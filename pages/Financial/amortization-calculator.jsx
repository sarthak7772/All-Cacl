import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator } from 'lucide-react';

const AmortizationCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(400000);
  const [loanTermYears, setLoanTermYears] = useState(15);
  const [loanTermMonths, setLoanTermMonths] = useState(0);
  const [interestRate, setInterestRate] = useState(6);
  const [makeExtraPayments, setMakeExtraPayments] = useState(false);
  const [extraPayment, setExtraPayment] = useState(0);
  const [results, setResults] = useState(null);
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const totalMonths = (parseInt(loanTermYears) * 12) + parseInt(loanTermMonths);

    if (principal <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      setResults(null);
      return;
    }

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                   (Math.pow(1 + monthlyRate, totalMonths) - 1);

    let remainingBalance = principal;
    let totalInterestPaid = 0;
    let totalPaymentsMade = 0;
    
    const scheduleData = [];
    let currentYear = 1;
    let yearlyInterest = 0;
    let yearlyPrincipal = 0;

    for (let month = 1; month <= totalMonths && remainingBalance > 0.01; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      let principalPayment = payment - interestPayment;
      let actualPayment = payment + (makeExtraPayments ? parseFloat(extraPayment || 0) : 0);

      if (principalPayment > remainingBalance) {
        principalPayment = remainingBalance;
        actualPayment = interestPayment + principalPayment;
      }

      remainingBalance -= principalPayment;
      totalInterestPaid += interestPayment;
      totalPaymentsMade += actualPayment;

      yearlyInterest += interestPayment;
      yearlyPrincipal += principalPayment;

      if (month % 12 === 0 || remainingBalance <= 0.01 || month === totalMonths) {
        scheduleData.push({
          year: currentYear,
          interest: yearlyInterest,
          principal: yearlyPrincipal,
          endingBalance: Math.max(0, remainingBalance),
          payment: payment + (makeExtraPayments ? parseFloat(extraPayment || 0) : 0)
        });

        currentYear++;
        yearlyInterest = 0;
        yearlyPrincipal = 0;
      }
    }

    const principalPercentage = totalPaymentsMade > 0 ? ((principal / totalPaymentsMade) * 100) : 0;
    const interestPercentage = totalPaymentsMade > 0 ? ((totalInterestPaid / totalPaymentsMade) * 100) : 0;

    setResults({
      monthlyPayment: payment + (makeExtraPayments ? parseFloat(extraPayment || 0) : 0),
      totalPayments: totalPaymentsMade,
      totalInterest: totalInterestPaid,
      schedule: scheduleData,
      principalPercentage: Math.round(principalPercentage),
      interestPercentage: Math.round(interestPercentage),
      payoffTime: scheduleData.length
    });
  };

  const resetForm = () => {
    setLoanAmount(0);
    setLoanTermYears(0);
    setLoanTermMonths(0);
    setInterestRate(0);
    setMakeExtraPayments(false);
    setExtraPayment(0);
    setResults(null);
  };

  return (
    <>
     <Head>
        <title>Amortization Calculator | Free Loan Payment Schedule Tool

</title>
        <meta
          name="description"
          content="
Use our free Amortization Calculator to calculate monthly loan payments, interest, and total costs. Get a detailed payment schedule instantly online.
  "
        />
        <meta name="keywords" content="Amortization Calculator, Loan Amortization Calculator, Mortgage Amortization Calculator, Car Loan Amortization Calculator, Online Amortization Calculator, Amortization Schedule Calculator, Home Loan Amortization Calculator, EMI Amortization Calculator, Free Amortization Calculator, Monthly Payment Calculator 

" />
     
      </Head>
    <div className="min-h-screen bg-gray-200">
      <Header/>

       <div className="flex pt-14">
        {/* Left Sidebar */}
        <div className="hidden lg:block fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40">
          <div className="bg-gray-900 text-white p-3">
            <h3 className="font-bold">Financial Tools</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2 text-sm">
              <a href="/Financial/mortgage-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                🏠 <span>Mortgage Calculator</span>
              </a>
              <a href="/Financial/loan-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                💵 <span>Loan Calculator</span>
              </a>
              <a href="/Financial/auto-loan-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                🚗 <span>Auto Loan Calculator</span>
              </a>
              <a href="/Financial/interest-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                📊 <span>Interest Calculator</span>
              </a>
              <a href="/Financial/payment-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                💳 <span>Payment Calculator</span>
              </a>
              <a href="/Financial/retirement-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                🐷 <span>Retirement Calculator</span>
              </a>
              <a href="/Financial/amortization-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                📈 <span>Amortization Calculator</span>
              </a>
              <a href="/Financial/investment-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                📉 <span>Investment Calculator</span>
              </a>
              <a href="/Financial/inflation-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                📆 <span>Inflation Calculator</span>
              </a>
              <a href="/Financial/finance-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                💼 <span>Finance Calculator</span>
              </a>
              <a href="/Financial/income-tax-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                🧾 <span>Income Tax Calculator</span>
              </a>
              <a href="/Financial/compound-interest-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                💲 <span>Compound Interest Calculator</span>
              </a>
              <a href="/Financial/salary-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                👔 <span>Salary Calculator</span>
              </a>
              <a href="/Financial/interest-rate-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                📉 <span>Interest Rate Calculator</span>
              </a>
              <a href="/Financial/sales-tax-calculator" className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
                🧾 <span>Sales Tax Calculator</span>
              </a>
            </div>
          </div>
          </div>
        
        {/* Main Content */}
        <div className="flex-1 lg:ml-64 p-4 md:p-6 -mt-15">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Amortization Calculator 
</h1>
            <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
             An amortization calculator helps determine how loan payments are divided between principal and interest over time.
            </p>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium text-right">
                Result
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Input Section */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <label className="sm:w-32 text-sm font-medium">Loan Amount</label>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm"></span>
                        <input
                          type="number"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full sm:w-32 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <label className="sm:w-32 text-sm font-medium">Loan Term</label>
                      <div className="flex flex-wrap gap-2">
                        <input
                          type="number"
                          value={loanTermYears}
                          onChange={(e) => setLoanTermYears(Number(e.target.value))}
                          className="w-20 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <span className="text-xs text-gray-500 self-center">years</span>
                        <input
                          type="number"
                          value={loanTermMonths}
                          onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                          className="w-20 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <span className="text-xs text-gray-500 self-center">months</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <label className="sm:w-32 text-sm font-medium">Interest Rate</label>
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          step="0.01"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <label className="sm:w-32 text-sm font-medium">Extra Payment</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={makeExtraPayments}
                          onChange={(e) => setMakeExtraPayments(e.target.checked)}
                          className="rounded"
                        />
                        {makeExtraPayments && (
                          <div className="flex items-center space-x-1">
                            <span className="text-sm"></span>
                            <input
                              type="number"
                              value={extraPayment}
                              onChange={(e) => setExtraPayment(Number(e.target.value))}
                              className="w-24 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <button
                        onClick={calculateAmortization}
                        className="bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                      >
                        ⚡ Calculate Amortization
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
                <div className="w-full lg:w-80 bg-gray-50 p-4 md:p-6 border-t lg:border-t-0 lg:border-l">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Result</h3>
                  </div>
                  {results ? (
                    <div>
                      <div className="text-center mb-6">
                        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                          {formatCurrency(results.monthlyPayment)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Monthly Payment
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Total of Payments</span>
                          <span className="font-semibold text-blue-600">{formatCurrency(results.totalPayments)}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Total Interest</span>
                          <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Principal %</span>
                          <span className="font-semibold text-orange-500">{results.principalPercentage}%</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Interest %</span>
                          <span className="font-semibold text-red-500">{results.interestPercentage}%</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Payoff Time</span>
                          <span className="font-semibold text-gray-600">{results.payoffTime} years</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Loan Amount</span>
                          <span className="font-semibold text-purple-500">{formatCurrency(loanAmount)}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                        <strong>Note:</strong> Amortization calculations are estimates based on fixed rates. 
                        Actual payments may vary with adjustable rates or additional fees.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-sm py-8">
                      Enter loan details and click "Calculate Amortization" to see results
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amortization Quick Tips */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Amortization Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Keep in mind your payment schedule for budgeting as it shows your monthly commitment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Extra principal payments help reduce total interest and shorten loan term significantly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Interest rates can vary by 10%. Understand lenders with similar terms can offer different rates</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Good credit history has beneficial effects, reducing interest rates and improving loan terms</span>
                </li>
              </ul>
            </div>

            {/* Accuracy & Limitations */}
            <div className="mt-6 bg-gray-900 text-white rounded-lg p-4 md:p-6">
              <h3 className="text-lg font-bold mb-3">Accuracy & Limitations</h3>
              <p className="text-sm leading-relaxed">
                Amortization calculations are mathematical estimates that work well for loan planning 
                but may not account for all fees, insurance, or rate changes. For 
                the most accurate assessment, consider consulting with financial advisors and 
                loan specialists.
              </p>
            </div>

            {/* Understanding Your Amortization Schedule */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Understanding Your Amortization Schedule</h2>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                Your Amortization Schedule represents the systematic repayment of a loan through regular payments over time. Think of it as the payment roadmap 
                - showing how each payment is divided between principal and interest, and how the loan balance decreases.
              </p>
              
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4">
                <strong>Amortization</strong> means that early payments consist mostly of interest, while later payments apply more toward principal. 
                This front-loaded interest structure is due to interest being calculated on the remaining loan balance.
              </p>

              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                Understanding your <strong>amortization schedule</strong> is crucial for financial planning, budgeting, and debt management. It provides insight into 
                total interest costs, payment timing, and the impact of extra payments on loan payoff acceleration.
              </p>
            </div>

            {/* Amortization Calculation Methods */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Amortization Calculation Methods</h2>
              
              <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold mb-3 bg-gray-50 p-3 rounded">Standard Amortization Formula (Recommended)</h3>
                <div className="bg-gray-50 p-4 rounded mb-2 overflow-x-auto">
                  <div className="text-xs md:text-sm">
                    <div><strong>Payment:</strong> P[r(1+r)^n]/[(1+r)^n-1]</div>
                    <div><strong>Where:</strong> P = Principal, r = Monthly rate, n = Number of payments</div>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  Standard formula used by most lenders for fixed-rate loans with equal monthly payments.
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-base md:text-lg font-semibold mb-3 bg-gray-50 p-3 rounded">Interest-Only Method</h3>
                <div className="bg-gray-50 p-4 rounded mb-2">
                  <div className="text-xs md:text-sm">
                    <div><strong>Initial Period:</strong> Payment = Principal × Monthly Interest Rate</div>
                    <div><strong>Amortization Period:</strong> Higher payments to cover principal</div>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  Lower initial payments but higher overall interest costs. Common in adjustable-rate mortgages.
                </p>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold mb-3 bg-gray-50 p-3 rounded">Accelerated Payment Method</h3>
                <div className="bg-gray-50 p-4 rounded mb-2">
                  <div className="text-xs md:text-sm">
                    <strong>Extra principal payments reduce total interest and loan term</strong>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600">
                  Additional payments toward principal significantly reduce total interest paid and shorten loan duration.
                </p>
              </div>
            </div>

            {/* Using Your Amortization for Financial Planning */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Using Your Amortization for Financial Planning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="font-semibold text-green-800 mb-2">Budget Planning</h3>
                  <p className="text-sm text-gray-700">
                    Use monthly payment amounts 
                    to create accurate budgets 
                    and ensure affordability 
                    over the loan term.
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-blue-800 mb-2">Interest Analysis</h3>
                  <p className="text-sm text-gray-700">
                    Compare total interest costs 
                    across different loan terms 
                    and rates to find optimal 
                    financing options.
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-purple-800 mb-2">Payoff Strategy</h3>
                  <p className="text-sm text-gray-700">
                    Plan extra payments and 
                    refinancing strategies to 
                    minimize interest costs 
                    and accelerate payoff.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> Amortization calculations provide estimates for planning purposes. Actual loan terms may vary based on lender policies, fees, and market conditions. 
                  Always verify calculations with lenders and consider professional financial advice for major borrowing decisions.
                </p>
              </div>
            </div>

            {/* Factors That Influence Your Amortization */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Factors That Influence Your Amortization</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Loan Amount (Principal)</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Higher loan amounts result in larger monthly payments and more total interest 
                    paid over the life of the loan, assuming same rate and term.
                  </p>

                  <h3 className="font-semibold text-gray-900 mb-3">Interest Rate</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Even small rate differences significantly impact total interest costs. 
                    Lower rates mean more principal payment in each installment.
                  </p>

                  <h3 className="font-semibold text-gray-900 mb-3">Loan Term</h3>
                  <p className="text-sm text-gray-700">
                    Longer terms mean lower monthly payments but higher total interest. 
                    Shorter terms increase monthly burden but reduce total cost.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Payment Frequency</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Bi-weekly payments instead of monthly can significantly reduce total interest 
                    by making one extra payment per year toward principal.
                  </p>

                  <h3 className="font-semibold text-gray-900 mb-3">Extra Payments</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Additional principal payments dramatically reduce total interest and 
                    loan term, with larger impact from early extra payments.
                  </p>

                  <h3 className="font-semibold text-gray-900 mb-3">Loan Type</h3>
                  <p className="text-sm text-gray-700">
                    Fixed-rate loans have predictable amortization schedules, while adjustable-rate 
                    loans change payment amounts as rates fluctuate.
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

export default AmortizationCalculator;