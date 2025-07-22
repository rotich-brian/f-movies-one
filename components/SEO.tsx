// components/SEO.tsx
import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile" | "video.movie" | "video.tv_show";
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  noindex?: boolean;
  structuredData?: Record<string, unknown> | null;
}

const SEO: React.FC<SEOProps> = ({
  title = "FMovies - Watch Free Movies Online Free Streaming in HD | f movies",
  description = "Watch free movies and TV shows online on Fmovies. Stream HD content across genres, featuring the latest releases, trending titles, and classic favorites — all free.",
  canonical = "https://fmoviesone.top",
  ogImage = "/img/fbimage.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  noindex = false,
  structuredData = null,
}) => {
  const siteUrl: string = "https://fmoviesone.top";
  const fullCanonical: string = canonical.startsWith("http")
    ? canonical
    : `${siteUrl}${canonical}`;
  const fullOgImage: string = ogImage.startsWith("http")
    ? ogImage
    : `${siteUrl}${ogImage}`;

  return (
    <Head>
      {/* Title */}
      <title>{title}</title>

      {/* Basic Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />

      {/* Robots */}
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large"
        }
      />

      {/* Canonical URL */}
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Meta Tags */}
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:site_name" content="FMovies" />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      <meta name="twitter:image:alt" content={title} />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
};

export default SEO;
