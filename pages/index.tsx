import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import InformationSection from "@/components/InformationSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

interface HomePageProps {
  backgroundImage?: string;
  siteName?: string;
  tagline?: string;
}

const Home: React.FC<HomePageProps> = ({
  backgroundImage = "/Avengers-Endgame-banner-poster.jpg",
  siteName = "FMovies",
  tagline = "FMoviesone Top - Just a better place for watching online movies for free!",
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FMovies",
    url: "https://fmoviesone.top",
    description: "Watch free movies and TV shows online in HD quality",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://fmoviesone.top/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        await router.push(
          `/search?q=${encodeURIComponent(searchQuery.trim())}`
        );
      } catch (error) {
        console.error("Navigation error:", error);
        setIsSearching(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        setIsSearching(true);
        router
          .push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
          .catch((error) => {
            console.error("Navigation error:", error);
            setIsSearching(false);
          });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleGoToHomePage = (): void => {
    router.push("/home");
  };

  return (
    <div className="min-h-screen relative">
      {/* SEO Component - should be at the top */}
      <SEO
        title={`${siteName} - Watch Free Movies Online Free Streaming in HD`}
        description={`${siteName} - Watch Movies and TV Shows online in HD quality. Stream thousands of movies and series for free with no registration required.`}
        canonical="/"
        structuredData={structuredData}
      />

      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          zIndex: -2,
        }}
        role="img"
        aria-label="Background image"
      />
      <div
        className="fixed inset-0 bg-black bg-opacity-75"
        style={{ zIndex: -1 }}
      />

      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto pt-20 sm:pt-24 lg:pt-28 pb-12 sm:pb-16 lg:pb-20">
        {/* Hero Section with Logo */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 px-4 sm:px-6">
          <div className="hidden sm:inline-block">
            <img
              src="/logo.png"
              alt={siteName}
              className="h-12 lg:h-16 xl:h-20 w-auto mx-auto drop-shadow-2xl"
              onError={(e) => {
                // Fallback to text if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = document.createElement("div");
                fallback.className =
                  "inline-block bg-gradient-to-r from-cyan-400 to-blue-500 bg-opacity-90 backdrop-blur-sm text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl text-2xl sm:text-3xl lg:text-4xl font-bold shadow-2xl";
                fallback.textContent = siteName;
                target.parentNode?.appendChild(fallback);
              }}
            />
          </div>

          {/* Tagline */}
          <p className="mt-4 sm:mt-6 text-base lg:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed px-4">
            {tagline}
          </p>
        </div>

        {/* Modern Search Section */}
        <div className="max-w-3xl px-4 sm:px-6 mx-auto mb-8 sm:mb-12 lg:mb-16">
          <div className="bg-black bg-opacity-40 backdrop-blur-lg rounded-full p-4 sm:p-6 lg:p-8 shadow-2xl border border-white border-opacity-10">
            <form onSubmit={handleSearch}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400 group-focus-within:text-cyan-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  placeholder="Search for movies, TV shows, or actors..."
                  className="w-full bg-[#1E2747] bg-opacity-95 backdrop-blur-sm pl-12 sm:pl-14 pr-16 sm:pr-20 py-4 sm:py-5 lg:py-6 rounded-full text-white placeholder-white/50 outline-none focus:outline-none focus:bg-[#1E2758] focus:text-white shadow-lg text-sm sm:text-base lg:text-lg font-medium transition-all duration-300"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isSearching}
                />

                <button
                  type="submit"
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white p-2 sm:p-3 lg:p-4 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  disabled={isSearching}
                  aria-label="Search for movies or TV shows"
                >
                  {isSearching ? (
                    <svg
                      className="animate-spin h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="h-4 w-4 sm:h-5 sm:w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Action Button with Open Icon */}
        <div className="text-center px-4 sm:px-6">
          <button
            onClick={handleGoToHomePage}
            className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105 font-semibold text-sm sm:text-base lg:text-lg"
          >
            <div className="bg-white rounded-full p-1 sm:p-1.5">
              <svg
                className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
            <span>Watch Movies Free</span>
          </button>
        </div>

        {/* Information Section Component */}
        <InformationSection />
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Home;
