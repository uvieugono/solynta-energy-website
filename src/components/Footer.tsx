import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-solynta-slate text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <h2 className="text-xl font-bold text-solynta-yellow mb-3">
              Solynta Energy
            </h2>
            <p className="text-gray-300">Powering Nigeria with the sun</p>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:+2347053008625"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  +234(0)705 300 8625
                </a>
              </li>
              <li>
                <a
                  href="tel:+2348137458756"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  +234(0)813 745 8756
                </a>
              </li>
              <li>
                <a
                  href="mailto:solar@solyntaenergy.com"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  solar@solyntaenergy.com
                </a>
              </li>
              <li className="text-gray-300 leading-relaxed">
                1B Etim Iyang Close, Off Etim Iyang Crescent, Victoria Island,
                Lagos
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-solynta-yellow transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-600 text-center text-sm text-gray-400">
          &copy; 2026 Solynta Energy Limited. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
