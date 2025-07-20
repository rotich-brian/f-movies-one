import { useRouter } from "next/router";
import { Play } from "lucide-react";
import Image from "next/image";

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

interface MovieCardProps {
  movie: Movie;
  onClick?: (movie: Movie) => void;
  isTvShow?: boolean;
}

export const MovieCard = ({ movie, onClick, isTvShow }: MovieCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      // Create a URL-friendly title slug
      const titleSlug = movie.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      // Use the new URL pattern: watch/tmdb_id/title-slug
      router.push(`/watch/${movie.id}/${titleSlug}`);
    }
  };

  const handleTvShowClick = () => {
    if (onClick) {
      onClick(movie);
    } else {
      // Create a URL-friendly title slug
      const titleSlug = movie.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      // Use the new URL pattern: watch/tmdb_id/title-slug
      router.push(`/series/${movie.id}/${titleSlug}`);
    }
  };

  // Single handler for the entire card
  const handleCardClick = () => {
    if (isTvShow) {
      handleTvShowClick();
    } else {
      handleClick();
    }
  };

  return (
    <div className="relative group cursor-pointer" onClick={handleCardClick}>
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-800 shadow-lg">
        <Image
          src={movie.imageUrl || movie.image_src || "/api/placeholder/220/330"}
          alt={movie.title}
          className="w-full h-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 220px"
          priority={false}
          unoptimized
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = "/placeholder.png";
          }}
        />

        {/* Year badge - always visible at bottom right */}
        {movie.year && (
          <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
            {movie.year}
          </div>
        )}

        {/* Quality badge - always visible at top left */}
        {movie.quality && (
          <div className="absolute top-3 left-3 bg-cyan-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold">
            {movie.quality}
          </div>
        )}

        {/* TV Show indicator - always visible at bottom left */}
        {isTvShow && (
          <div className="absolute bottom-3 left-3 bg-cyan-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            Series
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          {/* Play Button - removed click handler since parent handles it */}
          <div className="bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full p-4 transition-all duration-200 border border-white/30 hover:scale-110 pointer-events-none">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
      </div>

      {/* Title below card - max 2 lines */}
      <div className="mt-3 px-1">
        <h3 className="text-gray-200 group-hover:text-white text-sm font-medium leading-tight line-clamp-2 transition-colors duration-200">
          {movie.title}
        </h3>
      </div>
    </div>
  );
};

export const MovieCardSkeleton = () => {
  return (
    <div className="relative animate-pulse">
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-700 shadow-lg">
        {/* Year skeleton */}
        <div className="absolute bottom-3 right-3 bg-gray-600 rounded-md h-6 w-12"></div>

        {/* Quality skeleton */}
        <div className="absolute top-3 left-3 bg-gray-600 rounded-md h-6 w-8"></div>
      </div>

      {/* Title skeleton */}
      <div className="mt-3 px-1">
        <div className="h-4 bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-600 rounded w-3/4 mt-1"></div>
      </div>
    </div>
  );
};
