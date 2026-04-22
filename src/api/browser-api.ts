// Detect Firefox's `browser` global or fall back to Chrome's `chrome` global.
// We cast to `typeof chrome` so the rest of the codebase can use Chrome types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _browser: typeof chrome =
  typeof (globalThis as any).browser !== "undefined"
    ? (globalThis as any).browser
    : chrome;

const BrowserAPI = {
  runtime: _browser.runtime,
  storage: _browser.storage,
  tabs: _browser.tabs,
  commands: _browser.commands,
};

export default BrowserAPI;
