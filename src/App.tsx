import "./App.css";
import Search from '@/components/Search';
import RecentSearch from '@/components/RecentSearch';
import TableResults from "@/components/TableResults";

function App() {
	return (
		<>
			<main>
				<Search />
				<RecentSearch />
				<TableResults />
			</main>
		</>
	);
}

export default App;
