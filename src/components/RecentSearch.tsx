import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ElementInfo } from "@/types";

type PropsRecentSearch = {
	history: string[];
	result: ElementInfo[];
	handleExport: () => void;
	handleCopy: () => void;
	updateSearch: (newValue: string) => void;
	handleSearch: (search: string) => void;
};
export default function RecentSearch({
	history,
	result,
	handleExport,
	handleCopy,
	updateSearch,
	handleSearch,
}: PropsRecentSearch) {
	return (
		<section className="my-2 recent">
			<div className="flex justify-between items-between">
				<h2 className="mt-2 text-xl">Recent Searches</h2>
				{result.length > 0 && (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant={"outline"}>Export</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Export Options</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleCopy}>Copy</DropdownMenuItem>
							<DropdownMenuItem onClick={handleExport}>
								JSON File
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>
			<ScrollArea className="py-2 w-96 ">
				<ul>
					{history.map((i, index) => (
						<li key={`${i}-${index}-${history.length}-${Math.random()}`}>
							<Button
								type="button"
								onClick={() => {
									updateSearch(i);
									handleSearch(i);
								}}
							>
								{i}
							</Button>
						</li>
					))}
				</ul>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</section>
	);
}
