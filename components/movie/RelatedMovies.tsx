import Link from "next/link";
import { MovieCard, MovieCardSkeleton } from "../home/MovieCard";

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

interface RelatedMoviesProps {
  relatedMovies: TMDBMovieSearchResult[];
  isLoading: boolean;
}

const RelatedMovies: React.FC<RelatedMoviesProps> = ({
  relatedMovies,
  isLoading,
}) => {
  // Transform TMDB movie data to Movie interface
  const transformTMDBToMovie = (tmdbMovie: TMDBMovieSearchResult): Movie => {
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      imageUrl: tmdbMovie.poster_path
        ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`
        : undefined,
      year: tmdbMovie.release_date
        ? tmdbMovie.release_date.split("-")[0]
        : undefined,
      rating: tmdbMovie.vote_average ? tmdbMovie.vote_average / 2 : undefined, // Convert 0-10 to 0-5
      description: tmdbMovie.overview,
    };
  };

  return (
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
              .map((_, index) => <MovieCardSkeleton key={index} />)
          : relatedMovies.map((movie) => (
              <MovieCard
                key={movie.id} // Use movie.id instead of index for better React key
                movie={transformTMDBToMovie(movie)}
                isTvShow={false}
              />
            ))}
      </div>
    </section>
  );
};

export default RelatedMovies;
