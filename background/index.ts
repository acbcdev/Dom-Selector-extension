chrome.runtime.onInstalled.addListener(() => {
	chrome.storage.local.set({
		search: "",
		history: ["img", "video", "source"],
		result: [],
	});
});
