import { useState } from "react";
import Head from "next/head";
import { Menu, Search, X } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1d24]">
      <Head>
        <title>Fmovies - Watch Free Movies Online</title>
        <meta
          name="description"
          content="Fmovies is the best site to watch free movies online without downloading. Stream free movies here."
        />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      {/* Navigation */}
      <nav className="bg-[#1a1d24] border-b border-gray-800 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0" onClick={() => router.push("/")}>
              <div className="bg-cyan-400 text-white px-4 py-2 rounded-md font-bold">
                FMovies
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                href="/home"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Home
              </Link>
              <Link
                href="/genres"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Genres
              </Link>
              <Link
                href="/country"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Country
              </Link>
              <Link
                href="/movies"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Movies
              </Link>
              <Link
                href="/tv-series"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                TV-Series
              </Link>
              <Link
                href="/top-imdb"
                className="text-gray-300 hover:text-white px-3 py-2"
              >
                Top IMDb
              </Link>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-xl ml-8">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search movies or TV shows"
                    className="w-full bg-white px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    <Search className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </form>
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                className="p-2 text-gray-300 hover:text-white"
                onClick={toggleSearch}
              >
                <Search size={24} />
              </button>
              <button
                className="p-2 text-gray-300 hover:text-white"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden pb-4">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search movies or TV shows"
                  className="w-full bg-white px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </form>
            </div>
          )}

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-2">
                <Link
                  href="/home"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Home
                </Link>
                <Link
                  href="/genres"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Genres
                </Link>
                <Link
                  href="/country"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Country
                </Link>
                <Link
                  href="/movies"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Movies
                </Link>
                <Link
                  href="/tv-series"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  TV-Series
                </Link>
                <Link
                  href="/top-imdb"
                  className="text-gray-300 hover:text-white px-3 py-2"
                >
                  Top IMDb
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Center Logo */}
        <div className="text-center mb-12">
          <div className="inline-block bg-cyan-400 text-white px-8 py-4 rounded-lg text-3xl font-bold">
            FMovies
          </div>
        </div>

        {/* Center Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter Movies or Series name"
                className="w-full bg-white px-6 py-4 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-cyan-400 text-white px-6 py-2 rounded-md"
              >
                Search
              </button>
            </div>
          </form>
          {isSearching && (
            <div className="text-center mt-4 text-gray-300">Searching...</div>
          )}
        </div>

        {/* Tagline */}
        <div className="text-center text-gray-300 mb-8">
          FMoviesone Top - Just a better place for watching online movies for
          free!
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link
            href="/home"
            className="bg-cyan-400 text-white px-6 py-3 rounded-md hover:bg-cyan-500 transition-colors"
          >
            Go to home page
          </Link>
        </div>

        {/* Information Sections */}
        <div className="mt-16 space-y-8 text-gray-300">
          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">
              FMovies - Watch Free Movies Online | FMovies.to
            </h2>
            <p className="leading-relaxed">
              Cord-cutting is becoming a huge trend as people worldwide move
              away from costly cable TV and streaming subscriptions. FMovies
              provides an alternative by offering free movies and TV shows.
              However, the platform has faced numerous legal challenges due to
              copyright concerns.
            </p>
          </section>

          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">What is FMovies?</h2>
            <p className="leading-relaxed">
              FMovies is a file-sharing website that allows users to stream a
              vast selection of movies and TV shows for free. While many
              original domains have been blocked due to copyright enforcement,
              several mirror sites continue to operate, making it accessible
              worldwide.
            </p>
          </section>

          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">
              The History of FMovies
            </h2>
            <p className="leading-relaxed">
              Launched in 2016, FMovies quickly gained popularity but faced
              legal setbacks, including Google removing it from search results
              and lawsuits over piracy. Despite being labeled as a "notorious"
              piracy platform by U.S. authorities in 2018, FMovies continues to
              exist through alternative domains.
            </p>
          </section>

          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">
              How to Access FMovies from Anywhere?
            </h2>
            <p className="leading-relaxed">
              Due to regional restrictions, accessing FMovies can be
              challenging. A VPN can help bypass these restrictions by masking
              your IP and routing your connection through a different country
              where FMovies remains accessible. Additionally, VPNs enhance
              privacy and security.
            </p>
          </section>

          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">
              Pros of Using FMovies
            </h2>
            <p className="leading-relaxed">
              FMovies offers a vast selection of content, a user-friendly
              interface, and frequent updates with new movies and TV shows.
              While legal concerns remain, the platform is widely trusted by
              users, and precautions like VPN usage can improve safety.
            </p>
          </section>

          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">
              Can You Use FMovies on a Smart TV?
            </h2>
            <p className="leading-relaxed">
              Yes! While FMovies does not have an official app, you can access
              it through a web browser on your smart TV or streaming device like
              Firestick or Android TV.
            </p>
          </section>

          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">
              Should You Be Worried If You've Used FMovies?
            </h2>
            <p className="leading-relaxed">
              No, as copyright enforcement typically targets distribution rather
              than individual users. However, to ensure safety, it's recommended
              to use a VPN and regularly scan your device for malware.
            </p>
          </section>

          <section className="px-4">
            <h2 className="text-xl text-cyan-400 mb-4">Disclaimer</h2>
            <p className="leading-relaxed">
              FMovies does not host any content itself. It merely provides links
              to content available on the internet. Users should be aware of the
              legal implications of streaming copyrighted material in their
              respective regions.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1d24] border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2025 FMovies. All rights reserved.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <a href="#" className="text-gray-300 hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-300 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
