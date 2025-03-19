import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Menu, Search, X, Star, Play } from "lucide-react";
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

interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  overview: string;
  vote_count: number;
  genres?: { id: number; name: string }[];
}

// Define an interface for the transformed movie
interface TransformedMovie {
  id: number;
  title: string;
  rating: number;
  year: string;
  imageUrl: string | undefined; // Change from string | null
  image_src: string | undefined; // Change from string | null
  description: string;
  quality: string;
  imdb_rating: number;
  imdb_votes: string;
  genres: string[];
  link: string;
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  category: string;
  onMovieClick?: (movie: Movie) => void; // Make it optional with ?
}

// Constants for TMDB API
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Function to create fetch options with your API key
const createTmdbOptions = () => {
  return {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN}`,
    },
  };
};

const transformTmdbMovie = (movie: TMDBMovie): TransformedMovie => {
  return {
    id: movie.id,
    title: movie.title || movie.name || "",
    rating: movie.vote_average,
    year: movie.release_date
      ? movie.release_date.substring(0, 4)
      : movie.first_air_date
      ? movie.first_air_date.substring(0, 4)
      : "",
    imageUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : undefined,
    image_src: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : undefined,
    description: movie.overview,
    quality: movie.vote_count > 1000 ? "HD" : "SD",
    imdb_rating: movie.vote_average,
    imdb_votes: movie.vote_count ? `${movie.vote_count}` : "",
    genres: movie.genres?.map((g) => g.name) || [],
    link: `/api/stream/${movie.id}`,
  };
};

const MovieCard = ({
  movie,
  onClick,
  isTvShow,
}: {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  isTvShow?: boolean;
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      // Create a URL-friendly title slug
      const titleSlug = movie.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      // Use the new URL pattern: watch/tmdb_id/title-slug
      router.push(`/watch/${movie.id}/${titleSlug}`);
    }
  };

  const handleTvShowClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      // Create a URL-friendly title slug
      const titleSlug = movie.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      // Use the new URL pattern: watch/tmdb_id/title-slug
      router.push(`/series/${movie.id}/${titleSlug}`);
    }
  };

  return (
    <div className="relative group cursor-pointer">
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800">
        <Image
          src={movie.imageUrl || movie.image_src || "/api/placeholder/220/330"}
          alt={movie.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
          fill
          sizes="(max-width: 768px) 100vw, 220px"
          priority={false}
          unoptimized
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Play Button on hover */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={isTvShow ? handleTvShowClick : handleClick}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-3 transition-all duration-200 border border-white/30"
            >
              <Play className="h-8 w-8 text-white fill-white" />
            </button>

            {/* TV Show Icon */}
            {isTvShow && (
              <div className="mt-4 bg-cyan-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2"></polyline>
                </svg>
                View Episodes
              </div>
            )}
          </div>

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

  // Check if this is the TV shows section
  const isTvShowSection = category === "tv-series";

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
          : movies
              .slice(0, 15)
              .map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={onMovieClick}
                  isTvShow={isTvShowSection}
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

  const handleClick = (movie: Movie) => {
    // Create a URL-friendly title slug
    const titleSlug = movie.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Use the new URL pattern: watch/tmdb_id/title-slug
    router.push(`/watch/${movie.id}/${titleSlug}`);
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
    const fetchFeaturedAndTopMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${TMDB_BASE_URL}/trending/movie/day?language=en-US`,
          createTmdbOptions()
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.status_message || "Failed to fetch trending movies"
          );
        }

        if (data.results && data.results.length > 0) {
          // Get more details for the featured movie
          const featuredMovieId = data.results[0].id;
          const featuredResponse = await fetch(
            `${TMDB_BASE_URL}/movie/${featuredMovieId}?language=en-US`,
            createTmdbOptions()
          );
          const featuredData = await featuredResponse.json();

          // Set the first movie as featured with detailed info
          setFeaturedMovie(
            transformTmdbMovie({ ...data.results[0], ...featuredData })
          );

          // Use the rest for the suggested section
          setTopMovies(data.results.slice(1).map(transformTmdbMovie));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedAndTopMovies();
  }, []);

  useEffect(() => {
    const fetchLatestMovies = async () => {
      try {
        setIsLatestMoviesLoading(true);
        const response = await fetch(
          `${TMDB_BASE_URL}/movie/popular?language=en-US&page=1`,
          createTmdbOptions()
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.status_message || "Failed to fetch popular movies"
          );
        }

        if (data.results && data.results.length > 0) {
          setLatestMovies(data.results.map(transformTmdbMovie));
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

        const response = await fetch(
          `${TMDB_BASE_URL}/tv/top_rated?language=en-US&page=1`,
          createTmdbOptions()
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.status_message || "Failed to fetch TV shows");
        }

        if (data.results && data.results.length > 0) {
          setLatestShows(data.results.map(transformTmdbMovie));
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
        {isLoading ? (
          <FeaturedMovieSkeleton />
        ) : (
          featuredMovie && (
            <div className="relative h-[60vh] md:h-[70vh] mb-6 md:mb-12 rounded-lg overflow-hidden">
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
                  unoptimized
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
              </div>
              <div className="relative h-full flex flex-col justify-center px-4 md:px-8 max-w-7xl mx-auto">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center">
                  <div className="mr-8">
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
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg flex items-center justify-center"
                      onClick={() => handleClick(featuredMovie)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </button>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden">
                  {/* Content row with details and banner */}
                  <div className="flex mb-4">
                    {/* Movie details */}
                    <div className="flex-1 pr-3">
                      <h1 className="text-2xl font-bold text-white mb-2">
                        {featuredMovie.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-2">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {featuredMovie.rating || featuredMovie.imdb_rating}
                        </span>
                        {featuredMovie.year && (
                          <span>{featuredMovie.year}</span>
                        )}
                        {featuredMovie.quality && (
                          <span className="bg-cyan-900 text-white px-2 py-1 rounded text-xs">
                            {featuredMovie.quality}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 line-clamp-4 text-sm">
                        {featuredMovie.description ||
                          "No description available"}
                      </p>
                    </div>

                    {/* Mobile banner */}
                    <div className="flex-shrink-0">
                      <div className="overflow-hidden rounded-lg shadow-lg h-[140px] w-[100px]">
                        <img
                          src={
                            featuredMovie.imageUrl ||
                            featuredMovie.image_src ||
                            "/api/placeholder/100/140"
                          }
                          alt={featuredMovie.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.jpg";
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Watch button below both elements */}
                  <button
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg w-full flex items-center justify-center"
                    onClick={() => handleClick(featuredMovie)}
                  >
                    <Play className="w-4 h-4 mr-2" />
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
          // onMovieClick={handleTvShowClick}
        />
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
