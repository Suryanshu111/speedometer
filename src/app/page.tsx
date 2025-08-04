export const metadata = {
  title: "Live Speedometer – Real-time Speed Tracking",
  description: "Use Live Speedometer to track your real-time speed directly from your browser using GPS. No app install needed.",
  keywords: ["live speedometer", "GPS speed tracker", "online speedometer", "real-time speed tracking"],
  authors: [{ name: "Suryanshu Pathak" }],
  openGraph: {
    title: "Live Speedometer",
    description: "Track your real-time speed directly from your browser using GPS.",
    url: "https://livespeedometer.netlify.app",
    siteName: "Live Speedometer",
    locale: "en_US",
    type: "website",
  },
};

import { Speedometer } from '@/components/speedometer';

export default function Home() {
  return (
    <main>
      <Speedometer />
    </main>
  );
}
