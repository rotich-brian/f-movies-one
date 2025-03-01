import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="description"
            content="Fmovies is the best site to watch free movies online without downloading. Stream free movies here."
          />
          <meta
            property="og:title"
            content="Fmovies - Watch Free Movies Online"
          />
          <meta
            property="og:description"
            content="Fmovies is the best site to watch free movies online without downloading. Stream free movies here."
          />
          <meta
            name="keywords"
            content="fmovies,watch movies,watchfree,hd movies online for free,high quality free online movies,online movie website,free online movies,english movies online."
          />
          <meta name="robots" content="index,follow" />
          <meta name="googlebot" content="index,follow" />
          <base href="https://fmoviesone.top/" />
          <link rel="canonical" href="https://fmoviesone.top/" />
          <meta property="og:url" content="https://fmoviesone.top/" />
          <meta
            property="og:image"
            content="https://fmoviesone.top/img/fbimage.png"
          />
          <meta property="og:image:width" content="1280" />
          <meta property="og:image:height" content="720" />
          <meta property="og:site_name" content="Fmovies" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:image:alt" content="Watch Movies Online" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta
            name="msapplication-config"
            content="https://fmoviesone.top/icon/browserconfig.xml"
          />
          <meta name="theme-color" content="#ffffff" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="https://fmoviesone.top/icon/apple-touch-con.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="https://fmoviesone.top/icon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="https://fmoviesone.top/icon/favicon-16x16.png"
          />
          <link rel="manifest" href="https://fmoviesone.top/manifest.json" />
          <link
            rel="mask-icon"
            href="https://fmoviesone.top/icon/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="https://fmoviesone.top/favicon.ico" />
          <link rel="dns-prefetch" href="//img.cdno.my.id" />
          <link rel="dns-prefetch" href="//mcloud.vvid30c.site" />
          <link rel="preconnect" href="https://img.cdno.my.id" crossOrigin="" />
          <link
            rel="preconnect"
            href="https://mcloud.vvid30c.site"
            crossOrigin=""
          />
          <link
            rel="sitemap"
            type="application/xml"
            title="Sitemap"
            href="https://fmoviesone.top/sitemap.xml"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
