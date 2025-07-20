declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SITE_URL: string;
      NODE_ENV: "development" | "production" | "test";
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_TMDB_API_KEY?: string;
      NEXT_PUBLIC_MOVIE_API_BASE?: string;
      // Add other environment variables used in your movie app
    }
  }
}

// Types for your video player and movie data
declare module "*.js" {
  const content: any;
  export default content;
}

// HLS.js types if not properly imported
declare module "hls.js" {
  export default class Hls {
    static isSupported(): boolean;
    loadSource(src: string): void;
    attachMedia(video: HTMLVideoElement): void;
    destroy(): void;
    on(event: string, callback: Function): void;
    // Add other HLS methods you use
  }
}

// Video.js types enhancement
declare module "video.js" {
  interface VideoJsPlayer {
    hls?: any;
    // Add custom properties if needed
  }
}

export {};
