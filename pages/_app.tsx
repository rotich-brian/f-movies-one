import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css"; // Adjust path as needed

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Fmovies - Watch Free Movies Online</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
