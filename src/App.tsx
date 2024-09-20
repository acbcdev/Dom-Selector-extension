import "./App.css";
import type { Trt } from "./types";
// import { sendMessage } from "webext-bridge/popup";
import { useState } from "react";
// import { sendMessage } from "webext-bridge/content-script";
function App() {
	const [search, setSearch] = useState<string | null>(null);
	const [result, setResult] = useState<Trt[]>([]);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// console.log(search, property);
		chrome.storage.local.set({ search });
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id ?? 0 },
				func: getDom,
			});
			chrome.storage.local.get(["result"], (data) => {
				const result = data.result;
				setResult(result);
			});
		});
		function getDom() {
			chrome.storage.local.get(["search"], (data) => {
				const search = data.search;
				const $$ = [...document.querySelectorAll(search)];
				// sendMessage("dom", { data: $$ }, "popup");
				const dt = $$.map((item) => ({
					id: item.id,
					class: item.className,
					tag: item.tagName,
					innerText: item.innerText,
					href: item.href,
				}));
				chrome.storage.local.set({ result: dt });
			});
		}
	};
	return (
		<>
			<main>
				<search>
					<form className="form-search" onSubmit={handleSearch}>
						<input
							type="text"
							list="htmlElements"
							placeholder=".class"
							value={search ?? ""}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<datalist id="htmlElements">
							<option value="img" />
							<option value="a" />
							<option value="div" />
							<option value="span" />
							<option value="p" />
							<option value="h1" />
							<option value="h2" />
							<option value="h3" />
							<option value="h4" />
							<option value="h5" />
							<option value="h6" />
							<option value="ul" />
							<option value="ol" />
							<option value="li" />
							<option value="table" />
						</datalist>
					</form>
				</search>
				<section className="recent ">
					<h2 className="text-xl">Recent Searches</h2>
					<ul>
						<li>a</li>
						<li>img</li>
						<li>.main-continer</li>
					</ul>
				</section>
				<section className="result">
					{result.length !== 0 && (
						<>
							<h2>Result</h2>
							<ol>
								{result.map((item) => (
									<li key={item.id}>{item.innerText}</li>
								))}
							</ol>
						</>
					)}
				</section>
			</main>
		</>
	);
}

export default App;
