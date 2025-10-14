import React, { useState, useRef } from 'react';
import Link from "next/link";
 import Navbar from '../components/Navbar';
 import Footer from '../components/footer';
import { Calculator, Search, ChevronLeft, ChevronRight, Menu } from 'lucide-react';

const calculatorCategories = [
  {
    title: "Most Important Used Daily Calculators",
    id: "daily",
    calculators: [
      { name: "Scientific Calculator", icon: "🔬", href: "/Math/scientific-calculator" },
      { name: "Salary Calculator", icon: "💵", href: "/Financial/salary-calculator" },
      { name: "Loan Calculator", icon: "💰", href: "/Financial/loan-calculator" },
      { name: "Payment Calculator", icon: "💳", href: "/Financial/payment-calculator" },
      { name: "BMI Calculator", icon: "❤️", href: "/Fitness/bmi-calculator" },
      { name: "Calorie Calculator", icon: "🍎", href: "/Fitness/calorie-calculator" },
      { name: "Interest Calculator", icon: "💵", href: "/Financial/interest-calculator" },
      { name: "Body Fat Calculator", icon: "💪", href: "/Fitness/body-fat-calculator" },
      { name: "Date Calculator", icon: "📆", href: "/Other/date-calculator" },
      { name: "Age Calculator", icon: "⏰", href: "/Other/age-calculator" },
    ],
  },
  {
    title: "Financial Calculators",
    id: "financial",
    calculators: [
      { name: "Mortgage Calculator", icon: "🏠", href: "/Financial/mortgage-calculator" },
      { name: "Loan Calculator", icon: "💰", href: "/Financial/loan-calculator" },
      { name: "Auto Loan Calculator", icon: "🚗", href: "/Financial/auto-loan-calculator" },
      { name: "Interest Calculator", icon: "📊", href: "/Financial/interest-calculator" },
      { name: "Payment Calculator", icon: "💳", href: "/Financial/payment-calculator" },
      { name: "Retirement Calculator", icon: "👴", href: "/Financial/retirement-calculator" },
      { name: "Amortization Calculator", icon: "📈", href: "/Financial/amortization-calculator" },
      { name: "Investment Calculator", icon: "📉", href: "/Financial/investment-calculator" },
      { name: "Inflation Calculator", icon: "📆", href: "/Financial/inflation-calculator" },
      { name: "Finance Calculator", icon: "💼", href: "/Financial/finance-calculator" },
      { name: "Income Tax Calculator", icon: "🧾", href: "/Financial/income-tax-calculator" },
      { name: "Compound Interest Calculator", icon: "💲", href: "/Financial/compound-interest-calculator" },
      { name: "Salary Calculator", icon: "💵", href: "/Financial/salary-calculator" },
      { name: "Interest Rate Calculator", icon: "📉", href: "/Financial/interest-rate-calculator" },
      { name: "Sales Tax Calculator", icon: "🧾", href: "/Financial/sales-tax-calculator" },
    ],
  },
  {
    title: "Fitness & Health Calculators",
    id: "fitness",
    calculators: [
      { name: "BMI Calculator", icon: "❤️", href: "/Fitness/bmi-calculator" },
      { name: "Calorie Calculator", icon: "🍎", href: "/Fitness/calorie-calculator" },
      { name: "Body Fat Calculator", icon: "💪", href: "/Fitness/body-fat-calculator" },
      { name: "BMR Calculator", icon: "🏋️‍♂️", href: "/Fitness/bmr-calculator" },
      { name: "Ideal Weight Calculator", icon: "⚖️", href: "/Fitness/ideal-weight-calculator" },
      { name: "Pace Calculator", icon: "🏃", href: "/Fitness/pace-calculator" },
      { name: "Pregnancy Calculator", icon: "🤰", href: "/Fitness/pregnancy-calculator" },
      { name: "Pregnancy Conception Calculator", icon: "👶", href: "/Fitness/pregnancy-conception-calculator" },
      { name: "Due Date Calculator", icon: "🗓️", href: "/Fitness/due-date-calculator" },
    ],
  },
  {
    title: "Math Calculators",
    id: "math",
    calculators: [
      { name: "Scientific Calculator", icon: "🔬", href: "/Math/scientific-calculator" },
      { name: "Fraction Calculator", icon: "➗", href: "/Math/fraction-calculator" },
      { name: "Percentage Calculator", icon: "📐", href: "/Math/percentage-calculator" },
      { name: "Random Number Generator", icon: "🎲", href: "/Math/random-number-generator" },
      { name: "Triangle Calculator", icon: "🔺", href: "/Math/triangle-calculator" },
      { name: "Standard Deviation Calculator", icon: "📏", href: "/Math/standard-deviation-calculator" },
    ],
  },
  {
    title: "Other Calculators",
    id: "other",
    calculators: [
      { name: "Age Calculator", icon: "⏰", href: "/Other/age-calculator" },
      { name: "Date Calculator", icon: "📆", href: "/Other/date-calculator" },
      { name: "Time Calculator", icon: "⏱️", href: "/Other/time-calculator" },
      { name: "Hours Calculator", icon: "🕐", href: "/Other/hours-calculator" },
      { name: "GPA Calculator", icon: "🎓", href: "/Other/gpa-calculator" },
      { name: "Grade Calculator", icon: "✏️", href: "/Other/grade-calculator" },
      { name: "Concrete Calculator", icon: "🏗️", href: "/Other/concrete-calculator" },
      { name: "Subnet Calculator", icon: "🌐", href: "/Other/subnet-calculator" },
      { name: "Password Generator", icon: "🔒", href: "/Other/password-calculator" },
      { name: "Conversion Calculator", icon: "🔄", href: "/Other/conversion-calculator" },
    ],
  },
];

const CategoryCarousel = ({ category }) => {
  const scrollRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Auto-scroll functionality
  React.useEffect(() => {
    if (!isAutoScrolling || !scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    const scrollInterval = setInterval(() => {
      const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      const currentScroll = scrollContainer.scrollLeft;

      if (currentScroll >= maxScroll) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling]);

  const handleManualScroll = (direction) => {
    setIsAutoScrolling(false);
    scroll(direction);
    setTimeout(() => setIsAutoScrolling(true), 10000);
  };

  return (
    <div className="mb-12">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 pb-2 inline-block" style={{borderBottom: '2px solid #800000'}}>
        {category.title}
      </h3>
      
      <div className="relative group">
        <button
          onClick={() => handleManualScroll('left')}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          style={{color: '#800000'}}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-3 md:gap-4 pb-4 scrollbar-hide scroll-smooth"
          style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          {category.calculators.map((calc, idx) => (
            <Link key={idx} href={calc.href}>
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer text-center flex-shrink-0" 
                   style={{width: '180px', height: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px'}}>
                <div className="flex flex-col items-center flex-grow justify-center">
                  <div className="flex justify-center mb-2">
                    <span className="text-4xl">{calc.icon}</span>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm leading-tight">{calc.name}</h4>
                </div>
                <button style={{color: '#800000'}} className="text-xs font-medium hover:opacity-70 mt-2">
                  Explore Tool →
                </button>
              </div>
            </Link>
          ))}
        </div>

        <button
          onClick={() => handleManualScroll('right')}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          style={{color: '#800000'}}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

const CalculatorHomepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCalculators, setFilteredCalculators] = useState([]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredCalculators([]);
      return;
    }

    const results = [];
    calculatorCategories.forEach(category => {
      category.calculators.forEach(calc => {
        if (calc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push(calc);
        }
      });
    });
    setFilteredCalculators(results);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full lg:w-1/2">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">All-in-One Free Online Calculators</h2>
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">Finance, Health, Math, and Daily Life Tools - Simplify Every Calculation</p>
              
              <div className="relative">
                <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                <input
                  type="text"
                  placeholder="Start Calculating Now"
                  className="w-full pl-10 md:pl-12 pr-20 md:pr-32 py-3 md:py-4 rounded-lg bg-white text-gray-800 text-base md:text-lg focus:outline-none focus:ring-2"
                  style={{focusRingColor: '#800000'}}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  onClick={handleSearch}
                  style={{backgroundColor: '#800000'}}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-red-900 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-md transition-colors text-sm md:text-base"
                >
                  Search
                </button>
              </div>

              {/* Search Results */}
              {filteredCalculators.length > 0 && (
                <div className="mt-4 bg-white rounded-lg p-4 text-gray-800 max-h-60 overflow-y-auto">
                  <h3 className="font-bold mb-2">Search Results:</h3>
                  {filteredCalculators.map((calc, idx) => (
                    <Link key={idx} href={calc.href}>
                      <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                        {calc.icon} {calc.name}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3 max-w-md lg:max-w-none">
                <Link href="/Financial/loan-calculator">
                  <div style={{backgroundColor: '#800000'}} className="p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">💰</span>
                  </div>
                </Link>
                <Link href="/Financial/investment-calculator">
                  <div className="bg-red-700 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">📈</span>
                  </div>
                </Link>
                <Link href="/Other/time-calculator">
                  <div className="bg-blue-500 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">⏱️</span>
                  </div>
                </Link>
                <Link href="/Fitness/bmi-calculator">
                  <div className="bg-blue-600 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">❤️</span>
                  </div>
                </Link>
                <Link href="/Fitness/body-fat-calculator">
                  <div className="bg-green-500 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">💪</span>
                  </div>
                </Link>
                <Link href="/Math/fraction-calculator">
                  <div className="bg-green-600 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">🔢</span>
                  </div>
                </Link>
                <Link href="/Financial/interest-calculator">
                  <div className="bg-purple-500 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">💵</span>
                  </div>
                </Link>
                <Link href="/Financial/income-tax-calculator">
                  <div className="bg-purple-600 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">📄</span>
                  </div>
                </Link>
                <Link href="/Other/date-calculator">
                  <div style={{backgroundColor: '#800000'}} className="p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">📅</span>
                  </div>
                </Link>
                <Link href="/Financial/mortgage-calculator">
                  <div className="bg-indigo-500 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">🏠</span>
                  </div>
                </Link>
                <Link href="/Financial/inflation-calculator">
                  <div className="bg-pink-500 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">📊</span>
                  </div>
                </Link>
                <Link href="/Fitness/calorie-calculator">
                  <div className="bg-red-500 p-2 md:p-4 rounded-lg transform hover:scale-110 transition-transform cursor-pointer">
                    <span className="text-2xl md:text-3xl">🍎</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Categories with Carousel */}
      <section className="container mx-auto px-4 py-8 md:py-16">
        {calculatorCategories.map((category, idx) => (
          <div key={idx} id={category.id}>
            <CategoryCarousel category={category} />
          </div>
        ))}
      </section>

      {/* Footer Component */}
      <Footer />
        
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default CalculatorHomepage;
