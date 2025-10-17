import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator,  } from 'lucide-react';

const InflationCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // CPI Calculator inputs
  const [cpiAmount, setCpiAmount] = useState(100);
  const [cpiFromMonth, setCpiFromMonth] = useState('Average');
  const [cpiFromYear, setCpiFromYear] = useState(2010);
  const [cpiToMonth, setCpiToMonth] = useState('August');
  const [cpiToYear, setCpiToYear] = useState(2025);
  const [cpiResult, setCpiResult] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("Unknown");

  // Forward Flat Rate Calculator inputs
  const [forwardAmount, setForwardAmount] = useState(100);
  const [forwardRate, setForwardRate] = useState(3);
  const [forwardYears, setForwardYears] = useState(10);
  const [forwardResult, setForwardResult] = useState(0);

  // Backward Flat Rate Calculator inputs
  const [backwardAmount, setBackwardAmount] = useState(100);
  const [backwardRate, setBackwardRate] = useState(3);
  const [backwardYears, setBackwardYears] = useState(10);
  const [backwardResult, setBackwardResult] = useState(0);

  const months = [
    'Average', 'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
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

  const generateYears = () => {
    const years = [];
    for (let year = 2025; year >= 1913; year--) {
      years.push(year);
    }
    return years;
  };

  const getCPIData = (month, year) => {
    const baseYear = 1913;
    const baseRate = 0.03;
    const yearDiff = year - baseYear;
    return 10 * Math.pow(1 + baseRate, yearDiff);
  };

  const calculateCPI = () => {
    const fromCPI = getCPIData(cpiFromMonth, cpiFromYear);
    const toCPI = getCPIData(cpiToMonth, cpiToYear);
    const inflationMultiplier = toCPI / fromCPI;
    const result = cpiAmount * inflationMultiplier;
    setCpiResult(result);
  };

  const calculateForward = () => {
    const rate = forwardRate / 100;
    const result = forwardAmount * Math.pow(1 + rate, forwardYears);
    setForwardResult(result);
  };

  const calculateBackward = () => {
    const rate = backwardRate / 100;
    const result = backwardAmount / Math.pow(1 + rate, backwardYears);
    setBackwardResult(result);
  };

  const clearCPI = () => {
    setCpiAmount(0);
    setCpiFromMonth('Average');
    setCpiFromYear(1913);
    setCpiToMonth('Average');
    setCpiToYear(1913);
    setCpiResult(0);
  };

  const clearForward = () => {
    setForwardAmount(0);
    setForwardRate(0);
    setForwardYears(0);
    setForwardResult(0);
  };

  const clearBackward = () => {
    setBackwardAmount(0);
    setBackwardRate(0);
    setBackwardYears(0);
    setBackwardResult(0);
  };

  return (
    <>
     <Head>
        <title>Inflation Calculator | Free Online Inflation Rate Tool
</title>
        <meta
          name="description"
          content="Use our free Inflation Calculator to measure the impact of inflation on your money. Calculate real value, future costs, and purchasing power easily.
"
        />
        <meta name="keywords" content="Inflation Calculator, Online Inflation Calculator, Inflation Rate Calculator, CPI Inflation Calculator, Inflation Adjustment Calculator, Real Value Calculator, Cost of Living Calculator, Money Value Calculator, Historical Inflation Calculator, Free Inflation Calculator
" />
     
      </Head>
    <div className="min-h-screen bg-gray-100">
      <Header/>
      
      

      <div className="flex pt-14">
        

        {/* Left Sidebar */}
        <div className={`fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
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
        <div className="flex-1 lg:ml-64 -mt-15">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="bg-gray-900 text-white p-4 md:p-6 rounded-t-lg">
                <h1 className="text-xl md:text-2xl font-bold mb-2">Inflation Calculator
</h1>
                <p className="text-gray-100 text-xs md:text-sm">
                  An Inflation Calculator helps estimate the future value or past value of money based on inflation rates.
                </p>
              </div>

              {/* CPI Calculator */}
              <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Inflation Calculator with “Country-wise Inflation Analysis”</h2>
                <p className="mb-6 text-gray-700 text-xs md:text-sm">
                  Determine the adjusted value of the U.S. dollar from 1913 to 2025, based on historical average Consumer Price Index (CPI) data for all urban consumers nationwide.
                </p>

                <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                  <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 flex-wrap text-sm md:text-base">
                    <span></span>
                    <input
                      type="number"
                      value={cpiAmount}
                      onChange={(e) => setCpiAmount(Number(e.target.value))}
                      className="w-16 text-gray-900 md:w-20 px-2 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                    />
                    <span className="text-xl md:text-2xl text-gray-900">in</span>
                    <select
                      value={cpiFromMonth}
                      onChange={(e) => setCpiFromMonth(e.target.value)}
                      className="px-2 text-gray-900  md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={cpiFromYear}
                      onChange={(e) => setCpiFromYear(Number(e.target.value))}
                      className="px-2 text-gray-900 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                    >
                      {generateYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="text-xl md:text-2xl text-gray-900 "> =</span>
                    <span className="text-xl md:text-2xl text-green-600 font-bold">?</span>
                    <span className=" text-xl md:text-2xl text-gray-900" >in</span>
                    <select
                      value={cpiToMonth}
                      onChange={(e) => setCpiToMonth(e.target.value)}
                      className="px-2 text-gray-900 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={cpiToYear}
                      onChange={(e) => setCpiToYear(Number(e.target.value))}
                      className="px-2 text-gray-900 md:px-3 py-2 border border-gray900 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                    >
                      {generateYears().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={calculateCPI}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors"
                    >
                      Calculate
                    </button>
                    <button
                      onClick={clearCPI}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold transition-colors"
                    >
                      Clear
                    </button>
                  </div>

                  {cpiResult > 0 && (
                    <div className="mt-6 p-4 text-gray-900 bg-gray-300 rounded-lg text-center border border-gray-300">
                      <p className="text-sm md:text-lg">
                        <strong>{formatCurrency(cpiAmount)}</strong> in {cpiFromMonth} {cpiFromYear} is equivalent to 
                        <strong className="text-gray-900"> {formatCurrency(cpiResult)}</strong> in {cpiToMonth} {cpiToYear}
                      </p>
                    </div>
                  )}
                </div>

                {/* Forward Calculator */}
                <div className="mt-8">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Forward Flat Rate Inflation Calculator</h3>
                  <p className="mb-4 text-gray-900 text-xs md:text-sm">
                   Calculates the future value of money based on an average inflation rate over a specified number of years.
                  </p>

                  <div className=" p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 flex-wrap text-sm md:text-base">
                      <span></span>
                      <input
                        type="number"
                        value={forwardAmount}
                        onChange={(e) => setForwardAmount(Number(e.target.value))}
                        className="w-16  text-gray-900 md:w-20 px-2 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                      />
                      <span className="hidden sm:inline text-gray-900">with inflation rate</span>
                      <span className="sm:hidden text-gray-900">@</span>
                      <input
                        type="number"
                        step="0.1"
                        value={forwardRate}
                        onChange={(e) => setForwardRate(Number(e.target.value))}
                        className="w-12 text-gray-900 md:w-16 px-2 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                      />
                      <span  className="w-12 text-gray-900">% after</span>
                      <input
                        type="number"
                        value={forwardYears}
                        onChange={(e) => setForwardYears(Number(e.target.value))}
                        className="w-12 text-gray-900 md:w-16 px-2 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                      />
                      <span  className="w-12 text-gray-900">years</span>
                      <span className="w-12 text-gray-900">=</span>
                      <span className="text-xl md:text-2xl text-green-600 font-bold">?</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={calculateForward}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors"
                      >
                        Calculate
                      </button>
                      <button
                        onClick={clearForward}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    {forwardResult > 0 && (
                      <div className="mt-6 p-4 text-gray-900 bg-gray-300 rounded-lg text-center border border-gray-300">
                        <p className="text-sm md:text-lg">
                          <strong>{formatCurrency(forwardAmount)}</strong> with {forwardRate}% inflation for {forwardYears} years will be worth 
                          <strong className="text-gray-900"> {formatCurrency(forwardResult)}</strong>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Backward Calculator */}
                <div className="mt-8">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4">Backward Flat Rate Inflation Calculator</h3>
                  <p className="mb-4 text-gray-700 text-xs md:text-sm">
                    Calculates the equivalent purchasing power of an amount some years ago based on a certain 
                    average inflation rate.
                  </p>

                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 flex-wrap text-sm md:text-base">
                      <span></span>
                      <input
                        type="number"
                        value={backwardAmount}
                        onChange={(e) => setBackwardAmount(Number(e.target.value))}
                        className="w-16 text-gray-900 md:w-20 px-2 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                      />
                      <span className="hidden sm:inline text-gray-900">with inflation rate</span>
                      <span className="sm:hidden text-gray-900">@</span>
                      <input
                        type="number"
                        step="0.1"
                        value={backwardRate}
                        onChange={(e) => setBackwardRate(Number(e.target.value))}
                        className="w-12 md:w-16 text-gray-900 px-2 md:px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                      />
                      <span className="text-gray-900" >%</span>
                      <span className=" text-gray-900">=</span>
                      <span className="text-xl md:text-2xl text-green-600 font-bold">?</span>
                      <input
                        type="number"
                        value={backwardYears}
                        onChange={(e) => setBackwardYears(Number(e.target.value))}
                        className="w-12 md:w-16 text-gray-900 px-2 md:px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 text-sm"
                      />
                      <span  className=" text-xl md: text-gray-900">years ago</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={calculateBackward}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition-colors"
                      >
                        Calculate
                      </button>
                      <button
                        onClick={clearBackward}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded font-semibold transition-colors"
                      >
                        Clear
                      </button>
                    </div>

                    {backwardResult > 0 && (
                      <div className="mt-6 p-4 text-gray-900 bg-gray-300 rounded-lg text-center border border-gray-200">
                        <p className="text-sm md:text-lg">
                          <strong>{formatCurrency(backwardAmount)}</strong> today had the purchasing power of 
                          <strong className="text-gray-600"> {formatCurrency(backwardResult)}</strong> {backwardYears} years ago at {backwardRate}% inflation
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Inflation Information */}
                <div className="mt-8 bg-gray-50 p-4 md:p-6 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-3">How to Protect Against Inflation</h3>
                  <p className="mb-3 text-gray-900">
                    Inflation most impacts people holding large amounts of cash. Common inflation hedges include:
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-gray-900">
                    <li><strong>Real Estate</strong> - Property values often increase with inflation</li>
                    <li><strong>Stocks</strong> - Companies can often raise prices with inflation</li>
                    <li><strong>Commodities</strong> - Gold, silver, oil have intrinsic value that tends to rise with inflation</li>
                    <li><strong>TIPS</strong> - Treasury Inflation-Protected Securities adjust with CPI changes</li>
                    <li><strong>Foreign Currency</strong> - Diversification into stable foreign currencies</li>
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

export default InflationCalculator;