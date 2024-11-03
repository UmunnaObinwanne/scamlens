import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
          {/* About Section */}
          <div className="col-span-2 space-y-6">
            <h3 className="text-xl font-semibold">About ScamLens</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                ScamLens is your trusted partner in online safety. Our team of dedicated experts 
                specializes in identifying and preventing various types of online scams. With years 
                of experience in cybersecurity and fraud prevention, we're committed to protecting 
                individuals from digital threats and financial loss.
              </p>
              <p className="text-gray-600">
                Our mission is simple: to create a safer online environment by providing professional 
                verification services and educating people about potential scams.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/how-it-works" 
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  Scam Awareness Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-gray-600 hover:text-primary transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <div className="space-y-4 text-gray-600">
              <p>Email: support@scamlens.com</p>
              <div>
                <p>Hours: Monday - Friday</p>
                <p>9:00 AM - 5:00 PM EST</p>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="pt-4">
              <div className="flex items-center space-x-6">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label="Facebook"
                >
                  <Facebook size={22} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label="Twitter"
                >
                  <Twitter size={22} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram size={22} />
                </a>
                <a 
                  href="mailto:support@scamlens.com" 
                  className="text-gray-400 hover:text-primary transition-colors duration-200"
                  aria-label="Email"
                >
                  <Mail size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {currentYear} ScamLens. All rights reserved.
            </p>
            <div className="flex items-center space-x-8">
              <Link 
                href="/privacy" 
                className="text-sm text-gray-500 hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="text-sm text-gray-500 hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className="text-sm text-gray-500 hover:text-primary transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}