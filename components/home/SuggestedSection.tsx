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

interface SuggestedSectionProps {
  movies: Movie[];
  isLoading: boolean;
  onMovieClick?: (movie: Movie) => void;
}

export const SuggestedSection = ({
  movies,
  isLoading,
  onMovieClick,
}: SuggestedSectionProps) => {
  return (
    <MovieSection
      title="Suggested For You"
      movies={movies}
      isLoading={isLoading}
      category="suggested"
      onMovieClick={onMovieClick}
    />
  );
};
