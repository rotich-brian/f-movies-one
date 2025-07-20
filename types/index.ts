// types/index.ts - Common type definitions for the FMovies project

export interface NavigationLink {
  href: string;
  label: string;
}

export interface FooterLink {
  href: string;
  label: string;
}

export interface InformationSectionData {
  title: string;
  content: string;
}

export interface SearchFormData {
  query: string;
}

export interface HomePageProps {
  backgroundImage?: string;
  siteName?: string;
  tagline?: string;
}

export interface HeaderProps {
  className?: string;
  navigationLinks?: NavigationLink[];
}

export interface FooterProps {
  className?: string;
  copyrightText?: string;
  links?: FooterLink[];
}

export interface InformationSectionProps {
  className?: string;
  sections?: InformationSectionData[];
}

// Event handler types
export type SearchSubmitHandler = (
  e: React.FormEvent<HTMLFormElement>
) => Promise<void>;
export type InputChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement>
) => void;
export type KeyPressHandler = (
  e: React.KeyboardEvent<HTMLInputElement>
) => void;
export type ClickHandler = (e: React.MouseEvent<HTMLElement>) => void;

// Router types
export interface SearchParams {
  q: string;
}

// Component state types
export interface SearchState {
  query: string;
  isSearching: boolean;
  results?: any[];
  error?: string;
}

export interface NavigationState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
}

// API response types (for future use)
export interface Movie {
  id: string;
  title: string;
  year: number;
  poster?: string;
  rating?: number;
  genre?: string[];
}

export interface TVShow {
  id: string;
  title: string;
  year: number;
  poster?: string;
  rating?: number;
  genre?: string[];
  seasons?: number;
}

export interface SearchResponse {
  movies: Movie[];
  tvShows: TVShow[];
  total: number;
  page: number;
  totalPages: number;
}

// Theme types
export interface Theme {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

// Configuration types
export interface SiteConfig {
  siteName: string;
  siteDescription: string;
  defaultBackgroundImage: string;
  tagline: string;
  navigationLinks: NavigationLink[];
  footerLinks: FooterLink[];
  theme: Theme;
}
