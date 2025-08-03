"use client";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Carousel from "@/components/carousel";
import Fleet from "@/components/fleet";
import Stat from "@/components/stat";
import CallCourier from "@/components/callCourier";
import Head from "next/head";

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <title>
          7de Yedi Vale | 7de Yedi Vale Taşımacılık | 7de Yedi Isparta
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="7de Yedi Vale Taşımacılık: Güvenli dağıtımın adresi. 7de Yedi Vale hizmetlerimiz hakkında bilgi alın."
        />

        <meta property="og:title" content="7de Yedi Vale Taşımacılık" />
        <meta
          property="og:description"
          content="7de Yedi Vale Taşımacılık: Güvenli dağıtımın adresi. 7de Yedi Vale hizmetlerimiz hakkında bilgi alın."
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://www.7deyedivale.com.tr/" />
        <meta
          property="og:image"
          content="https://www.7deyedivale.com.tr/assets/carousel/vale2.png"
        />

        <link rel="stylesheet" href="styles.css" />
        <meta
          name="keywords"
          content="kurye hizmeti, hızlı gönderi, aynı gün teslimat, gün içi teslimat, hızlı teslimat, kurye firması, ısparta kurye, isparta kurye, ısparta"
        />
      </Head>
      <main
        className="min-w-fit min-h-screen items-center justify-center bg-white"
      >
        <Carousel />
        <CallCourier />
        <Fleet />
        <Stat />
      </main>
    </>
  );
}
