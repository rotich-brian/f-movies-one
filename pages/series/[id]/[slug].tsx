import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Star, Share2, Play, List, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import Header from "@/components/HomeHeader";
import Footer from "@/components/Footer";

interface TMDBTVDetails {
  id: number;
  name: string;
  overview: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  episode_run_time: number[];
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: { id: number; name: string; logo_path: string }[];
  credits?: {
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
  videos?: {
    results: {
      id: string;
      key: string;
      name: string;
      site: string;
      type: string;
    }[];
  };
  seasons: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string;
    overview: string;
    air_date: string;
  }[];
}

interface TMDBSeasonDetails {
  id: number;
  name: string;
  season_number: number;
  episodes: {
    id: number;
    name: string;
    episode_number: number;
    air_date: string;
    overview: string;
    still_path: string;
    vote_average: number;
    runtime: number;
  }[];
}

interface TMDBTVSearchResult {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genre_ids: number[];
}

interface TVShowDetails {
  title: string;
  year: string;
  quality: string;
  imdb_rating?: string;
  imdb_votes?: string;
  image_src?: string;
  urls?: string[];
  plot?: string;
  description?: string;
  actors?: string[];
  creators?: string[];
  genres?: string[];
  imdb_url?: string;
  link?: string;
  release_date?: string;
  runtime?: string;
  trailer?: string;
  tmdb_id?: number;
  backdrop_path?: string;
  videos?: { key: string; name: string; type: string }[];
  cast?: { name: string; character: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  seasons?: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string;
    overview: string;
    air_date: string;
  }[];
  status?: string;
}

interface TVCardProps {
  show: {
    id: number;
    title: string;
    rating: string;
    genres: string[];
    imageUrl: string;
    quality: string;
    year?: string;
    link?: string;
    tmdb_id?: number;
    imdb_rating?: string;
    imdb_votes?: string;
    image_src?: string;
    poster_path?: string;
  };
}

// Episode Button Component
const EpisodeButton = ({
  episode,
  isActive,
  onClick,
}: {
  episode: TMDBSeasonDetails["episodes"][0];
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 rounded-md flex flex-col items-start transition-colors ${
        isActive
          ? "bg-cyan-500 text-white"
          : "bg-gray-700 hover:bg-gray-600 text-gray-200"
      }`}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span className="font-medium">{`Episode ${episode.episode_number}`}</span>
        {episode.runtime && (
          <span className="text-xs opacity-75">{`${episode.runtime} min`}</span>
        )}
      </div>
      <span className="text-xs line-clamp-1 text-left">{episode.name}</span>
    </button>
  );
};

type Season = {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string;
  overview: string;
  air_date: string;
};

const SeasonTab = ({
  season,
  isActive,
  onClick,
}: {
  season: Season;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-cyan-500 text-white"
          : "bg-gray-700 hover:bg-gray-600 text-gray-200"
      }`}
    >
      {season.name}
    </button>
  );
};

// Main TV Series Watch Page Component
export default function TVSeriesWatchPage() {
  const router = useRouter();
  const { slug } = router.query;

  const tmdb_id =
    router.query.tmdb_id ||
    (router.asPath.startsWith("/series/") && router.asPath.split("/")[2]);

  const [tvShowDetails, setTVShowDetails] = useState<TVShowDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [relatedShows, setRelatedShows] = useState<TVCardProps["show"][]>([]);
  const [iframeError, setIframeError] = useState<boolean>(false);

  // Season and episode state
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);
  const [seasonDetails, setSeasonDetails] = useState<TMDBSeasonDetails | null>(
    null
  );
  const [isLoadingSeason, setIsLoadingSeason] = useState(false);

  useEffect(() => {
    // console.log("Router path:", router.asPath);
    // console.log("Extracted TMDB ID:", tmdb_id);
    // console.log("Slug:", slug);
  }, [router, tmdb_id, slug]);

  // Handle iframe errors
  const handleIframeError = () => {
    // console.log("Iframe error occurred");
    setIframeError(true);
  };

  // Update iframe when season or episode changes
  const updatePlayer = (season: number, episode: number) => {
    setSelectedSeason(season);
    setSelectedEpisode(episode);
    setIframeError(false);
    // Scroll to top to show the updated player
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch TV show details from TMDB API
  useEffect(() => {
    const fetchTVShowDetails = async () => {
      if (!tmdb_id) return;

      try {
        // console.log(`Fetching TV show details for TMDB ID: ${tmdb_id}`);
        setIsLoading(true);
        setError("");

        // Fetch detailed TV show information including videos and credits
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
          throw new Error("API key not found");
        }

        const apiUrl = `https://api.themoviedb.org/3/tv/${tmdb_id}?append_to_response=videos,credits&api_key=${API_KEY}`;
        // console.log(`Making API request to: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch TV show details: ${response.status}`
          );
        }

        const tmdbData: TMDBTVDetails = await response.json();
        // console.log("TV show data fetched successfully:", tmdbData.name);

        // Format creators
        const creators =
          tmdbData.credits?.crew
            .filter(
              (person) =>
                person.job === "Creator" || person.job === "Executive Producer"
            )
            .map((creator) => creator.name) || [];

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

        // Convert TMDB data to our TVShowDetails format
        const tvShowData: TVShowDetails = {
          title: tmdbData.name,
          year: tmdbData.first_air_date
            ? new Date(tmdbData.first_air_date).getFullYear().toString()
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
          runtime:
            tmdbData.episode_run_time.length > 0
              ? `${tmdbData.episode_run_time[0]} min`
              : undefined,
          release_date: tmdbData.first_air_date,
          trailer:
            videos.length > 0
              ? `https://www.youtube.com/watch?v=${videos[0].key}`
              : undefined,
          videos: videos,
          creators: creators,
          cast: cast,
          tmdb_id: tmdbData.id,
          number_of_seasons: tmdbData.number_of_seasons,
          number_of_episodes: tmdbData.number_of_episodes,
          seasons: tmdbData.seasons,
          status: tmdbData.status,
        };

        // console.log("Processed TV show data:", tvShowData.title);
        setTVShowDetails(tvShowData);

        // Set initial season and episode
        if (tvShowData.seasons && tvShowData.seasons.length > 0) {
          // Find the first regular season (sometimes season 0 is specials)
          const firstRegularSeason =
            tvShowData.seasons.find((s) => s.season_number > 0) ||
            tvShowData.seasons[0];
          setSelectedSeason(firstRegularSeason.season_number);
        }
      } catch (err) {
        console.error("Error fetching TV show details:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (tmdb_id) {
      fetchTVShowDetails();
    } else {
      console.log("No TMDB ID provided");
    }
  }, [tmdb_id]);

  // Fetch season details when selected season changes
  useEffect(() => {
    const fetchSeasonDetails = async () => {
      if (!tmdb_id || !selectedSeason) return;

      try {
        setIsLoadingSeason(true);
        // console.log(
        //   `Fetching season ${selectedSeason} details for TV show ${tmdb_id}`
        // );

        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
          throw new Error("API key not found");
        }

        const apiUrl = `https://api.themoviedb.org/3/tv/${tmdb_id}/season/${selectedSeason}?api_key=${API_KEY}`;
        // console.log(`Making API request to: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch season details: ${response.status}`);
        }

        const data: TMDBSeasonDetails = await response.json();
        // console.log(
        //   `Season ${selectedSeason} data fetched successfully with ${data.episodes.length} episodes`
        // );

        setSeasonDetails(data);

        // Set first episode if not set or if current selected episode is out of range
        if (data.episodes && data.episodes.length > 0) {
          if (!selectedEpisode || selectedEpisode > data.episodes.length) {
            setSelectedEpisode(1);
          }
        }
      } catch (err) {
        console.error("Error fetching season details:", err);
      } finally {
        setIsLoadingSeason(false);
      }
    };

    if (tmdb_id && selectedSeason) {
      fetchSeasonDetails();
    }
  }, [tmdb_id, selectedSeason]);

  // Fetch related TV shows
  useEffect(() => {
    const fetchRelatedShows = async () => {
      if (!tmdb_id) return;

      try {
        // console.log(`Fetching related TV shows for TMDB ID: ${tmdb_id}`);

        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
          throw new Error("API key not found");
        }

        // Fetch recommendations from TMDB
        const recommendationsUrl = `https://api.themoviedb.org/3/tv/${tmdb_id}/recommendations?language=en-US&page=1&api_key=${API_KEY}`;
        // console.log(`Making API request to: ${recommendationsUrl}`);

        const response = await fetch(recommendationsUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch recommendations: ${response.status}`
          );
        }

        const data = await response.json();
        // console.log(
        //   `Recommendations fetched. Total results: ${
        //     data.results ? data.results.length : 0
        //   }`
        // );

        if (data.results && data.results.length > 0) {
          const formattedShows = data.results
            .slice(0, 15)
            .map((show: TMDBTVSearchResult) => ({
              id: show.id,
              tmdb_id: show.id,
              title: show.name,
              rating: (show.vote_average / 2).toFixed(1),
              genres: [],
              quality: "HD",
              imageUrl: show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : "/placeholder.png",
              image_src: show.poster_path
                ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                : "/placeholder.png",
              poster_path: show.poster_path,
              year: show.first_air_date
                ? new Date(show.first_air_date).getFullYear().toString()
                : "",
              imdb_rating: (show.vote_average / 2).toFixed(1),
              imdb_votes: `${show.vote_count} votes`,
              link: `/series/${show.id}/${show.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")}`,
            }));

          // console.log(`Processed ${formattedShows.length} recommendations`);
          setRelatedShows(formattedShows);
          return;
        }

        if (!data.results || data.results.length === 0) {
          // console.log(
          //   "No recommendations found, fetching similar shows instead"
          // );

          const similarUrl = `https://api.themoviedb.org/3/tv/${tmdb_id}/similar?language=en-US&page=1&api_key=${API_KEY}`;
          // console.log(`Making API request to: ${similarUrl}`);

          const similarResponse = await fetch(similarUrl);

          if (!similarResponse.ok) {
            throw new Error(
              `Failed to fetch similar shows: ${similarResponse.status}`
            );
          }

          const similarData = await similarResponse.json();
          // console.log(
          //   `Similar shows fetched. Total results: ${
          //     similarData.results ? similarData.results.length : 0
          //   }`
          // );

          if (similarData.results && similarData.results.length > 0) {
            const formattedShows = similarData.results
              .slice(0, 15)
              .map((show: TMDBTVSearchResult) => ({
                id: show.id,
                tmdb_id: show.id,
                title: show.name,
                rating: (show.vote_average / 2).toFixed(1),
                genres: [],
                quality: "HD",
                imageUrl: show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                  : "/placeholder.png",
                image_src: show.poster_path
                  ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                  : "/placeholder.png",
                poster_path: show.poster_path,
                year: show.first_air_date
                  ? new Date(show.first_air_date).getFullYear().toString()
                  : "",
                imdb_rating: (show.vote_average / 2).toFixed(1),
                imdb_votes: `${show.vote_count} votes`,
                link: `/series/${show.id}/${show.name
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, "")
                  .replace(/\s+/g, "-")}`,
              }));

            // console.log(`Processed ${formattedShows.length} similar shows`);
            setRelatedShows(formattedShows);
          } else {
            // console.log("No similar shows found either");
            console.error("Error fetching related shows");
          }
        }
      } catch (error) {
        console.error("Error fetching related shows:", error);
      }
    };

    if (tmdb_id) {
      fetchRelatedShows();
    }
  }, [tmdb_id]);

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Head>
        <title>{`${
          tvShowDetails?.title || "Watch TV Series"
        } - FMovies`}</title>
        <meta
          name="description"
          content={`Watch ${tvShowDetails?.title} ${
            tvShowDetails?.year ? `(${tvShowDetails.year})` : ""
          } in HD quality`}
        />
      </Head>

      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        <div className="flex items-center space-x-2 text-sm mb-4">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300">
            Home
          </Link>
          <span className="text-gray-500">/</span>
          <Link href="/tv-series" className="text-cyan-400 hover:text-cyan-300">
            TV Series
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">
            {tvShowDetails?.title || "Loading..."}
          </span>
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
          ) : !tvShowDetails ? (
            <div className="w-full aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-white text-center p-4">
                <h3 className="text-xl mb-2">Unable to load TV show</h3>
                <p className="text-gray-400">
                  {error || "Please check the TV show ID or try again later"}
                </p>
              </div>
            </div>
          ) : tvShowDetails?.tmdb_id && !iframeError ? (
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
              <iframe
                src={`https://vidsrc.me/embed/tv?tmdb=${tvShowDetails.tmdb_id}&season=${selectedSeason}&episode=${selectedEpisode}`}
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
                  tvShowDetails?.backdrop_path ||
                  tvShowDetails?.image_src ||
                  "/placeholder.png"
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className="text-white text-xl mb-4 font-bold">
                  {tvShowDetails?.title}
                </div>
                <a
                  href={tvShowDetails?.trailer}
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
        {!isLoading && tvShowDetails?.tmdb_id && iframeError && (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setIframeError(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Retry Player
            </button>
          </div>
        )}

        {/* Season and Episode Selection */}
        {!isLoading &&
          tvShowDetails?.seasons &&
          tvShowDetails.seasons.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6 mb-8">
              <h3 className="text-white font-semibold text-lg mb-4">
                {`${tvShowDetails.title} - Season ${selectedSeason}, Episode ${selectedEpisode}`}
              </h3>

              {/* Season Tabs */}
              <div className="mb-6">
                <h4 className="text-gray-300 text-sm mb-3">Seasons</h4>
                <div className="flex flex-wrap gap-2">
                  {tvShowDetails.seasons
                    .filter((season) => season.season_number > 0)
                    .map((season) => (
                      <SeasonTab
                        key={season.season_number}
                        season={season}
                        isActive={selectedSeason === season.season_number}
                        onClick={() => setSelectedSeason(season.season_number)}
                      />
                    ))}
                </div>
              </div>

              {/* Episodes List */}
              <div>
                <h4 className="text-gray-300 text-sm mb-3">Episodes</h4>
                {isLoadingSeason ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-700 h-16 rounded-md"
                      ></div>
                    ))}
                  </div>
                ) : !seasonDetails || seasonDetails.episodes.length === 0 ? (
                  <div className="text-gray-400 py-4">
                    No episodes available for this season
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {seasonDetails.episodes.map((episode) => (
                      <EpisodeButton
                        key={episode.episode_number}
                        episode={episode}
                        isActive={selectedEpisode === episode.episode_number}
                        onClick={() =>
                          updatePlayer(selectedSeason, episode.episode_number)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        {/* TV Show Details Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* TV Show Poster and Title */}
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
                  {tvShowDetails?.title}{" "}
                  {tvShowDetails?.year ? `(${tvShowDetails.year})` : ""}
                </h1>

                <div className="relative aspect-[2/3] mb-4 hidden md:block">
                  <img
                    src={tvShowDetails?.image_src || `/placeholder.png`}
                    alt={tvShowDetails?.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.png";
                      // console.log(
                      //   "TV show poster image failed to load, using placeholder"
                      // );
                    }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-4">
                  <span className="bg-cyan-400 text-white px-2 py-1 rounded text-sm">
                    {tvShowDetails?.quality}
                  </span>
                  {tvShowDetails?.runtime && (
                    <>
                      <span>•</span>
                      <span>{tvShowDetails.runtime}</span>
                    </>
                  )}
                  {tvShowDetails?.release_date && (
                    <>
                      <span>•</span>
                      <span>
                        {new Date(tvShowDetails.release_date).getFullYear()}
                      </span>
                    </>
                  )}
                </div>

                {tvShowDetails?.genres && tvShowDetails.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tvShowDetails.genres.map((genre, index) => (
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

          {/* TV Show Description and Info */}
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
                  Series Details
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  {tvShowDetails?.imdb_rating && (
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 mr-1" />
                      <span className="text-white font-bold text-lg">
                        {tvShowDetails.imdb_rating}
                      </span>
                    </div>
                  )}
                  {tvShowDetails?.imdb_votes && (
                    <span className="text-gray-300 text-sm">
                      {tvShowDetails.imdb_votes}
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-gray-200 font-medium mb-2">Synopsis</h4>
                  <p className="text-gray-300">
                    {tvShowDetails?.plot || "No plot available"}
                  </p>
                </div>

                <div className="space-y-4">
                  {tvShowDetails?.status && (
                    <div>
                      <h4 className="text-gray-200 font-medium mb-1">Status</h4>
                      <p className="text-gray-300">{tvShowDetails.status}</p>
                    </div>
                  )}

                  {tvShowDetails?.number_of_seasons && (
                    <div>
                      <h4 className="text-gray-200 font-medium mb-1">
                        Seasons
                      </h4>
                      <p className="text-gray-300">
                        {tvShowDetails.number_of_seasons}
                      </p>
                    </div>
                  )}

                  {tvShowDetails?.number_of_episodes && (
                    <div>
                      <h4 className="text-gray-200 font-medium mb-1">
                        Episodes
                      </h4>
                      <p className="text-gray-300">
                        {tvShowDetails.number_of_episodes}
                      </p>
                    </div>
                  )}

                  {tvShowDetails?.creators &&
                    tvShowDetails.creators.length > 0 && (
                      <div>
                        <h4 className="text-gray-200 font-medium mb-1">
                          {tvShowDetails.creators.length > 1
                            ? "Creators"
                            : "Creator"}
                        </h4>
                        <p className="text-gray-300">
                          {tvShowDetails.creators.join(", ")}
                        </p>
                      </div>
                    )}

                  {tvShowDetails?.cast && tvShowDetails.cast.length > 0 && (
                    <div>
                      <h4 className="text-gray-200 font-medium mb-1">Cast</h4>
                      <p className="text-gray-300">
                        {tvShowDetails.cast
                          .map((actor) => actor.name)
                          .join(", ")}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Trailer and Watch Controls */}
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

                {tvShowDetails?.videos && tvShowDetails.videos.length > 0 ? (
                  <div className="aspect-video mb-6">
                    <iframe
                      src={`https://www.youtube.com/embed/${tvShowDetails.videos[0].key}`}
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

                {/* Watch Controls */}
                <h3 className="text-white font-semibold mb-4">Quick Access</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => {
                      if (selectedEpisode > 1) {
                        updatePlayer(selectedSeason, selectedEpisode - 1);
                      }
                    }}
                    disabled={selectedEpisode <= 1}
                    className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                      selectedEpisode > 1
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <span>Previous Episode</span>
                  </button>

                  <button
                    onClick={() => {
                      if (
                        seasonDetails &&
                        selectedEpisode < seasonDetails.episodes.length
                      ) {
                        updatePlayer(selectedSeason, selectedEpisode + 1);
                      }
                    }}
                    disabled={
                      !seasonDetails ||
                      selectedEpisode >= seasonDetails.episodes.length
                    }
                    className={`px-4 py-3 rounded-lg flex items-center justify-center ${
                      seasonDetails &&
                      selectedEpisode < seasonDetails.episodes.length
                        ? "bg-blue-500 hover:bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <span>Next Episode</span>
                  </button>
                </div>

                {/* Season Jump */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-gray-200 text-sm mb-2">
                    <span>Jump to Season</span>
                    {tvShowDetails?.number_of_seasons && (
                      <span className="text-cyan-400">
                        {selectedSeason} / {tvShowDetails.number_of_seasons}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tvShowDetails?.seasons
                      ?.filter((season) => season.season_number > 0)
                      ?.slice(0, 5)
                      .map((season) => (
                        <button
                          key={season.season_number}
                          onClick={() =>
                            setSelectedSeason(season.season_number)
                          }
                          className={`w-9 h-9 rounded-md flex items-center justify-center transition-colors ${
                            selectedSeason === season.season_number
                              ? "bg-cyan-500 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {season.season_number}
                        </button>
                      ))}

                    {(tvShowDetails?.seasons || []).filter(
                      (s) => (s?.season_number ?? 0) > 0
                    ).length > 5 && (
                      <button
                        onClick={() => {
                          document
                            .getElementById("seasons-section")
                            ?.scrollIntoView({
                              behavior: "smooth",
                            });
                        }}
                        className="bg-gray-700 text-gray-300 hover:bg-gray-600 w-9 h-9 rounded-md flex items-center justify-center"
                      >
                        ...
                      </button>
                    )}
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: tvShowDetails?.title,
                        text: `Watch ${tvShowDetails?.title} ${
                          tvShowDetails?.year || ""
                        } - Season ${selectedSeason}, Episode ${selectedEpisode}`,
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
                  <span>Share Series</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Watch Info */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <List className="w-5 h-5 text-cyan-400 mr-2" />
            <h3 className="text-white font-semibold text-lg">
              Current Episode
            </h3>
          </div>

          {isLoadingSeason ? (
            <div className="animate-pulse space-y-2">
              <div className="h-6 w-3/4 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-700 rounded"></div>
              <div className="h-4 w-full bg-gray-700 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
            </div>
          ) : seasonDetails &&
            selectedEpisode &&
            selectedEpisode <= seasonDetails.episodes.length ? (
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h4 className="text-xl font-medium text-white">
                  {seasonDetails.episodes[selectedEpisode - 1].name}
                </h4>
                <div className="flex items-center text-gray-400 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {seasonDetails.episodes[selectedEpisode - 1].air_date
                    ? new Date(
                        seasonDetails.episodes[selectedEpisode - 1].air_date
                      ).toLocaleDateString()
                    : "Unknown air date"}
                </div>
                {seasonDetails.episodes[selectedEpisode - 1].runtime && (
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {seasonDetails.episodes[selectedEpisode - 1].runtime} min
                  </div>
                )}
              </div>
              <p className="text-gray-300 mb-4">
                {seasonDetails.episodes[selectedEpisode - 1].overview ||
                  "No overview available for this episode."}
              </p>
              <div className="flex items-center text-sm">
                <span className="text-gray-400 mr-2">Rating:</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  <span className="text-white">
                    {seasonDetails.episodes[
                      selectedEpisode - 1
                    ].vote_average.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-400">
              No episode information available
            </div>
          )}
        </div>

        {/* Related Series Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              {relatedShows.length > 0
                ? "Related Series"
                : "Recommended Series"}
            </h2>
            <Link
              href="/tv-series"
              className="text-cyan-400 hover:text-cyan-300"
            >
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isLoading || relatedShows.length === 0
              ? Array(10)
                  .fill(null)
                  .map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
                      <div className="h-4 bg-gray-700 rounded mb-2"></div>
                      <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
                    </div>
                  ))
              : relatedShows.map((show, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <div
                      className="relative aspect-[2/3] overflow-hidden rounded-lg bg-gray-800"
                      onClick={() =>
                        router.push(
                          `/series/${show.tmdb_id}/${show.title
                            .toLowerCase()
                            .replace(/[^\w\s-]/g, "")
                            .replace(/\s+/g, "-")}`
                        )
                      }
                    >
                      <img
                        src={show.image_src || "/placeholder.png"}
                        alt={show.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-white text-sm font-medium">
                            {show.year || ""}
                            {show.imdb_rating && (
                              <span className="ml-2 bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded">
                                ⭐ {show.imdb_rating}
                              </span>
                            )}
                          </div>
                          {show.quality && (
                            <div className="text-cyan-400 text-sm mt-1">
                              {show.quality}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <h3 className="text-gray-300 group-hover:text-white text-sm font-medium truncate">
                        {show.title}
                      </h3>
                      <div className="text-gray-500 text-xs">
                        {show.year || ""}
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
