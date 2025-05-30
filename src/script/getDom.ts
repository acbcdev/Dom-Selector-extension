import type { ElementInfo } from "@/types";

function isElementVisible(element: Element): boolean {
	const rect = element.getBoundingClientRect();
	const viewHeight =
		window.innerHeight || document.documentElement.clientHeight;
	const viewWidth = window.innerWidth || document.documentElement.clientWidth;

	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= viewHeight &&
		rect.right <= viewWidth
	);
}

function getElementStyles(element: Element): string {
	const computedStyle = window.getComputedStyle(element);
	return (
		computedStyle.cssText ||
		Array.from(computedStyle)
			.map((prop) => `${prop}: ${computedStyle.getPropertyValue(prop)}`)
			.join("; ")
	);
}

function getElementUrl(element: Element): string {
	if (element instanceof HTMLAnchorElement) {
		return element.href;
	}
	if (element instanceof HTMLImageElement) {
		return element.src;
	}
	return "";
}

export function getDom(): void {
	try {
		chrome.storage.local.get(["search"], (data) => {
			if (!data.search) {
				chrome.runtime.sendMessage({
					type: "dom",
					list: [],
					property: { innerText: false, href: false },
					error: "No search query provided",
				});
				return;
			}

			const elements = [...document.querySelectorAll(data.search)];
			const dt: ElementInfo[] = elements.map((item, index) => {
				const rect = item.getBoundingClientRect();

				return {
					id: index + 1,
					class: item.className.toString(),
					tag: item.tagName.toLowerCase(),
					innerText: item.textContent?.trim() || "",
					href: getElementUrl(item),
					idAttribute: item.id || null,
					indexInParent: Array.from(item.parentNode?.children || []).indexOf(
						item,
					),
					styles: getElementStyles(item),
					dimensions: {
						width: item.clientWidth,
						height: item.clientHeight,
					},
					content: item instanceof HTMLElement ? item.innerHTML : "",
					visible: isElementVisible(item),
					parent: {
						tag: item.parentElement?.tagName.toLowerCase(),
						class: item.parentElement?.className,
						id: item.parentElement?.id,
					},
					boundingBox: {
						top: rect.top,
						right: rect.right,
						bottom: rect.bottom,
						left: rect.left,
						width: rect.width,
						height: rect.height,
					},
					childrenCount: item.children.length,
					open: false,
				};
			});

			// Analyze properties presence
			const property: Record<string, boolean> = {
				innerText:
					dt.filter((item) => item.innerText).length >= dt.length * 0.25,
				href: dt.filter((item) => item.href).length >= dt.length * 0.5,
			};

			chrome.runtime.sendMessage({
				type: "dom",
				list: dt,
				property,
				timestamp: Date.now(),
			});
		});
	} catch (error) {
		console.error("Error in getDom:", error);
		chrome.runtime.sendMessage({
			type: "dom",
			list: [],
			property: { innerText: false, href: false },
			error: error instanceof Error ? error.message : "Unknown error occurred",
		});
	}
}
