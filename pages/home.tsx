import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Menu, Search, X, Star } from "lucide-react";
import Link from "next/link";
import FeaturedMovieSkeleton from "./FeaturedMovieSkeleton";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  rating?: number;
  duration?: string;
  genres?: string[];
  imageUrl?: string;
  quality?: string;
  year?: string;
  description?: string;
  link?: string;
  image_src?: string;
  imdb_rating?: number;
  imdb_votes?: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  category: string;
  onMovieClick?: (movie: Movie) => void; // Make it optional with ?
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Sample movie data expanded to 12 items
// const sampleMovies = Array(12)
//   .fill(null)
//   .map((_, index) => ({
//     id: index + 1,
//     title: index % 2 === 0 ? "Gladiator II" : "Red One",
//     rating: 7.1 + index * 0.1,
//     duration: "148 min",
//     genres: ["Action", "Adventure", "Drama"],
//     imageUrl: "/api/placeholder/300/450",
//     quality: index % 2 === 0 ? "HD" : "CAM",
//     year: "2024",
//   }));

const MovieCard = ({
  movie,
  onClick,
}: {
  movie: Movie;
  onClick?: (movie: Movie) => void;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      router.push({
        pathname: "/watch",
        query: {
          id: movie.id,
          title: movie.title,
          year: movie.year,
          link: movie.link,
        },
      });
    }
  };

  return (
    <div className="relative group cursor-pointer">
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800"
        onClick={handleClick}
      >
        {/* <img
          src={movie.imageUrl || movie.image_src || "/api/placeholder/220/330"}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        /> */}
        <Image
          src={movie.imageUrl || movie.image_src || "/api/placeholder/220/330"}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
          fill
          sizes="(max-width: 768px) 100vw, 220px"
          priority={false}
          style={{ objectFit: "cover" }}
          onError={(e) => {
            // Next/image handles errors differently, this is the updated approach
            e.currentTarget.src = "/placeholder.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="text-white text-sm font-medium">
              {movie.year}
              {(movie.rating || movie.imdb_rating) && (
                <span className="ml-2 bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                  ⭐ {movie.rating || movie.imdb_rating}
                </span>
              )}
            </div>
            {movie.quality && (
              <div className="text-cyan-400 text-sm mt-1">{movie.quality}</div>
            )}
            {movie.imdb_votes && (
              <div className="text-gray-400 text-xs mt-1">
                {movie.imdb_votes} votes
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-gray-300 group-hover:text-white text-sm font-medium truncate">
          {movie.title}
        </h3>
        <div className="text-gray-500 text-xs">{movie.year}</div>
      </div>
    </div>
  );
};

const MovieCardSkeleton = () => {
  return (
    <div className="relative animate-pulse">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-700">
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2 mt-2"></div>
        </div>
      </div>
      <div className="mt-2">
        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-600 rounded w-1/3 mt-1"></div>
      </div>
    </div>
  );
};

// const MovieSection = ({
//   title,
//   movies,
//   isLoading,
//   category,
//   onMovieClick,
// }: MovieSectionProps) => {
//   const router = useRouter();

//   const handleViewAll = () => {
//     router.push(`/category/${category}`);
//   };

//   return (
//     <section className="mb-12">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-bold text-white">{title}</h2>
//         <button
//           onClick={handleViewAll}
//           className="text-cyan-400 hover:text-cyan-300 text-sm"
//         >
//           View All
//         </button>
//       </div>
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//         {isLoading
//           ? [...Array(10)].map((_, index) => <MovieCardSkeleton key={index} />)
//           : movies
//               .slice(0, 10)
//               .map((movie) => (
//                 <MovieCard
//                   key={movie.id}
//                   movie={movie}
//                   onClick={onMovieClick}
//                 />
//               ))}
//       </div>
//     </section>
//   );
// };

const MovieSection = ({
  title,
  movies,
  isLoading,
  category,
  onMovieClick,
}: MovieSectionProps) => {
  const router = useRouter();

  const handleViewAll = () => {
    router.push(`/category/${category}`);
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <button
          onClick={handleViewAll}
          className="text-cyan-400 hover:text-cyan-300 text-sm"
        >
          View All
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading
          ? [...Array(10)].map((_, index) => <MovieCardSkeleton key={index} />)
          : movies.slice(0, 10).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={onMovieClick} // This will be undefined when null is passed
              />
            ))}
      </div>
    </section>
  );
};

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [latestShows, setLatestShows] = useState<Movie[]>([]);
  const [isLatestMoviesLoading, setIsLatestMoviesLoading] = useState(true);
  const [isLatestShowsLoading, setIsLatestShowsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const handleClick = (movie: Movie) => {
    router.push({
      pathname: "/watch",
      query: {
        id: movie.id,
        title: movie.title,
        year: movie.year,
        link: movie.link,
      },
    });
  };

  const handleTvShowClick = () => {
    setShowToast(true);

    // Hide the toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
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

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/latest_movies`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch latest movies");
        }

        if (data.results && data.results.length > 0) {
          // Set the first movie as featured
          setFeaturedMovie(data.results[0]);
          // Use the rest for the suggested section
          setTopMovies(data.results.slice(1));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopMovies();
  }, []);

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        setIsLatestMoviesLoading(true);
        const response = await fetch(`${API_BASE_URL}/top_movies`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch latest movies");
        }

        if (data.results && data.results.length > 0) {
          setLatestMovies(data.results);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLatestMoviesLoading(false);
      }
    };

    const fetchLatestShows = async () => {
      try {
        setIsLatestShowsLoading(true);
        const response = await fetch(`${API_BASE_URL}/tv_shows`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch TV shows");
        }

        if (data.results && data.results.length > 0) {
          setLatestShows(data.results);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLatestShowsLoading(false);
      }
    };

    fetchLatestMovies();
    fetchLatestShows();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Head>
        <title>FMovies - Your Streaming Directory</title>
        <meta name="description" content="Find the best streaming content" />
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
      <main className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        {/* Featured Section */}
        {isLoading ? (
          <FeaturedMovieSkeleton />
        ) : (
          featuredMovie && (
            <div className="relative h-[70vh] mb-12 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex justify-center items-center overflow-hidden">
                <Image
                  src={
                    featuredMovie.imageUrl ||
                    featuredMovie.image_src ||
                    "/api/placeholder/1200/600"
                  }
                  alt={featuredMovie.title}
                  className="w-auto h-full object-cover scale-110 blur-sm opacity-40"
                  fill
                  sizes="100vw"
                  priority={false}
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
              </div>
              <div className="relative h-full flex items-center px-8 max-w-7xl mx-auto">
                <div className="hidden md:block mr-8">
                  <div className="overflow-hidden rounded-lg shadow-2xl h-[500px] w-[350px]">
                    <img
                      src={
                        featuredMovie.imageUrl ||
                        featuredMovie.image_src ||
                        "/api/placeholder/350/500"
                      }
                      alt={featuredMovie.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    {featuredMovie.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-300 mb-4">
                    <span className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      {featuredMovie.rating || featuredMovie.imdb_rating}
                    </span>
                    {featuredMovie.duration && (
                      <span>{featuredMovie.duration}</span>
                    )}
                    {featuredMovie.year && <span>{featuredMovie.year}</span>}
                    {featuredMovie.quality && (
                      <span className="bg-cyan-900 text-white px-2 py-1 rounded text-sm">
                        {featuredMovie.quality}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 max-w-2xl mb-6">
                    {featuredMovie.description || "No description available"}
                  </p>
                  <button
                    className="bg-cyan-400 text-black px-6 py-3 rounded-md hover:bg-cyan-500 transition-colors"
                    onClick={() => handleClick(featuredMovie)}
                  >
                    Watch Now
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Movie Sections */}
        {topMovies.length > 0 && (
          <MovieSection
            title="Suggested For You"
            movies={topMovies}
            isLoading={isLoading}
            category="suggested"
          />
        )}
        <MovieSection
          title="Most Rated Movies"
          movies={latestMovies}
          isLoading={isLatestMoviesLoading}
          category="movies"
        />
        <MovieSection
          title="Latest TV Series"
          movies={latestShows}
          isLoading={isLatestShowsLoading}
          category="tv-series"
          onMovieClick={handleTvShowClick}
        />

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in-up">
            Feature coming soon
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1d24] border-t border-gray-800 py-8">
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
