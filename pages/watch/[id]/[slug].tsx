import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Menu, Search, X, Star, Share2, Play } from "lucide-react";
import Link from "next/link";
import { GetServerSideProps } from "next";

interface TMDBMovieDetails {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  imdb_id: string;
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
  homepage: string;
  production_companies: { id: number; name: string; logo_path: string }[];
  credits: {
    cast: {
      id: number;
      name: string;
      character: string;
      profile_path: string;
    }[];
    crew: {
      id: number;
      name: string;
      job: string;
      department: string;
    }[];
  };
  videos: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
}

interface TMDBMovieSearchResult {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
}

interface MovieDetails {
  title: string;
  year: string;
  quality: string;
  imdb_rating?: string;
  imdb_votes?: string;
  image_src?: string;
  urls?: string[];
  plot?: string; // This is optional so we need optional chaining
  description?: string;
  actors?: string[];
  director?: string;
  downloads?: string;
  genres?: string[];
  imdb_url?: string;
  link?: string;
  release_date?: string;
  runtime?: string;
  trailer?: string;
  imdb_id?: string;
  tmdb_id?: number; // Make sure this is typed as number
  backdrop_path?: string;
  videos?: { key: string; name: string; type: string }[];
  directors?: string[];
  cast?: { name: string; character: string }[];
}

// Navigation Component
const Navigation = ({
  searchQuery,
  setSearchQuery,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isSearchOpen,
  setIsSearchOpen,
  handleSearch,
  handleKeyPress,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}) => {
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-[#1a1d24] border-b border-gray-800 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="bg-cyan-400 text-white px-4 py-2 rounded-md font-bold"
            >
              FMovies
            </Link>
          </div>

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
  );
};

interface WatchPageProps {
  initialMovieDetails: MovieDetails | null;
  error: string | null;
  tmdb_id: string | null;
}

export default function WatchPage({
  initialMovieDetails,
  error: initialError,
  tmdb_id: initialTmdbId,
}: WatchPageProps) {
  const router = useRouter();
  const { slug } = router.query as { slug?: string };

  // Define the type for tmdb_id
  const tmdb_id: string | null | undefined =
    initialTmdbId ||
    (router.query.tmdb_id as string) ||
    (router.asPath.startsWith("/watch/")
      ? router.asPath.split("/")[2]
      : undefined);

  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(
    initialMovieDetails || null
  );
  const [error, setError] = useState<string>(initialError || "");
  const [relatedMovies, setRelatedMovies] = useState<TMDBMovieSearchResult[]>(
    []
  );
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!initialMovieDetails);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // Inside your useEffect
  useEffect(() => {
    // If we have initial data from SSR, immediately set loading to false
    if (initialMovieDetails && initialMovieDetails.tmdb_id == tmdb_id) {
      setIsLoading(false);
    }
  }, [initialMovieDetails, tmdb_id]);

  useEffect(() => {
    console.log("Router path:", router.asPath);
    console.log("Extracted TMDB ID:", tmdb_id);
    console.log("Slug:", slug);
  }, [router, tmdb_id, slug]);

  // Handle search
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

  // Handle iframe errors
  const handleIframeError = () => {
    console.log("Iframe error occurred");
    setIframeError(true);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!tmdb_id) return;

      // }
      if (
        initialMovieDetails &&
        initialMovieDetails.tmdb_id === Number(tmdb_id)
      ) {
        console.log("Using server-side movie data");
        return;
      }

      try {
        console.log(`Fetching movie details for TMDB ID: ${tmdb_id}`);
        setIsLoading(true);
        setError("");

        // Fetch detailed movie information including videos and credits
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
          throw new Error("API key not found");
        }

        const apiUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}?append_to_response=videos,credits&api_key=${API_KEY}`;
        console.log(`Making API request to: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch movie details: ${response.status}`);
        }

        const tmdbData: TMDBMovieDetails = await response.json();
        console.log("Movie data fetched successfully:", tmdbData.title);

        // Format directors
        const directors =
          tmdbData.credits?.crew
            .filter((person) => person.job === "Director")
            .map((director) => director.name) || [];

        // Format cast
        const cast =
          tmdbData.credits?.cast.slice(0, 10).map((actor) => ({
            name: actor.name,
            character: actor.character,
          })) || [];

        // Format videos (trailers)
        const videos =
          tmdbData.videos?.results
            .filter(
              (video) =>
                video.site === "YouTube" &&
                (video.type === "Trailer" || video.type === "Teaser")
            )
            .map((video) => ({
              key: video.key,
              name: video.name,
              type: video.type,
            })) || [];

        // Convert TMDB data to our MovieDetails format
        const movieData: MovieDetails = {
          title: tmdbData.title,
          year: tmdbData.release_date
            ? new Date(tmdbData.release_date).getFullYear().toString()
            : "",
          quality: "HD",
          imdb_rating: (tmdbData.vote_average / 2).toFixed(1),
          imdb_votes: `${tmdbData.vote_count.toLocaleString()} votes`,
          image_src: tmdbData.poster_path
            ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
            : "/placeholder.png",
          backdrop_path: tmdbData.backdrop_path
            ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
            : undefined,
          plot: tmdbData.overview,
          genres: tmdbData.genres.map((genre) => genre.name),
          imdb_id: tmdbData.imdb_id,
          imdb_url: tmdbData.imdb_id
            ? `https://www.imdb.com/title/${tmdbData.imdb_id}`
            : undefined,
          runtime: tmdbData.runtime ? `${tmdbData.runtime} min` : undefined,
          release_date: tmdbData.release_date,
          trailer:
            videos.length > 0
              ? `https://www.youtube.com/watch?v=${videos[0].key}`
              : undefined,
          videos: videos,
          directors: directors,
          cast: cast,
          tmdb_id: tmdbData.id,
        };

        console.log("Processed movie data:", movieData.title);
        setMovieDetails(movieData);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (tmdb_id) {
      fetchMovieDetails();
    } else {
      console.log("No TMDB ID provided");
    }
    // }, [tmdb_id, initialMovieDetails]);
  }, [tmdb_id, initialMovieDetails?.tmdb_id]);

  // Fetch related movies
  useEffect(() => {
    const fetchRelatedMovies = async () => {
      if (!tmdb_id) return;

      try {
        console.log(`Fetching related movies for TMDB ID: ${tmdb_id}`);

        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
          throw new Error("API key not found");
        }

        // Fetch recommendations from TMDB
        const recommendationsUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}/recommendations?language=en-US&page=1&api_key=${API_KEY}`;
        console.log(`Making API request to: ${recommendationsUrl}`);

        const response = await fetch(recommendationsUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch recommendations: ${response.status}`
          );
        }

        const data = await response.json();
        console.log(
          `Recommendations fetched. Total results: ${
            data.results ? data.results.length : 0
          }`
        );

        if (data.results && data.results.length > 0) {
          const formattedMovies = data.results
            .slice(0, 15)
            .map((movie: TMDBMovieSearchResult) => ({
              id: movie.id,
              tmdb_id: movie.id,
              title: movie.title,
              rating: (movie.vote_average / 2).toFixed(1),
              duration: "",
              genres: [],
              quality: "HD",
              imageUrl: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.png",
              image_src: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/placeholder.png",
              poster_path: movie.poster_path,
              year: movie.release_date
                ? new Date(movie.release_date).getFullYear().toString()
                : "",
              imdb_rating: (movie.vote_average / 2).toFixed(1),
              imdb_votes: `${movie.vote_count} votes`,
              link: `/watch/${movie.id}/${movie.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")}`,
            }));

          console.log(`Processed ${formattedMovies.length} recommendations`);
          setRelatedMovies(formattedMovies);
          return;
        }

        if (!data.results || data.results.length === 0) {
          console.log(
            "No recommendations found, fetching similar movies instead"
          );

          const similarUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}/similar?language=en-US&page=1&api_key=${API_KEY}`;
          console.log(`Making API request to: ${similarUrl}`);

          const similarResponse = await fetch(similarUrl);

          if (!similarResponse.ok) {
            throw new Error(
              `Failed to fetch similar movies: ${similarResponse.status}`
            );
          }

          const similarData = await similarResponse.json();
          console.log(
            `Similar movies fetched. Total results: ${
              similarData.results ? similarData.results.length : 0
            }`
          );

          if (similarData.results && similarData.results.length > 0) {
            const formattedMovies = similarData.results
              .slice(0, 15)
              .map((movie: TMDBMovieSearchResult) => ({
                id: movie.id,
                tmdb_id: movie.id,
                title: movie.title,
                rating: (movie.vote_average / 2).toFixed(1),
                duration: "",
                genres: [],
                quality: "HD",
                imageUrl: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.png",
                image_src: movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/placeholder.png",
                poster_path: movie.poster_path,
                year: movie.release_date
                  ? new Date(movie.release_date).getFullYear().toString()
                  : "",
                imdb_rating: (movie.vote_average / 2).toFixed(1),
                imdb_votes: `${movie.vote_count} votes`,
                link: `/watch/${movie.id}/${movie.title
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .replace(/\s+/g, "-")}`,
              }));

            console.log(`Processed ${formattedMovies.length} similar movies`);
            setRelatedMovies(formattedMovies);
          } else {
            console.log("No similar movies found either");
          }
        }
      } catch (error) {
        console.error("Error fetching related movies:", error);
      }
    };

    if (tmdb_id) {
      fetchRelatedMovies();
    }
  }, [tmdb_id]);

  // Log component state changes
  useEffect(() => {
    console.log("WatchPage component state:", {
      isLoading,
      hasMovieDetails: !!movieDetails,
      relatedMoviesCount: relatedMovies.length,
      hasError: !!error,
      iframeError,
    });
  }, [isLoading, movieDetails, relatedMovies, error, iframeError]);

  const RelatedMoviesSection = () => (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">
          {relatedMovies.length > 0 ? "Related Movies" : "Recommended Movies"}
        </h2>
        <Link href="/movies" className="text-cyan-400 hover:text-cyan-300">
          See All
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading || relatedMovies.length === 0
          ? Array(15)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
                </div>
              ))
          : relatedMovies.map((movie, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div
                  className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800"
                  onClick={() =>
                    router.push(
                      `/watch/${movie.id}/${movie.title
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .replace(/\s+/g, "-")}`
                    )
                  }
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/api/placeholder/220/330"
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="text-white text-sm font-medium">
                        {movie.release_date
                          ? movie.release_date.split("-")[0]
                          : ""}
                        {movie.vote_average > 0 && (
                          <span className="ml-2 bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                            ⭐ {(movie.vote_average / 2).toFixed(1)}
                          </span>
                        )}
                      </div>
                      {movie.vote_count > 0 && (
                        <div className="text-gray-400 text-xs mt-1">
                          {movie.vote_count} votes
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-gray-300 group-hover:text-white text-sm font-medium truncate">
                    {movie.title}
                  </h3>
                  <div className="text-gray-500 text-xs">
                    {movie.release_date ? movie.release_date.split("-")[0] : ""}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Head>
        <title>{`${movieDetails?.title || "Watch Movie"} - FMovies`}</title>
        {/* <meta
          name="description"
          content={`Watch ${movieDetails?.title} ${
            movieDetails?.year ? `(${movieDetails.year})` : ""
          } in HD quality. ${movieDetails?.plot?.substring(0, 150)}${
            movieDetails?.plot?.length > 150 ? "..." : ""
          }`}
        />  */}
        <meta
          name="description"
          content={`Watch ${movieDetails?.title || "Watch Movie"} ${
            movieDetails?.year ? `(${movieDetails.year})` : ""
          } in HD quality. ${movieDetails?.plot?.substring(0, 150) || ""}${
            movieDetails?.plot && movieDetails.plot.length > 150 ? "..." : ""
          }`}
        />
        {movieDetails?.title && (
          <>
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta
              property="og:url"
              content={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/watch/${
                movieDetails.tmdb_id
              }/${encodeURIComponent(movieDetails.title.toLowerCase())}`}
            />
            <meta
              property="og:title"
              content={`${movieDetails.title} (${
                movieDetails.year || "N/A"
              }) - Watch Online`}
            />
            <meta
              property="og:description"
              content={
                movieDetails.plot?.substring(0, 200) ||
                `Watch ${movieDetails.title} in HD quality`
              }
            />
            <meta
              property="og:image"
              content={movieDetails.backdrop_path || movieDetails.image_src}
            />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta
              property="twitter:title"
              content={`${movieDetails.title} (${
                movieDetails.year || "N/A"
              }) - Watch Online`}
            />
            <meta
              property="twitter:description"
              content={
                movieDetails.plot?.substring(0, 200) ||
                `Watch ${movieDetails.title} in HD quality`
              }
            />
            <meta
              property="twitter:image"
              content={movieDetails.backdrop_path || movieDetails.image_src}
            />

            {/* Structured Data for Google */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Movie",
                  name: movieDetails.title,
                  description: movieDetails.plot,
                  image: movieDetails.image_src,
                  datePublished: movieDetails.release_date,
                  genre: movieDetails.genres,
                  duration: movieDetails.runtime,
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: movieDetails.imdb_rating,
                    ratingCount: parseInt(
                      movieDetails.imdb_votes?.replace(/[^0-9]/g, "") || "0"
                    ),
                    bestRating: "5",
                    worstRating: "0",
                  },
                  director:
                    movieDetails.directors?.map((name) => ({
                      "@type": "Person",
                      name: name,
                    })) || [],
                  actor:
                    movieDetails.cast?.map((actor) => ({
                      "@type": "Person",
                      name: actor.name,
                    })) || [],
                }),
              }}
            />
          </>
        )}
      </Head>

      <Navigation
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        handleSearch={handleSearch}
        handleKeyPress={handleKeyPress}
      />

      <main className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="flex items-center space-x-2 text-sm mb-4">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            Home
          </Link>
          <span className="text-gray-500">/</span>
          <Link href="/movies" className="text-cyan-400 hover:text-cyan-300">
            Movies
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">
            {movieDetails?.title || "Loading..."}
          </span>
        </div>

        {/* {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )} */}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
            <div className="font-bold mb-1">Error loading movie</div>
            <div>{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Video Player Section - Improved iframe player */}
        <div className="relative w-full mb-8">
          {isLoading ? (
            <div className="w-full aspect-video bg-gray-900 rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
                  <div className="h-4 w-32 bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          ) : !movieDetails ? (
            <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center p-4">
                <h3 className="text-xl mb-2">Unable to load movie</h3>
                <p className="text-gray-400">
                  {error || "Please check the movie ID or try again later"}
                </p>
              </div>
            </div>
          ) : movieDetails?.imdb_id && !iframeError ? (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
              <iframe
                src={`https://vidsrc.me/embed/movie?imdb=${movieDetails.imdb_id}`}
                style={{ width: "100%", height: "100%" }}
                className="w-full h-full"
                frameBorder="0"
                referrerPolicy="origin"
                allowFullScreen
                onError={handleIframeError}
              />
            </div>
          ) : (
            <div
              className="w-full aspect-video bg-gray-900 rounded-lg relative cursor-pointer"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${
                  movieDetails?.backdrop_path ||
                  movieDetails?.image_src ||
                  "/placeholder.png"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-white text-xl mb-4 font-bold">
                  {movieDetails?.title}
                </div>
                <a
                  href={movieDetails?.trailer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-400 rounded-full p-4 cursor-pointer hover:bg-cyan-500 transition-colors"
                >
                  <Play className="w-12 h-12 text-white" />
                </a>
                <div className="text-white text-sm mt-4">Watch Trailer</div>
              </div>
            </div>
          )}
        </div>

        {/* Toggle button to retry iframe if it fails */}
        {!isLoading && movieDetails?.imdb_id && iframeError && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIframeError(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Retry Player
            </button>
          </div>
        )}

        {/* Movie Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Movie Poster and Title */}
          <div className="bg-gray-800 rounded-lg p-6">
            {isLoading ? (
              <>
                <div className="animate-pulse h-8 w-3/4 bg-gray-700 rounded mb-6"></div>
                <div className="animate-pulse aspect-[2/3] bg-gray-700 rounded-lg mb-4"></div>
                <div className="flex items-center gap-2">
                  <div className="animate-pulse h-6 w-16 bg-gray-700 rounded-md"></div>
                  <span className="text-gray-700">•</span>
                  <div className="animate-pulse h-6 w-12 bg-gray-700 rounded"></div>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-white p-4">
                  {movieDetails?.title}{" "}
                  {movieDetails?.year ? `(${movieDetails.year})` : ""}
                </h1>

                <div className="relative aspect-[2/3] mb-4 hidden md:block">
                  <img
                    src={movieDetails?.image_src || `/placeholder.png`}
                    alt={movieDetails?.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png";
                      console.log(
                        "Movie poster image failed to load, using placeholder"
                      );
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-4">
                  <span className="bg-cyan-400 text-white px-2 py-1 rounded text-sm">
                    {movieDetails?.quality}
                  </span>
                  {movieDetails?.runtime && (
                    <>
                      <span>•</span>
                      <span>{movieDetails.runtime}</span>
                    </>
                  )}
                  {movieDetails?.release_date && (
                    <>
                      <span>•</span>
                      <span>
                        {new Date(movieDetails.release_date).getFullYear()}
                      </span>
                    </>
                  )}
                </div>

                {movieDetails?.genres && movieDetails.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {movieDetails.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Movie Description and Ratings */}
          <div className="bg-gray-800 rounded-lg p-6">
            {isLoading ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="animate-pulse h-6 w-16 bg-gray-700 rounded flex items-center"></div>
                  <div className="animate-pulse h-5 w-32 bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="animate-pulse h-4 w-full bg-gray-700 rounded"></div>
                  <div className="animate-pulse h-4 w-full bg-gray-700 rounded"></div>
                  <div className="animate-pulse h-4 w-3/4 bg-gray-700 rounded"></div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-white font-semibold text-xl mb-4">
                  Movie Details
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  {movieDetails?.imdb_rating && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      <span className="text-white font-bold text-lg">
                        {movieDetails.imdb_rating}
                      </span>
                    </div>
                  )}
                  {movieDetails?.imdb_votes && (
                    <span className="text-gray-300 text-sm">
                      {movieDetails.imdb_votes}
                    </span>
                  )}
                  {movieDetails?.imdb_url && (
                    <a
                      href={movieDetails.imdb_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      IMDb
                    </a>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-200 font-medium mb-2">Synopsis</h4>
                  <p className="text-gray-300">
                    {movieDetails?.plot || "No plot available"}
                  </p>
                </div>

                {movieDetails?.directors &&
                  movieDetails.directors.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-gray-200 font-medium mb-1">
                        Director{movieDetails.directors.length > 1 ? "s" : ""}
                      </h4>
                      <p className="text-gray-300">
                        {movieDetails.directors.join(", ")}
                      </p>
                    </div>
                  )}

                {movieDetails?.cast && movieDetails.cast.length > 0 && (
                  <div>
                    <h4 className="text-gray-200 font-medium mb-1">Cast</h4>
                    <p className="text-gray-300">
                      {movieDetails.cast.map((actor) => actor.name).join(", ")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Trailer and Information */}
          <div className="bg-gray-800 rounded-lg p-6">
            {isLoading ? (
              <>
                <div className="animate-pulse h-6 w-40 bg-gray-700 rounded mb-4"></div>
                <div className="animate-pulse h-48 w-full bg-gray-700 rounded-lg mb-4"></div>
                <div className="space-y-4">
                  <div className="animate-pulse h-12 w-full bg-gray-700 rounded-lg"></div>
                  <div className="animate-pulse h-12 w-full bg-gray-700 rounded-lg"></div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-white font-semibold text-xl mb-4">
                  Trailer
                </h3>

                {movieDetails?.videos && movieDetails.videos.length > 0 ? (
                  <div className="aspect-video mb-6">
                    <iframe
                      src={`https://www.youtube.com/embed/${movieDetails.videos[0].key}`}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="flex items-center justify-center bg-gray-700 aspect-video rounded-lg mb-6">
                    <p className="text-gray-400">No trailer available</p>
                  </div>
                )}

                {/* Watch Options */}
                <h3 className="text-white font-semibold mb-4">Watch Options</h3>

                {movieDetails?.imdb_id ? (
                  <a
                    href="#top"
                    onClick={() => {
                      if (iframeError) {
                        setIframeError(false);
                      }
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    <span>Watch Movie Now</span>
                  </a>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-700 text-gray-400 rounded-lg mb-4 text-center">
                    No streaming source available
                  </div>
                )}

                {/* Share Button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: movieDetails?.title,
                        text: `Watch ${movieDetails?.title} ${
                          movieDetails?.year || ""
                        }`,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }
                  }}
                  className="w-full flex items-center justify-center mt-4 px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  <span>Share Movie</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Related Movies Section */}
        <section>
          {/* <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {relatedMovies.length > 0
                ? "Related Movies"
                : "Recommended Movies"}
            </h2>
            <Link href="/movies" className="text-cyan-400 hover:text-cyan-300">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isLoading || relatedMovies.length === 0
              ? Array(15)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
                    </div>
                  ))
              : relatedMovies.map((movie, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <div
                      className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800"
                      onClick={() =>
                        router.push(
                          `/watch/${movie.tmdb_id}/${movie.title
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, "")
                            .replace(/\s+/g, "-")}`
                        )
                      }
                    >
                      <img
                        src={movie.image_src || "/api/placeholder/220/330"}
                        alt={movie.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-white text-sm font-medium">
                            {movie.year || ""}
                            {movie.imdb_rating && (
                              <span className="ml-2 bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                                ⭐ {movie.imdb_rating}
                              </span>
                            )}
                          </div>
                          {movie.quality && (
                            <div className="text-cyan-400 text-sm mt-1">
                              {movie.quality}
                            </div>
                          )}
                          {movie.imdb_votes && (
                            <div className="text-gray-400 text-xs mt-1">
                              {movie.imdb_votes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-gray-300 group-hover:text-white text-sm font-medium truncate">
                        {movie.title}
                      </h3>
                      <div className="text-gray-500 text-xs">
                        {movie.year || ""}
                      </div>
                    </div>
                  </div>
                ))}
          </div> */}

          <RelatedMoviesSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1d24] border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2025 FMovies. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <Link href="#" className="text-gray-300 hover:text-white">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-300 hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<WatchPageProps> = async (
  context
) => {
  const { tmdb_id } = context.query as { tmdb_id?: string };

  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=300"
  );

  // Extract tmdb_id from URL if not in query params
  const id: string | null =
    tmdb_id ||
    (context.req.url?.startsWith("/watch/")
      ? context.req.url.split("/")[2]
      : null);

  if (!id) {
    return {
      props: {
        initialMovieDetails: null,
        error: "No movie ID provided",
        tmdb_id: null,
      },
    };
  }

  try {
    // Fetch movie details from TMDB API

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!API_KEY) {
      throw new Error("API key not found");
    }

    const apiUrl = `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos,credits&api_key=${API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.status}`);
    }

    const tmdbData: TMDBMovieDetails = await response.json();

    // Format directors with proper typing
    const directors: string[] =
      tmdbData.credits?.crew
        .filter((person: { job: string }) => person.job === "Director")
        .map((director: { name: string }) => director.name) || [];

    // Format cast with proper typing
    const cast: { name: string; character: string }[] =
      tmdbData.credits?.cast
        .slice(0, 10)
        .map((actor: { name: string; character: string }) => ({
          name: actor.name,
          character: actor.character,
        })) || [];

    // Format videos (trailers) with proper typing
    const videos: { key: string; name: string; type: string }[] =
      tmdbData.videos?.results
        .filter(
          (video: { site: string; type: string }) =>
            video.site === "YouTube" &&
            (video.type === "Trailer" || video.type === "Teaser")
        )
        .map((video: { key: string; name: string; type: string }) => ({
          key: video.key,
          name: video.name,
          type: video.type,
        })) || [];

    // Convert TMDB data to our MovieDetails format
    const movieData: MovieDetails = {
      title: tmdbData.title,
      year: tmdbData.release_date
        ? new Date(tmdbData.release_date).getFullYear().toString()
        : "",
      quality: "HD",
      imdb_rating: (tmdbData.vote_average / 2).toFixed(1),
      imdb_votes: `${tmdbData.vote_count.toLocaleString()} votes`,
      image_src: tmdbData.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
        : "/placeholder.png",
      backdrop_path: tmdbData.backdrop_path
        ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}`
        : undefined,
      plot: tmdbData.overview,
      genres: tmdbData.genres.map((genre: { name: string }) => genre.name),
      imdb_id: tmdbData.imdb_id,
      imdb_url: tmdbData.imdb_id
        ? `https://www.imdb.com/title/${tmdbData.imdb_id}`
        : undefined,
      runtime: tmdbData.runtime ? `${tmdbData.runtime} min` : undefined,
      release_date: tmdbData.release_date,
      trailer:
        videos.length > 0
          ? `https://www.youtube.com/watch?v=${videos[0].key}`
          : undefined,
      videos: videos,
      directors: directors,
      cast: cast,
      tmdb_id: tmdbData.id,
    };

    return {
      props: {
        initialMovieDetails: movieData,
        error: null,
        tmdb_id: id,
      },
    };
  } catch (err) {
    console.error("Error fetching movie details:", err);
    return {
      props: {
        initialMovieDetails: null,
        error: err instanceof Error ? err.message : "An error occurred",
        tmdb_id: id,
      },
    };
  }
};
