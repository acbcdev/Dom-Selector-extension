import { EllipsisVertical } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import TableDialog from "./TableDialog";
import type { ElementInfo } from "@/types";

export default function TableResults({
	result,
	property,
	search,
}: {
	result: ElementInfo[];
	property: Record<string, boolean>;
	search: string | null;
}) {
	return (
		<ScrollArea className="w-full">
			<section className="result">
				{result.length > 0 ? (
					<>
						<h2>Result</h2>
						<Table className="scroolbar">
							<TableHeader>
								<TableRow>
									<TableHead> </TableHead>
									<TableHead>ID</TableHead>
									<TableHead>Tag</TableHead>
									{property.innerText && <TableHead>Inner Text</TableHead>}
									{property.href && <TableHead>Href</TableHead>}
									<TableHead>ClassList</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody className="text-start">
								{result.map((item) => {
									const { origin, pathname, search } = item.href
										? new URL(item.href)
										: { origin: "", pathname: "", search: "" };
									return (
										<>
											<TableRow key={item.id}>
												<TableCell>
													<Dialog open={item.open}>
														<DialogTrigger asChild>
															<EllipsisVertical className="duration-200 cursor-pointer hover:text-zinc-500" />
														</DialogTrigger>
														<DialogContent
															className="w-[95%] h-full"
															aria-describedby={`${item.id}-${item.tag}-${item.class}`}
														>
															<DialogHeader>
																<DialogTitle>
																	{item.tag}-{item.id}
																</DialogTitle>
															</DialogHeader>
															<section>
																<TableDialog element={item} />
															</section>
														</DialogContent>
													</Dialog>
												</TableCell>
												<TableCell>{item.id}</TableCell>
												<TableCell>{item.tag}</TableCell>
												{property.innerText && (
													<TableCell>{item.innerText}</TableCell>
												)}
												{property.href && (
													<TableCell>
														<a
															href={item.href}
															className="underline hover:text-zinc-500"
															target="_blank"
															rel="noreferrer"
														>
															{origin + pathname + (search && "?...")}
														</a>
													</TableCell>
												)}
												<TableCell className="w-fit">{item.class}</TableCell>
											</TableRow>
										</>
									);
								})}
							</TableBody>
						</Table>
					</>
				) : (
					search && (
						<div className="flex flex-col items-center justify-center h-full mr-2">
							<h2 className="text-xl font-bold">No results found</h2>
						</div>
					)
				)}
			</section>
			<ScrollBar orientation="horizontal" />
		</ScrollArea>
	);
}
