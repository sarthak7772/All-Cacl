import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, FileText,   } from 'lucide-react';

const IncomeTaxCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filingStatus, setFilingStatus] = useState('single');
  const [wages, setWages] = useState(80000);
  const [federalTaxWithheld, setFederalTaxWithheld] = useState(9000);
  const [interestIncome, setInterestIncome] = useState(0);
  const [iraContributions, setIraContributions] = useState(0);
  const [mortgageInterest, setMortgageInterest] = useState(0);
  const [charitableDonations, setCharitableDonations] = useState(0);
  const [studentLoanInterest, setStudentLoanInterest] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("Unknown");
  
  const [taxResults, setTaxResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const taxBrackets2024 = {
    single: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578125, rate: 0.35 },
      { min: 578125, max: Infinity, rate: 0.37 }
    ],
    marriedJointly: [
      { min: 0, max: 22000, rate: 0.10 },
      { min: 22000, max: 89450, rate: 0.12 },
      { min: 89450, max: 190750, rate: 0.22 },
      { min: 190750, max: 364200, rate: 0.24 },
      { min: 364200, max: 462500, rate: 0.32 },
      { min: 462500, max: 693750, rate: 0.35 },
      { min: 693750, max: Infinity, rate: 0.37 }
    ],
    marriedSeparately: [
      { min: 0, max: 11000, rate: 0.10 },
      { min: 11000, max: 44725, rate: 0.12 },
      { min: 44725, max: 95375, rate: 0.22 },
      { min: 95375, max: 182100, rate: 0.24 },
      { min: 182100, max: 231250, rate: 0.32 },
      { min: 231250, max: 346875, rate: 0.35 },
      { min: 346875, max: Infinity, rate: 0.37 }
    ],
    headOfHousehold: [
      { min: 0, max: 15700, rate: 0.10 },
      { min: 15700, max: 59850, rate: 0.12 },
      { min: 59850, max: 95350, rate: 0.22 },
      { min: 95350, max: 182050, rate: 0.24 },
      { min: 182050, max: 231250, rate: 0.32 },
      { min: 231250, max: 578100, rate: 0.35 },
      { min: 578100, max: Infinity, rate: 0.37 }
    ]
  };

  const standardDeductions2024 = {
    single: 14600,
    marriedJointly: 29200,
    marriedSeparately: 14600,
    headOfHousehold: 21900
  };

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
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount || 0);
    } catch (error) {
      // Fallback to USD if currency is invalid
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount || 0);
    }
  };

  const calculateFederalTax = (taxableIncome, status) => {
    const brackets = taxBrackets2024[status] || taxBrackets2024.single;
    let tax = 0;
    let marginalRate = 0;

    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableInBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        tax += taxableInBracket * bracket.rate;
        if (taxableIncome > bracket.min) {
          marginalRate = bracket.rate;
        }
      }
    }

    return { tax, marginalRate };
  };

  const calculateTaxes = () => {
    const totalIncome = wages + interestIncome;
    const adjustments = iraContributions + studentLoanInterest;
    const agi = totalIncome - adjustments;

    const itemizedDeductions = mortgageInterest + charitableDonations;
    const standardDeduction = standardDeductions2024[filingStatus] || standardDeductions2024.single;
    const deduction = Math.max(standardDeduction, itemizedDeductions);

    const taxableIncome = Math.max(0, agi - deduction);
    const { tax: federalTax, marginalRate } = calculateFederalTax(taxableIncome, filingStatus);
    const effectiveTaxRate = agi > 0 ? (federalTax / agi) * 100 : 0;
    const refundOrOwed = federalTaxWithheld - federalTax;

    setTaxResults({
      adjustedGrossIncome: agi,
      taxableIncome,
      federalTax,
      refundOrOwed,
      marginalTaxRate: marginalRate * 100,
      effectiveTaxRate,
      standardDeduction,
      itemizedDeductions,
      deductionUsed: deduction
    });
    setShowResults(true);
  };

  const clearForm = () => {
    setFilingStatus('single');
    setWages(0);
    setFederalTaxWithheld(0);
    setInterestIncome(0);
    setIraContributions(0);
    setMortgageInterest(0);
    setCharitableDonations(0);
    setStudentLoanInterest(0);
    setTaxResults(null);
    setShowResults(false);
  };

  return (
    <>
      <Head>
        <title>Income Tax Calculator | Quick & Accurate Tax Tool</title>
        <meta
          name="description"
          content="Calculate your income tax effortlessly with our smart Income Tax Calculator. Get precise results instantly for better financial planning and peace of mind."
        />
        <meta name="keywords" content="Income Tax Calculator, Online Income Tax Calculator, Personal Income Tax Calculator, Federal Income Tax Calculator, State Income Tax Calculator, Tax Estimator, Tax Calculation Tool, Quick Income Tax Calculator, Free Income Tax Calculator, Accurate Tax Calculator" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header/>
        
        <div className="flex pt-12 md:pt-16">
          

          {/* Left Sidebar */}
          <div className={`fixed top-12 md:top-16 left-0 h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="bg-[#111827] text-white p-3">
              <h3 className="font-bold">Financial Tools</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <a href="/Financial/mortgage-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  🏠 <span>Mortgage Calculator</span>
                </a>
                <a href="/Financial/loan-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  💵 <span>Loan Calculator</span>
                </a>
                <a href="/Financial/auto-loan-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  🚗 <span>Auto Loan Calculator</span>
                </a>
                <a href="/Financial/interest-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  📊 <span>Interest Calculator</span>
                </a>
                <a href="/Financial/payment-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  💳 <span>Payment Calculator</span>
                </a>
                <a href="/Financial/retirement-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  🐷 <span>Retirement Calculator</span>
                </a>
                <a href="/Financial/amortization-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  📈 <span>Amortization Calculator</span>
                </a>
                <a href="/Financial/investment-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  📉 <span>Investment Calculator</span>
                </a>
                <a href="/Financial/inflation-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  📆 <span>Inflation Calculator</span>
                </a>
                <a href="/Financial/finance-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  💼 <span>Finance Calculator</span>
                </a>
                <a href="/Financial/income-tax-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  🧾 <span>Income Tax Calculator</span>
                </a>
                <a href="/Financial/compound-interest-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  💲 <span>Compound Interest Calculator</span>
                </a>
                <a href="/Financial/salary-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  👔 <span>Salary Calculator</span>
                </a>
                <a href="/Financial/interest-rate-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  📉 <span>Interest Rate Calculator</span>
                </a>
                <a href="/Financial/sales-tax-calculator" className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
                  🧾 <span>Sales Tax Calculator</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-54 -mt-15">
            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* Title Card */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
                  <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Income Tax Calculator</h1>
                </div>
                
                <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                  An Income Tax Calculator helps estimate the total tax payable based on annual income and applicable deductions.
                </p>
              </div>

              {/* Calculator Card */}
              <div className="bg-white rounded-xl shadow-lg border-l-4 border-red-800 p-4 md:p-8 mb-6 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Tax Information</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filing Status</label>
                    <select
                      value={filingStatus}
                      onChange={(e) => setFilingStatus(e.target.value)}
                      className="w-full px-3 md:px-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                    >
                      <option value="single">Single</option>
                      <option value="marriedJointly">Married Filing Jointly</option>
                      <option value="marriedSeparately">Married Filing Separately</option>
                      <option value="headOfHousehold">Head of Household</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Wages & Salary (W-2)</label>
                      <div className="relative">
                        <span className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-medium text-sm md:text-base"></span>
                        <input
                          type="number"
                          value={wages}
                          onChange={(e) => setWages(Number(e.target.value) || 0)}
                          className="w-full pl-7 md:pl-8 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Federal Tax Withheld</label>
                      <div className="relative">
                        <span className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm md:text-base"></span>
                        <input
                          type="number"
                          value={federalTaxWithheld}
                          onChange={(e) => setFederalTaxWithheld(Number(e.target.value) || 0)}
                          className="w-full pl-7 md:pl-8 pr-3 md:pr-4 py-2 md:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm md:text-base"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg border">
                    <h4 className="font-bold text-gray-800 mb-4 text-sm md:text-base">Additional Income & Deductions</h4>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-900">Interest Income</label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm"></span>
                          <input
                            type="number"
                            value={interestIncome}
                            onChange={(e) => setInterestIncome(Number(e.target.value) || 0)}
                            className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-900">IRA Contributions</label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm"></span>
                          <input
                            type="number"
                            value={iraContributions}
                            onChange={(e) => setIraContributions(Number(e.target.value) || 0)}
                            className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-900">Mortgage Interest</label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm"></span>
                          <input
                            type="number"
                            value={mortgageInterest}
                            onChange={(e) => setMortgageInterest(Number(e.target.value) || 0)}
                            className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-900">Charitable Donations</label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm"></span>
                          <input
                            type="number"
                            value={charitableDonations}
                            onChange={(e) => setCharitableDonations(Number(e.target.value) || 0)}
                            className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <label className="text-sm font-medium text-gray-900">Student Loan Interest</label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm"></span>
                          <input
                            type="number"
                            value={studentLoanInterest}
                            onChange={(e) => setStudentLoanInterest(Number(e.target.value) || 0)}
                            className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                    <button
                      onClick={calculateTaxes}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg font-semibold flex items-center justify-center space-x-2"
                    >
                      
                      <span className="text-sm md:text-base">Calculate Tax</span>
                    </button>
                    <button
                      onClick={clearForm}
                      className="px-4 md:px-6 py-2 md:py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors text-sm md:text-base"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Results */}
                {showResults && taxResults && (
                  <div className="mt-6 md:mt-8 bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4 md:p-6">
                    <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">Tax Calculation Results</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                      <div className="bg-white rounded-lg p-3 md:p-4 space-y-3">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Adjusted Gross Income</span>
                          <span className="font-bold">{formatCurrency(taxResults.adjustedGrossIncome)}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Deduction Used</span>
                          <span className="font-bold">{formatCurrency(taxResults.deductionUsed)}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Taxable Income</span>
                          <span className="font-bold text-gray-900">{formatCurrency(taxResults.taxableIncome)}</span>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 md:p-4 space-y-3">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Federal Tax</span>
                          <span className="font-bold text-gray-900">{formatCurrency(taxResults.federalTax)}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Marginal Rate</span>
                          <span className="font-bold">{taxResults.marginalTaxRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span className="text-gray-600">Effective Rate</span>
                          <span className="font-bold">{taxResults.effectiveTaxRate.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-3 md:p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-base md:text-lg font-bold">
                          {taxResults.refundOrOwed >= 0 ? 'Expected Refund:' : 'Amount Owed:'}
                        </span>
                        <span className={`text-xl md:text-2xl font-bold ${taxResults.refundOrOwed >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(Math.abs(taxResults.refundOrOwed))}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-xs md:text-sm text-gray-900 bg-white rounded-lg p-3 md:p-4">
                      <p className="mb-2">
                        <strong>Deduction Type:</strong> {taxResults.itemizedDeductions > taxResults.standardDeduction ? 'Itemized' : 'Standard'}
                      </p>
                      <p>
                        Your effective tax rate ({taxResults.effectiveTaxRate.toFixed(1)}%) is lower than your marginal rate 
                        ({taxResults.marginalTaxRate.toFixed(1)}%) due to progressive tax brackets.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Educational Content */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  Understanding Your Tax Return
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                  <div>
                    <h4 className="text-base md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
                      Deductions
                    </h4>
                    <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>Standard:</strong> Fixed amount based on filing status</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span><strong>Itemized:</strong> Sum of specific deductible expenses</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-gray-900 p-4 md:p-6 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm md:text-base">
                    2024 Standard Deductions:
                  </h4>
                  <div className="text-xs md:text-sm text-gray-900 space-y-1">
                    <p>Single: $14,600</p>
                    <p>Married Filing Jointly: $29,200</p>
                    <p>Head of Household: $21,900</p>
                  </div>
                </div>
              </div>

              {/* Tax Planning Tips */}
              <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
                <h3 className="font-bold text-base md:text-lg mb-4 text-gray-900">Tax Planning Tips</h3>
                <div className="space-y-4 text-xs md:text-sm text-gray-900">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Maximize retirement contributions to reduce taxable income</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Track deductible expenses throughout the year</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Adjust withholding to avoid large refunds or bills</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Consider tax-loss harvesting for investments</p>
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div style={{backgroundColor: '#111827'}} className="text-white rounded-xl p-4 md:p-6 mb-6">
                <h4 className="font-bold mb-3 text-sm md:text-base">Important Notice</h4>
                <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                  This calculator provides estimates for planning purposes. Actual tax liability may vary based on specific 
                  circumstances and tax law changes. Consult a tax professional for personalized advice.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default IncomeTaxCalculator;
                      
                    