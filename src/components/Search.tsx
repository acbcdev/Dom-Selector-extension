import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Search({
	search,
	updateSearch,
	handleSearch,
}: {
	search: string | null;
	updateSearch: (newValue: string) => void;
	handleSearch: () => void;
}) {
	return (
		<search>
			<form
				className="flex items-center px-3 gap-x-2 "
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
					spellCheck="false"
					placeholder="a, h1, p,.myclass"
					value={search ?? ""}
					onChange={(e) => updateSearch(e.target.value)}
				/>
				<Button type="submit">Search</Button>
			</form>
		</search>
	);
}
