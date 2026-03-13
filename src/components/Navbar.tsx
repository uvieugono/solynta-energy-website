"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Calculator", href: "/calculator" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("#")) return false;
    return pathname.startsWith(href);
  };

  const activeLinkClass =
    "border-b-2 border-solynta-yellow text-solynta-slate font-semibold";
  const inactiveLinkClass =
    "text-solynta-grey hover:text-solynta-slate transition-colors duration-150";

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/logo.png"
              alt="Solynta Energy"
              width={150}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm py-1 ${
                  isActive(link.href) ? activeLinkClass : inactiveLinkClass
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop phone number */}
          <div className="hidden md:flex items-center">
            <a
              href="tel:+2347053008625"
              className="text-sm text-solynta-grey hover:text-solynta-slate transition-colors duration-150"
            >
              +234(0)705 300 8625
            </a>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center p-2 rounded text-solynta-grey hover:text-solynta-slate focus:outline-none"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {menuOpen ? (
                // X icon
                <>
                  <line
                    x1="4"
                    y1="4"
                    x2="20"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="20"
                    y1="4"
                    x2="4"
                    y2="20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                // Hamburger icon
                <>
                  <line
                    x1="4"
                    y1="6"
                    x2="20"
                    y2="6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4"
                    y1="12"
                    x2="20"
                    y2="12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="4"
                    y1="18"
                    x2="20"
                    y2="18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border pb-4">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`px-2 py-2 text-sm rounded ${
                    isActive(link.href)
                      ? "text-solynta-slate font-semibold bg-solynta-yellow/10 border-l-4 border-solynta-yellow"
                      : inactiveLinkClass
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+2347053008625"
                onClick={() => setMenuOpen(false)}
                className="px-2 py-2 text-sm text-solynta-grey hover:text-solynta-slate transition-colors duration-150"
              >
                +234(0)705 300 8625
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
