import Head from "next/head";
import React, { useState, useEffect } from "react";
import Header from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Calculator,
  

} from "lucide-react";

const InvestmentCalculator = () => {
  const [startingAmount, setStartingAmount] = useState(40000);
  const [investmentLength, setInvestmentLength] = useState(10);
  const [lengthUnit, setLengthUnit] = useState("years");
  const [returnRate, setReturnRate] = useState(6);
  const [compound, setCompound] = useState("annually");
  const [additionalContribution, setAdditionalContribution] = useState(1000);
  const [contributeFrequency, setContributeFrequency] = useState("month");
  const [contributeWhen, setContributeWhen] = useState("end");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [endBalance, setEndBalance] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [accumulationSchedule, setAccumulationSchedule] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [currency, setCurrency] = useState("USD");
   const [country, setCountry] = useState("Unknown");

  const compoundFrequencies = {
    annually: 1,
    semiannually: 2,
    quarterly: 4,
    monthly: 12,
    weekly: 52,
    daily: 365,
  };

  const calculateInvestment = () => {
    const principal = parseFloat(startingAmount) || 0;
    const annualRate = parseFloat(returnRate) / 100 || 0;
    const years =
      lengthUnit === "years"
        ? parseFloat(investmentLength)
        : parseFloat(investmentLength) / 12;
    const compoundsPerYear = compoundFrequencies[compound] || 1;
    const periodicRate = annualRate / compoundsPerYear;
    const totalPeriods = years * compoundsPerYear;

    const futureValuePrincipal =
      principal * Math.pow(1 + periodicRate, totalPeriods);

    const additionalAmount = parseFloat(additionalContribution) || 0;
    let contributionFrequency = contributeFrequency === "month" ? 12 : 1;
    let futureValueContributions = 0;
    let totalContributionAmount = 0;

    if (additionalAmount > 0 && years > 0) {
      const contributionPeriods = years * contributionFrequency;
      const contributionRate = annualRate / contributionFrequency;

      if (contributionRate === 0) {
        futureValueContributions = additionalAmount * contributionPeriods;
      } else {
        if (contributeWhen === "beginning") {
          futureValueContributions =
            ((additionalAmount *
              (Math.pow(1 + contributionRate, contributionPeriods) - 1)) /
              contributionRate) *
            (1 + contributionRate);
        } else {
          futureValueContributions =
            (additionalAmount *
              (Math.pow(1 + contributionRate, contributionPeriods) - 1)) /
            contributionRate;
        }
      }
      totalContributionAmount = additionalAmount * contributionPeriods;
    }

    const finalBalance = futureValuePrincipal + futureValueContributions;
    const totalInterestEarned =
      finalBalance - principal - totalContributionAmount;

    setEndBalance(finalBalance);
    setTotalContributions(totalContributionAmount);
    setTotalInterest(totalInterestEarned);
    setShowResults(true);

    generateSchedules(
      principal,
      additionalAmount,
      annualRate,
      years,
      contributionFrequency
    );
  };

  const generateSchedules = (
    principal,
    contribution,
    rate,
    years,
    contributionFreq
  ) => {
    const annualSchedule = [];
    let currentBalance = principal;

    for (let year = 1; year <= Math.ceil(years); year++) {
      const isPartialYear = year > years;
      const yearContributions = isPartialYear
        ? contribution * contributionFreq * (years - Math.floor(years))
        : contribution * contributionFreq;

      const startBalance = currentBalance;
      const interest = startBalance * rate + (yearContributions * rate) / 2;
      currentBalance = startBalance + yearContributions + interest;

      annualSchedule.push({
        year,
        deposit: year === 1 ? principal + yearContributions : yearContributions,
        interest: interest,
        endingBalance: currentBalance,
      });

      if (year >= years) break;
    }

    setAccumulationSchedule(annualSchedule);
  };

  const clearForm = () => {
    setStartingAmount(0);
    setInvestmentLength(0);
    setReturnRate(0);
    setAdditionalContribution(0);
    setLengthUnit("years");
    setCompound("annually");
    setContributeFrequency("month");
    setContributeWhen("end");
    setEndBalance(0);
    setTotalContributions(0);
    setTotalInterest(0);
    setShowResults(false);
    setAccumulationSchedule([]);
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
          console.log( "Lat:", latitude, "Lon:", longitude);

          try {
            // Step 1️ - Reverse Geocode to get country code (ISO 3166)
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

  // Step 3️ - Format currency dynamically
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <Head>
        <title>Investment Calculator | Free ROI & Growth Estimator</title>
        <meta
          name="description"
          content="
   Use our free Investment Calculator to estimate returns, growth, and profits. Plan your investments smartly with accurate and instant results online.


  "
        />
        <meta
          name="keywords"
          content="Investment Calculator, Online Investment Calculator, ROI Calculator, Return on Investment Calculator, Compound Interest Investment Calculator, Investment Growth Calculator, Mutual Fund Investment Calculator, SIP Calculator, Stock Investment Calculator, Free Investment Calculator 



"
        />
      </Head>
      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <Header />
        <div className="flex pt-16 md:pt-Star">
          

          {/* Left Sidebar */}
          <div
            className={`fixed top-16 md:top-20 left-0 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:translate-x-0`}
          >
            <div
              style={{ backgroundColor: "#111827" }}
              className="text-white p-3"
            >
              <h3 className="font-bold">Financial Tools</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <a
                  href="/Financial/mortgage-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  🏠 <span>Mortgage Calculator</span>
                </a>
                <a
                  href="/Financial/loan-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  💵 <span>Loan Calculator</span>
                </a>
                <a
                  href="/Financial/auto-loan-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  🚗 <span>Auto Loan Calculator</span>
                </a>
                <a
                  href="/Financial/interest-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  📊 <span>Interest Calculator</span>
                </a>
                <a
                  href="/Financial/payment-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  💳 <span>Payment Calculator</span>
                </a>
                <a
                  href="/Financial/retirement-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  🐷 <span>Retirement Calculator</span>
                </a>
                <a
                  href="/Financial/amortization-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  📈 <span>Amortization Calculator</span>
                </a>
                <a
                  href="/Financial/investment-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  📉 <span>Investment Calculator</span>
                </a>
                <a
                  href="/Financial/inflation-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  📆 <span>Inflation Calculator</span>
                </a>
                <a
                  href="/Financial/finance-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  💼 <span>Finance Calculator</span>
                </a>
                <a
                  href="/Financial/income-tax-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  🧾 <span>Income Tax Calculator</span>
                </a>
                <a
                  href="/Financial/compound-interest-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  💲 <span>Compound Interest Calculator</span>
                </a>
                <a
                  href="/Financial/salary-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  👔 <span>Salary Calculator</span>
                </a>
                <a
                  href="/Financial/interest-rate-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  📉 <span>Interest Rate Calculator</span>
                </a>
                <a
                  href="/Financial/sales-tax-calculator"
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                >
                  🧾 <span>Sales Tax Calculator</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 px-4 md:px-6 py-6 md:py-8 -mt-15">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 md:mb-8 text-center">
                <h2
                  className="text-2xl md:text-4xl font-bold mb-3 md:mb-4"
                  style={{ color: "#111827" }}
                >
                  Investment Calculator
                </h2>
                <p className="text-sm md:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  An Investment Calculator is a tool that helps estimate the
                  future value of an investment by considering the principal
                  amount, expected returns, time period, and interest or growth
                  rate.
                </p>
              </div>

              <div
                className="mb-6 md:mb-8 p-3 md:p-4 rounded-2xl text-white text-center shadow-lg"
                style={{ backgroundColor: "#111827" }}
              >
                <span className="text-base md:text-lg font-medium">
                  "Calculate your future wealth with smart investments."
                </span>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
                <div className="xl:col-span-5">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8 space-y-6">
                    <h3
                      className="text-lg md:text-xl font-bold flex items-center mb-4 md:mb-6"
                      style={{ color: "#111827" }}
                    >
                      <PieChart className="w-5 h-5 mr-2" />
                      Investment Parameters
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Starting Amount
                        </label>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-900"></span>
                          <input
                            type="number"
                            value={startingAmount}
                            onChange={(e) =>
                              setStartingAmount(Number(e.target.value) || 0)
                            }
                            className="flex-1 px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-base md:text-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Investment Length
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={investmentLength}
                            onChange={(e) =>
                              setInvestmentLength(Number(e.target.value) || 0)
                            }
                            className="px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-base md:text-lg"
                          />
                          <select
                            value={lengthUnit}
                            onChange={(e) => setLengthUnit(e.target.value)}
                            className="px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none"
                          >
                            <option value="years">years</option>
                            <option value="months">months</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Return Rate
                        </label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            step="0.1"
                            value={returnRate}
                            onChange={(e) =>
                              setReturnRate(Number(e.target.value) || 0)
                            }
                            className="flex-1 px-3  text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-base md:text-lg"
                          />
                          <span className="ml-2 text-gray-900">%</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Compound Frequency
                        </label>
                        <select
                          value={compound}
                          onChange={(e) => setCompound(e.target.value)}
                          className="w-full px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none"
                        >
                          <option value="annually">Annually</option>
                          <option value="semiannually">Semiannually</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="monthly">Monthly</option>
                          <option value="weekly">Weekly</option>
                          <option value="daily">Daily</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Additional Contribution
                        </label>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-900"></span>
                          <input
                            type="number"
                            value={additionalContribution}
                            onChange={(e) =>
                              setAdditionalContribution(
                                Number(e.target.value) || 0
                              )
                            }
                            className="flex-1 px-3 text-gray-900 md:px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:border-red-500 focus:outline-none transition-colors text-base md:text-lg"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Contribution Frequency
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex text-gray-900 items-center cursor-pointer">
                            <input
                              type="radio"
                              value="month"
                              checked={contributeFrequency === "month"}
                              onChange={(e) =>
                                setContributeFrequency(e.target.value)
                              }
                              className="mr-2"
                            />
                            <span text-gray-900>Monthly</span>
                          </label>
                          <label className="flex text-gray-900 items-center cursor-pointer">
                            <input
                              type="radio"
                              value="year"
                              checked={contributeFrequency === "year"}
                              onChange={(e) =>
                                setContributeFrequency(e.target.value)
                              }
                              className="mr-2"
                            />
                            <span text-gray-900>Yearly</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Contribute at the
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex text-gray-900 items-center cursor-pointer">
                            <input
                              type="radio"
                              value="beginning"
                              checked={contributeWhen === "beginning"}
                              onChange={(e) =>
                                setContributeWhen(e.target.value)
                              }
                              className="mr-2"
                            />
                            <span>Beginning</span>
                          </label>
                          <label className="flex text-gray-900 items-center cursor-pointer">
                            <input
                              type="radio"
                              value="end"
                              checked={contributeWhen === "end"}
                              onChange={(e) =>
                                setContributeWhen(e.target.value)
                              }
                              className="mr-2"
                            />
                            <span>End</span>
                          </label>
                        </div>
                        <p className="text-xs text-gray-900 mt-1">
                          of each period
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                        <button
                          onClick={calculateInvestment}
                          style={{ backgroundColor: "#43A047" }}
                          className="flex-1 text-gray-900 py-2  md:py-3 px-4 md:px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
                  {showResults && endBalance > 0 ? (
                    <>
                      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-8 mb-6">
                        <h3
                          className="text-lg md:text-xl font-bold mb-4 md:mb-6"
                          style={{ color: "#800000" }}
                        >
                          Investment Results
                        </h3>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              End Balance:
                            </span>
                            <span
                              className="text-xl md:text-2xl font-bold"
                              style={{ color: "#800000" }}
                            >
                              {formatCurrency(endBalance)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              Starting Amount:
                            </span>
                            <span className="font-bold text-gray-900 text-sm md:text-base">
                              {formatCurrency(startingAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              Total Contributions:
                            </span>
                            <span className="font-bold text-gray-900  text-sm md:text-base">
                              {formatCurrency(totalContributions)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3 border-b">
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              Total Interest:
                            </span>
                            <span className="font-bold text-green-600 text-sm md:text-base">
                              {formatCurrency(totalInterest)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center py-3">
                            <span className="font-medium text-gray-900 text-sm md:text-base">
                              Interest Ratio:
                            </span>
                            <span className="font-bold text-gray-900  text-sm md:text-base">
                              {((totalInterest / endBalance) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 md:mt-8">
                          <h4 className="font-bold text-gray-900  text-center mb-4">
                            Investment Breakdown
                          </h4>
                          <div className="flex flex-col md:flex-row items-center justify-center">
                            <div className="relative w-40 h-40">
                              <svg
                                viewBox="0 0 100 100"
                                className="w-full h-full transform -rotate-90"
                              >
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="transparent"
                                  stroke="#111827"
                                  strokeWidth="20"
                                  strokeDasharray={`${(
                                    (startingAmount / endBalance) *
                                    251.2
                                  ).toFixed(1)} 251.2`}
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="transparent"
                                  stroke="#16a34a"
                                  strokeWidth="20"
                                  strokeDasharray={`${(
                                    (totalContributions / endBalance) *
                                    251.2
                                  ).toFixed(1)} 251.2`}
                                  strokeDashoffset={`-${(
                                    (startingAmount / endBalance) *
                                    251.2
                                  ).toFixed(1)}`}
                                />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="40"
                                  fill="transparent"
                                  stroke="#dc2626"
                                  strokeWidth="20"
                                  strokeDasharray={`${(
                                    (totalInterest / endBalance) *
                                    251.2
                                  ).toFixed(1)} 251.2`}
                                  strokeDashoffset={`-${(
                                    ((startingAmount + totalContributions) /
                                      endBalance) *
                                    251.2
                                  ).toFixed(1)}`}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-sm font-bold text-gray-900">
                                    {Math.round(
                                      (totalInterest / endBalance) * 100
                                    )}
                                    %
                                  </div>
                                  <div className="text-xs text-gray-900">Interest</div>
                                </div>
                              </div>
                            </div>
                            <div className="ml-0 md:ml-6 mt-4 md:mt-0 space-y-2 text-sm">
                              <div className="flex items-center">
                                <div
                                  className="w-4 h-4 rounded mr-2 "
                                  style={{ backgroundColor: "#800000" }}
                                ></div>
                                <span className="text-gray-900">
                                  Starting (
                                  {Math.round(
                                    (startingAmount / endBalance) * 100
                                  )}
                                  %)
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
                                <span className="text-xs text-gray-900" >
                                  Contributions (
                                  {Math.round(
                                    (totalContributions / endBalance) * 100
                                  )}
                                  %)
                                </span>
                              </div>
                              <div className="flex items-center">
                                <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
                                <span className="text-xs text-gray-900">
                                  Interest (
                                  {Math.round(
                                    (totalInterest / endBalance) * 100
                                  )}
                                  %)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                        <div
                          style={{ backgroundColor: "#111827" }}
                          className="text-white p-3 md:p-4"
                        >
                          <h3 className="font-bold">Accumulation Schedule</h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs md:text-sm">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="p-2 md:p-3 text-gray-900 text-left font-semibold">
                                  Year
                                </th>
                                <th className="p-2 md:p-3 text-gray-900 text-left font-semibold">
                                  Deposit
                                </th>
                                <th className="p-2 md:p-3  text-gray-900 text-left font-semibold">
                                  Interest
                                </th>
                                <th className="p-2 md:p-3  text-gray-900 text-left font-semibold">
                                  Balance
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {accumulationSchedule
                                .slice(0, 10)
                                .map((item, index) => (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-90"
                                    }
                                  >
                                    <td className="p-2 md:p-3 text-gray-900">{item.year}</td>
                                    <td className="p-2 md:p-3 text-gray-900">
                                      {formatCurrency(item.deposit)}
                                    </td>
                                    <td className="p-2 md:p-3 text-green-600">
                                      {formatCurrency(item.interest)}
                                    </td>
                                    <td className="p-2 md:p-3 text-gray-900 font-medium">
                                      {formatCurrency(item.endingBalance)}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-16 text-center">
                      <TrendingUp className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-900 text-base md:text-lg">
                        Enter your details and calculate to see results
                      </p>
                    </div>
                  )}

                  <div
                    style={{ backgroundColor: "#111827" }}
                    className="text-white rounded-2xl p-4 md:p-6 mt-6"
                  >
                    <h3 className="font-bold text-base md:text-lg mb-4">
                      Investment Tips
                    </h3>
                    <div className="space-y-3 text-xs md:text-sm opacity-90">
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                        <p>Start early to maximize compound interest effects</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                        <p>
                          Regular contributions build wealth through dollar-cost
                          averaging
                        </p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                        <p>Diversify investments to manage risk effectively</p>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 rounded-full bg-white mt-2 mr-3 flex-shrink-0"></div>
                        <p>Review and adjust your strategy annually</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 md:mt-16 space-y-8">
                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 md:mb-6"
                    style={{ color: "#111827" }}
                  >
                    Understanding Investment Growth
                  </h2>
                  <div className="prose max-w-none text-gray-900 leading-relaxed">
                    <p className="mb-4 text-sm md:text-base">
                      Investment growth occurs through compound returns, where
                      earnings generate additional earnings over time. This
                      exponential growth effect becomes more pronounced with
                      longer investment timelines and consistent contributions.
                    </p>
                    <p className="mb-4 text-sm md:text-base">
                      The power of compounding means that time is one of your
                      most valuable assets. Starting early allows your
                      investments to grow significantly, even with modest
                      initial amounts and regular contributions.
                    </p>
                    <p className="text-sm md:text-base">
                      Regular portfolio reviews and strategic adjustments help
                      ensure your investment timeline remains on track toward
                      your financial goals while adapting to changing market
                      conditions and life circumstances.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
                  <h2
                    className="text-xl md:text-2xl font-bold mb-4 md:mb-6"
                    style={{ color: "#111827" }}
                  >
                    Using Your Investment Timeline for Wealth Planning
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-8">
                    <div className="bg-gray-200 p-4 rounded border-l-4 border-green-600">
                      <div className="text-center mb-3">
                        <div className="w-12 h-12 bg-green-600 rounded-full mx-auto flex items-center justify-center text-gray-900 font-bold text-xl">
                          📈
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 text-center mb-2">
                        Growth Tracking
                      </h4>
                      <p className="text-sm  text-gray-900 text-center">
                        Schedule regular portfolio reviews, performance
                        evaluations, and strategy adjustments based on your
                        investment milestones and market conditions.
                      </p>
                    </div>

                    <div className="bg-gray-200 p-4 rounded border-l-4 border-blue-600">
                      <div className="text-center mb-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                          💰
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 text-center mb-2">
                        Wealth Building
                      </h4>
                      <p className="text-sm text-gray-900 text-center">
                        Monitor compound growth and accumulation milestones
                        throughout each investment phase and market cycle
                        progression.
                      </p>
                    </div>

                    <div className="bg-gray-200 p-4 rounded border-l-4 border-red-600">
                      <div className="text-center mb-3">
                        <div className="w-12 h-12 bg-red-600 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl">
                          🎯
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-900 text-center mb-2">
                        Goal Achievement
                      </h4>
                      <p className="text-sm text-gray-900 text-center">
                        Plan major financial decisions, retirement timing, and
                        wealth preservation strategies around your investment
                        timeline.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-200 p-4 rounded border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-900">
                      <strong>Important:</strong> Investment calculations
                      provide estimates based on assumed constant returns.
                      Actual results may vary significantly based on market
                      volatility, economic conditions, and investment selection.
                      Always consult financial professionals for personalized
                      investment advice and portfolio guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default InvestmentCalculator;
