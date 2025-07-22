import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "@/components/Footer";
import Header from "@/components/HomeHeader";
import {
  createTmdbOptions,
  Movie,
  TMDB_BASE_URL,
  TMDBMovie,
  transformTmdbMovie,
} from "@/utils/tmdb-utils";
import { HeroSection } from "@/components/home/HeroSection";
import { SuggestedSection } from "@/components/home/SuggestedSection";
import { MoviesSection } from "@/components/home/MoviesSection";
import { TvSeriesSection } from "@/components/home/TvSeriesSection";

export default function Home() {
  const router = useRouter();
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [heroMovies, setHeroMovies] = useState<Movie[]>([]); // Changed from featuredMovie
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
  const [latestShows, setLatestShows] = useState<Movie[]>([]);
  const [isLatestMoviesLoading, setIsLatestMoviesLoading] = useState(true);
  const [isLatestShowsLoading, setIsLatestShowsLoading] = useState(true);

  const handleClick = (movie: Movie) => {
    const titleSlug = movie.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
    router.push(`/watch/${movie.id}/${titleSlug}`);
  };

  // Fetch trending movies for hero slideshow
  useEffect(() => {
    const fetchHeroMovies = async () => {
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
          // Get detailed info for top 5 movies
          const top5Movies = data.results.slice(0, 5);

          const detailedMovies = await Promise.all(
            top5Movies.map(async (movie: TMDBMovie) => {
              try {
                const detailResponse = await fetch(
                  `${TMDB_BASE_URL}/movie/${movie.id}?language=en-US`,
                  createTmdbOptions()
                );
                const detailData = await detailResponse.json();
                return transformTmdbMovie({ ...movie, ...detailData });
              } catch {
                // If detail fetch fails, use basic movie data
                return transformTmdbMovie(movie);
              }
            })
          );

          setHeroMovies(detailedMovies);

          // Use movies 6-15 for the suggested section
          setTopMovies(data.results.slice(5, 15).map(transformTmdbMovie));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeroMovies();
  }, []);

  // Fetch popular movies
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

    fetchLatestMovies();
  }, []);

  // Fetch top-rated TV shows
  useEffect(() => {
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

    fetchLatestShows();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Head>
        <title>
          FMovies - Watch Movies and TV Shows online in HD quality | fmoviesone
        </title>
        <meta
          name="description"
          content="FMovies - Watch Movies and TV Shows online in HD quality. Stream thousands of movies and series for free with no registration required. Similar f movies, fmoviesone, fmovies.to"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 pt-20 pb-16">
        {/* Hero Section with Slideshow */}
        <HeroSection
          movies={heroMovies} // Changed from featuredMovie to movies
          isLoading={isLoading}
          onWatchClick={handleClick}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Movie Sections */}
        {topMovies.length > 0 && (
          <SuggestedSection
            movies={topMovies}
            isLoading={isLoading}
            onMovieClick={handleClick}
          />
        )}

        <MoviesSection
          movies={latestMovies}
          isLoading={isLatestMoviesLoading}
          onMovieClick={handleClick}
        />

        <TvSeriesSection
          shows={latestShows}
          isLoading={isLatestShowsLoading}
          onShowClick={handleClick}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
