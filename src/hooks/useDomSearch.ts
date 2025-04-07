import type { ElementInfo } from "@/types";
import { useEffect, useState } from "react";

export function useDomSearch() {
	const [search, setSearch] = useState<string | null>(null);
	const [result, setResult] = useState<ElementInfo[]>([]);
	const [history, setHistory] = useState<string[]>([]);
	const [property, setProperty] = useState<Record<string, boolean>>({});

	useEffect(() => {
		chrome.storage.local.get(["search", "history", "result"], (data) => {
			setSearch(data.search);
			setHistory(data.history);
			setResult(data.result);
		});
		chrome.runtime.onMessage.addListener((message) => {
			if (message.type === "dom") {
				if (Array.isArray(message.list)) {
					chrome.storage.local.set({ result: message.list });
					setResult(message.list);
				}
				setProperty(message.property);
			}
		});
	}, []);

	/**
	 * Handles the search input and sends a message to the content script
	 * to get the DOM elements.
	 *
	 * @param {string} [value] - The search value. If not provided, uses the
	 * current search value.
	 */
	const handleSearch = (value = "") => {
		const searchValue = value || search;
		if (searchValue === null) return;
		if (searchValue.trim() === "") return;

		// Add the new search value to the beginning of the history
		setHistory((prev) => [searchValue, ...new Set(prev)]);

		// Save the search value and history to local storage
		chrome.storage.local.set({ search: searchValue, history });

		// Get the currently active tab and execute the content script
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id ?? 0 },
				func: getDom,
			});
		});
	};
	const handleCopy = () => {
		navigator.clipboard.writeText(JSON.stringify(result, null, 2));
	};

	const openModal = (id: number) => {
		setResult((prev) =>
			prev.map((item) => {
				if (item.id === id) {
					item.open = !item.open;
				}
				return { ...item, open: false };
			}),
		);
	};
	/**
	 * Handles exporting the search result as a JSON file.
	 *
	 * It creates a blob from the result data, creates a link with the blob URL,
	 * adds the link to the page, triggers a click on the link to download the file,
	 * and then removes the link and revokes the URL to avoid memory leaks.
	 */
	const handleExport = () => {
		const data = JSON.stringify(result, null, 2);
		const blob = new Blob([data], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = `${search?.replace(/\s/g, "-")}.json`;
		// Activamos el enlace
		document.body.appendChild(link);
		link.click();

		// Limpiamos el enlace y la URL creada
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};
	const updateSearch = (newValue: string) => {
		setSearch(newValue);
	};
	return {
		search,
		result,
		property,
		handleSearch,
		history: history,
		updateSearch,
		openModal,
		handleExport,
		handleCopy,
	};
}
function getDom() {
	chrome.storage.local.get(["search"], (data) => {
		const search = data.search;
		const $$ = [...document.querySelectorAll(search)];
		// sendMessage("dom", { data: $$ }, "popup");
		const dt = $$.map((item, index) => ({
			id: index + 1,
			class: item.className.toString(),
			tag: item.tagName,
			innerText: item.innerText,
			href: item.href ?? item.src,
			idAttribute: item.id || null,
			indexInParent: [...item.parentNode.children].indexOf(item),
			dimensions: {
				width: item.offsetWidth,
				height: item.offsetHeight,
			},
			content: item.content,
			visible: (() => {
				const rect = item.getBoundingClientRect();
				return (
					rect.top >= 0 &&
					rect.left >= 0 &&
					rect.bottom <=
						(window.innerHeight || document.documentElement.clientHeight) &&
					rect.right <=
						(window.innerWidth || document.documentElement.clientWidth)
				);
			})(),
			parent: {
				tag: item.parentElement?.tagName,
				class: item.parentElement?.className,
				id: item.parentElement?.id,
			},
			boundingBox: item.getBoundingClientRect(),
			childrenCount: item.children.length,
		}));

		const property: Record<string, boolean> = {
			innerText: false,
			href: false,
		};
		if (dt.length / 2 / 2 <= dt.filter((item) => item.innerText).length)
			property.innerText = true;

		if (dt.length / 2 <= dt.filter((item) => item.href).length) {
			property.href = true;
			// dt.sort((a, b) => b.href.length - a.href.length);
		}

		chrome.runtime.sendMessage({ type: "dom", list: dt, property });
	});
}
