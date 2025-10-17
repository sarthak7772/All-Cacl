import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Home,   } from 'lucide-react';

const MortgageCalculator = () => {
  const [homePrice, setHomePrice] = useState(450000);
  const [downPayment, setDownPayment] = useState(90000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanAmount, setLoanAmount] = useState(360000);
  const [interestRate, setInterestRate] = useState(6.875);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(5400);
  const [homeInsurance, setHomeInsurance] = useState(1800);
  const [hoaFees, setHoaFees] = useState(0);
  
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalMonthlyPayment, setTotalMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [calculated, setCalculated] = useState(false);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("Unknown");

  const financialTools = [
    { emoji: '🏠', name: 'Mortgage Calculator', href: '/Financial/mortgage-calculator' },
    { emoji: '💵', name: 'Loan Calculator', href: '/Financial/loan-calculator' },
    { emoji: '🚗', name: 'Auto Loan Calculator', href: '/Financial/auto-loan-calculator' },
    { emoji: '📊', name: 'Interest Calculator', href: '/Financial/interest-calculator' },
    { emoji: '💳', name: 'Payment Calculator', href: '/Financial/payment-calculator' },
    { emoji: '🐷', name: 'Retirement Calculator', href: '/Financial/retirement-calculator' },
    { emoji: '📈', name: 'Amortization Calculator', href: '/Financial/amortization-calculator' },
    { emoji: '📉', name: 'Investment Calculator', href: '/Financial/investment-calculator' },
    { emoji: '📆', name: 'Inflation Calculator', href: '/Financial/inflation-calculator' },
    { emoji: '💼', name: 'Finance Calculator', href: '/Financial/finance-calculator' },
    { emoji: '🧾', name: 'Income Tax Calculator', href: '/Financial/income-tax-calculator' },
    { emoji: '💲', name: 'Compound Interest Calculator', href: '/Financial/compound-interest-calculator' },
    { emoji: '👔', name: 'Salary Calculator', href: '/Financial/salary-calculator' },
    { emoji: '📉', name: 'Interest Rate Calculator', href: '/Financial/interest-rate-calculator' },
    { emoji: '🧾', name: 'Sales Tax Calculator', href: '/Financial/sales-tax-calculator' },
  ];

  // Fetch user's currency from IP location API
  useEffect(() => {
    async function detectCurrency() {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported in this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Lat:", latitude, "Lon:", longitude);

          try {
            // Step 1 - Reverse Geocode to get country code (ISO 3166)
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const geoData = await geoRes.json();

            const countryCode = geoData.address?.country_code?.toUpperCase();
            setCountry(geoData.address?.country || "Unknown");

            if (!countryCode) {
              console.warn("Country code not found, defaulting to USD");
              setCurrency("USD");
              return;
            }

            // Step 2 - Fetch currency info using REST Countries API
            const countryRes = await fetch(
              `https://restcountries.com/v3.1/alpha/${countryCode}`
            );
            const countryData = await countryRes.json();

            const currencies = countryData[0]?.currencies;
            const currencyCode = currencies
              ? Object.keys(currencies)[0]
              : "USD";

            setCurrency(currencyCode);
          } catch (error) {
            console.error("Error detecting currency:", error);
            setCurrency("USD");
          }
        },
        (error) => {
          console.error("Geolocation Error:", error);
          setCurrency("USD");
        }
      );
    }

    detectCurrency();
  }, []);

  // Format currency dynamically
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyDetailed = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const totalMonths = parseInt(loanTerm) * 12;

    if (principal <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return;
    }

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);

    setMonthlyPayment(payment);

    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthly = payment + monthlyPropertyTax + monthlyInsurance + hoaFees;
    setTotalMonthlyPayment(totalMonthly);

    const totalPaid = payment * totalMonths;
    const interest = totalPaid - principal;
    setTotalInterest(interest);
    setCalculated(true);
  };

  const updateDownPayment = (value, isPercent = false) => {
    if (isPercent) {
      const percent = parseFloat(value) || 0;
      const amount = (homePrice * percent) / 100;
      setDownPaymentPercent(percent);
      setDownPayment(amount);
      setLoanAmount(homePrice - amount);
    } else {
      const amount = parseFloat(value) || 0;
      const percent = homePrice > 0 ? (amount / homePrice) * 100 : 0;
      setDownPayment(amount);
      setDownPaymentPercent(percent);
      setLoanAmount(homePrice - amount);
    }
  };

  const updateHomePrice = (value) => {
    const price = parseFloat(value) || 0;
    setHomePrice(price);
    const currentDownPercent = downPaymentPercent;
    const newDownPayment = (price * currentDownPercent) / 100;
    setDownPayment(newDownPayment);
    setLoanAmount(price - newDownPayment);
  };

  const clearForm = () => {
    setHomePrice(0);
    setDownPayment(0);
    setDownPaymentPercent(0);
    setLoanAmount(0);
    setInterestRate(0);
    setLoanTerm(0);
    setPropertyTax(0);
    setHomeInsurance(0);
    setHoaFees(0);
    setMonthlyPayment(0);
    setTotalMonthlyPayment(0);
    setTotalInterest(0);
    setCalculated(false);
  };

  return (
    <>
     <Head>
        <title>Online Mortgage Calculator – Plan Your Home Loan Smartly</title>
        <meta
          name="description"
          content="Easily calculate mortgage payments and interest with our online Mortgage Calculator. Get insights into your home loan costs, affordability, and repayment schedule instantly."
        />
        <meta name="keywords" content="Mortgage Calculator, Home Loan Calculator, Loan Payment Calculator, Mortgage Payment Estimator, Monthly Mortgage Calculator, Mortgage Interest Calculator, Online Mortgage Calculator, House Loan Calculator, Mortgage Affordability Calculator, Mortgage Calculator Online" />
      </Head>
      <div className="min-h-screen bg-gray-100">
      <Header/>
              

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex mt-14">
        {/* Left Sidebar - Financial Tools */}
        <div className={`
          fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}>
          <div className="bg-gray-900 text-white p-3">
            <h3 className="font-bold">Financial Tools</h3>
          </div>

          <div className="p-4">
            <div className="space-y-2 text-sm">
              {financialTools.map((tool, index) => (
                <a
                  key={index}
                  href={tool.href}
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-700 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  <span>{tool.emoji}</span>
                  <span>{tool.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        
                   <div className="w-full lg:ml-64 p-4 md:p-6 -mt-15">
                    <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="bg-gray-900 text-white p-4 md:p-6 rounded-t-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="w-6 h-6 md:w-8 md:h-8" />
                  <h1 className="text-xl md:text-2xl font-bold">Mortgage Calculator</h1>
                  </div>
               


                <p className="text-gray-300 text-xs md:text-sm">
                  A Mortgage Calculator is a tool that helps estimate monthly mortgage payments, total interest, and loan duration based on the loan amount, interest rate, and repayment term.
                </p>
              </div>

              {/* Calculator Card */}
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Input Section */}
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Loan Parameters</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Home Purchase Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></span>
                          <input
                            type="number"
                            value={homePrice}
                            onChange={(e) => updateHomePrice(e.target.value)}
                            className="w-full text-gray-900 pl-8 pr-4 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Down Payment</label>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="relative">
                            <input
                              type="number"
                              value={Math.round(downPaymentPercent)}
                              onChange={(e) => updateDownPayment(e.target.value, true)}
                              className="w-full text-gray-900  px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900">%</span>
                          </div>
                          <div className="flex items-center px-3 bg-gray-300 rounded text-gray-900 font-medium text-xs md:text-sm">
                            {formatCurrency(downPayment)}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Loan Term</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={loanTerm}
                              onChange={(e) => setLoanTerm(e.target.value)}
                              className="w-full text-gray-900  px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-14"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900 text-sm">years</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Interest Rate</label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.001"
                              value={interestRate}
                              onChange={(e) => setInterestRate(e.target.value)}
                              className="w-full text-gray-900  px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-8"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-900">%</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm">Additional Monthly Costs</h4>
                        
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className="text-xs font-medium text-gray-900">Property Tax (Annual)</label>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs"></span>
                              <input
                                type="number"
                                value={propertyTax}
                                onChange={(e) => setPropertyTax(Number(e.target.value))}
                                className="w-full text-gray-900  sm:w-24 px-2 py-1 text-sm border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className="text-xs font-medium text-gray-900">Home Insurance (Annual)</label>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs"></span>
                              <input
                                type="number"
                                value={homeInsurance}
                                onChange={(e) => setHomeInsurance(Number(e.target.value))}
                                className="w-full text-gray-900  sm:w-24 px-2 py-1 text-sm border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <label className="text-xs font-medium text-gray-900">HOA Fees (Monthly)</label>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs"></span>
                              <input
                                type="number"
                                value={hoaFees}
                                onChange={(e) => setHoaFees(Number(e.target.value))}
                                className="w-full  text-gray-900 sm:w-24 px-2 py-1 text-sm border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 pt-4">
                        <button
                          onClick={calculateMortgage}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded font-medium hover:bg-green-700 transition-colors"
                        >
                          Calculate
                        </button>
                        <button
                          onClick={clearForm}
                          className="px-4 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="bg-gray-900 text-white p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base md:text-lg font-bold">Results:</h3>
                    </div>

                    {calculated ? (
                      <div className="space-y-4">
                        <div className="bg-white text-gray-800 rounded-lg p-4">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center pb-2 border-b">
                              <span className="font-semibold text-xs md:text-sm">Principal & Interest</span>
                              <span className="text-lg md:text-xl font-bold text-gray-900">{formatCurrencyDetailed(monthlyPayment)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Property Tax</span>
                              <span>{formatCurrencyDetailed(propertyTax / 12)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Home Insurance</span>
                              <span>{formatCurrencyDetailed(homeInsurance / 12)}</span>
                            </div>
                            {hoaFees > 0 && (
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>HOA Fees</span>
                                <span>{formatCurrencyDetailed(hoaFees)}</span>
                              </div>
                            )}
                            <div className="border-t pt-2 flex justify-between items-center">
                              <span className="font-bold text-xs md:text-sm">Total Monthly Payment</span>
                              <span className="text-lg md:text-xl font-bold text-green-600">{formatCurrencyDetailed(totalMonthlyPayment)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div className="bg-white rounded-lg p-2 md:p-3 text-center">
                            <div className="text-xs text-gray-600 mb-1">Loan Amount</div>
                            <div className="font-bold text-gray-900 text-xs md:text-sm">{formatCurrency(loanAmount)}</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 md:p-3 text-center">
                            <div className="text-xs text-gray-600 mb-1">Total Interest</div>
                            <div className="font-bold text-red-600 text-xs md:text-sm">{formatCurrency(totalInterest)}</div>
                          </div>
                          <div className="bg-white rounded-lg p-2 md:p-3 text-center">
                            <div className="text-xs text-gray-600 mb-1">Total Paid</div>
                            <div className="font-bold text-gray-900 text-xs md:text-sm">{formatCurrency(monthlyPayment * loanTerm * 12)}</div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 md:py-12 text-gray-300">
                       
                        <p className="text-xs md:text-sm">Enter your mortgage details and click Calculate to see your payment breakdown</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Educational Content */}
                <div className="mt-6 md:mt-8 bg-gray-50 p-4 md:p-6 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Understanding Mortgage Payments</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">What is PITI?</h4>
                      <p className="text-xs md:text-sm text-gray-600 mb-3">
                        PITI stands for Principal, Interest, Taxes, and Insurance - the four main components of your monthly mortgage payment.
                      </p>
                      <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span><strong>Principal:</strong> Amount borrowed</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span><strong>Interest:</strong> Cost of borrowing</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span><strong>Taxes:</strong> Property taxes</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span><strong>Insurance:</strong> Homeowners coverage</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Smart Mortgage Tips</h4>
                      <ul className="space-y-2 text-xs md:text-sm text-gray-600">
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>Aim for 20% down payment to avoid PMI</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>Compare rates from multiple lenders</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>Consider 15-year loans for interest savings</span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-gray-900 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>Budget for maintenance and repairs</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 md:p-4 rounded">
                    <h4 className="font-bold text-yellow-800 mb-2 text-xs md:text-sm">The 28/36 Rule:</h4>
                    <p className="text-xs text-yellow-700">
                      Financial experts recommend that your housing expenses should not exceed 28% of your gross monthly income, 
                      and your total debt payments should stay below 36% of your gross monthly income.
                    </p>
                  </div>
                </div>

                <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Important Notice</h3>
                  <p className="text-xs md:text-sm text-gray-300">
                    This calculator provides estimates for educational purposes. Actual mortgage terms, rates, and costs 
                    may vary. Consult with mortgage professionals for personalized advice.
                  </p>
                </div>
              </div>
          </div>
        </div>
        </div>
        </div>
       <Footer/>
    </div>
    
    </>
  );
};

export default MortgageCalculator;