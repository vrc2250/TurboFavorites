# Turbo Favorites — addons.thunderbird.net listing copy

Paste each section into the matching field in the ATN Developer Hub.

---

## Add-on name
Turbo Favorites

## Summary (short, shown in search results — keep under ~250 chars)
Pin your favorite folders and move mail into them — and every one of their
subfolders — straight from the message right-click menu. Cascading submenus mean
no more drilling down from the account root. Multi-message selection supported.

## Categories (choose up to two)
- Message and News Tools
- Folders and Filters

## Suggested tags / keywords
move, file, folders, subfolders, favorites, filing, right-click, context menu,
quick move, organize

---

## Description (long — basic HTML allowed on ATN)

**Turbo-charge the way you file email.**

Thunderbird's built-in “Move To” menu makes you expand your account, then the
top-level folder, then click the little arrow to reach subfolders — every single
time. Turbo Favorites fixes that.

**How it works**

1. Open the add-on's options and tick the folders you file to most often.
2. Right-click any message (or several) and choose **Turbo Favorites**.
3. Your pinned folders appear instantly. Hover one and its **entire subfolder
   tree cascades** as submenus — nested to any depth.
4. Click a destination and the selected message(s) move there. Done.

**Why you'll like it**

- ⭐ **Pinned favorites** — the folders you actually use, right at the top of the
  menu. No hunting, no drilling down.
- 🗂️ **Full subfolder cascade** — every favorite exposes all of its subfolders,
  recursively. Deep hierarchies stop being a chore.
- ✉️ **Multi-select friendly** — select a batch of messages and file them all in
  one move. Great when you're juggling several projects at once.
- ➡️ **Move into a parent too** — folders that contain subfolders include a
  “Move into …” entry so you can drop mail into the parent itself.
- 🔒 **Private by design** — your favorites are stored locally. Nothing is ever
  sent anywhere. (See the privacy policy.)

**Good to know**

Thunderbird does not let add-ons add items inside its own “Move To” submenu, so
Turbo Favorites adds its own **Turbo Favorites** entry right next to it in the
same right-click menu — the shortcut you wanted, one click away.

Built with standard MailExtension APIs. No remote code, no minified bundles —
just plain, readable JavaScript.

---

## Version notes — v1.0.1 (What's New)
- Added MIT LICENSE and author metadata; no functional changes.

## Version notes — v1.0.0
First public release.
- Right-click “Turbo Favorites” menu with pinned favorite folders.
- Full, recursive subfolder cascade under each favorite.
- Options page to choose favorites from your complete folder tree.
- Multi-message selection support.
- All data stored locally; no network access.

---

## License
MIT (recommended — permissive and simple). Set this in the ATN license field, or
tell the author if you prefer another.

---

## Notes for the reviewer (paste into the review-notes box)
- Pure MailExtension WebExtension; no experiment APIs, no remote or minified code.
- Permissions used:
  - `accountsRead` — list the folder tree to build the menu and the options page.
  - `menus` — add the right-click “Turbo Favorites” entry.
  - `messagesRead` — read the current message selection to know what to move.
  - `messagesMove` — perform the move the user requested.
  - `storage` — save the user's chosen favorites locally (storage.local).
- No data leaves the client; there is no network/fetch usage anywhere in the code.

---

## Privacy policy (paste into the ATN “Privacy Policy” field)

**Turbo Favorites — Privacy Policy**

Turbo Favorites does not collect, transmit, or share any personal data.

- **What it stores:** only the list of folders you choose as favorites
  (account id and folder path). This is saved locally on your computer using
  Thunderbird's extension storage (`storage.local`).
- **What it accesses:** the add-on reads your account/folder list to build its
  menu, and reads your current message selection only at the moment you click a
  destination, so it knows which message(s) to move. It moves messages only when
  you explicitly pick a folder.
- **What it sends:** nothing. The add-on makes no network connections and
  contains no tracking, analytics, or remote code.
- **Uninstalling:** removing the add-on removes its locally stored favorites.

Questions? Contact the developer through the add-on's support listing.
