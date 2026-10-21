// Turbo Favorites — background script
//
// Builds a "Turbo Favorites ▸" entry in the message-list right-click menu.
// Each pinned favorite folder appears as a submenu that cascades through ALL
// of its subfolders (recursively). Selecting any entry moves the currently
// selected message(s) into that folder.

const ROOT_ID = "mtf-root";

// Maps our generated menu-item ids -> the MailFolder object to move into.
// Rebuilt from scratch every time the menu is rebuilt.
let folderByMenuId = {};

// ---- Folder tree helpers --------------------------------------------------

// Walk every account's folder tree and return a flat list of all folders,
// each annotated with its subFolders (as provided by the API).
async function getAllFolders() {
  const accounts = await browser.accounts.list(true);
  const roots = [];
  for (const account of accounts) {
    const root = account.rootFolder;
    if (root && Array.isArray(root.subFolders)) {
      for (const child of root.subFolders) {
        roots.push(child);
      }
    }
  }
  return roots;
}

// Depth-first search for a folder matching a stored favorite {accountId, path}.
function findFolder(folders, accountId, path) {
  for (const folder of folders) {
    if (folder.accountId === accountId && folder.path === path) {
      return folder;
    }
    if (Array.isArray(folder.subFolders) && folder.subFolders.length) {
      const hit = findFolder(folder.subFolders, accountId, path);
      if (hit) return hit;
    }
  }
  return null;
}

// ---- Menu building --------------------------------------------------------

function createItem(props) {
  // menus.create is fire-and-forget; errors surface in onCreated callback.
  return browser.menus.create(props);
}

// Recursively add a folder (and its subfolders) as menu items under parentId.
function addFolderNode(folder, parentId) {
  const nodeId = `node:${folder.accountId}:${folder.path}`;
  folderByMenuId[nodeId] = folder;

  const children = Array.isArray(folder.subFolders) ? folder.subFolders : [];

  if (children.length === 0) {
    // Leaf: a single clickable entry that moves into this folder.
    createItem({
      id: nodeId,
      parentId,
      title: folder.name,
      contexts: ["message_list"],
    });
    return;
  }

  // Has subfolders: becomes a submenu. A submenu label itself does not fire
  // onClicked, so add an explicit "move here" child for the folder itself.
  const submenuId = `sub:${folder.accountId}:${folder.path}`;
  createItem({
    id: submenuId,
    parentId,
    title: folder.name,
    contexts: ["message_list"],
  });

  const selfId = `self:${folder.accountId}:${folder.path}`;
  folderByMenuId[selfId] = folder;
  createItem({
    id: selfId,
    parentId: submenuId,
    title: `→ Move into “${folder.name}”`,
    contexts: ["message_list"],
  });
  createItem({
    id: `sep:${folder.accountId}:${folder.path}`,
    parentId: submenuId,
    type: "separator",
    contexts: ["message_list"],
  });

  for (const child of children) {
    addFolderNode(child, submenuId);
  }
}

async function rebuildMenu() {
  await browser.menus.removeAll();
  folderByMenuId = {};

  createItem({
    id: ROOT_ID,
    title: "Turbo Favorites",
    contexts: ["message_list"],
  });

  const { favorites = [] } = await browser.storage.local.get("favorites");

  if (favorites.length === 0) {
    createItem({
      id: "mtf-configure",
      parentId: ROOT_ID,
      title: "Configure favorites…",
      contexts: ["message_list"],
    });
    return;
  }

  const allFolders = await getAllFolders();
  let added = 0;
  for (const fav of favorites) {
    const folder = findFolder(allFolders, fav.accountId, fav.path);
    if (folder) {
      addFolderNode(folder, ROOT_ID);
      added++;
    }
  }

  if (added === 0) {
    createItem({
      id: "mtf-configure",
      parentId: ROOT_ID,
      title: "Configure favorites…",
      contexts: ["message_list"],
    });
  }
}

// ---- Click handling -------------------------------------------------------

browser.menus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "mtf-configure") {
    await browser.runtime.openOptionsPage();
    return;
  }

  const folder = folderByMenuId[info.menuItemId];
  if (!folder) return;

  const selected = info.selectedMessages;
  if (!selected || !selected.messages || selected.messages.length === 0) return;

  const ids = selected.messages.map((m) => m.id);
  try {
    await browser.messages.move(ids, folder);
  } catch (e) {
    console.error("Turbo Favorites: move failed", e);
  }
});

// ---- Lifecycle ------------------------------------------------------------

// Rebuild whenever the favorites list changes in the options page.
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.favorites) {
    rebuildMenu();
  }
});

rebuildMenu();
