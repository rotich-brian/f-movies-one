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
          {/* Basic Meta Tags - Keep these as they're technical requirements */}
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          {/* Base URL */}
          <base href="/" />

          {/* Theme and App Configuration */}
          <meta name="theme-color" content="#ffffff" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="msapplication-config" content="/icon/browserconfig.xml" />
          <meta
            name="msapplication-TileImage"
            content="https://fmoviesone.top/icon/apple-touch-icon.png"
          />

          {/* Icons and Manifest */}
          <link rel="shortcut icon" href="/favicon.ico" />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/icon/favicon-16x16.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/icon/android-chrome-192x192.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icon/apple-touch-icon.png"
          />
          <link
            rel="mask-icon"
            href="/icon/safari-pinned-tab.svg"
            color="#011e25ff"
          />
          <link rel="manifest" href="/manifest.json" />

          {/* DNS Prefetch and Preconnect for Performance */}
          <link rel="dns-prefetch" href="//img.cdno.my.id" />
          <link rel="dns-prefetch" href="//mcloud.vvid30c.site" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//shebudriftaiter.net" />
          <link rel="preconnect" href="https://img.cdno.my.id" crossOrigin="" />
          <link
            rel="preconnect"
            href="https://mcloud.vvid30c.site"
            crossOrigin=""
          />

          {/* Sitemap */}
          <link
            rel="sitemap"
            type="application/xml"
            title="Sitemap"
            href="/sitemap.xml"
          />

          {/* RSS Feed */}
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Fmovies » Feed"
            href="/feed.xml"
          />
        </Head>
        <body>
          {/* Accessibility skip link */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>

          <Main />
          <NextScript />

          {/* Global Structured Data for Website - Keep this as it's site-wide */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Fmovies",
                url: "https://fmoviesone.top",
                description:
                  "Watch free movies and TV shows online in HD quality",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate:
                      "https://fmoviesone.top/search?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
                publisher: {
                  "@type": "Organization",
                  name: "Fmovies",
                  url: "https://fmoviesone.top",
                },
              }),
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
