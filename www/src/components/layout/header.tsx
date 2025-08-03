"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../themeToggle";

export default function Header() {
  // <p>&copy; 2024 - Tüm hakkı saklıdır.</p>
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0 ? true : false);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = (name: string, href: string) => (
    <a
      href={href}
      className="px-4 py-3 w-[180px] border-4 border-black rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-colors text-center"
    >
      {name}
    </a>

  )

  return (
    <header
      className={`${isScrolled && "sticky top-0 shadow-xl"} z-40 bg-[#EDC81E]`}
    >
      <div className="flex flex-row justify-center md:justify-between p-4 max-w-7xl mx-auto">
        <div className="flex md:hidden" />
        <a href="/">
          <Image
            src="/assets/yedi_siyah.png"
            className="w-[400px] sm:w-[400px] md:w-[270px] lg:w-[270px] h-[100px] md:h-[70px] object-cover hover:cursor-pointer"
            alt="7de Yedi Vale Logo"
            width={400}
            height={100}
          />
        </a>

        <div className="hidden min-[950px]:flex flex-row gap-2 items-center">
          {navItems("Hizmetlerimiz", "/hizmetlerimiz")}
          {navItems("Kurye Hizmeti Al", "/kurye-hizmeti-al")}
          {navItems("Kurye Ol", "/kurye-basvuru")}
        </div>

        <div className="hidden md:flex items-center">
          <a
            href="/kurye-cagir"
            className="px-6 py-3 w-[180px] border-4 border-black bg-[#333] text-white rounded-full font-semibold hover:bg-gray-800 transition-colors text-center"
          >
            Hemen Kurye Çağır!
          </a>
          {/* <ThemeToggle /> */}
        </div>

        <div className="flex md:hidden items-center">
          <div className="relative">
            <div
              tabIndex={0}
              role="button"
              className="px-4 py-2 bg-white border-4 border-black rounded-full lg:hidden cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul className="absolute right-0 top-12 z-50 p-2 gap-2 shadow-lg bg-white rounded-lg w-52 border border-gray-200 hidden group-hover:block">
              <li>
                <button
                  className="w-full px-4 py-2 text-sm border-2 border-black bg-[#333] text-white rounded-full hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    router.push("/kurye-cagir");
                  }}
                >
                  Kurye Çağır!
                </button>
              </li>
              <li>
                <button
                  className="w-full px-4 py-2 text-sm border-2 border-black text-[#333] bg-white rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    router.push("/hizmetlerimiz");
                  }}
                >
                  Hizmetlerimiz
                </button>
              </li>
              <li>
                <button
                  className="w-full px-4 py-2 text-sm border-2 border-black text-[#333] bg-white rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    router.push("/kurye-hizmeti-al");
                  }}
                >
                  Kurye Hizmeti Al
                </button>
              </li>
              <li>
                <button
                  className="w-full px-4 py-2 text-sm border-2 border-black text-[#333] bg-white rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    router.push("/kurye-basvuru");
                  }}
                >
                  Kurye Ol
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <img src="/assets/line1.svg" />
        <img className="-translate-x-5" src="/assets/line1.svg" />
      </div>
    </header>
  );
}
