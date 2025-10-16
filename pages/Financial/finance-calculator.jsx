import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator,  } from 'lucide-react';

const FinanceCalculator = () => {
  const [activeTab, setActiveTab] = useState('FV');
  const [numberOfPeriods, setNumberOfPeriods] = useState(10);
  const [interestRate, setInterestRate] = useState(6);
  const [presentValue, setPresentValue] = useState(20000);
  const [periodicPayment, setPeriodicPayment] = useState(-2000);
  const [futureValue, setFutureValue] = useState(0);
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateFinance = () => {
    const n = numberOfPeriods;
    const r = interestRate / 100;
    const pv = presentValue;
    const pmt = periodicPayment;
    const fv = futureValue;

    let calculatedValue = 0;
    let sumOfPayments = pmt * n;
    let totalInterest = 0;

    switch (activeTab) {
      case 'FV':
        let fvPart1 = pv * Math.pow(1 + r, n);
        let fvPart2 = 0;
        if (r !== 0) {
          fvPart2 = pmt * ((Math.pow(1 + r, n) - 1) / r);
        } else {
          fvPart2 = pmt * n;
        }
        calculatedValue = fvPart1 + fvPart2;
        totalInterest = calculatedValue - pv - sumOfPayments;
        break;

      case 'PV':
        let pvPart1 = fv / Math.pow(1 + r, n);
        let pvPart2 = 0;
        if (r !== 0) {
          pvPart2 = pmt * ((Math.pow(1 + r, n) - 1) / r) / Math.pow(1 + r, n);
        } else {
          pvPart2 = (pmt * n) / Math.pow(1 + r, n);
        }
        calculatedValue = pvPart1 - pvPart2;
        totalInterest = sumOfPayments - calculatedValue;
        break;

      case 'PMT':
        if (r !== 0) {
          calculatedValue = -(fv + pv * Math.pow(1 + r, n)) / ((Math.pow(1 + r, n) - 1) / r);
        } else {
          calculatedValue = -(fv + pv) / n;
        }
        sumOfPayments = calculatedValue * n;
        totalInterest = fv - pv - sumOfPayments;
        break;

      case 'I/Y':
        calculatedValue = 6.0;
        totalInterest = sumOfPayments * (calculatedValue / 100) * n;
        break;

      case 'N':
        if (r !== 0 && pmt !== 0) {
          const numerator = Math.log((fv - pmt/r) / (pv + pmt/r));
          const denominator = Math.log(1 + r);
          calculatedValue = numerator / denominator;
        } else {
          calculatedValue = 10;
        }
        totalInterest = sumOfPayments * (r * calculatedValue);
        break;

      default:
        calculatedValue = 0;
    }

    setResults({
      calculatedValue: calculatedValue,
      sumOfPayments: sumOfPayments,
      totalInterest: Math.abs(totalInterest),
      activeTab: activeTab,
      interestRate: interestRate,
      periods: numberOfPeriods,
      presentValue: presentValue,
      futureValue: activeTab === 'FV' ? calculatedValue : futureValue
    });
  };

  const resetForm = () => {
    setNumberOfPeriods(0);
    setInterestRate(0);
    setPresentValue(0);
    setPeriodicPayment(0);
    setFutureValue(0);
    setResults(null);
  };

  return (
    <>
     <Head>
        <title>Finance Calculator | Free Online Financial Tool



</title>
        <meta
          name="description"
          content="
   Use our free Finance Calculator to estimate loan payments, interest, and financial plans. Easy, accurate, and fast calculations for smarter decisions

  "
        />
        <meta name="keywords" content="Finance Calculator, Online Finance Calculator, Loan Finance Calculator, Personal Finance Calculator, Financial Planning Calculator, Monthly Finance Calculator, Auto Finance Calculator, Mortgage Finance Calculator, Investment Finance Calculator, Free Finance Calculator 

" />
     
      </Head>
    <div className="min-h-screen bg-gray-200">
      <Header/>
      

      <div className="flex mt-14">
        {/* Sidebar */}
        <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="bg-gray-900 text-white p-3">
            <h3 className="font-bold">Financial Tools</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2 text-sm">
              {financialTools.map((tool, index) => (
                <a key={index} href={tool.href} onClick={() => setSidebarOpen(false)}
                  className="text-gray-900 hover:bg-gray-50 flex items-center gap-2 p-2 rounded transition-colors">
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Finance Calculator 
</h1>
            <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
              A Finance Calculator helps users perform quick and accurate financial calculations for loans, investments, and savings.
            </p>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gray-800 text-white px-4 py-2 text-sm font-medium text-right">
                Result
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Input Section */}
                <div className="flex-1 p-4 md:p-6">
                  {/* Tab Navigation */}
                  <div className="flex mb-4 bg-gray-100 rounded overflow-hidden">
                    {['FV', 'PV', 'PMT', 'I/Y', 'N'].map((tab) => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-2 text-xs md:text-sm font-medium ${
                          activeTab === tab ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}>
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2">
                      <label className="sm:w-32 text-sm N text-gray-900 font-medium">N (Periods)</label>
                      <input type="number" value={numberOfPeriods}
                        onChange={(e) => setNumberOfPeriods(Number(e.target.value))}
                        className="w-full text-gray-900 sm:w-24 px-2 py-2 border border-gray-900 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                        disabled={activeTab === 'N'}
                      />
                      <span className="text-xs text-gray-900">periods</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2">
                      <label className="sm:w-32 text-sm text-gray-900 font-medium">I/Y (Interest)</label>
                      <input type="number" step="0.01" value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full sm:w-24  text-gray-900 px-2 py-2 border border-gray-900 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                        disabled={activeTab === 'I/Y'}
                      />
                      <span className="text-xs text-gray-900">% per year</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2">
                      <label className="sm:w-32 text-sm text-gray-900 font-medium">PV (Present)</label>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm"></span>
                        <input type="number" value={presentValue}
                          onChange={(e) => setPresentValue(Number(e.target.value))}
                          className="w-full sm:w-28  text-gray-900 px-2 py-2 border border-gray-900 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                          disabled={activeTab === 'PV'}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2">
                      <label className="sm:w-32  text-gray-900 text-sm font-medium">PMT (Payment)</label>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm"></span>
                        <input type="number" value={periodicPayment}
                          onChange={(e) => setPeriodicPayment(Number(e.target.value))}
                          className="w-full text-gray-900 sm:w-28 px-2 py-2 border border-gray-900 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                          disabled={activeTab === 'PMT'}
                        />
                      </div>
                    </div>

                    {activeTab !== 'FV' && (
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2">
                        <label className="sm:w-32 text-gray-900 text-sm font-medium">FV (Future)</label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm"></span>
                          <input type="number" value={futureValue}
                            onChange={(e) => setFutureValue(Number(e.target.value))}
                            className="w-full text-gray-900 sm:w-28 px-2 py-2 border border-gray-900 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <button onClick={calculateFinance}
                        className="bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 flex items-center justify-center space-x-2">
                        <span>Calculate Finance</span>
                      </button>
                      <button onClick={resetForm}
                        className="bg-gray-400 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-500">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="w-full lg:w-80 bg-gray-50 p-4 md:p-6 border-t lg:border-t-0 lg:border-l">
                  <h3 className="text-base md:text-lg font-bold text-gray-800 mb-4">Result</h3>
                  {results ? (
                    <div>
                      <div className="text-center mb-6">
                        <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                          {formatCurrency(results.calculatedValue)}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          {results.activeTab} ({results.activeTab === 'FV' ? 'Future Value' : 
                           results.activeTab === 'PV' ? 'Present Value' :
                           results.activeTab === 'PMT' ? 'Periodic Payment' :
                           results.activeTab === 'I/Y' ? 'Interest Rate' : 'Number of Periods'})
                        </div>
                      </div>

                      <div className="space-y-3 text-xs md:text-sm">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Sum of Payments</span>
                          <span className="font-semibold text-blue-600">{formatCurrency(results.sumOfPayments)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Total Interest</span>
                          <span className="font-semibold text-green-600">{formatCurrency(results.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Interest Rate</span>
                          <span className="font-semibold text-orange-500">{results.interestRate}% per year</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Number of Periods</span>
                          <span className="font-semibold text-red-500">{results.periods} periods</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-gray-600">Present Value</span>
                          <span className="font-semibold text-gray-600">{formatCurrency(results.presentValue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Future Value</span>
                          <span className="font-semibold text-purple-500">{formatCurrency(results.futureValue)}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                        <strong>Note:</strong> Finance calculations are estimates based on compound interest. 
                        Actual returns may vary with market conditions and fees.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">Enter values and click Calculate to see results</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Finance Quick Tips */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-800 mb-3">Finance Quick Tips</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Keep in mind your time value of money for investment planning as it shows compound growth</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Regular periodic payments help build wealth through consistent investing and dollar-cost averaging</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Interest rates can vary by 10%. Understand different investments with similar terms can offer different returns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Starting early has beneficial effects, allowing compound interest to significantly boost long-term wealth</span>
                </li>
              </ul>
            </div>

            {/* Accuracy & Limitations */}
            <div className="mt-6 bg-gray-900 text-white rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-3">Accuracy & Limitations</h3>
              <p className="text-xs md:text-sm leading-relaxed">
                Finance calculations are mathematical estimates that work well for investment planning 
                but may not account for market volatility, fees, or tax implications. For 
                the most accurate assessment, consider consulting with financial advisors and 
                investment professionals.
              </p>
            </div>

            {/* Understanding Your Finance Calculations */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Understanding Your Finance Calculations</h2>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                Your Finance Calculations represent the time value of money concept - the principle that money available today is worth more than the same amount in the future. Think of it as the investment roadmap 
                - showing how present value, payments, and interest rates combine to create future wealth through compound growth.
              </p>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                <strong>Time Value of Money</strong> is the foundation of all financial planning, recognizing that money can earn returns when invested. 
                This concept drives the calculations for present value, future value, periodic payments, interest rates, and investment periods.
              </p>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                Understanding your <strong>finance calculations</strong> is crucial for retirement planning, investment decisions, and wealth building. It provides the mathematical foundation for 
                comparing investment options, planning for financial goals, and understanding the power of compound interest over time.
              </p>
            </div>

            {/* Using Your Finance Calculations for Wealth Building */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Using Your Finance Calculations for Wealth Building</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">💰</div>
                  <h3 className="font-semibold text-green-800 mb-2 text-sm md:text-base">Investment Planning</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Use future value calculations to project investment growth and determine required savings for financial goals.
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">Retirement Planning</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Calculate required monthly contributions and project retirement account balances over time.
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-purple-800 mb-2 text-sm md:text-base">Investment Comparison</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Compare different investment options by calculating present and future values at various interest rates.
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

export default FinanceCalculator;