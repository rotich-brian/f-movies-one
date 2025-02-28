import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";

interface MovieResult {
  link: string;
  title: string;
  year: string;
  quality: string;
  image_src?: string;
  imdb_rating?: string;
  imdb_votes?: string;
}

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [searchQuery, setSearchQuery] = useState((q as string) || "");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleClick = (result: MovieResult) => {
    router.push({
      pathname: "/watch",
      query: {
        title: result.title,
        year: result.year,
        link: result.link,
      },
    });
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!q) return;

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/search?term=${encodeURIComponent(q as string)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch search results");
        }

        setSearchResults(data.results || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  return (
    <div className="min-h-screen bg-[#1a1d24] flex flex-col">
      <Head>
        <title>{`Search Results for "${q}" - FMovies`}</title>
        <meta name="description" content={`Search results for ${q}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Navigation */}
      <nav className="bg-[#1a1d24] border-b border-gray-800 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="bg-cyan-400 text-white px-4 py-2 rounded-md font-bold">
                FMovies
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/home"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Home
              </Link>
              <Link
                href="/genres"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Genres
              </Link>
              <Link
                href="/country"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Country
              </Link>
              <Link
                href="/movies"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Movies
              </Link>
              <Link
                href="/tv-series"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                TV-Series
              </Link>
              <Link
                href="/top-imdb"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Top IMDb
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl ml-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies or TV shows"
                    className="w-full bg-white px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                className="p-2 text-gray-300 hover:text-white"
                onClick={toggleSearch}
              >
                <Search size={24} />
              </button>
              <button
                className="p-2 text-gray-300 hover:text-white"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search movies or TV shows"
                  className="w-full bg-white px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                <Link
                  href="/home"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Home
                </Link>
                <Link
                  href="/genres"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Genres
                </Link>
                <Link
                  href="/country"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Country
                </Link>
                <Link
                  href="/movies"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Movies
                </Link>
                <Link
                  href="/tv-series"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  TV-Series
                </Link>
                <Link
                  href="/top-imdb"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Top IMDb
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 pt-24 pb-16 w-full">
        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-2xl text-white font-bold">
            {isLoading
              ? "SEARCHING..."
              : searchResults.length > 0
              ? `SEARCH RESULTS FOR: "${q}"`
              : `NO RESULTS FOUND FOR: "${q}"`}
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && searchResults.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {searchResults.map((result, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div
                  className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800"
                  onClick={() => handleClick(result)}
                >
                  <img
                    src={result.image_src || "/api/placeholder/220/330"}
                    alt={result.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-white text-sm font-medium">
                        {result.year}
                        {result.imdb_rating && (
                          <span className="ml-2 bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                            ⭐ {result.imdb_rating}
                          </span>
                        )}
                      </div>
                      {result.quality && (
                        <div className="text-cyan-400 text-sm mt-1">
                          {result.quality}
                        </div>
                      )}
                      {result.imdb_votes && (
                        <div className="text-gray-400 text-xs mt-1">
                          {result.imdb_votes} votes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-gray-300 group-hover:text-white text-sm font-medium truncate">
                    {result.title}
                  </h3>
                  <div className="text-gray-500 text-xs">{result.year}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && searchResults.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              No results found for "{q}"
            </div>
            <div className="text-gray-500 text-sm">
              Try adjusting your search terms or try a different search
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1d24] border-t border-gray-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2025 FMovies. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <a href="#" className="text-gray-300 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
