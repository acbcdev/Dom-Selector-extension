import { onMessage } from "webext-bridge/content-script";

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	onMessage<{ search: string; property: string }>("getdom", ({ data }) => {
		const $$ = document.querySelectorAll(data.search);
		console.log($$);
	});
});
