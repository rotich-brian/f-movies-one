// Types and utilities for TMDB API
export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string;
  overview: string;
  vote_count: number;
  genres?: { id: number; name: string }[];
}

export interface Movie {
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

// Define an interface for the transformed movie
export interface TransformedMovie {
  id: number;
  title: string;
  rating: number;
  year: string;
  imageUrl: string | undefined;
  image_src: string | undefined;
  description: string;
  quality: string;
  imdb_rating: number;
  imdb_votes: string;
  genres: string[];
  link: string;
}

// Constants for TMDB API
export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Function to create fetch options with your API key
export const createTmdbOptions = () => {
  return {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN}`,
    },
  };
};

export const transformTmdbMovie = (movie: TMDBMovie): TransformedMovie => {
  return {
    id: movie.id,
    title: movie.title || movie.name || "",
    rating: movie.vote_average,
    year: movie.release_date
      ? movie.release_date.substring(0, 4)
      : movie.first_air_date
      ? movie.first_air_date.substring(0, 4)
      : "",
    imageUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : undefined,
    image_src: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
      : undefined,
    description: movie.overview,
    quality: movie.vote_count > 1000 ? "HD" : "SD",
    imdb_rating: movie.vote_average,
    imdb_votes: movie.vote_count ? `${movie.vote_count}` : "",
    genres: movie.genres?.map((g) => g.name) || [],
    link: `/api/stream/${movie.id}`,
  };
};
