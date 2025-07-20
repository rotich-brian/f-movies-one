import { Play, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

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

interface HeroSectionProps {
  movies: Movie[]; // Changed from featuredMovie to movies array
  isLoading: boolean;
  onWatchClick: (movie: Movie) => void;
}

export const HeroSection = ({
  movies = [],
  isLoading,
  onWatchClick,
}: HeroSectionProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Take only top 5 movies
  const slideMovies = movies.slice(0, 5);
  const totalSlides = slideMovies.length;

  // Auto-scroll function
  const nextSlide = useCallback(() => {
    if (totalSlides > 1) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  // Auto-scroll effect
  useEffect(() => {
    if (totalSlides > 1 && !isLoading) {
      const interval = setInterval(nextSlide, 10000); // 5 seconds
      return () => clearInterval(interval);
    }
  }, [nextSlide, totalSlides, isLoading]);

  // Handle transition end
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
    }
  };

  if (isLoading) {
    return <FeaturedMovieSkeleton totalSlides={5} />;
  }

  if (!slideMovies.length) {
    return null;
  }

  const currentMovie = slideMovies[currentSlide];

  return (
    <div className="relative w-full h-[70vh] sm:h-[65vh] md:h-[60vh] overflow-hidden mb-6 sm:mb-8">
      {/* Background Images Container */}
      <div className="absolute inset-0">
        {slideMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={
                movie.imageUrl ||
                movie.image_src ||
                "/api/placeholder/1920/1080"
              }
              alt={movie.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index === 0}
              unoptimized
            />
          </div>
        ))}

        {/* Gradient Overlays */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(90deg, 
            rgb(26, 29, 36) 0%, 
            transparent 15%, 
            transparent 85%, 
            rgb(26, 29, 36) 100%),
            linear-gradient(180deg, 
            rgba(26, 29, 36, 0.7) 0%, 
            transparent 20%, 
            transparent 80%, 
            rgba(26, 29, 36, 0.8) 100%)`,
          }}
        />
        {/* Additional radial fade to body color */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `radial-gradient(ellipse at center, 
            rgba(26, 29, 36, 0.2) 20%,
            rgba(26, 29, 36, 0.7) 60%,
            rgba(26, 29, 36, 0.95) 100%)`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 h-full flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-none">
            {/* Content with smooth transitions */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isTransitioning
                  ? "opacity-0 transform translate-y-4"
                  : "opacity-100 transform translate-y-0"
              }`}
            >
              {/* Movie Badge */}
              {currentMovie.quality && (
                <div className="mb-3 sm:mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-yellow-500 text-black">
                    {currentMovie.quality}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight max-w-4xl">
                {currentMovie.title}
              </h1>

              {/* Rating and Year Row */}
              <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
                <div className="flex items-center">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 mr-1 sm:mr-2" />
                  <span className="text-white font-medium text-sm sm:text-base">
                    {(currentMovie.rating || currentMovie.imdb_rating)?.toFixed(
                      1
                    )}
                  </span>
                  <span className="text-gray-300 text-xs sm:text-sm ml-1">
                    /10
                  </span>
                </div>
                {currentMovie.year && (
                  <span className="text-gray-300 text-sm sm:text-base font-medium">
                    {currentMovie.year}
                  </span>
                )}
                {currentMovie.duration && (
                  <span className="text-gray-300 text-sm sm:text-base">
                    {currentMovie.duration}
                  </span>
                )}
                {currentMovie.quality && (
                  <span className="hidden sm:inline-block bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    HD
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-100 mb-6 sm:mb-8 max-w-5xl leading-relaxed line-clamp-5 text-lg sm:truncate md:text-xl lg:text-2xl xl:font-light">
                {currentMovie.description || "No description available"}
              </p>

              {/* Watch Button */}
              <button
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold rounded-full text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => onWatchClick(currentMovie)}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-200" />
                Watch Movie
              </button>
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 flex space-x-2">
            {slideMovies.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-110 ${
                  index === currentSlide
                    ? "bg-cyan-400 scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideProgress {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          100% {
            transform: scaleX(1);
            transform-origin: left;
          }
        }
      `}</style>
    </div>
  );
};

const FeaturedMovieSkeleton = ({ totalSlides = 5 }) => {
  return (
    <div className="relative w-full h-[70vh] sm:h-[65vh] md:h-[60vh] overflow-hidden mb-6 sm:mb-8">
      {/* Skeleton Background with Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse" />

        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(90deg, 
            rgb(26, 29, 36) 0%, 
            transparent 15%, 
            transparent 85%, 
            rgb(26, 29, 36) 100%),
            linear-gradient(180deg, 
            rgba(26, 29, 36, 0.7) 0%, 
            transparent 20%, 
            transparent 80%, 
            rgba(26, 29, 36, 0.8) 100%)`,
          }}
        />
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `radial-gradient(ellipse at center, 
            rgba(26, 29, 36, 0.2) 20%,
            rgba(26, 29, 36, 0.7) 60%,
            rgba(26, 29, 36, 0.95) 100%)`,
          }}
        />
      </div>

      {/* Content Skeleton */}
      <div className="relative z-20 h-full flex items-center">
        <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="w-full max-w-none">
            {/* Badge Skeleton */}
            <div className="mb-3 sm:mb-4">
              <div className="w-16 h-6 bg-gray-600/60 rounded-full animate-pulse" />
            </div>

            {/* Title Skeleton */}
            <div className="mb-3 sm:mb-4 max-w-4xl">
              <div className="h-9 sm:h-11 md:h-14 bg-gray-600/60 rounded-lg w-full animate-pulse mb-2" />
              <div className="h-9 sm:h-11 md:h-14 bg-gray-600/60 rounded-lg w-3/4 animate-pulse" />
            </div>

            {/* Rating Row Skeleton */}
            <div className="flex items-center space-x-4 sm:space-x-6 mb-4 sm:mb-6">
              <div className="flex items-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-600/60 rounded mr-1 sm:mr-2 animate-pulse" />
                <div className="w-8 h-4 sm:h-5 bg-gray-600/60 rounded animate-pulse" />
                <div className="w-6 h-3 sm:h-4 bg-gray-600/60 rounded ml-1 animate-pulse" />
              </div>
              <div className="w-12 h-4 sm:h-5 bg-gray-600/60 rounded animate-pulse" />
              <div className="w-20 h-4 sm:h-5 bg-gray-600/60 rounded animate-pulse" />
            </div>

            {/* Description Skeleton */}
            <div className="mb-6 sm:mb-8 max-w-5xl">
              <div className="block sm:hidden space-y-2">
                <div className="h-6 bg-gray-600/60 rounded w-full animate-pulse" />
                <div className="h-6 bg-gray-600/60 rounded w-full animate-pulse" />
                <div className="h-6 bg-gray-600/60 rounded w-full animate-pulse" />
                <div className="h-6 bg-gray-600/60 rounded w-full animate-pulse" />
                <div className="h-6 bg-gray-600/60 rounded w-3/4 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <div className="h-7 sm:h-8 md:h-9 lg:h-11 bg-gray-600/60 rounded w-4/5 animate-pulse" />
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="w-36 sm:w-44 h-12 sm:h-16 bg-gray-600/60 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Pagination Dots Skeleton */}
        <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-8 flex space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-600/60 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
