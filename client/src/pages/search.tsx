import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import ContentCarousel from "@/components/content/content-carousel.tsx";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const { data: channels = [] } = useQuery<any[]>({
    queryKey: ["/api/channels"],
  });

  const { data: movies = [] } = useQuery<any[]>({
    queryKey: ["/api/movies"],
  });

  const { data: series = [] } = useQuery<any[]>({
    queryKey: ["/api/series"],
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filterItems = (items: any[], term: string) => {
    if (!term) return [];
    return items.filter(item =>
      item.title?.toLowerCase().includes(term.toLowerCase()) ||
      item.name?.toLowerCase().includes(term.toLowerCase()) ||
      item.description?.toLowerCase().includes(term.toLowerCase()) ||
      item.genre?.toLowerCase().includes(term.toLowerCase())
    );
  };

  const filteredChannels = filterItems(channels, debouncedSearchTerm);
  const filteredMovies = filterItems(movies, debouncedSearchTerm);
  const filteredSeries = filterItems(series, debouncedSearchTerm);

  const hasResults = filteredChannels.length > 0 || filteredMovies.length > 0 || filteredSeries.length > 0;

  return (
    <div className="p-8 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Search</h1>
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
          <Input
            type="search"
            placeholder="Search channels, movies, shows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border-gray-700 rounded-lg px-12 py-4 text-lg focus-ring focus:border-samsung-blue"
            data-testid="input-search"
          />
        </div>
      </div>

      {!debouncedSearchTerm ? (
        <div className="flex flex-col items-center justify-center py-20">
          <SearchIcon className="h-16 w-16 text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-4">Start Searching</h2>
          <p className="text-gray-400 text-center max-w-md">
            Enter a search term to find channels, movies, and TV series.
          </p>
        </div>
      ) : !hasResults ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-4">No results found</h2>
          <p className="text-gray-400 text-center max-w-md">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      ) : (
        <>
          {filteredChannels.length > 0 && (
            <ContentCarousel
              title={`Channels (${filteredChannels.length})`}
              items={filteredChannels}
              isLoading={false}
              type="channel"
            />
          )}

          {filteredMovies.length > 0 && (
            <ContentCarousel
              title={`Movies (${filteredMovies.length})`}
              items={filteredMovies}
              isLoading={false}
              type="movie"
            />
          )}

          {filteredSeries.length > 0 && (
            <ContentCarousel
              title={`TV Series (${filteredSeries.length})`}
              items={filteredSeries}
              isLoading={false}
              type="series"
            />
          )}
        </>
      )}
    </div>
  );
}
