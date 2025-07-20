import { MovieSection } from "./MovieSection";

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

interface MoviesSectionProps {
  movies: Movie[];
  isLoading: boolean;
  onMovieClick?: (movie: Movie) => void;
}

export const MoviesSection = ({
  movies,
  isLoading,
  onMovieClick,
}: MoviesSectionProps) => {
  return (
    <MovieSection
      title="Most Rated Movies"
      movies={movies}
      isLoading={isLoading}
      category="movies"
      onMovieClick={onMovieClick}
    />
  );
};
