// Create the context menu item when the extension is installed.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "squash-bug-ai",
    title: "Squash Bug with AI",
    contexts: ["selection"] // Only show when text is selected
  });
});

// Listener for when the context menu item is clicked.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "squash-bug-ai" && info.selectionText) {
    // Store the selected text.
    chrome.storage.local.set({ 'buggyCode': info.selectionText }, () => {
      // Open the app in a new tab.
      // The app's useEffect will then pick up the stored code.
      chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
    });
  }
});

// Listener for the extension icon click to open the app
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});
