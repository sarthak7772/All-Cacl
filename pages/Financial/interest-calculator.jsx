import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator,  PieChart, Home,  } from 'lucide-react';

const InterestCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(45000);
  const [annualContribution, setAnnualContribution] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [contributeTiming, setContributeTiming] = useState('beginning');
  const [interestRate, setInterestRate] = useState(5);
  const [compoundFrequency, setCompoundFrequency] = useState('annually');
  const [investmentLengthYears, setInvestmentLengthYears] = useState(5);
  const [investmentLengthMonths, setInvestmentLengthMonths] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [inflationRate, setInflationRate] = useState(3);

  const [endingBalance, setEndingBalance] = useState(0);
  const [totalPrincipal, setTotalPrincipal] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [interestOfInitial, setInterestOfInitial] = useState(0);
  const [interestOfContributions, setInterestOfContributions] = useState(0);
  const [buyingPowerEndBalance, setBuyingPowerEndBalance] = useState(0);
  const [accumulationSchedule, setAccumulationSchedule] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [country, setCountry] = useState("Unknown");

  const compoundingOptions = [
    { value: 'annually', label: 'annually', frequency: 1 },
    { value: 'semiannually', label: 'semi-annually', frequency: 2 },
    { value: 'quarterly', label: 'quarterly', frequency: 4 },
    { value: 'monthly', label: 'monthly', frequency: 12 },
    { value: 'weekly', label: 'weekly', frequency: 52 },
    { value: 'daily', label: 'daily', frequency: 365 },
    { value: 'continuously', label: 'continuously', frequency: 0 }
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

  const calculateCompoundInterest = () => {
    const totalYears = investmentLengthYears + investmentLengthMonths / 12;
    const r = interestRate / 100;
    const frequency = compoundingOptions.find(opt => opt.value === compoundFrequency)?.frequency || 1;
    
    let futureValue = 0;
    let totalContributionsAmount = 0;
    let schedule = [];

    if (compoundFrequency === 'continuously') {
      futureValue = initialInvestment * Math.exp(r * totalYears);
      
      const annualTotal = annualContribution + (monthlyContribution * 12);
      if (annualTotal > 0) {
        const contributionFV = (annualTotal / r) * (Math.exp(r * totalYears) - 1);
        futureValue += contributionFV;
      }
      totalContributionsAmount = annualTotal * totalYears;
    } else {
      const periodsPerYear = frequency;
      const totalPeriods = totalYears * periodsPerYear;
      const periodRate = r / periodsPerYear;
      
      futureValue = initialInvestment * Math.pow(1 + periodRate, totalPeriods);
      
      const annualTotal = annualContribution + (monthlyContribution * 12);
      totalContributionsAmount = annualTotal * totalYears;
      
      if (annualTotal > 0) {
        const contributionPerPeriod = annualTotal / periodsPerYear;
        let contributionFV = 0;
        
        if (contributeTiming === 'beginning') {
          contributionFV = contributionPerPeriod * 
            (((Math.pow(1 + periodRate, totalPeriods) - 1) / periodRate) * (1 + periodRate));
        } else {
          contributionFV = contributionPerPeriod * 
            ((Math.pow(1 + periodRate, totalPeriods) - 1) / periodRate);
        }
        
        futureValue += contributionFV;
      }
    }

    const scheduleData = [];
    let balance = initialInvestment;
    const annualTotal = annualContribution + (monthlyContribution * 12);
    
    for (let year = 1; year <= Math.ceil(totalYears); year++) {
      const yearRate = frequency > 0 ? Math.pow(1 + r / frequency, frequency) - 1 : Math.exp(r) - 1;
      
      if (contributeTiming === 'beginning' && year <= totalYears) {
        balance += annualTotal;
      }
      
      const interestEarned = balance * yearRate;
      balance += interestEarned;
      
      if (contributeTiming === 'end' && year <= totalYears) {
        balance += annualTotal;
      }
      
      scheduleData.push({
        year,
        deposit: year <= totalYears ? annualTotal : 0,
        interest: interestEarned,
        balance: balance
      });
      
      if (year >= totalYears) break;
    }

    const afterTaxEndingBalance = futureValue * (1 - taxRate / 100);
    const realValue = afterTaxEndingBalance / Math.pow(1 + inflationRate / 100, totalYears);

    const totalPrincipalAmount = initialInvestment + totalContributionsAmount;
    const totalInterestAmount = futureValue - totalPrincipalAmount;
    
    const interestOnInitial = frequency > 0 ? 
      initialInvestment * Math.pow(1 + r / frequency, totalYears * frequency) - initialInvestment :
      initialInvestment * Math.exp(r * totalYears) - initialInvestment;
    const interestOnContributions = Math.max(0, totalInterestAmount - interestOnInitial);

    setEndingBalance(afterTaxEndingBalance);
    setTotalPrincipal(totalPrincipalAmount);
    setTotalContributions(totalContributionsAmount);
    setTotalInterest(totalInterestAmount);
    setInterestOfInitial(interestOnInitial);
    setInterestOfContributions(interestOnContributions);
    setBuyingPowerEndBalance(realValue);
    setAccumulationSchedule(scheduleData);
    setShowResults(true);
  };

  const clearForm = () => {
    setInitialInvestment(0);
    setAnnualContribution(0);
    setMonthlyContribution(0);
    setContributeTiming('beginning');
    setInterestRate(0);
    setCompoundFrequency('annually');
    setInvestmentLengthYears(0);
    setInvestmentLengthMonths(0);
    setTaxRate(0);
    setInflationRate(0);
    setEndingBalance(0);
    setTotalPrincipal(0);
    setTotalContributions(0);
    setTotalInterest(0);
    setInterestOfInitial(0);
    setInterestOfContributions(0);
    setBuyingPowerEndBalance(0);
    setAccumulationSchedule([]);
    setShowResults(false);
  };

  return (
    <>
     <Head>
        <title>Interest Calculator | Free Online Interest Rate Tool</title>
        <meta
          name="description"
          content="Use our free Interest Calculator to quickly compute interest rates, total payments, and loan costs. Simple, accurate, and easy-to-use online tool."
        />
        <meta name="keywords" content="Interest Calculator, Online Interest Calculator, Simple Interest Calculator, Compound Interest Calculator, Loan Interest Calculator, Interest Rate Calculator, Savings Interest Calculator, Bank Interest Calculator, Monthly Interest Calculator, Free Interest Calculator" />
     
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
        <div className="flex-1 lg:ml-64 p-4 md:p-6 -mt-15">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="bg-gray-900 text-white p-4 md:p-6 rounded-t-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Home className="w-6 h-6 md:w-8 md:h-8" />
                  <h1 className="text-xl md:text-2xl font-bold">Interest Calculator</h1>
                </div>
                <p className="text-red-100 text-xs md:text-sm">
                  An Interest Calculator is a tool used to quickly calculate the simple or compound interest on a principal amount over a specified time period at a given rate of interest.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Input Form */}
              <div className="xl:col-span-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8 space-y-6">
                  <h3 className="text-lg md:text-xl font-bold flex items-center mb-6" style={{color: '#111827'}}>
                    <PieChart className="w-5 h-5 mr-2" />
                    Investment Parameters
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Investment</label>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500"></span>
                        <input
                          type="number"
                          value={initialInvestment}
                          onChange={(e) => setInitialInvestment(Number(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Contribution</label>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500"></span>
                        <input
                          type="number"
                          value={annualContribution}
                          onChange={(e) => setAnnualContribution(Number(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Monthly Contribution</label>
                      <div className="flex items-center">
                        <span className="mr-2 text-gray-500"></span>
                        <input
                          type="number"
                          value={monthlyContribution}
                          onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Contribute at the</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            value="beginning"
                            checked={contributeTiming === 'beginning'}
                            onChange={(e) => setContributeTiming(e.target.value)}
                            className="mr-2"
                          />
                          <span>Beginning</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            value="end"
                            checked={contributeTiming === 'end'}
                            onChange={(e) => setContributeTiming(e.target.value)}
                            className="mr-2"
                          />
                          <span>End</span>
                        </label>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">of each compounding period</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Interest Rate</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                        />
                        <span className="ml-2 text-gray-500">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Compound Frequency</label>
                      <select
                        value={compoundFrequency}
                        onChange={(e) => setCompoundFrequency(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                      >
                        {compoundingOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Investment Length</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <input
                            type="number"
                            min="0"
                            value={investmentLengthYears}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setInvestmentLengthYears(value >= 0 ? value : 0);
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                            placeholder="0"
                          />
                          <span className="mt-1 text-sm text-gray-600 text-center">years</span>
                        </div>
                        <div className="flex flex-col">
                          <input
                            type="number"
                            min="0"
                            max="11"
                            value={investmentLengthMonths}
                            onChange={(e) => {
                              let value = Number(e.target.value);
                              if (value < 0) value = 0;
                              if (value > 11) value = 11;
                              setInvestmentLengthMonths(value);
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                            placeholder="0"
                          />
                          <span className="mt-1 text-sm text-gray-600 text-center">months</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tax Rate</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          step="0.1"
                          value={taxRate}
                          onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                        />
                        <span className="ml-2 text-gray-500">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Inflation Rate</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          step="0.1"
                          value={inflationRate}
                          onChange={(e) => setInflationRate(Number(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-lg"
                        />
                        <span className="ml-2 text-gray-500">%</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                      <button
                        onClick={calculateCompoundInterest}
                        style={{backgroundColor: '#43A047'}}
                        className="flex-1 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                      >
                        Calculate
                      </button>
                      <button
                        onClick={clearForm}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-red-300 hover:text-red-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="xl:col-span-6">
                {showResults && endingBalance > 0 ? (
                  <>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8 mb-6">
                      <h3 className="text-lg md:text-xl font-bold mb-6" style={{color: '#800000'}}>Investment Results</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-700 text-sm md:text-base">Ending Balance:</span>
                            <span className="text-xl md:text-2xl font-bold" style={{color: '#800000'}}>{formatCurrency(endingBalance)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-700 text-sm md:text-base">Total Principal:</span>
                            <span className="font-bold text-sm md:text-base">{formatCurrency(totalPrincipal)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-700 text-sm md:text-base">Total Contributions:</span>
                            <span className="font-bold text-sm md:text-base">{formatCurrency(totalContributions)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="font-medium text-gray-700 text-sm md:text-base">Total Interest:</span>
                            <span className="font-bold text-green-600 text-sm md:text-base">{formatCurrency(totalInterest)}</span>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-700 text-sm md:text-base">Interest on Initial:</span>
                            <span className="font-bold text-sm md:text-base">{formatCurrency(interestOfInitial)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-700 text-sm md:text-base">Interest on Contributions:</span>
                            <span className="font-bold text-sm md:text-base">{formatCurrency(interestOfContributions)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-700 text-xs md:text-sm">After-Tax Balance:</span>
                            <span className="font-bold text-sm md:text-base">{formatCurrency(endingBalance)}</span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="font-medium text-gray-700 text-xs md:text-sm">Buying Power:</span>
                            <span className="font-bold text-sm md:text-base">{formatCurrency(buyingPowerEndBalance)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8">
                        <h4 className="font-bold text-center mb-4">Investment Breakdown</h4>
                        <div className="flex flex-col md:flex-row items-center justify-center">
                          <div className="relative w-40 h-40">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                              <circle
                                cx="50" cy="50" r="40"
                                fill="transparent"
                                stroke="#800000"
                                strokeWidth="20"
                                strokeDasharray={`${(initialInvestment / endingBalance * 251.2).toFixed(1)} 251.2`}
                              />
                              <circle
                                cx="50" cy="50" r="40"
                                fill="transparent"
                                stroke="#16a34a"
                                strokeWidth="20"
                                strokeDasharray={`${(totalContributions / endingBalance * 251.2).toFixed(1)} 251.2`}
                                strokeDashoffset={`-${(initialInvestment / endingBalance * 251.2).toFixed(1)}`}
                              />
                              <circle
                                cx="50" cy="50" r="40"
                                fill="transparent"
                                stroke="#dc2626"
                                strokeWidth="20"
                                strokeDasharray={`${(totalInterest / endingBalance * 251.2).toFixed(1)} 251.2`}
                                strokeDashoffset={`-${((initialInvestment + totalContributions) / endingBalance * 251.2).toFixed(1)}`}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-sm font-bold">{Math.round((totalInterest / endingBalance) * 100)}%</div>
                                <div className="text-xs">Interest</div>
                              </div>
                            </div>
                          </div>
                          <div className="ml-0 md:ml-6 mt-4 md:mt-0 space-y-2 text-sm">
                            <div className="flex items-center">
                              <div className="w-4 h-4 rounded mr-2" style={{backgroundColor: '#800000'}}></div>
                              <span>Initial ({Math.round((initialInvestment / endingBalance) * 100)}%)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                              <span>Contributions ({Math.round((totalContributions / endingBalance) * 100)}%)</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-4 h-4 bg-gray-900 rounded mr-2"></div>
                              <span>Interest ({Math.round((totalInterest / endingBalance) * 100)}%)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
              
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                      <div style={{backgroundColor: '#800000'}} className="text-white p-4">
                        <h3 className="font-bold">Accumulation Schedule</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="p-3 text-left font-semibold">Year</th>
                              <th className="p-3 text-left font-semibold">Deposit</th>
                              <th className="p-3 text-left font-semibold">Interest</th>
                              <th className="p-3 text-left font-semibold">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {accumulationSchedule.slice(0, 10).map((item, index) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="p-3">{item.year}</td>
                                <td className="p-3">{formatCurrency(item.deposit)}</td>
                                <td className="p-3 text-green-600">{formatCurrency(item.interest)}</td>
                                <td className="p-3 font-medium">{formatCurrency(item.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-16 text-center">
                    <Calculator className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-base md:text-lg">Enter your details and calculate to see results</p>
                  </div>
                )}
              </div>
            </div>

            {/* Using Interest Calculator Section */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">📈 Using Interest Calculator for Financial Planning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-2">➕</div>
                  <h3 className="font-semibold text-green-800 mb-2">Simple Interest</h3>
                  <p className="text-sm text-gray-700">
                    Quickly calculate interest earned or payable using the formula: 
                    <strong> (P × R × T) / 100</strong>.
                    <br /><br />
                    Useful for short-term loans, deposits, or investments.
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-2">🔄</div>
                  <h3 className="font-semibold text-blue-800 mb-2">Compound Interest</h3>
                  <p className="text-sm text-gray-700">
                    Estimate how money grows with compounding using:
                    <strong> A = P (1 + R/100)<sup>T</sup></strong>.
                    <br /><br />
                    Ideal for long-term savings, fixed deposits, or reinvested returns.
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-purple-800 mb-2">Financial Planning</h3>
                  <p className="text-sm text-gray-700">
                    Compare simple vs compound growth to make better decisions.
                    <br /><br />
                    Plan EMIs, savings, or retirement goals with accurate interest projections.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> Interest calculations provide estimates. 
                  Actual returns may vary based on compounding frequency, market conditions, 
                  and specific loan or investment agreements. Always verify with your bank or financial advisor.
                </p>
              </div>
            </div>

            {/* Investment Tips */}
            <div style={{ backgroundColor: "#111827" }} className="text-white rounded-2xl p-4 md:p-6 mt-6">
              <h3 className="font-bold text-base md:text-lg mb-4">Investment Tips</h3>
              <div className="space-y-3 text-xs md:text-sm opacity-90">
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                  <p>Start early to maximize compound interest benefits</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                  <p>Regular contributions build wealth through dollar-cost averaging</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                  <p>Consider tax implications on your investment returns</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                  <p>Factor in inflation for realistic buying power projections</p>
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

export default InterestCalculator;