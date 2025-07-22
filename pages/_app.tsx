import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>
          FMovies - Watch Free Movies Online Free Streaming in HD | f movies
        </title>
      </Head>

      <GoogleAnalytics />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
