import type { NextApiRequest, NextApiResponse } from "next";
import { rateLimitedFetch } from "../../utils/tmdb-api";

type TMDBMovie = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  media_type: "movie" | "tv";
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req.query;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // Get the first page to determine total number of pages
    const firstPageData = await rateLimitedFetch("/search/multi", {
      query: encodeURIComponent(query),
      include_adult: "false",
      language: "en-US",
      page: "1",
    });

    let results = [...firstPageData.results];
    const totalPages = Math.min(firstPageData.total_pages, 5); // Limit to 5 pages to be safe with API limits

    // Fetch all remaining pages in parallel with rate limiting
    if (totalPages > 1) {
      const pagePromises = [];

      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(
          rateLimitedFetch("/search/multi", {
            query: encodeURIComponent(query),
            include_adult: "false",
            language: "en-US",
            page: page.toString(),
          })
        );
      }

      // Wait for all pages to be fetched
      const additionalPagesData = await Promise.all(pagePromises);

      // Combine all results
      additionalPagesData.forEach((pageData) => {
        results = [...results, ...pageData.results];
      });
    }

    // Filter out people and other non-relevant results
    const filteredResults = results.filter(
      (item: TMDBMovie) =>
        item.media_type === "movie" || item.media_type === "tv"
    );

    // Transform TMDB results to match your app's format
    const formattedResults = filteredResults.map((item: TMDBMovie) => {
      const isMovie = item.media_type === "movie";
      return {
        tmdb_id: item.id.toString(),
        title: isMovie ? item.title : item.name,
        year: getYear(isMovie ? item.release_date : item.first_air_date),
        quality: item.vote_average > 7 ? "HD" : "SD", // You might want a different logic here
        image_src: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : undefined,
        imdb_rating: item.vote_average.toFixed(1),
        imdb_votes: formatVoteCount(item.vote_count),
        media_type: item.media_type, // Add media type to differentiate movies from TV shows
      };
    });

    res.status(200).json({
      results: formattedResults,
      total_results: filteredResults.length,
      total_pages: totalPages,
    });
  } catch (error) {
    console.error("TMDB search error:", error);
    res.status(500).json({ error: "Failed to search movies and TV shows" });
  }
}

// Helper functions
function getYear(dateString?: string): string {
  if (!dateString) return "Unknown";
  return dateString.split("-")[0] || "Unknown";
}

function formatVoteCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}
