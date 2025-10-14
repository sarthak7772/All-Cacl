import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer
      style={{ backgroundColor: "#1a2433" }}
      className="text-white py-8 md:py-12 mt-8 md:mt-12 relative z-[9999]"
    >
      <div className="container mx-auto px-4">
        {/* All Calculator Tools by Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8 md:mb-12">
          
          {/* Financial Calculators */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 pb-2 border-b border-gray-600">
              Financial Calculators
            </h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li><Link href="/Financial/mortgage-calculator">🏠 Mortgage Calculator</Link></li>
              <li><Link href="/Financial/loan-calculator">💰 Loan Calculator</Link></li>
              <li><Link href="/Financial/auto-loan-calculator">🚗 Auto Loan Calculator</Link></li>
              <li><Link href="/Financial/interest-calculator">💲 Interest Calculator</Link></li>
              <li><Link href="/Financial/payment-calculator">💵 Payment Calculator</Link></li>
              <li><Link href="/Financial/retirement-calculator">👴 Retirement Calculator</Link></li>
              <li><Link href="/Financial/amortization-calculator">📊 Amortization Calculator</Link></li>
              <li><Link href="/Financial/investment-calculator">📈 Investment Calculator</Link></li>
              <li><Link href="/Financial/inflation-calculator">📉 Inflation Calculator</Link></li>
              <li><Link href="/Financial/finance-calculator">💸 Finance Calculator</Link></li>
              <li><Link href="/Financial/income-tax-calculator">🧾 Income Tax Calculator</Link></li>
              <li><Link href="/Financial/compound-interest-calculator">🪙 Compound Interest Calculator</Link></li>
              <li><Link href="/Financial/salary-calculator">💼 Salary Calculator</Link></li>
              <li><Link href="/Financial/interest-rate-calculator">📉 Interest Rate Calculator</Link></li>
              <li><Link href="/Financial/sales-tax-calculator">🧮 Sales Tax Calculator</Link></li>
            </ul>
          </div>

          {/* Fitness & Health Calculators */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 pb-2 border-b border-gray-600">
              Fitness & Health
            </h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li><Link href="/Fitness/bmi-calculator">❤️ BMI Calculator</Link></li>
              <li><Link href="/Fitness/calorie-calculator">🍎Calorie Calculator</Link></li>
              <li><Link href="/Fitness/body-fat-calculator">💪 Body Fat Calculator</Link></li>
              <li><Link href="/Fitness/bmr-calculator">🏋️‍♂️ BMR Calculator</Link></li>
              <li><Link href="/Fitness/ideal-weight-calculator">⚖️ Ideal Weight Calculator</Link></li>
              <li><Link href="/Fitness/pace-calculator">🏃‍♂️ Pace Calculator</Link></li>
              <li><Link href="/Fitness/pregnancy-calculator">🤰 Pregnancy Calculator</Link></li>
              <li><Link href="/Fitness/pregnancy-conception-calculator">👶 Pregnancy Conception Calculator</Link></li>
              <li><Link href="/Fitness/due-date-calculator">🗓️ Due Date Calculator</Link></li>
            </ul>
          </div>

          {/* Math Calculators */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 pb-2 border-b border-gray-600">
              Math Calculators
            </h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li><Link href="/Math/scientific-calculator">🔬 Scientific Calculator</Link></li>
              <li><Link href="/Math/fraction-calculator">➗ Fraction Calculator</Link></li>
              <li><Link href="/Math/percentage-calculator">📊 Percentage Calculator</Link></li>
              <li><Link href="/Math/random-number-generator">🎲 Random Number Generator</Link></li>
              <li><Link href="/Math/triangle-calculator">🔺 Triangle Calculator</Link></li>
              <li><Link href="/Math/standard-deviation-calculator">📏 Standard Deviation Calculator</Link></li>
            </ul>
          </div>

          {/* Other Calculators */}
          <div>
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 pb-2 border-b border-gray-600">
              Other Calculators
            </h3>
            <ul className="space-y-1.5 md:space-y-2">
              <li><Link href="/Other/age-calculator">⏰ Age Calculator</Link></li>
              <li><Link href="/Other/date-calculator">📅 Date Calculator</Link></li>
              <li><Link href="/Other/time-calculator">⏱️ Time Calculator</Link></li>
              <li><Link href="/Other/hours-calculator">🕒 Hours Calculator</Link></li>
              <li><Link href="/Other/gpa-calculator">🎓 GPA Calculator</Link></li>
              <li><Link href="/Other/grade-calculator">📘 Grade Calculator</Link></li>
              <li><Link href="/Other/concrete-calculator">🧱 Concrete Calculator</Link></li>
              <li><Link href="/Other/subnet-calculator">🌐 Subnet Calculator</Link></li>
              <li><Link href="/Other/password-calculator">🔑 Password Generator</Link></li>
              <li><Link href="/Other/conversion-calculator">🔄 Conversion Calculator</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 md:pt-8 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs md:text-sm">© 2025 AllCalculators.ai. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm">
              <Link href="/about" className="hover:text-red-200 transition-colors">
                📘 About Us
              </Link>
              <Link href="/privacy" className="hover:text-red-200 transition-colors">
                🔒 Privacy
              </Link>
              <Link href="/contact" className="hover:text-red-200 transition-colors">
                📞 Contact
              </Link>
              <div className="flex gap-3">
                <a href="https://allcalculators.ai" target="_blank" rel="noopener noreferrer" className="hover:text-red-200 transition-colors">
                  🌐
                </a>
                {/* <a href="#" className="hover:text-red-200 transition-colors">
                  🐦</a> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}