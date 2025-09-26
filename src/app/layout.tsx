import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SpeedometerProvider } from '@/hooks/use-speedometer';
import Script from 'next/script';
import Head from 'next/head';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* Basic Meta */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Speedometer Online - Live Speed Tracker</title>
        <meta
          name="description"
          content="Use Speedometer Online to track your accurate and real-time speed directly from your browser using GPS. No app install needed."
        />
        <meta
          name="keywords"
          content="Speedometer Online, Online Speedometer, track my speed, what is my speed, speedometer, train speedometer"
        />
        <meta name="author" content="Team Stallgrip" />

        {/* Open Graph */}
        <meta property="og:title" content="Speedometer Online - Live Speed Tracker" />
        <meta property="og:description" content="Use Speedometer Online to track your accurate and real-time speed directly from your browser using GPS." />
        <meta property="og:url" content="https://speedometeronline.live/" />
        <meta property="og:site_name" content="Speedometer Online" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Speedometer Online - Live Speed Tracker" />
        <meta name="twitter:description" content="Use Speedometer Online to track your accurate and real-time speed directly from your browser using GPS." />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" href="/logo.png" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
      </Head>

      <body className="font-body antialiased bg-background" suppressHydrationWarning>
        <SpeedometerProvider>{children}</SpeedometerProvider>
        <Toaster />

        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-TJ3XS18903"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-TJ3XS18903');
          `}
        </Script>

        {/* JSON-LD Schema for Speedometer Online */}
        <Script id="speedometer-schema" type="application/ld+json" strategy="afterInteractive">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Speedometer Online - Live Speed Tracker",
              "url": "https://speedometeronline.live/",
              "description": "Use Speedometer Online to track your accurate and real-time speed directly from your browser using GPS. No app install needed.",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "browserRequirements": "Requires JavaScript and GPS access",
              "keywords": ["Speedometer Online", "Online Speedometer", "track my speed", "what is my speed", "speedometer", "train speedometer"],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1500"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Team Stallgrip",
                "url": "https://speedometeronline.live/"
              }
            }
          `}
        </Script>
      </body>
    </html>
  );
}
