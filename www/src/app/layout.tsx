import { Inter, Open_Sans } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "../lib/analytics/analytics";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import SWRProvider from "@/components/providers/swr-provider";

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
  return (
    <html lang="tr">
      <head>
        <GoogleAnalytics />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        {metadata.openGraph.images.map((image, index) => (
          <meta property="og:image" content={image.url} key={index} />
        ))}
      </head>
      <body className={inter.className}>
        <SWRProvider>
          <Header />
          {children}
          <Footer />
          <GoogleAnalytics />
        </SWRProvider>
      </body>
    </html>
  );
}
