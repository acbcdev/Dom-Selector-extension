import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "./ui/scroll-area";
import type { ElementInfo } from "@/types";

type Props = {
	element: ElementInfo;
};

function TableDialog({ element }: Props) {
	const { origin, pathname, search } = element.href
		? new URL(element.href)
		: { origin: "", pathname: "", search: "" };
	const keys = [
		{ name: "id", value: element.id },
		{ name: "class", value: element.class },
		{ name: "tag", value: element.tag },
		{ name: "innerText", value: element.innerText },
		{ name: "href", value: `${origin}${pathname}${search && "?..."}` },
		{ name: "url query (?)", value: search },
		{ name: "idAttribute", value: element.idAttribute },
		{ name: "indexInParent", value: element.indexInParent },
		{
			name: "dimensions",
			value: `width: ${element.dimensions.width}, height: ${element.dimensions.height}`,
		},
		{ name: "visible", value: element.visible ? "true" : "false" },
		{
			name: "parent",
			value: `tag: ${element.parent.tag}, class: ${element.parent.class?.split(" ").splice(0, 10).join(" ")}..., id: ${element.parent.id ?? "undefined"}`,
		},
		{
			name: "boundingBox",
			value: `top: ${element.boundingBox.top}, right: ${element.boundingBox.right},\n
							bottom: ${element.boundingBox.bottom}, left: ${element.boundingBox.left},\n
							width: ${element.boundingBox.width}, height: ${element.boundingBox.height}\n `,
		},
		{ name: "childrenCount", value: element.childrenCount },
	];

	return (
		<ScrollArea className="min-h-56 h-96">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Value</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{keys.map((key) => {
						return (
							<TableRow key={`${key.name}-${key.value}`}>
								<TableCell>{key.name}</TableCell>
								<TableCell className="break-all text-balance">
									{key.value}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</ScrollArea>
	);
}
TableDialog.displayName = "TableDialog";
export default TableDialog;
