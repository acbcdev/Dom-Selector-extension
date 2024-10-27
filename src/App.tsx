import "./App.css";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGlobal } from "@/hooks/useGlobal";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import TableDialog from "@/components/TableDialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function App() {
	const { search, result, property, handleSearch, history, updateSearch } =
		useGlobal();
	return (
		<>
			<main>
				<search className="absolute mx-auto top-3 ">
					<form
						className="form-search"
						onSubmit={(e) => {
							e.preventDefault();
							if (search !== null) {

								handleSearch();
							}
						}}
					>
						<Input
							autoFocus={true}
							type="text"
							placeholder=".class a video"
							value={search ?? ""}
							onChange={(e) => updateSearch(e.target.value)}
						/>
						<Button type="submit" >
							Search
						</Button>
					</form>
				</search>
				<section className="my-2 recent">
					<h2 className="text-xl">Recent Searches</h2>
					<ScrollArea className="py-2 w-96 ">
						<ul>
							{history.map((i, index) => (
								<li key={`${i}-${index}-${history.length}-${Math.random()}`}>
									<Button
										type="button"
										onClick={() => {
											updateSearch(i);
											handleSearch();
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
				<ScrollArea className="h-[60vh] w-full">
					<section className="result">
						{result.length !== 0 && (
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
						)}
					</section>
					<ScrollBar orientation="horizontal" />
				</ScrollArea>

			</main>
		</>
	);
}

export default App;
