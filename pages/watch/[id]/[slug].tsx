import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps } from "next";
import Header from "@/components/HomeHeader";
import Footer from "@/components/Footer";
import MoviePlayerDetails from "@/components/movie/MoviePlayerDetails";
import RelatedMovies from "@/components/movie/RelatedMovies";

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

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('[data-zone="8979704"]');
    if (existingScript) return;

    // Create and configure script
    const script = document.createElement("script");
    script.src = "https://shebudriftaiter.net/tag.min.js";
    script.setAttribute("data-zone", "8979704");
    script.async = true;

    // Append to document
    const target = document.body || document.documentElement;
    target.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('[data-zone="8979704"]');
      if (scriptToRemove && scriptToRemove.parentNode) {
        scriptToRemove.parentNode.removeChild(scriptToRemove);
      }
    };
  }, []);

  // Inside your useEffect
  useEffect(() => {
    // If we have initial data from SSR, immediately set loading to false
    if (initialMovieDetails && initialMovieDetails.tmdb_id == tmdb_id) {
      setIsLoading(false);
    }
  }, [initialMovieDetails, tmdb_id]);

  useEffect(() => {}, [router, tmdb_id, slug]);

  // Handle iframe errors
  const handleIframeError = () => {
    // console.log("Iframe error occurred");
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
        // // console.log("Using server-side movie data");
        return;
      }

      try {
        // console.log(`Fetching movie details for TMDB ID: ${tmdb_id}`);
        setIsLoading(true);
        setError("");

        // Fetch detailed movie information including videos and credits
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
          throw new Error("API key not found");
        }

        const apiUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}?append_to_response=videos,credits&api_key=${API_KEY}`;
        // console.log(`Making API request to: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch movie details: ${response.status}`);
        }

        const tmdbData: TMDBMovieDetails = await response.json();
        // console.log("Movie data fetched successfully:", tmdbData.title);

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

        // console.log("Processed movie data:", movieData.title);
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
      // console.log("No TMDB ID provided");
    }
    // }, [tmdb_id, initialMovieDetails]);
  }, [tmdb_id, initialMovieDetails?.tmdb_id]);

  // Fetch related movies
  useEffect(() => {
    const fetchRelatedMovies = async () => {
      if (!tmdb_id) return;

      try {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        if (!API_KEY) {
          throw new Error("API key not found");
        }

        // Fetch recommendations from TMDB
        const recommendationsUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}/recommendations?language=en-US&page=1&api_key=${API_KEY}`;

        const response = await fetch(recommendationsUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch recommendations: ${response.status}`
          );
        }

        const data = await response.json();

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

          // console.log(`Processed ${formattedMovies.length} recommendations`);
          setRelatedMovies(formattedMovies);
          return;
        }

        if (!data.results || data.results.length === 0) {
          // console.log(
          //   "No recommendations found, fetching similar movies instead"
          // );

          const similarUrl = `https://api.themoviedb.org/3/movie/${tmdb_id}/similar?language=en-US&page=1&api_key=${API_KEY}`;
          // console.log(`Making API request to: ${similarUrl}`);

          const similarResponse = await fetch(similarUrl);

          if (!similarResponse.ok) {
            throw new Error(
              `Failed to fetch similar movies: ${similarResponse.status}`
            );
          }

          const similarData = await similarResponse.json();

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

            // console.log(`Processed ${formattedMovies.length} similar movies`);
            setRelatedMovies(formattedMovies);
          } else {
            // console.log("No similar movies found either");
            console.error("Error fetching related movies");
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
  useEffect(() => {}, [
    isLoading,
    movieDetails,
    relatedMovies,
    error,
    iframeError,
  ]);

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

      {/* Header */}
      <Header />

      <main
        id="main-content"
        className="max-w-7xl mx-auto px-4 pt-20 sm:pt-24 pb-16"
      >
        <div className="flex items-center space-x-2 sm:pt-4 text-sm sm:text-base mb-4">
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

        <MoviePlayerDetails
          movieDetails={movieDetails}
          isLoading={isLoading}
          iframeError={iframeError}
          onIframeError={handleIframeError}
          onRetryPlayer={() => setIframeError(false)}
        />

        {/* Related Movies Section */}
        <RelatedMovies relatedMovies={relatedMovies} isLoading={isLoading} />
      </main>

      {/* Footer */}
      <Footer />
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
