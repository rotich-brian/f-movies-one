import { useRouter } from "next/router";
import { MovieCard, MovieCardSkeleton } from "./MovieCard";

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
  onMovieClick?: (movie: Movie) => void;
}

export const MovieSection = ({
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
