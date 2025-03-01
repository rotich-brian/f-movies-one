import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Menu,
  Search,
  X,
  Star,
  Download,
  Share2,
  Play,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

interface MovieDetails {
  title: string;
  year: string;
  quality: string;
  imdb_rating?: string;
  imdb_votes?: string;
  image_src?: string;
  urls?: string[];
  plot?: string;
  description?: string; // Keep for backward compatibility
  actors?: string[];
  director?: string;
  downloads?: string;
  genres?: string[];
  imdb_url?: string;
  link?: string;
  release_date?: string;
  runtime?: string;
  trailer?: string;
  imdb_id?: string; // Add IMDB ID
}

interface ServerLink {
  url: string;
  quality: "SD" | "HD";
  serverNumber: number;
}

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    rating: string;
    duration: string;
    genres: string[];
    imageUrl: string;
    quality: string;
    year?: string;
    link?: string;
    // Add the missing properties
    imdb_rating?: string;
    imdb_votes?: string;
    image_src?: string;
  };
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

// Main WatchPage Component
export default function WatchPage() {
  const router = useRouter();
  const { title, year, link } = router.query;

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeServer, setActiveServer] = useState<number>(1);
  const [serverLinks, setServerLinks] = useState<ServerLink[]>([]);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSDDropdownOpen, setIsSDDropdownOpen] = useState(false);
  const [isHDDropdownOpen, setIsHDDropdownOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  // const [relatedMovies, setRelatedMovies] = useState<any[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<MovieCardProps["movie"][]>(
    []
  );

  const [useIframe, setUseIframe] = useState<boolean>(true);
  const [iframeError, setIframeError] = useState<boolean>(false);
  const [showDirectPlayer, setShowDirectPlayer] = useState<boolean>(false);

  const extractImdbId = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/tt\d+/);
    return match ? match[0] : null;
  };

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

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!link) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getLinks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              link,
              title,
              year,
              quality: "HD",
              image_src: "placeholder.png",
              imdb_rating: "8.2",
              imdb_votes: "15,000 votes",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie details");
        }

        const data = await response.json();

        // Extract IMDB ID from imdb_url if available
        if (data.imdb_url && !data.imdb_id) {
          data.imdb_id = extractImdbId(data.imdb_url);
        }

        setMovieDetails(data);

        // If no IMDB ID is available, fallback to direct player
        if (!data.imdb_id) {
          setUseIframe(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setUseIframe(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [link, title, year]);

  // Add function to handle iframe errors
  const handleIframeError = () => {
    setIframeError(true);
    setUseIframe(false);
  };

  const handlePlayButtonClick = () => {
    setShowDirectPlayer(true);
  };

  // Process URLs into server links
  useEffect(() => {
    if (movieDetails?.urls) {
      // Separate mp4 and mkv files
      const standardLinks = movieDetails.urls.filter((url) =>
        url.includes(".mp4")
      );
      const hdLinks = movieDetails.urls.filter((url) => url.includes(".mkv"));

      const processedLinks: ServerLink[] = [
        ...standardLinks.map((url, index) => ({
          url,
          quality: "SD" as "SD" | "HD", // Add type assertion
          serverNumber: index + 1,
        })),
        ...hdLinks.map((url, index) => ({
          url,
          quality: "HD" as "SD" | "HD", // Add type assertion
          serverNumber: standardLinks.length + index + 1,
        })),
      ];

      setServerLinks(processedLinks);

      if (processedLinks.length > 0) {
        setCurrentVideoUrl(processedLinks[0].url);
        setActiveServer(1);
      }
    }
  }, [movieDetails?.urls]);

  useEffect(() => {
    if (videoError && serverLinks.length > 1) {
      // Find next server
      const nextServerIndex = (activeServer % serverLinks.length) + 1;
      handleServerChange(nextServerIndex);
    }
  }, [videoError]);

  useEffect(() => {
    if (movieDetails) {
      console.log("Movie details image_src:", movieDetails.image_src);
    }
  }, [movieDetails]);

  // Handle server change
  const handleServerChange = (serverNumber: number) => {
    const serverLink = serverLinks.find(
      (link) => link.serverNumber === serverNumber
    );
    if (serverLink) {
      setCurrentVideoUrl(serverLink.url);
      setActiveServer(serverNumber);
      setVideoError(false); // Reset error state when changing servers
    }
  };

  // Handle HD stream
  const handleStreamHD = () => {
    if (movieDetails?.trailer) {
      window.open(movieDetails.trailer, "_blank");
    }
  };

  // Handle downloads
  const handleGroupedDownload = (url: string, quality: "SD" | "HD") => {
    try {
      if (!url) throw new Error("Invalid download URL");

      const a = document.createElement("a");
      a.href = url;
      a.download = url.split("/").pop() || "download"; // Use the file name from the URL
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (quality === "SD") {
        setIsSDDropdownOpen(false);
      } else {
        setIsHDDropdownOpen(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
    }
  };

  // Handle video error
  const handleVideoError = () => {
    setVideoError(true);
    console.error("Video playback error for URL:", currentVideoUrl);
  };

  const fetchRelatedMovies = async () => {
    try {
      if (movieDetails?.genres && movieDetails.genres.length > 0) {
        const genre = movieDetails.genres[0];
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/search?genre=${encodeURIComponent(
            genre
          )}&limit=12`
        );

        if (response.ok) {
          const data = await response.json();
          // Filter out the current movie
          const filteredMovies = data.filter(
            (movie: MovieCardProps["movie"]) =>
              movie.title !== movieDetails.title
          );

          if (filteredMovies.length > 0) {
            setRelatedMovies(filteredMovies.slice(0, 15));
            return;
          }
        }
      }

      // Fall back to top_movies if genre fetch failed or returned no results
      const topMoviesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/latest_movies`
      );

      if (!topMoviesResponse.ok) throw new Error("Failed to fetch top movies");

      const topMoviesData = await topMoviesResponse.json();

      // Map the data structure to match what the MovieCard expects
      const formattedMovies = topMoviesData.results
        .filter(
          (movie: MovieCardProps["movie"]) =>
            movie.title !== movieDetails?.title
        )
        .slice(0, 15);

      setRelatedMovies(formattedMovies);
    } catch (error) {
      console.error("Error fetching related movies:", error);
    }
  };

  useEffect(() => {
    if (movieDetails) {
      fetchRelatedMovies();
    }
  }, [movieDetails]);

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Head>
        <title>{`${title || "Watch Movie"} - FMovies`}</title>
        <meta
          name="description"
          content={`Watch ${title} ${year ? `(${year})` : ""} in HD quality`}
        />
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
          <Link href="/home" className="text-cyan-400 hover:text-cyan-300">
            Movies
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">{title || "Loading..."}</span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Video Player Section */}
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
          ) : useIframe && movieDetails?.imdb_id && !iframeError ? (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://vidsrc.me/embed/movie?imdb=${movieDetails.imdb_id}`}
                style={{ width: "100%", height: "100%" }}
                frameBorder="0"
                referrerPolicy="origin"
                allowFullScreen
                onError={handleIframeError}
              />
            </div>
          ) : showDirectPlayer && currentVideoUrl && !videoError ? (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-full"
                controls
                autoPlay
                src={currentVideoUrl}
                poster={movieDetails?.image_src || "/placeholder.png"}
                onError={handleVideoError}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div
              className="w-full aspect-video bg-gray-900 rounded-lg relative cursor-pointer"
              onClick={handlePlayButtonClick}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${
                  movieDetails?.image_src || "/placeholder.png"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                {videoError || iframeError ? (
                  <>
                    <div className="text-red-500 mb-4">
                      Video playback error. Please try another server.
                    </div>
                    <div className="bg-cyan-400 rounded-full p-4 cursor-pointer hover:bg-cyan-500 transition-colors">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-white text-xl mb-4 font-bold">
                      {movieDetails?.title}
                    </div>
                    <div className="bg-cyan-400 rounded-full p-4 cursor-pointer hover:bg-cyan-500 transition-colors">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-white text-sm mt-4">
                      {useIframe ? "Play with VidSrc" : "Play"}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Server Selection - Only show when direct player is active */}
        {(!useIframe || iframeError) && showDirectPlayer && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div className="flex flex-wrap gap-2">
              {isLoading ? (
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="animate-pulse h-10 w-24 bg-gray-700 rounded-md"
                    ></div>
                  ))}
                </div>
              ) : (
                serverLinks.map((link) => (
                  <button
                    key={link.serverNumber}
                    onClick={() => handleServerChange(link.serverNumber)}
                    className={`px-6 py-2 rounded-md transition-colors ${
                      activeServer === link.serverNumber
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 bg-opacity-10 text-gray-300 hover:bg-opacity-20"
                    }`}
                  >
                    Server {link.serverNumber}
                  </button>
                ))
              )}
            </div>

            {isLoading ? (
              <div className="animate-pulse h-10 w-32 bg-gray-700 rounded-md"></div>
            ) : (
              <button
                onClick={
                  movieDetails?.trailer
                    ? handleStreamHD
                    : () => {
                        const hdLink = serverLinks.find(
                          (link) => link.quality === "HD"
                        );
                        if (hdLink) setCurrentVideoUrl(hdLink.url);
                      }
                }
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-md hover:from-red-600 hover:to-rose-700 transition-all shadow-lg transform hover:scale-105 flex items-center justify-center"
              >
                <Play className="w-4 h-4 mr-2" />
                {movieDetails?.trailer ? "Watch Trailer" : "Stream HD"}
              </button>
            )}
          </div>
        )}

        {/* Toggle button to switch between iframe and direct player */}
        {!isLoading && movieDetails?.imdb_id && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => {
                setUseIframe(!useIframe);
                setIframeError(false);
                setShowDirectPlayer(false);
              }}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              {useIframe ? "Switch Player" : "Switch Player"}
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
                  {movieDetails?.year ? `${movieDetails.year}` : ""}
                </h1>

                <div className="relative aspect-[2/3] mb-4 hidden md:block">
                  <img
                    src={movieDetails?.image_src || `/placeholder.png`}
                    alt={movieDetails?.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png";
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-4">
                  <span className="bg-cyan-400 text-white px-2 py-1 rounded text-sm">
                    {movieDetails?.quality?.replace(/[\(\)]/g, "")}
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
                  {movieDetails?.downloads && (
                    <div className="flex items-center">
                      <Download className="w-4 h-4 text-cyan-400 mr-1" />
                      <span className="text-gray-300 text-sm">
                        {parseInt(movieDetails.downloads).toLocaleString()}{" "}
                        downloads
                      </span>
                    </div>
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
                    {movieDetails?.plot ||
                      movieDetails?.description ||
                      "No plot available"}
                  </p>
                </div>

                {movieDetails?.director && (
                  <div className="mb-3">
                    <h4 className="text-gray-200 font-medium mb-1">Director</h4>
                    <p className="text-gray-300">{movieDetails.director}</p>
                  </div>
                )}

                {movieDetails?.actors && movieDetails.actors.length > 0 && (
                  <div>
                    <h4 className="text-gray-200 font-medium mb-1">Cast</h4>
                    <p className="text-gray-300">
                      {movieDetails.actors.join(", ")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Trailer and Download Options */}
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

                {movieDetails?.trailer ? (
                  <div className="aspect-video mb-6">
                    <iframe
                      src={movieDetails.trailer}
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

                <h3 className="text-white font-semibold mb-4">
                  Download Options
                </h3>

                {/* SD Downloads (mp4 files) */}
                <div className="mb-4">
                  <button
                    onClick={() => setIsSDDropdownOpen(!isSDDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                  >
                    <div className="flex items-center">
                      <span>Download SD (mp4)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400 mr-2">
                        {
                          serverLinks.filter((link) => link.quality === "SD")
                            .length
                        }{" "}
                        links
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          isSDDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {isSDDropdownOpen && (
                    <div className="mt-2 space-y-2">
                      {serverLinks
                        .filter((link) => link.quality === "SD")
                        .map((link, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleGroupedDownload(link.url, "SD")
                            }
                            className="w-full flex items-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            <span>SD Link {index + 1}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* HD Downloads (mkv files) */}
                <div>
                  <button
                    onClick={() => setIsHDDropdownOpen(!isHDDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                  >
                    <div className="flex items-center">
                      <span>Download HD (mkv)</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-400 mr-2">
                        {
                          serverLinks.filter((link) => link.quality === "HD")
                            .length
                        }{" "}
                        links
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform ${
                          isHDDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>
                  {isHDDropdownOpen && (
                    <div className="mt-2 space-y-2">
                      {serverLinks
                        .filter((link) => link.quality === "HD")
                        .map((link, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              handleGroupedDownload(link.url, "HD")
                            }
                            className="w-full flex items-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <Download className="w-5 h-5 mr-2" />
                            <span>HD Link {index + 1}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {movieDetails?.genres && relatedMovies.length > 0
                ? `Related ${movieDetails.genres[0]} Movies`
                : "Related Movies"}
            </h2>
            {movieDetails?.genres &&
            movieDetails.genres.length > 0 &&
            relatedMovies.length > 0 ? (
              <Link
                href={`/genre/${encodeURIComponent(movieDetails.genres[0])}`}
                className="text-cyan-400 hover:text-cyan-300"
              >
                See All
              </Link>
            ) : (
              <Link
                href="/top-imdb"
                className="text-cyan-400 hover:text-cyan-300"
              >
                See All
              </Link>
            )}
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
                        router.push({
                          pathname: "/watch",
                          query: {
                            id: index,
                            title: movie.title,
                            year: movie.year?.replace(/[\(\)]/g, "") || "2024",
                            link: movie.link || "",
                          },
                        })
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
                            {movie.year?.replace(/[\(\)]/g, "") || ""}
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
                        {movie.year?.replace(/[\(\)]/g, "") || ""}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
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
