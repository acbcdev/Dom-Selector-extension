import { useGlobal } from "@/hooks/useGlobal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Search() {
  const { search, handleSearch, updateSearch } = useGlobal()

  return (
    <search >
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
          placeholder="a, h1, p,.myclass"
          value={search ?? ""}
          onChange={(e) => updateSearch(e.target.value)}
        />
        <Button type="submit" >
          Search
        </Button>
      </form>
    </search>
  );
}