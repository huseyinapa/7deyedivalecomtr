import { Open_Sans } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "../lib/analytics/analytics";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SWRProvider from "@/components/providers/swr-provider";
import AdminWrapper from "@/components/layout/admin-wrapper";

const inter = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://www.7deyedivale.com.tr"),
  title: "7 de Yedi Vale Taşımacılık | 7 de Yedi | 7 de Yedi Vale",
  description:
    "7 de Yedi Vale Taşımacılık: Güvenli dağıtımın adresi. 7 de Yedi Vale hizmetlerimiz hakkında bilgi alın.",
  openGraph: {
    title: "7 de Yedi Vale Taşımacılık",
    description:
      "7 de Yedi Vale Taşımacılık: Güvenli dağıtımın adresi. 7 de Yedi Vale hizmetlerimiz hakkında bilgi alın.",
    images: [
      {
        url: "/assets/carousel/vale2.png",
        width: 800,
        height: 600,
        alt: "7de Yedi Vale Taşımacılık Isparta",
      },
    ],
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  // For SSR, fallback to empty string, for CSR use window.location.pathname
  // But Next.js recommends using usePathname for client components

  // If you want to use usePathname, you need to make this a Client Component:
  // Add 'use client' at the top of the file

  // --- CLIENT COMPONENT VERSION ---
  // 'use client';
  // const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <html lang="tr">
      <head>
        <GoogleAnalytics />
        {/* Performance optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* Preload critical assets */}
        <link rel="preload" href="/assets/yedi_siyah.png" as="image" type="image/png" />
        <link rel="preload" href="/assets/carousel/vale1.png" as="image" type="image/png" />
        <link rel="preload" href="/assets/tesla.png" as="image" type="image/png" />
        {/* OpenGraph meta tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        {metadata.openGraph.images.map((image, index) => (
          <meta property="og:image" content={image.url} key={index} />
        ))}
      </head>
      <body className={inter.className}>
        <SWRProvider>
          <AdminWrapper>
            {children}
          </AdminWrapper>
          <GoogleAnalytics />
        </SWRProvider>
      </body>
    </html>
  );
}
