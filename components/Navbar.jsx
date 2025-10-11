import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Calculator } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header style={{ backgroundColor: "#1f456E" }} className="text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4">
        
        {/* ===== Logo + Menu Button ===== */}
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <Calculator className="h-6 w-6 md:h-8 md:w-8" />
            <h1 className="text-xl md:text-2xl font-bold"> AllCalculators</h1>
          </Link>

          {/* ===== Desktop Navigation ===== */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/#daily" className="hover:text-red-200 transition-colors text-sm lg:text-base">
              Daily
            </Link>
            <Link href="/#financial" className="hover:text-red-200 transition-colors text-sm lg:text-base">
              Financial
            </Link>
            <Link href="/#fitness" className="hover:text-red-200 transition-colors text-sm lg:text-base">
              Fitness
            </Link>
            <Link href="/#math" className="hover:text-red-200 transition-colors text-sm lg:text-base">
              Math
            </Link>
            <Link href="/#other" className="hover:text-red-200 transition-colors text-sm lg:text-base">
              Other
            </Link>
          </nav>

          {/* ===== Mobile Menu Button ===== */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* ===== Mobile Dropdown Menu ===== */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            <Link
              href="/daily"
              className="block py-2 hover:text-red-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Daily Calculators
            </Link>
            <Link
              href="/financial"
              className="block py-2 hover:text-red-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Financial
            </Link>
            <Link
              href="/fitness"
              className="block py-2 hover:text-red-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fitness & Health
            </Link>
            <Link
              href="/math"
              className="block py-2 hover:text-red-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Math
            </Link>
            <Link
              href="/other"
              className="block py-2 hover:text-red-200 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Other
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
