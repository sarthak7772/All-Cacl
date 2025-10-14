import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator,  } from 'lucide-react';

const PaymentCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(700000);
  const [loanTerm, setLoanTerm] = useState(15);
  const [interestRate, setInterestRate] = useState(6);
  const [monthlyPayment, setMonthlyPayment] = useState(1687);
  const [calculationMode, setCalculationMode] = useState('fixedTerm');
  const [results, setResults] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("Unknown");

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
      }).format(amount);
    } catch (error) {
      // Fallback to USD if currency is invalid
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
  };

  const calculatePayment = () => {
    const principal = parseFloat(loanAmount);
    const monthlyRate = parseFloat(interestRate) / 100 / 12;

    if (principal <= 0 || monthlyRate <= 0) {
      setResults(null);
      return;
    }

    let calculatedMonthlyPayment;
    let calculatedTerm;
    let numPayments;

    if (calculationMode === 'fixedTerm') {
      // Fixed Term: Calculate monthly payment based on loan term
      numPayments = parseFloat(loanTerm) * 12;
      
      if (numPayments <= 0) {
        setResults(null);
        return;
      }

      calculatedMonthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                                (Math.pow(1 + monthlyRate, numPayments) - 1);
      calculatedTerm = loanTerm;
    } else {
      // Fixed Payment: Calculate loan term based on monthly payment
      const payment = parseFloat(monthlyPayment);
      
      if (payment <= 0) {
        setResults(null);
        return;
      }

      // Check if payment is sufficient to cover interest
      const minPayment = principal * monthlyRate;
      if (payment <= minPayment) {
        alert('Monthly payment must be greater than the monthly interest (' + formatCurrency(minPayment) + ') to pay off the loan.');
        setResults(null);
        return;
      }

      // Calculate number of payments using logarithmic formula
      numPayments = Math.log(payment / (payment - principal * monthlyRate)) / Math.log(1 + monthlyRate);
      calculatedTerm = numPayments / 12;
      calculatedMonthlyPayment = payment;
    }

    const totalOfPayments = calculatedMonthlyPayment * numPayments;
    const totalInterest = totalOfPayments - principal;

    const schedule = [];
    let remainingBalance = principal;

    for (let year = 1; year <= Math.ceil(numPayments / 12); year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      const paymentsInYear = Math.min(12, numPayments - (year - 1) * 12);

      for (let month = 1; month <= paymentsInYear; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = Math.min(calculatedMonthlyPayment - interestPayment, remainingBalance);
        
        yearlyInterest += interestPayment;
        yearlyPrincipal += principalPayment;
        remainingBalance -= principalPayment;

        if (remainingBalance < 0.01) {
          remainingBalance = 0;
          break;
        }
      }

      schedule.push({
        year,
        interest: yearlyInterest,
        principal: yearlyPrincipal,
        endingBalance: remainingBalance
      });

      if (remainingBalance <= 0) break;
    }

    const principalPercentage = totalOfPayments > 0 ? Math.round((principal / totalOfPayments) * 100) : 0;
    const interestPercentage = totalOfPayments > 0 ? Math.round((totalInterest / totalOfPayments) * 100) : 0;

    setResults({
      monthlyPayment: calculatedMonthlyPayment,
      totalOfPayments,
      totalInterest,
      schedule,
      principalPercentage,
      interestPercentage,
      payoffTime: calculatedTerm
    });
  };

  const resetForm = () => {
    setLoanAmount(0);
    setLoanTerm(0);
    setInterestRate(0);
    setMonthlyPayment(0);
    setCalculationMode('fixedTerm');
    setResults(null);
  };

  return (
    <>
      <Head>
        <title>Payment Calculator | Free Online Loan Payment Tool</title>
        <meta
          name="description"
          content="Use our free Payment Calculator to estimate your monthly loan payments, interest rates, and total costs. Simple, fast, and accurate online calculator."
        />
        <meta name="keywords" content="Payment Calculator, Online Payment Calculator, Loan Payment Calculator, Monthly Payment Calculator, Auto Payment Calculator, Mortgage Payment Calculator, Car Payment Calculator, Personal Loan Payment Calculator, EMI Payment Calculator, Free Payment Calculator." />
      </Head>
      
      <div className="min-h-screen bg-gray-200">
        <Header/>
       

        <div className="flex pt-14">
          

          {/* Left Sidebar */}
          <div className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
          <div className="flex-1 lg:ml-54 p-4 md:p-6 -mt-15">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-2">Payment Calculator</h1>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                A Payment Calculator is a tool that helps determine the periodic payment amount for a loan or service based on the principal, interest rate, and payment schedule.
              </p>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Header */}
                <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium text-right">
                  Result
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* Input Section */}
                  <div className="flex-1 p-4 md:p-6">
                    <div className="space-y-4">
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          <button 
                            className={`px-4 text-gray-900 py-2 rounded text-sm ${calculationMode === 'fixedTerm' ? 'bg-[#111827] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setCalculationMode('fixedTerm')}
                          >
                            Fixed Term
                          </button>
                          <button 
                            className={`px-4 text-gray-900 py-2 rounded text-sm ${calculationMode === 'fixedPayments' ? 'bg-[#111827] text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setCalculationMode('fixedPayments')}
                          >
                            Fixed Payments
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="sm:w-32 text-gray-900 text-sm font-medium">Loan Amount</label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm"></span>
                          <input
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="sm:w-32 text-gray-900 text-sm font-medium">Loan Term</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            value={loanTerm}
                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                            disabled={calculationMode === 'fixedPayments'}
                            className={`w-24 text-gray-900 px-3 py-2 border border-gray-900 rounded text-sm focus:outline-none focus:ring-2 ${calculationMode === 'fixedPayments' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          />
                          <span className="text-xs text-gray-900">years</span>
                        </div>
                      </div>

                      {calculationMode === 'fixedPayments' && (
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <label className="sm:w-32 text-gray-900 text-sm font-medium">Monthly Payment</label>
                          <div className="flex items-center space-x-1">
                            <span className="text-sm"></span>
                            <input
                              type="number"
                              value={monthlyPayment}
                              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                              className="w-full  text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded text-sm focus:outline-none "
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="sm:w-32  text-gray-900 text-sm font-medium">Interest Rate</label>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            step="0.01"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-24 text-gray-900 px-3 py-2 border border-gray-900 rounded text-sm focus:outline-none 
                            "
                          />
                          <span className="text-sm text-gray-900">%</span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                          onClick={calculatePayment}
                          className="bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          ⚡ Calculate Payment
                        </button>
                        <button
                          onClick={resetForm}
                          className="bg-gray-400 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-500 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="w-full lg:w-80 bg-red-50 p-4 md:p-6 border-t lg:border-t-0 lg:border-l">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-[#111827]">Result</h3>
                    </div>
                    {results ? (
                      <div>
                        <div className="text-center mb-6">
                          <div className="text-3xl md:text-4xl font-bold text-[#111827] mb-2">
                            {formatCurrency(results.monthlyPayment)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Monthly Payment
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center border-b border-red-100 pb-2">
                            <span className="text-gray-600">Total of Payments</span>
                            <span className="font-semibold text-blue-600">{formatCurrency(results.totalOfPayments)}</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-red-100 pb-2">
                            <span className="text-gray-600">Total Interest</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-red-100 pb-2">
                            <span className="text-gray-600">Principal %</span>
                            <span className="font-semibold text-orange-500">{results.principalPercentage}%</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-red-100 pb-2">
                            <span className="text-gray-600">Interest %</span>
                            <span className="font-semibold text-gray-900">{results.interestPercentage}%</span>
                          </div>

                          <div className="flex justify-between items-center border-b border-red-100 pb-2">
                            <span className="text-gray-600">Payoff Time</span>
                            <span className="font-semibold text-gray-900">{results.payoffTime.toFixed(2)} years</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Loan Amount</span>
                            <span className="font-semibold text-purple-500">{formatCurrency(loanAmount)}</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                          <strong>Note:</strong> Payment calculations are estimates based on fixed rates. 
                          Actual payments may vary with adjustable rates or additional fees.
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 text-sm py-8">
                        Enter loan details and click "Calculate Payment" to see results
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Quick Tips */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h3 className="text-lg font-bold text-[#111827] mb-3">Payment Quick Tips</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2">•</span>
                    <span>Keep in mind your payment schedule for budgeting as it affects your monthly cash flow</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2">•</span>
                    <span>Shorter loan terms help reduce total interest paid but increase monthly payment amounts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2">•</span>
                    <span>Interest rates can vary by 10%. Understand lenders with similar terms can offer different rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-900 mr-2">•</span>
                    <span>Good credit history has beneficial effects, reducing interest rates and improving loan terms</span>
                  </li>
                </ul>
              </div>

              {/* Accuracy & Limitations */}
              <div className="mt-6 bg-[#111827] text-white rounded-lg p-4 md:p-6">
                <h3 className="text-lg font-bold mb-3">Accuracy & Limitations</h3>
                <p className="text-sm leading-relaxed">
                  Payment calculations are mathematical estimates that work well for loan planning 
                  but may not account for all fees, insurance, or rate changes. For 
                  the most accurate assessment, consider consulting with financial advisors and 
                  comparing multiple lender offers.
                </p>
              </div>

              {/* Understanding Your Payment Structure */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#111827] mb-4">Understanding Your Payment Structure</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                  Your Payment Structure represents the systematic repayment of borrowed funds through regular installments over time. Think of it as the financial commitment 
                  - showing how principal and interest combine to create predictable monthly obligations.
                </p>
                
                <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                  <strong>Loan payments</strong> are calculated using compound interest formulas where early payments contain more interest and later payments apply more toward principal. 
                  This amortization structure ensures the loan is fully paid by the end of the term.
                </p>

                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  Understanding your <strong>payment structure</strong> is crucial for budgeting, cash flow planning, and debt management. It helps determine affordability, 
                  compare loan options, and understand the total cost of borrowing over time.
                </p>
              </div>

              {/* Payment Calculation Methods */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#111827] mb-4">Payment Calculation Methods</h2>
                
                <div className="mb-6">
                  <h3 className="text-base md:text-lg text-gray-900 font-semibold mb-3 bg-gray-50 p-3 rounded">Fixed Term Method (Recommended)</h3>
                  <div className="bg-gray-50 p-4 rounded mb-2 overflow-x-auto">
                    <div className="text-xs text-gray-900 md:text-sm">
                      <div><strong>Payment:</strong> P[r(1+r)^n]/[(1+r)^n-1]</div>
                      <div><strong>Where:</strong> P = Principal, r = Monthly rate, n = Number of payments</div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-900">
                    Standard amortization formula for fixed-rate loans with predetermined term length.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base md:text-lg  text-gray-900 font-semibold mb-3 bg-gray-50 p-3 rounded">Fixed Payment Method</h3>
                  <div className="bg-gray-50 p-4 rounded mb-2 overflow-x-auto">
                    <div className="text-xs text-gray-900 md:text-sm">
                      <div><strong>Term:</strong> log(M/(M-P×r)) / log(1+r)</div>
                      <div><strong>Where:</strong> M = Monthly payment amount, P = Principal, r = Monthly rate</div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-900">
                    Calculates loan term when monthly payment amount is predetermined or constrained.
                  </p>
                </div>

                <div>
                  <h3 className="text-base md:text-lg text-gray-900 font-semibold mb-3 bg-gray-50 p-3 rounded">Interest-Only Method</h3>
                  <div className="bg-gray-50 p-4 rounded mb-2">
                    <div className="text-xs text-gray-900 md:text-sm">
                      <strong>Payment = Principal × Monthly Interest Rate (interest only period)</strong>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-900">
                    Initial period with lower payments covering only interest, followed by higher amortizing payments.
                  </p>
                </div>
              </div>
                
            {/* Using Your Payment Calculator for Financial Planning */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#111827] mb-4">Using Your Payment Calculator for Financial Planning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="font-semibold text-green-800 mb-2">Budget Planning</h3>
                  <p className="text-sm text-gray-700">
                    Determine affordable monthly 
                    payment amounts that fit 
                    within your budget and 
                    debt-to-income ratios.
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-blue-800 mb-2">Loan Comparison</h3>
                  <p className="text-sm text-gray-700">
                    Compare different loan terms 
                    and rates to find the most 
                    cost-effective financing 
                    options available.
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-purple-800 mb-2">Cash Flow Planning</h3>
                  <p className="text-sm text-gray-700">
                    Plan monthly cash flow and 
                    ensure adequate income to 
                    cover loan payments and 
                    other expenses.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> Payment calculations provide estimates for planning purposes. Actual loan terms may vary based on credit score, lender policies, and market conditions. 
                  Always verify calculations with lenders and consider professional financial advice for major borrowing decisions.
                </p>
              </div>
            </div>

            {/* Factors That Influence Your Payment */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#111827] mb-4">Factors That Influence Your Payment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#111827] mb-3">Principal Amount</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Higher loan amounts result in proportionally higher monthly payments, 
                    assuming the same interest rate and loan term.
                  </p>

                  <h3 className="font-semibold text-[#111827] mb-3">Interest Rate</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Even small rate differences significantly impact both monthly payments 
                    and total interest paid over the loan term.
                  </p>

                  <h3 className="font-semibold text-[#111827] mb-3">Loan Term</h3>
                  <p className="text-sm text-gray-700">
                    Longer terms reduce monthly payments but increase total interest cost. 
                    Shorter terms increase monthly burden but reduce overall cost.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-[#111827] mb-3">Credit Score</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Higher credit scores qualify for lower interest rates, directly reducing 
                    monthly payment amounts and total loan cost.
                  </p>

                  <h3 className="font-semibold text-[#111827] mb-3">Down Payment</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Larger down payments reduce the principal amount financed, 
                    resulting in lower monthly payments and less interest paid.
                  </p>

                  <h3 className="font-semibold text-[#111827] mb-3">Loan Type</h3>
                  <p className="text-sm text-gray-700">
                    Fixed-rate loans have predictable payments, while variable-rate loans 
                    may change payments as interest rates fluctuate over time.
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

export default PaymentCalculator;

