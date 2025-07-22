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

          {/* Global Styles */}
          <style jsx global>{`
            /* CSS Reset and Base Styles */
            * {
              box-sizing: border-box;
            }

            html {
              scroll-behavior: smooth;
            }

            body {
              margin: 0;
              padding: 0;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
                "Helvetica Neue", Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #0f0f23;
              background-image: linear-gradient(
                  rgba(8, 15, 40, 0.8),
                  rgba(8, 15, 40, 0.9)
                ),
                url("/images/hero-bg.jpg");
              background-repeat: no-repeat;
              background-position: center center;
              background-attachment: fixed;
              background-size: cover;
              min-height: 100vh;
            }

            /* Responsive utilities */
            .container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 1rem;
            }

            .home-main {
              padding-top: 100px;
            }

            /* Mobile optimizations */
            @media (max-width: 992px) {
              #home-logo {
                display: none;
              }

              .home-main {
                padding-top: 60px;
              }
            }

            @media (max-width: 768px) {
              body {
                background-attachment: scroll;
              }
            }

            /* Loading states */
            .loading {
              opacity: 0.7;
              pointer-events: none;
            }

            /* Focus states for accessibility */
            :focus {
              outline: 2px solid #007aff;
              outline-offset: 2px;
            }

            /* Skip to content link for accessibility */
            .skip-link {
              position: absolute;
              top: -40px;
              left: 6px;
              background: #007aff;
              color: white;
              padding: 8px;
              text-decoration: none;
              transition: top 0.3s;
              z-index: 100;
            }

            .skip-link:focus {
              top: 6px;
            }
          `}</style>

          {/* Google Analytics */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-ZQ93LQEC62"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-ZQ93LQEC62', {
                  page_title: document.title,
                  page_location: window.location.href,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false
                });
              `,
            }}
          />

          {/* Shebudriftaiter Script */}
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(s,u,z,p){
                  s.src=u;
                  s.setAttribute('data-zone',z);
                  s.async=true;
                  p.appendChild(s);
                })(document.createElement('script'),'https://shebudriftaiter.net/tag.min.js',8979704,document.body||document.documentElement)
              `,
            }}
          /> */}
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
