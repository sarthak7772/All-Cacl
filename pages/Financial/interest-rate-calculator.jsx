
                      import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { TrendingUp, Percent, Calculator,  } from 'lucide-react';

const InterestRateCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState('loan-payment');
  const [loanAmount, setLoanAmount] = useState(32000);
  const [loanTermYears, setLoanTermYears] = useState(3);
  const [loanTermMonths, setLoanTermMonths] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(960);
  const [knownRate, setKnownRate] = useState(5.5);
  const [totalInterest, setTotalInterest] = useState(2560);
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("Unknown");
  
  const [results, setResults] = useState({
    interestRate: 0,
    totalPayments: 0,
    totalInterest: 0,
    monthlyPayment: 0,
    effectiveRate: 0
  });
  const [showResults, setShowResults] = useState(false);

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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    } catch (error) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0);
    }
  };

  const calculateInterestRate = () => {
    let calculatedResults = {
      interestRate: 0,
      totalPayments: 0,
      totalInterest: 0,
      monthlyPayment: 0,
      effectiveRate: 0
    };

    const totalMonths = loanTermYears * 12 + loanTermMonths;

    if (calculationMethod === 'loan-payment') {
      const totalAmount = monthlyPayment * totalMonths;
      const totalInterestAmount = totalAmount - loanAmount;
      
      let rate = 0.05;
      const tolerance = 0.0001;
      let iteration = 0;
      const maxIterations = 100;

      while (iteration < maxIterations) {
        const monthlyRate = rate / 12;
        const factor = Math.pow(1 + monthlyRate, totalMonths);
        const calculatedPayment = loanAmount * (monthlyRate * factor) / (factor - 1);
        
        if (Math.abs(calculatedPayment - monthlyPayment) < tolerance) {
          break;
        }

        const delta = 0.0001;
        const monthlyRateDelta = (rate + delta) / 12;
        const factorDelta = Math.pow(1 + monthlyRateDelta, totalMonths);
        const calculatedPaymentDelta = loanAmount * (monthlyRateDelta * factorDelta) / (factorDelta - 1);
        const derivative = (calculatedPaymentDelta - calculatedPayment) / delta;
        
        rate = rate - (calculatedPayment - monthlyPayment) / derivative;
        iteration++;
      }

      calculatedResults = {
        interestRate: (rate * 100).toFixed(3),
        totalPayments: totalAmount.toFixed(2),
        totalInterest: totalInterestAmount.toFixed(2),
        monthlyPayment: monthlyPayment.toFixed(2),
        effectiveRate: (rate * 100).toFixed(3)
      };

    } else if (calculationMethod === 'total-interest') {
      const totalAmount = loanAmount + totalInterest;
      const monthlyPmt = totalAmount / totalMonths;
      const simpleRate = (totalInterest / loanAmount / (totalMonths / 12)) * 100;
      
      calculatedResults = {
        interestRate: simpleRate.toFixed(3),
        totalPayments: totalAmount.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        monthlyPayment: monthlyPmt.toFixed(2),
        effectiveRate: simpleRate.toFixed(3)
      };
    } else if (calculationMethod === 'known-rate') {
      const monthlyRate = knownRate / 100 / 12;
      const factor = Math.pow(1 + monthlyRate, totalMonths);
      const payment = loanAmount * (monthlyRate * factor) / (factor - 1);
      const totalAmount = payment * totalMonths;
      const totalInterestAmount = totalAmount - loanAmount;
      
      calculatedResults = {
        interestRate: knownRate.toFixed(3),
        totalPayments: totalAmount.toFixed(2),
        totalInterest: totalInterestAmount.toFixed(2),
        monthlyPayment: payment.toFixed(2),
        effectiveRate: knownRate.toFixed(3)
      };
    }

    setResults(calculatedResults);
    setShowResults(true);
  };

  const clearForm = () => {
    setLoanAmount(0);
    setLoanTermYears(0);
    setLoanTermMonths(0);
    setMonthlyPayment(0);
    setKnownRate(0);
    setTotalInterest(0);
    setCalculationMethod('loan-payment');
    setResults({
      interestRate: 0,
      totalPayments: 0,
      totalInterest: 0,
      monthlyPayment: 0,
      effectiveRate: 0
    });
    setShowResults(false);
  };

  const getCurrentRatePhase = () => {
    const rate = parseFloat(results.interestRate) || 0;
    if (rate <= 3) return { phase: 1, label: 'Excellent Rate', color: 'bg-green-600' };
    if (rate <= 6) return { phase: 2, label: 'Good Rate', color: 'bg-blue-600' };
    if (rate <= 10) return { phase: 3, label: 'Average Rate', color: 'bg-yellow-600' };
    return { phase: 4, label: 'High Rate', color: 'bg-red-600' };
  };

  return (
    <>
      <Head>
        <title>Interest Rate Calculator | Free Online Interest Tool</title>
        <meta
          name="description"
          content="Use our free Interest Rate Calculator to quickly estimate loan and savings interest rates. Accurate, fast, and easy-to-use interest rate calculations online."
        />
        <meta name="keywords" content="Interest Rate Calculator, Online Interest Rate Calculator, Loan Interest Rate Calculator, Savings Interest Rate Calculator, Free Interest Rate Calculator, Interest Calculator, Compound Interest Rate Calculator, Simple Interest Rate Calculator, Mortgage Interest Rate Calculator, Bank Interest Rate Calculator" />
      </Head>
      
      <div className="min-h-screen" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <Header/>
       
        <div className="flex pt-16 md:pt-20">
          

          {/* Left Sidebar */}
          <div className={`fixed top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div style={{backgroundColor: '#111827'}} className="text-white p-3">
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
          <div className="flex-1 lg:ml-64 px-4 md:px-6 py-6 md:py-8 -mt-15">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 md:mb-8 text-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style={{color: '#111827'}}>
                  Interest Rate Calculator 
                </h2>
                <p className="text-sm md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  An Interest Rate Calculator is a tool that helps determine the rate of interest applied to a loan or investment based on the principal, time period, and interest amount.
                </p>
              </div>

              <div className="mb-6 md:mb-8 p-3 md:p-4 rounded-2xl text-white text-center shadow-lg" style={{backgroundColor: '#111827'}}>
                <span className="text-sm md:text-lg font-medium">"Interest rates directly affect the cost of borrowing and the growth of savings."</span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
                <div className="xl:col-span-5">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8 space-y-6">
                    <h3 className="text-lg md:text-xl font-bold flex items-center mb-4 md:mb-6" style={{color: '#111827'}}>
                      <Percent className="w-5 h-5 mr-2" />
                      Loan Parameters
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Calculate Based On</label>
                        <select 
                          value={calculationMethod}
                          onChange={(e) => setCalculationMethod(e.target.value)}
                          className="w-full text-gray-900 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg "
                        >
                          <option value="loan-payment ">Loan Amount & Monthly Payment</option>
                          <option value="total-interest">Loan Amount & Total Interest</option>
                          <option value="known-rate">Known Interest Rate</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Loan Amount</label>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-900"></span>
                          <input
                            type="number"
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                            className="flex-1 px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg "
                            step="100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Loan Term</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={loanTermYears}
                              onChange={(e) => setLoanTermYears(parseInt(e.target.value) || 0)}
                              className="w-full px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-base md:text-lg"
                            />
                            <span className="mt-1 text-xs md:text-sm text-gray-900 text-center">years</span>
                          </div>
                          <div className="flex flex-col">
                            <input
                              type="number"
                              value={loanTermMonths}
                              onChange={(e) => setLoanTermMonths(parseInt(e.target.value) || 0)}
                              className="w-full px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-base md:text-lg"
                              max="11"
                            />
                            <span className="mt-1 text-xs md:text-sm text-gray-900 text-center">months</span>
                          </div>
                        </div>
                      </div>

                      {calculationMethod === 'loan-payment' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Monthly Payment</label>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-500"></span>
                            <input
                              type="number"
                              value={monthlyPayment}
                              onChange={(e) => setMonthlyPayment(parseFloat(e.target.value) || 0)}
                              className="flex-1 px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-base md:text-lg"
                              step="10"
                            />
                          </div>
                        </div>
                      )}

                      {calculationMethod === 'total-interest' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Total Interest Amount</label>
                          <div className="flex items-center">
                            <span className="mr-2 text-gray-900"></span>
                            <input
                              type="number"
                              value={totalInterest}
                              onChange={(e) => setTotalInterest(parseFloat(e.target.value) || 0)}
                              className="flex-1 text-gray-900 px-3 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg "
                              step="100"
                            />
                          </div>
                        </div>
                      )}

                      {calculationMethod === 'known-rate' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">Interest Rate</label>
                          <div className="flex items-center">
                            <input
                              type="number"
                              value={knownRate}
                              onChange={(e) => setKnownRate(parseFloat(e.target.value) || 0)}
                              className="flex-1 px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg "
                              step="0.1"
                            />
                            <span className="ml-2 text-gray-900">%</span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                        <button
                          onClick={calculateInterestRate}
                          style={{backgroundColor: '#43A047'}}
                          className="flex-1 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Calculate
                        </button>
                        <button
                          onClick={clearForm}
                      className="px-4 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-7">
                  {showResults && parseFloat(results.interestRate) > 0 ? (
                    <>
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8 mb-6">
                        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6" style={{color: '#800000'}}>Interest Rate Results</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b text-sm md:text-base">
                              <span className="font-medium text-gray-700">Interest Rate:</span>
                              <span className="text-xl md:text-2xl font-bold" style={{color: '#800000'}}>{results.interestRate}%</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b text-sm md:text-base">
                              <span className="font-medium text-gray-700">Monthly Payment:</span>
                              <span className="font-bold text-gray-800">{formatCurrency(results.monthlyPayment)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b text-sm md:text-base">
                              <span className="font-medium text-gray-700">Loan Amount:</span>
                              <span className="font-bold text-gray-800">{formatCurrency(loanAmount)}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b text-sm md:text-base">
                              <span className="font-medium text-gray-700">Total Payments:</span>
                              <span className="font-bold text-gray-800">{formatCurrency(results.totalPayments)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b text-sm md:text-base">
                              <span className="font-medium text-gray-700">Total Interest:</span>
                              <span className="font-bold text-red-600">{formatCurrency(results.totalInterest)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b text-sm md:text-base">
                              <span className="font-medium text-gray-700">Loan Term:</span>
                              <span className="font-bold text-gray-800">{loanTermYears}y {loanTermMonths}m</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 md:mt-8">
                          <h4 className="font-bold text-center text-gray-800 mb-4 text-sm md:text-base">Payment Breakdown</h4>
                          <div className="flex flex-col md:flex-row items-center justify-center">
                            <div className="relative w-32 h-32 md:w-40 md:h-40">
                              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="50" cy="50" r="40"
                                  fill="transparent"
                                  stroke="#800000"
                                  strokeWidth="20"
                                  strokeDasharray={`${(loanAmount / parseFloat(results.totalPayments) * 251.2).toFixed(1)} 251.2`}
                                />
                                <circle
                                  cx="50" cy="50" r="40"
                                  fill="transparent"
                                  stroke="#16a34a"
                                  strokeWidth="20"
                                  strokeDasharray={`${(parseFloat(results.totalInterest) / parseFloat(results.totalPayments) * 251.2).toFixed(1)} 251.2`}
                                  strokeDashoffset={`-${(loanAmount / parseFloat(results.totalPayments) * 251.2).toFixed(1)}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-xs md:text-sm text-gray-800 font-bold">{results.interestRate}%</div>
                                </div>
                              </div>
                            </div>
                            <div className="ml-0 md:ml-6 mt-4 md:mt-0 space-y-2 text-xs md:text-sm">
                              <div className="flex items-center">
                                <div className="w-4 h-4 rounded mr-2" style={{backgroundColor: '#800000'}}></div>
                                <span className="text-gray-900">Principal ({Math.round((loanAmount / parseFloat(results.totalPayments)) * 100)}%)</span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                                <span className="text-gray-900">Interest ({Math.round((parseFloat(results.totalInterest) / parseFloat(results.totalPayments)) * 100)}%)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8">
                        <h3 className="text-base md:text-lg font-bold mb-4" style={{color: '#800000'}}>Rate Classification</h3>
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-center flex-1">
                            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 ${getCurrentRatePhase().phase >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                            <div className="text-xs text-gray-800 font-medium">Excellent</div>
                            <div className="text-xs text-gray-800">0-3%</div>
                          </div>
                          <div className="text-center flex-1">
                            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 ${getCurrentRatePhase().phase >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                            <div className="text-xs text-gray-800 font-medium">Good</div>
                            <div className="text-xs text-gray-800">3-6%</div>
                          </div>
                          
                        <div className="text-center flex-1">
                          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 ${getCurrentRatePhase().phase >= 3 ? 'bg-yellow-600' : 'bg-gray-300'}`}></div>
                          <div className="text-xs text-gray-800 font-medium">Average</div>
                          <div className="text-xs text-gray-800">6-10%</div>
                        </div>
                        <div className="text-center flex-1">
                          <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full mx-auto mb-2 ${getCurrentRatePhase().phase >= 4 ? 'bg-red-600' : 'bg-gray-300'}`}></div>
                          <div className="text-xs text-gray-800 font-medium">High</div>
                          <div className="text-xs text-gray-800">10%+</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getCurrentRatePhase().color}`}
                          style={{ width: `${Math.min(100, (getCurrentRatePhase().phase / 4) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2 text-xs md:text-sm text-gray-600">
                        Your rate: {results.interestRate}% ({getCurrentRatePhase().label})
                      </div>
                    </div>

                    <div style={{backgroundColor: '#800000'}} className="text-white rounded-2xl p-4 md:p-6 mt-6">
                      <h3 className="font-bold text-sm md:text-lg mb-4">Interest Rate Tips</h3>
                      <div className="space-y-3 text-xs md:text-sm opacity-90">
                        <div className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                          <p>Shop around for the best rates from multiple lenders</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                          <p>Improve your credit score to qualify for lower rates</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                          <p>Consider shorter loan terms for lower total interest</p>
                        </div>
                        <div className="flex items-start">
                          <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                          <p>Compare APR, not just interest rates</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-16 text-center">
                    <TrendingUp className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-base md:text-lg">Enter your details and calculate to see results</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 md:mt-16 space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6" style={{color: '#111827'}}>
                  Understanding Interest Rates
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed text-sm md:text-base">
                  <p className="mb-4">
                    Interest rates represent the cost of borrowing money, expressed as a percentage of the loan amount. 
                    They directly impact your monthly payments and the total amount you'll repay over the loan's lifetime.
                  </p>
                  <p className="mb-4">
                    The interest rate you receive depends on multiple factors including your credit score, loan type, 
                    loan term, market conditions, and the lender's policies. Understanding these factors helps you 
                    negotiate better terms and make informed borrowing decisions.
                  </p>
                  <p>
                    Even small differences in interest rates can result in substantial savings or costs over time. 
                    For example, on a $30,000 loan over 5 years, a 1% rate difference could mean hundreds or even 
                    thousands of dollars in additional interest payments.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6" style={{color: '#111827'}}>Understanding Interest Rate Calculations</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-green-50 p-4 rounded border-l-4 border-green-600">
                    <div className="text-center mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg md:text-xl">
                        🧮
                      </div>
                    </div>
                    <h4 className="font-bold text-center mb-2 text-gray-900 text-sm md:text-base">Rate Calculation</h4>
                    <p className="text-xs text-gray-900 md:text-sm text-center">
                      Easily determine simple or compound interest on loans, deposits, or investments 
                      by entering principal, rate, and time period.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-600">
                    <div className="text-center mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg md:text-xl">
                        💵
                      </div>
                    </div>
                    <h4 className="font-bold text-center text-gray-900 mb-2 text-sm md:text-base">Financial Planning</h4>
                    <p className="text-xs text-gray-900  md:text-sm text-center">
                      Compare borrowing costs, savings returns, and investment opportunities 
                      to make informed financial decisions.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded border-l-4 border-red-600">
                    <div className="text-center mb-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-full mx-auto flex items-center justify-center text-white font-bold text-lg md:text-xl">
                        📊
                      </div>
                    </div>
                    <h4 className="font-bold text-center mb-2 text-gray-900  text-sm md:text-base">Result Insights</h4>
                    <p className="text-xs text-gray-900  md:text-sm text-center">
                      Analyze total interest paid, final maturity value, and repayment schedules 
                      to better plan your finances.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500">
                  <p className="text-xs text-gray-900  md:text-sm">
                    <strong>Note:</strong> Interest rate results are based on the inputs provided. Actual financial outcomes 
                    may differ due to market changes, taxes, fees, and other external factors. Always verify with your 
                    bank or financial advisor before making decisions.
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

export default InterestRateCalculator;