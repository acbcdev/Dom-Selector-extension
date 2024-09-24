chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({ search: "", history: [] });
});
