import { useState } from "react";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      setIsLoading(true);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          placeholder="Search movies or TV shows"
          className="w-full bg-white px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
        >
          <Search className="h-5 w-5 text-gray-400" />
        </button>
      </form>

      {isLoading && (
        <div className="absolute left-0 right-0 mt-2 text-center">
          <div className="inline-flex items-center text-cyan-400">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Searching...</span>
          </div>
        </div>
      )}
    </div>
  );
}
