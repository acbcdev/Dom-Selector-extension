export function getDom() {
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
