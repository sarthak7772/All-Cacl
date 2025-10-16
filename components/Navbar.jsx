"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Calculator } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Handle scroll on page load if there's a hash in URL
  useEffect(() => {
    if (isHomePage && window.location.hash) {
      const hash = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 300);
    }
  }, [pathname, isHomePage]);
  
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close mobile menu first
    setMobileMenuOpen(false);
    
    if (isHomePage) {
      // If on homepage, scroll to section
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
    } else {
      // If on other page, navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
    }
  };

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
            <a 
              href="/#daily" 
              onClick={(e) => scrollToSection(e, 'daily')}
              className="hover:text-red-200 transition-colors text-sm lg:text-base cursor-pointer"
            >
              Daily
            </a>
            <a 
              href="/#financial" 
              onClick={(e) => scrollToSection(e, 'financial')}
              className="hover:text-red-200 transition-colors text-sm lg:text-base cursor-pointer"
            >
              Financial
            </a>
            <a 
              href="/#fitness" 
              onClick={(e) => scrollToSection(e, 'fitness')}
              className="hover:text-red-200 transition-colors text-sm lg:text-base cursor-pointer"
            >
              Fitness
            </a>
            <a 
              href="/#math" 
              onClick={(e) => scrollToSection(e, 'math')}
              className="hover:text-red-200 transition-colors text-sm lg:text-base cursor-pointer"
            >
              Math
            </a>
            <a 
              href="/#other" 
              onClick={(e) => scrollToSection(e, 'other')}
              className="hover:text-red-200 transition-colors text-sm lg:text-base cursor-pointer"
            >
              Other
            </a>
          </nav>

          {/* ===== Mobile Menu Button ===== */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* ===== Mobile Dropdown Menu ===== */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2">
            <a
              href="/#daily"
              onClick={(e) => scrollToSection(e, 'daily')}
              className="block py-2 hover:text-red-200 transition-colors cursor-pointer"
            >
              Daily Calculators
            </a>
            <a
              href="/#financial"
              onClick={(e) => scrollToSection(e, 'financial')}
              className="block py-2 hover:text-red-200 transition-colors cursor-pointer"
            >
              Financial
            </a>
            <a
              href="/#fitness"
              onClick={(e) => scrollToSection(e, 'fitness')}
              className="block py-2 hover:text-red-200 transition-colors cursor-pointer"
            >
              Fitness & Health
            </a>
            <a
              href="/#math"
              onClick={(e) => scrollToSection(e, 'math')}
              className="block py-2 hover:text-red-200 transition-colors cursor-pointer"
            >
              Math
            </a>
            <a
              href="/#other"
              onClick={(e) => scrollToSection(e, 'other')}
              className="block py-2 hover:text-red-200 transition-colors cursor-pointer"
            >
              Other
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}




