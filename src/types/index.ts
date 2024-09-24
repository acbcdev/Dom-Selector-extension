// id: item.id,
// 				class: item.className,
// 				tag: item.tagName,
// 				innerText: item.innerText,
// 				href: item.href,
export type Trt = {
	class: string;
	tag: string;
	innerText: string;
	href: string;
	id: number;
};

export type ElementInfo = {
	open: boolean;
	id: number;
	class: string;
	tag: string;
	innerText: string;
	href: string | undefined;
	idAttribute: string | null;
	indexInParent: number;
	styles: string;
	dimensions: {
		width: number;
		height: number;
	};
	visible: boolean;
	parent: {
		tag: string | undefined;
		class: string | undefined;
		id: string | undefined;
	};
	boundingBox: {
		top: number;
		right: number;
		bottom: number;
		left: number;
		width: number;
		height: number;
	};
	childrenCount: number;
};
