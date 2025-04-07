import "@/App.css";
import Search from "@/components/Search";
import RecentSearch from "@/components/RecentSearch";
import TableResults from "@/components/TableResults";
import { useDomSearch } from "./hooks/useDomSearch";

function App() {
	const {
		search,
		result,
		property,
		handleSearch,
		history,
		updateSearch,
		handleExport,
		handleCopy,
	} = useDomSearch();
	return (
		<>
			<main>
				<Search
					search={search}
					updateSearch={updateSearch}
					handleSearch={handleSearch}
				/>
				<RecentSearch
					history={history}
					result={result}
					handleExport={handleExport}
					handleCopy={handleCopy}
					updateSearch={updateSearch}
					handleSearch={handleSearch}
				/>
				<TableResults property={property} result={result} search={search} />
			</main>
		</>
	);
}

export default App;
