"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";
import Header from "./header";

interface AdminWrapperProps {
  children: React.ReactNode;
}

export default function AdminWrapper({ children }: AdminWrapperProps) {
  const pathname = usePathname();
  // const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const isAdminPage = pathname.startsWith("/admin");

  return <>{isAdminPage ? children : <>
    <Header />
    {children}
    <Footer />
  </>}</>;
}
