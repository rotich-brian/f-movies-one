const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// Image sizes based on TMDB's configuration
export const imageSizes = {
  poster: {
    small: "w185",
    medium: "w342",
    large: "w500",
    original: "original",
  },
  backdrop: {
    small: "w300",
    medium: "w780",
    large: "w1280",
    original: "original",
  },
  profile: {
    small: "w45",
    medium: "w185",
    original: "original",
  },
};

export function getImageUrl(
  path: string | null,
  size: string = "medium",
  type: "poster" | "backdrop" | "profile" = "poster"
): string {
  if (!path) return "/placeholder.png";

  // Type assertion to tell TypeScript this is valid
  const sizeValue =
    imageSizes[type][size as keyof (typeof imageSizes)[typeof type]];
  return `${IMAGE_BASE_URL}/${sizeValue}${path}`;
}

// Advanced rate limiter for TMDB API
// TMDB free tier allows 45 requests every 10 seconds
class RateLimiter {
  private queue: {
    resolve: Function;
    reject: Function;
    endpoint: string;
    params: Record<string, string>;
  }[] = [];
  private requestTimes: number[] = [];
  private processing = false;
  private readonly MAX_REQUESTS = 40; // Using 40 instead of 45 to be safe
  private readonly TIME_WINDOW = 10000; // 10 seconds in ms

  constructor() {
    // Clean up old request times periodically
    setInterval(() => {
      const now = Date.now();
      this.requestTimes = this.requestTimes.filter(
        (time) => now - time < this.TIME_WINDOW
      );
    }, 1000);
  }

  async enqueue(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this.queue.push({ resolve, reject, endpoint, params });
      if (!this.processing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.queue.length === 0) {
      this.processing = false;
      return;
    }

    this.processing = true;
    const now = Date.now();

    // Clean outdated request times
    this.requestTimes = this.requestTimes.filter(
      (time) => now - time < this.TIME_WINDOW
    );

    if (this.requestTimes.length >= this.MAX_REQUESTS) {
      // Need to wait - find the earliest request time
      const oldestTime = Math.min(...this.requestTimes);
      const timeToWait = this.TIME_WINDOW - (now - oldestTime) + 50; // Add 50ms buffer

      await new Promise((resolve) => setTimeout(resolve, timeToWait));
      return this.processQueue(); // Try again after waiting
    }

    // We can make a request now
    const { resolve, reject, endpoint, params } = this.queue.shift()!;
    this.requestTimes.push(Date.now());

    try {
      const result = await this.fetchFromTMDB(endpoint, params);
      resolve(result);
    } catch (error) {
      reject(error);
    }

    // Continue processing queue
    setTimeout(() => this.processQueue(), 50); // Small delay between requests
  }

  private async fetchFromTMDB(
    endpoint: string,
    params: Record<string, string> = {}
  ) {
    // Convert params object to query string
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";
    const url = `${TMDB_BASE_URL}${endpoint}${queryString}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_READ_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.status_message ||
          `Error ${response.status}: Failed to fetch from TMDB`
      );
    }

    return await response.json();
  }
}

// Create a singleton instance of the rate limiter
const rateLimiter = new RateLimiter();

// Export the rate limited fetch function
export async function rateLimitedFetch(
  endpoint: string,
  params: Record<string, string> = {}
) {
  return rateLimiter.enqueue(endpoint, params);
}
