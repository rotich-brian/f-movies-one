import React, { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

interface NavigationLink {
  href: string;
  label: string;
}

const Header: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);

  const navigationLinks: NavigationLink[] = [
    { href: "/home", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv-shows", label: "TV Series" },
    { href: "/Genre", label: "Genre" },
  ];

  const mobileNavigationLinks: NavigationLink[] = [
    { href: "/home", label: "Home" },
    { href: "/movies", label: "Movies" },
    { href: "/tv-shows", label: "TV Series" },
    { href: "/Genre", label: "Genre" },
    { href: "/Genre", label: "Trending" },
    { href: "/Genre", label: "Latest Movies" },
    { href: "/Genre", label: "Top IMDB" },
  ];

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const handleSearch = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  const handleLogoClick = (): void => {
    router.push("/");
  };

  const handleImageError = (): void => {
    setImageError(true);
  };

  return (
    <>
      {/* Accessibility skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav className="sm:py-4 bg-opacity-90 backdrop-blur-lg border-b border-gray-800/50 fixed w-full top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={handleLogoClick}
            >
              {!imageError ? (
                <Image
                  src="/logo.png"
                  alt="FMovies"
                  width={120}
                  height={48}
                  className="h-8 sm:h-10 lg:h-12 w-auto hover:scale-105 transition-transform duration-300 drop-shadow-lg"
                  style={{ aspectRatio: "120/48" }}
                  onError={handleImageError}
                  priority
                />
              ) : (
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-lg font-bold text-lg cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg">
                  FMovies
                </div>
              )}
            </div>

            {/* Desktop Layout: Navigation + Search */}
            <div className="hidden lg:flex items-center flex-1 justify-end space-x-8">
              {/* Navigation Links */}
              <div className="flex items-center space-x-6 xl:space-x-8">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white hover:bg-opacity-10 font-medium text-sm xl:text-base relative group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ))}
              </div>

              {/* Compact Search Bar */}
              <div className="flex-shrink-0">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-48 xl:w-56 bg-white bg-opacity-90 backdrop-blur-sm pl-4 pr-10 py-2.5 rounded-full text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all duration-300 shadow-lg hover:shadow-xl placeholder-gray-500"
                      value={searchQuery}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-500 transition-colors duration-300"
                      aria-label="Search"
                    >
                      <Search className="h-6 w-6" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Tablet Navigation (md breakpoint) */}
            <div className="hidden md:flex lg:hidden items-center space-x-4 flex-1 justify-end">
              {navigationLinks.slice(0, 4).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white px-2 py-2 transition-colors text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Controls */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                className="p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white hover:bg-opacity-10"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="bg-opacity-60 backdrop-blur-sm rounded-xl mx-2 shadow-xl border border-gray-700/50">
                <div className="flex flex-col space-y-1 p-3">
                  {mobileNavigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-gray-300 hover:text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-cyan-400/20 hover:to-blue-500/20 transition-all duration-300 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Header;
