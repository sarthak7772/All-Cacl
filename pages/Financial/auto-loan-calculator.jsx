import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Car } from 'lucide-react';

const AutoLoanCalculator = () => {
  const [autoPrice, setAutoPrice] = useState(50000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(5);
  const [downPayment, setDownPayment] = useState(10000);
  const [tradeInValue, setTradeInValue] = useState(0);
  const [salesTax, setSalesTax] = useState(7);
  const [titleFees, setTitleFees] = useState(2000);
  const [includeTaxesInLoan, setIncludeTaxesInLoan] = useState(false);
  const [results, setResults] = useState(null);
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
    { emoji: '🧾', name: 'Sales Tax Calculator', href: '/Financial/sales-tax-calculator' }
  ];

  useEffect(() => {
    async function detectCurrency() {
      if (!navigator.geolocation) {
        console.error("Geolocation not supported in this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const geoData = await geoRes.json();

            const countryCode = geoData.address?.country_code?.toUpperCase();
            setCountry(geoData.address?.country || "Unknown");

            if (!countryCode) {
              setCurrency("USD");
              return;
            }

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateAutoLoan = () => {
    const effectiveAutoPrice = autoPrice - tradeInValue;
    const taxAmount = effectiveAutoPrice * (salesTax / 100);
    
    let loanAmount = effectiveAutoPrice - downPayment;
    if (includeTaxesInLoan) {
      loanAmount += taxAmount + titleFees;
    }

    const upfrontPayment = downPayment + (includeTaxesInLoan ? 0 : taxAmount + titleFees);

    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm;
    
    let monthlyPayment = 0;
    if (monthlyRate > 0) {
      monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                      (Math.pow(1 + monthlyRate, numPayments) - 1);
    } else {
      monthlyPayment = loanAmount / numPayments;
    }

    const totalOfPayments = monthlyPayment * numPayments;
    const totalInterest = totalOfPayments - loanAmount;
    const totalCost = autoPrice + totalInterest + taxAmount + titleFees;

    const principalPercentage = totalOfPayments > 0 ? Math.round((loanAmount / totalOfPayments) * 100) : 0;
    const interestPercentage = totalOfPayments > 0 ? Math.round((totalInterest / totalOfPayments) * 100) : 0;

    setResults({
      monthlyPayment,
      totalLoanAmount: loanAmount,
      salesTaxAmount: taxAmount,
      upfrontPayment,
      totalOfPayments,
      totalInterest,
      totalCost,
      principalPercentage,
      interestPercentage,
      payoffTime: Math.round(loanTerm / 12 * 10) / 10
    });
  };

  const resetForm = () => {
    setAutoPrice(0);
    setLoanTerm(0);
    setInterestRate(0);
    setDownPayment(0);
    setTradeInValue(0);
    setSalesTax(0);
    setTitleFees(0);
    setIncludeTaxesInLoan(false);
    setResults(null);
  };

  return (
    <>
     <Head>
        <title>Auto Loan Calculator | Free Car Loan Payment Estimator</title>
        <meta
          name="description"
          content="Use our free Auto Loan Calculator to estimate monthly car payments, interest rates, and total loan costs. Quick, accurate, and easy to use."
        />
        <meta name="keywords" content="Auto Loan Calculator, Car Loan Calculator, Vehicle Loan Calculator, Auto Loan Payment Calculator" />
      </Head>
    <div className="min-h-screen bg-gray-100">
      
      <Header/>
              
      
      <div className="flex mt-14">
        {/* Left Sidebar - Financial Calculator Tools */}
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
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  <span>{tool.emoji}</span>
                  <span>{tool.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:ml-64 p-4 md:p-6 pb-20 -mt-15">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="bg-gray-900 text-white p-4 md:p-6 rounded-t-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Car className="w-6 h-6 md:w-8 md:h-8" />
                  <h1 className="text-xl md:text-2xl font-bold">Auto Loan Calculator</h1>
                </div>
                <p className="text-red-100 text-xs md:text-sm">
                  An Auto Loan Calculator helps estimate monthly payments for purchasing a vehicle based on loan amount, interest rate, and loan term.
                </p>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  {/* Input Section */}
                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-6">Loan Parameters</h3>
                    
                    <div className="space-y-5">
                      {/* Auto Price */}
                      <div>
                        <label className="block font-medium text-gray-900 text-sm mb-2">Auto Price</label>
                        <input
                          type="number"
                          value={autoPrice}
                          onChange={(e) => setAutoPrice(Number(e.target.value))}
                          className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Loan Term */}
                      <div>
                        <label className="block font-medium text-gray-900 text-sm mb-2">Loan Term (months)</label>
                        <input
                          type="number"
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Interest Rate */}
                      <div>
                        <label className="block font-medium text-gray-900 text-sm mb-2">Interest Rate (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Down Payment */}
                      <div>
                        <label className="block font-medium text-gray-900 text-sm mb-2">Down Payment</label>
                        <input
                          type="number"
                          value={downPayment}
                          onChange={(e) => setDownPayment(Number(e.target.value))}
                          className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Trade-in Value */}
                      <div>
                        <label className="block font-medium text-gray-900 text-sm mb-2">Trade-in Value</label>
                        <input
                          type="number"
                          value={tradeInValue}
                          onChange={(e) => setTradeInValue(Number(e.target.value))}
                          className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Sales Tax */}
                      <div>
                        <label className="block font-medium text-gray-900 text-sm mb-2">Sales Tax (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={salesTax}
                          onChange={(e) => setSalesTax(Number(e.target.value))}
                          className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Title & Fees */}
                      <div>
                        <label className="block font-medium text-gray-900 text-sm mb-2">Title & Fees</label>
                        <input
                          type="number"
                          value={titleFees}
                          onChange={(e) => setTitleFees(Number(e.target.value))}
                          className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>

                      {/* Checkbox */}
                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          checked={includeTaxesInLoan}
                          onChange={(e) => setIncludeTaxesInLoan(e.target.checked)}
                          className="rounded w-4 h-4 accent-red-500"
                        />
                        <label className="text-sm text-gray-900 font-medium">Include taxes & fees in loan</label>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        <button
                          onClick={calculateAutoLoan}
                          className="flex-1 bg-green-600 text-white py-3 px-4 rounded font-medium hover:bg-green-700 transition-colors"
                        >
                          Calculate
                        </button>
                        <button
                          onClick={resetForm}
                          className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-medium"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-base md:text-lg font-bold">Results</h3>
                    </div>

                    {results ? (
                      <div className="space-y-4">
                        <div className="text-center mb-6">
                          <div className="text-3xl md:text-4xl font-bold mb-2">
                            {formatCurrency(results.monthlyPayment)}
                          </div>
                          <div className="text-xs md:text-sm text-red-100">
                            Monthly Payment
                          </div>
                        </div>

                        <div className="space-y-3 text-xs md:text-sm border-t border-gray-700 pt-4">
                          <div className="flex justify-between">
                            <span>Total Loan Amount</span>
                            <span className="font-bold">{formatCurrency(results.totalLoanAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Sales Tax</span>
                            <span className="font-bold">{formatCurrency(results.salesTaxAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Upfront Payment</span>
                            <span className="font-bold">{formatCurrency(results.upfrontPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Interest</span>
                            <span className="font-bold">{formatCurrency(results.totalInterest)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Cost</span>
                            <span className="font-bold">{formatCurrency(results.totalCost)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Loan Term</span>
                            <span className="font-bold">{results.payoffTime} years</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-white text-gray-800 rounded text-xs leading-relaxed">
                          <strong>Note:</strong> Auto loan calculations are estimates based on fixed rates. Actual terms may vary with credit score and market conditions.
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 md:py-12 text-red-100">
                        <Car className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 opacity-50" />
                        <p className="text-xs md:text-sm">Enter your auto loan details and click Calculate to see your payment breakdown</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Auto Loan Quick Tips */}
                <div className="mt-6 md:mt-8 bg-gray-50 p-4 md:p-6 rounded-lg border-l-4 border-green-500">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Auto Loan Quick Tips</h3>
                  <ul className="space-y-3 text-xs md:text-sm text-gray-700">
                    <li className="flex gap-3"><span className="text-green-600 font-bold">•</span><span>Keep your monthly payment within budget as it affects your debt-to-income ratio</span></li>
                    <li className="flex gap-3"><span className="text-green-600 font-bold">•</span><span>Larger down payments help reduce monthly payments and total interest paid</span></li>
                    <li className="flex gap-3"><span className="text-green-600 font-bold">•</span><span>Interest rates can vary significantly - compare offers from multiple lenders</span></li>
                    <li className="flex gap-3"><span className="text-green-600 font-bold">•</span><span>Good credit history can reduce interest rates and improve loan approval odds</span></li>
                  </ul>
                </div>

                <div className="mt-6 bg-gray-900 text-white p-4 md:p-6 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Accuracy & Limitations</h3>
                  <p className="text-xs md:text-sm text-red-100">
                    Auto loan calculations are mathematical estimates that work well for financing planning but may not account for all dealer incentives, rebates, or promotional rates.
                  </p>
                </div>
              </div>
            </div>

            {/* Understanding Your Auto Loan */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Understanding Your Auto Loan</h2>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                Your Auto Loan represents a secured financing agreement where the vehicle serves as collateral for the borrowed amount. It features fixed monthly payments that combine principal and interest over a predetermined term.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Key Factors</h3>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    <li className="flex gap-2"><span>•</span><span>Credit score affects interest rates significantly</span></li>
                    <li className="flex gap-2"><span>•</span><span>Down payment reduces loan amount and monthly costs</span></li>
                    <li className="flex gap-2"><span>•</span><span>Loan term impacts monthly payment and total interest</span></li>
                    <li className="flex gap-2"><span>•</span><span>Vehicle age and type influence available rates</span></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Smart Tips</h3>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    <li className="flex gap-2"><span>•</span><span>Shop around for best rates and terms</span></li>
                    <li className="flex gap-2"><span>•</span><span>Consider total cost, not just monthly payment</span></li>
                    <li className="flex gap-2"><span>•</span><span>Avoid being upside-down on your loan</span></li>
                    <li className="flex gap-2"><span>•</span><span>Factor in insurance and maintenance costs</span></li>
                  </ul>
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

export default AutoLoanCalculator;