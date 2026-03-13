import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "Solynta Energy | Powering Nigeria with the Sun",
  description:
    "Nigeria's #1 urban residential solar company. Clean, affordable solar subscription packages from 1KW to 5KW. Displace your generator — go solar today.",
  openGraph: {
    title: "Solynta Energy | Powering Nigeria with the Sun",
    description:
      "Clean, affordable solar subscription packages for Nigerian homes. Join 1,000+ happy customers.",
    siteName: "Solynta Energy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Navbar />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
