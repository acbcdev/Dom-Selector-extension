import type { ElementInfo } from "@/types";
import { useEffect, useState } from "react";

export function useGlobal() {
	const [search, setSearch] = useState<string | null>(null);
	const [result, setResult] = useState<ElementInfo[]>([]);
	const [history, setHistory] = useState<string[]>([]);
	const [property, setProperty] = useState<Record<string, boolean>>({});

	useEffect(() => {
		chrome.storage.local.get(["search", "history"], (data) => {
			setSearch(data.search);
			setHistory(data.history);
		});
		chrome.runtime.onMessage.addListener((message) => {
			if (message.type === "dom") {
				if (Array.isArray(message.list)) {
					setResult(message.list);
				}
				setProperty(message.property);
			}
		});
	}, []);

	const handleSearch = () => {
		if (search === null) return;
		if (search.trim() === "") return;
		if (search !== history[0]) setHistory([search, ...history.slice(0, 10)]);

		chrome.storage.local.set({ search, history });
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id ?? 0 },
				func: getDom,
			});
		});
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
