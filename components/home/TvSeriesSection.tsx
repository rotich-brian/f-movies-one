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

interface TvSeriesSectionProps {
  shows: Movie[];
  isLoading: boolean;
  onShowClick?: (movie: Movie) => void;
}

export const TvSeriesSection = ({
  shows,
  isLoading,
  onShowClick,
}: TvSeriesSectionProps) => {
  return (
    <MovieSection
      title="Latest TV Series"
      movies={shows}
      isLoading={isLoading}
      category="tv-series"
      onMovieClick={onShowClick}
    />
  );
};
