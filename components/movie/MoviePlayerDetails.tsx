import { Star, Share2, Play } from "lucide-react";
import { useState } from "react";

interface MovieDetails {
  title: string;
  year: string;
  quality: string;
  imdb_rating?: string;
  imdb_votes?: string;
  image_src?: string;
  plot?: string;
  genres?: string[];
  imdb_url?: string;
  runtime?: string;
  release_date?: string;
  trailer?: string;
  imdb_id?: string;
  tmdb_id?: number;
  backdrop_path?: string;
  videos?: { key: string; name: string; type: string }[];
  directors?: string[];
  cast?: { name: string; character: string }[];
}

interface MoviePlayerDetailsProps {
  movieDetails: MovieDetails | null;
  isLoading: boolean;
  iframeError: boolean;
  onIframeError: () => void;
  onRetryPlayer: () => void;
}

const MoviePlayerDetails: React.FC<MoviePlayerDetailsProps> = ({
  movieDetails,
  isLoading,
  iframeError,
  onIframeError,
  onRetryPlayer,
}) => {
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlayClick = () => {
    setShowPlayer(true);
    if (iframeError) {
      onRetryPlayer();
    }
  };

  return (
    <>
      {/* Video Player Section */}
      <div className="relative w-full">
        {isLoading ? (
          <div className="w-full aspect-[16/9] bg-gray-900 rounded-t-lg">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        ) : !movieDetails ? (
          <div className="w-full aspect-[16/9] bg-gray-900 rounded-t-lg flex items-center justify-center">
            <div className="text-white text-center p-4">
              <h3 className="text-xl mb-2">Unable to load movie</h3>
              <p className="text-gray-400">
                Please check the movie ID or try again later
              </p>
            </div>
          </div>
        ) : showPlayer && movieDetails?.imdb_id && !iframeError ? (
          <div className="w-full aspect-[16/9] bg-black rounded-t-lg overflow-hidden shadow-xl">
            <iframe
              src={`https://vidsrc.me/embed/movie?imdb=${movieDetails.imdb_id}`}
              style={{ width: "100%", height: "100%" }}
              className="w-full h-full"
              frameBorder="0"
              referrerPolicy="origin"
              allowFullScreen
              onError={onIframeError}
            />
          </div>
        ) : (
          <div
            className="w-full bg-gray-900 rounded-t-lg relative cursor-pointer group 
             h-[30vh] sm:h-[40vh] md:h-[60vh]"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${
                movieDetails?.backdrop_path ||
                movieDetails?.image_src ||
                "/placeholder.png"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={handlePlayClick}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-cyan-400 rounded-full p-4 cursor-pointer hover:bg-cyan-500 transition-all duration-300 group-hover:scale-110 shadow-lg">
                <Play className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle button to retry iframe if it fails */}
      {!isLoading && movieDetails?.imdb_id && iframeError && showPlayer && (
        <div className="flex justify-center mb-4">
          <button
            onClick={onRetryPlayer}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Retry Player
          </button>
        </div>
      )}

      {/* Movie Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Movie Poster and Title */}
        <div className="bg-gray-800 p-6">
          {isLoading ? (
            <>
              <div className="animate-pulse h-8 w-3/4 bg-gray-700 rounded mb-6"></div>
              <div className="animate-pulse aspect-[2/3] bg-gray-700 rounded-lg mb-4"></div>
              <div className="flex items-center gap-2">
                <div className="animate-pulse h-6 w-16 bg-gray-700 rounded-md"></div>
                <span className="text-gray-700">•</span>
                <div className="animate-pulse h-6 w-12 bg-gray-700 rounded"></div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-bold text-white py-4">
                {movieDetails?.title}{" "}
                {movieDetails?.year ? `(${movieDetails.year})` : ""}
              </h1>

              <div className="relative aspect-[2/3] mb-4 hidden md:block">
                <img
                  src={movieDetails?.image_src || `/placeholder.png`}
                  alt={movieDetails?.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder.png";
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-gray-300 mb-4">
                <span className="bg-cyan-400 text-white px-2 py-1 rounded text-sm">
                  {movieDetails?.quality}
                </span>
                {movieDetails?.runtime && (
                  <>
                    <span>•</span>
                    <span>{movieDetails.runtime}</span>
                  </>
                )}
                {movieDetails?.release_date && (
                  <>
                    <span>•</span>
                    <span>
                      {new Date(movieDetails.release_date).getFullYear()}
                    </span>
                  </>
                )}
              </div>

              {movieDetails?.genres && movieDetails.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {movieDetails.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Movie Description and Ratings */}
        <div className="bg-gray-800 p-6">
          {isLoading ? (
            <>
              <div className="flex items-center gap-4 mb-4">
                <div className="animate-pulse h-6 w-16 bg-gray-700 rounded flex items-center"></div>
                <div className="animate-pulse h-5 w-32 bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="animate-pulse h-4 w-full bg-gray-700 rounded"></div>
                <div className="animate-pulse h-4 w-full bg-gray-700 rounded"></div>
                <div className="animate-pulse h-4 w-3/4 bg-gray-700 rounded"></div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-white font-semibold text-xl mb-4">
                Movie Details
              </h3>

              <div className="flex items-center gap-4 mb-6">
                {movieDetails?.imdb_rating && (
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span className="text-white font-bold text-lg">
                      {movieDetails.imdb_rating}
                    </span>
                  </div>
                )}
                {movieDetails?.imdb_votes && (
                  <span className="text-gray-300 text-sm">
                    {movieDetails.imdb_votes}
                  </span>
                )}
                {movieDetails?.imdb_url && (
                  <a
                    href={movieDetails.imdb_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 text-sm"
                  >
                    IMDb
                  </a>
                )}
              </div>

              <div className="mb-6">
                <h4 className="text-gray-200 font-medium mb-2">Synopsis</h4>
                <p className="text-gray-300">
                  {movieDetails?.plot || "No plot available"}
                </p>
              </div>

              {movieDetails?.directors && movieDetails.directors.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-gray-200 font-medium mb-1">
                    Director{movieDetails.directors.length > 1 ? "s" : ""}
                  </h4>
                  <p className="text-gray-300">
                    {movieDetails.directors.join(", ")}
                  </p>
                </div>
              )}

              {movieDetails?.cast && movieDetails.cast.length > 0 && (
                <div>
                  <h4 className="text-gray-200 font-medium mb-1">Cast</h4>
                  <p className="text-gray-300">
                    {movieDetails.cast.map((actor) => actor.name).join(", ")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Trailer and Information */}
        <div className="bg-gray-800 p-6">
          {isLoading ? (
            <>
              <div className="animate-pulse h-6 w-40 bg-gray-700 rounded mb-4"></div>
              <div className="animate-pulse h-48 w-full bg-gray-700 rounded-lg mb-4"></div>
              <div className="space-y-4">
                <div className="animate-pulse h-12 w-full bg-gray-700 rounded-lg"></div>
                <div className="animate-pulse h-12 w-full bg-gray-700 rounded-lg"></div>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-white font-semibold text-xl mb-4">Trailer</h3>

              {movieDetails?.videos && movieDetails.videos.length > 0 ? (
                <div className="aspect-video mb-6">
                  <iframe
                    src={`https://www.youtube.com/embed/${movieDetails.videos[0].key}`}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="flex items-center justify-center bg-gray-700 aspect-video rounded-lg mb-6">
                  <p className="text-gray-400">No trailer available</p>
                </div>
              )}

              {/* Watch Options */}
              <h3 className="text-white font-semibold mb-4">Watch Options</h3>

              {movieDetails?.imdb_id ? (
                <button
                  onClick={() => {
                    handlePlayClick();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mb-4"
                >
                  <Play className="w-5 h-5 mr-2" />
                  <span>Watch Movie Now</span>
                </button>
              ) : (
                <div className="w-full px-4 py-3 bg-gray-700 text-gray-400 rounded-lg mb-4 text-center">
                  No streaming source available
                </div>
              )}

              {/* Share Button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: movieDetails?.title,
                      text: `Watch ${movieDetails?.title} ${
                        movieDetails?.year || ""
                      }`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
                className="w-full flex items-center justify-center mt-4 px-4 py-3 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
              >
                <Share2 className="w-5 h-5 mr-2" />
                <span>Share Movie</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MoviePlayerDetails;
