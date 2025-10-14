import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator,  } from 'lucide-react';

const SalaryCalculator = () => {
  const [salaryAmount, setSalaryAmount] = useState(50);
  const [payFrequency, setPayFrequency] = useState('Hour');
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [holidaysPerYear, setHolidaysPerYear] = useState(10);
  const [vacationDaysPerYear, setVacationDaysPerYear] = useState(15);
  const [results, setResults] = useState({});
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
    }).format(amount || 0);
  };

  const calculateSalary = () => {
    const workingDaysPerYear = 260;
    const totalHoursPerYear = hoursPerWeek * 52;
    const adjustedWorkingDays = workingDaysPerYear - holidaysPerYear - vacationDaysPerYear;
    const adjustedHoursPerYear = (adjustedWorkingDays / workingDaysPerYear) * totalHoursPerYear;

    let hourlyRate = salaryAmount;
    
    switch(payFrequency) {
      case 'Hour':
        hourlyRate = salaryAmount;
        break;
      case 'Day':
        hourlyRate = salaryAmount / 8;
        break;
      case 'Week':
        hourlyRate = salaryAmount / hoursPerWeek;
        break;
      case 'Month':
        hourlyRate = (salaryAmount * 12) / totalHoursPerYear;
        break;
      case 'Year':
        hourlyRate = salaryAmount / totalHoursPerYear;
        break;
    }

    const calculations = {
      hourly: {
        unadjusted: hourlyRate,
        adjusted: (hourlyRate * totalHoursPerYear) / adjustedHoursPerYear
      },
      daily: {
        unadjusted: hourlyRate * 8,
        adjusted: ((hourlyRate * totalHoursPerYear) / adjustedHoursPerYear) * 8
      },
      weekly: {
        unadjusted: hourlyRate * hoursPerWeek,
        adjusted: ((hourlyRate * totalHoursPerYear) / adjustedHoursPerYear) * hoursPerWeek
      },
      biweekly: {
        unadjusted: hourlyRate * hoursPerWeek * 2,
        adjusted: ((hourlyRate * totalHoursPerYear) / adjustedHoursPerYear) * hoursPerWeek * 2
      },
      semimonthly: {
        unadjusted: (hourlyRate * totalHoursPerYear) / 24,
        adjusted: ((hourlyRate * totalHoursPerYear) / adjustedHoursPerYear) * adjustedHoursPerYear / 24
      },
      monthly: {
        unadjusted: (hourlyRate * totalHoursPerYear) / 12,
        adjusted: ((hourlyRate * totalHoursPerYear) / adjustedHoursPerYear) * adjustedHoursPerYear / 12
      },
      quarterly: {
        unadjusted: (hourlyRate * totalHoursPerYear) / 4,
        adjusted: ((hourlyRate * totalHoursPerYear) / adjustedHoursPerYear) * adjustedHoursPerYear / 4
      },
      annual: {
        unadjusted: hourlyRate * totalHoursPerYear,
        adjusted: hourlyRate * adjustedHoursPerYear
      }
    };

    setResults(calculations);
  };

  const clearForm = () => {
    setSalaryAmount(0);
    setPayFrequency('Hour');
    setHoursPerWeek(0);
    setDaysPerWeek(0);
    setHolidaysPerYear(0);
    setVacationDaysPerYear(0);
    setResults({});
  };

  return (
    <>
     <Head>
        <title>
          Salary Calculator | Free Online Salary Calculator Tool

</title>
        <meta
          name="description"
          content="
   Use our free Salary Calculator to calculate your monthly and yearly salary, taxes, and deductions. Quick, accurate, and easy salary calculator online.


  "
        />
        <meta name="keywords" content="Salary Calculator, Online Salary Calculator, Free Salary Calculator, Paycheck Calculator, Monthly Salary Calculator, Annual Salary Calculator, Net Salary Calculator, Gross Salary Calculator, Tax Calculator, Salary Estimator
" />
     
      </Head>
    <div className="min-h-screen bg-gray-100">
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
        <div className="w-full lg:ml-54 p-4 md:p-6 -mt-15">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="bg-gray-800 text-white p-4 md:p-6 rounded-t-lg">
                <h1 className="text-xl md:text-2xl font-bold mb-2">Salary Calculator 
</h1>
                <p className="text-gray-100 text-xs md:text-sm">
                  A Salary Calculator is a tool that helps determine an employee's net salary by calculating deductions, taxes, and allowances based on the gross income.
                </p>
              </div>

              {/* Calculator Section */}
              <div className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Input Section */}
                  <div className="flex-1">
                    <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-1">
                            Salary amount
                          </label>
                          <div className="flex flex-col sm:flex-row">
                            <span className="bg-white border border-gray-300 sm:border-r-0 px-3 py-2 text-sm rounded-t sm:rounded-l sm:rounded-t-none"></span>
                            <input type="number" value={salaryAmount}
                              onChange={(e) => setSalaryAmount(parseFloat(e.target.value) || 0)}
                              className="flex-1 px-3 py-2 text-gray-900 border border-gray-900 text-sm"
                              step="0.01"/>
                            <span className="bg-white border text-gray-900 border-gray-900 px-2 py-2 text-sm">per</span>
                            <select value={payFrequency}
                              onChange={(e) => setPayFrequency(e.target.value)}
                              className="px-2 py-2  text-gray-900 border border-gray-900 sm:border-l-0 text-sm bg-white rounded-b sm:rounded-r sm:rounded-b-none">
                              <option value="Hour">Hour</option>
                              <option value="Day">Day</option>
                              <option value="Week">Week</option>
                              <option value="Month">Month</option>
                              <option value="Year">Year</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              Hours per week
                            </label>
                            <input type="number" value={hoursPerWeek}
                              onChange={(e) => setHoursPerWeek(parseInt(e.target.value) || 0)}
                              className="w-full px-3 text-gray-900 py-2 border border-gray-900 text-sm rounded"/>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              Days per week
                            </label>
                            <input type="number" value={daysPerWeek}
                              onChange={(e) => setDaysPerWeek(parseInt(e.target.value) || 0)}
                              className="w-full text-gray-900 px-3 py-2 border border-gray-900 text-sm rounded"/>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              Holidays per year
                            </label>
                            <input type="number" value={holidaysPerYear}
                              onChange={(e) => setHolidaysPerYear(parseInt(e.target.value) || 0)}
                              className="w-full px-3 text-gray-900 py-2 border border-gray-900 text-sm rounded"/>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-1">
                              Vacation days per year
                            </label>
                            <input type="number" value={vacationDaysPerYear}
                              onChange={(e) => setVacationDaysPerYear(parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 text-gray-900 border border-gray-900 text-sm rounded"/>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                          <button onClick={calculateSalary}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-medium rounded transition-colors">
                            Calculate
                          </button>
                          <button onClick={clearForm}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 text-sm font-medium rounded transition-colors">
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="flex-1">
                    <div className="bg-gray-700 text-white p-3 rounded-t-lg">
                      <h3 className="font-medium text-sm md:text-base">Result</h3>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-b-lg overflow-x-auto">
                      <table className="w-full text-xs md:text-sm">
                        <thead className="bg-gray-900 text-white">
                          <tr>
                            <th className="text-left p-2 md:p-3 font-medium">Period</th>
                            <th className="text-center p-2 md:p-3 font-medium">Unadjusted</th>
                            <th className="text-center p-2 md:p-3 font-medium">Adjusted</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 md:p-3 text-gray-900 font-medium">Hourly</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.hourly?.unadjusted)}</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.hourly?.adjusted)}</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 md:p-3 text-gray-900 font-medium">Daily</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.daily?.unadjusted)}</td>
                            <td className="p-2 md:p-3  text-gray-900 text-center">{formatCurrency(results.daily?.adjusted)}</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 md:p-3 text-gray-900 font-medium">Weekly</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.weekly?.unadjusted)}</td>
                            <td className="p-2 md:p-3 text-gray-900  text-center">{formatCurrency(results.weekly?.unadjusted)}</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.weekly?.adjusted)}</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 md:p-3 text-gray-900 font-medium">Bi-weekly</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.biweekly?.unadjusted)}</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.biweekly?.adjusted)}</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 md:p-3 text-gray-900 font-medium">Semi-monthly</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.semimonthly?.unadjusted)}</td>
                            <td className="p-2 md:p-3  text-gray-900 text-center">{formatCurrency(results.semimonthly?.adjusted)}</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="p-2 md:p-3 text-gray-900 font-medium">Monthly</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.monthly?.unadjusted)}</td>
                            <td className="p-2 md:p-3 text-gray-900 text-center">{formatCurrency(results.monthly?.adjusted)}</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50 text-gray-900">
                            <td className="p-2 md:p-3 font-medium">Quarterly</td>
                            <td className="p-2 md:p-3 text-center">{formatCurrency(results.quarterly?.unadjusted)}</td>
                            <td className="p-2 md:p-3 text-center">{formatCurrency(results.quarterly?.adjusted)}</td>
                          </tr>
                          <tr className="hover:bg-gray-50 text-gray-900">
                            <td className="p-2 md:p-3 font-medium">Annual</td>
                            <td className="p-2 md:p-3 text-center">{formatCurrency(results.annual?.unadjusted)}</td>
                            <td className="p-2 md:p-3 text-center">{formatCurrency(results.annual?.adjusted)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Salary Information */}
                <div className="mt-6 md:mt-8 bg-gray-50 p-4 md:p-6 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Salary Information Tips</h3>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    <li>• This salary calculator assumes the hourly and daily salary inputs to be unadjusted values</li>
                    <li>• All other pay frequency inputs are assumed to be holidays and vacation days adjusted values</li>
                    <li>• This calculator also assumes 52 working weeks or 260 weekdays per year in its calculations</li>
                    <li>• The unadjusted results ignore the holidays and paid vacation days</li>
                  </ul>
                </div>

                {/* Accuracy & Limitations */}
                <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Accuracy & Limitations</h3>
                  <p className="text-xs md:text-sm text-gray-100">
                    Salary calculations are estimates based on standard working assumptions and may not perfectly match your individual 
                    work situation. Different companies may have varying policies for holidays, vacation days, and pay periods.
                  </p>
                </div>
              </div>
            </div>

            {/* Understanding Salary Calculations */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">Understanding Salary Calculations</h2>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                A salary or wage is the payment from an employer to a worker for the time and works contributed. To 
                protect workers, many countries enforce minimum wages set by either central or local governments. 
                Also, unions may be formed in order to set standards in certain companies or industries.
              </p>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                This calculator converts salary amounts to their corresponding values based on payment frequency. 
                It assumes 52 working weeks or 260 weekdays per year and provides both adjusted and unadjusted figures 
                that account for vacation days and holidays per year.
              </p>
            </div>

            {/* Using Your Salary Information */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">Using Your Salary Information for Financial Planning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-green-800 mb-2 text-sm md:text-base">Budget Planning</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Break down your salary by weekly, biweekly, or monthly pay frequencies. Track income against expenses to create a sustainable budget.
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-2">🧾</div>
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">Tax Planning</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Estimate your annual earnings for accurate tax preparation. Account for paid holidays and plan for deductions.
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-2">📅</div>
                  <h3 className="font-semibold text-purple-800 mb-2 text-sm md:text-base">Career Planning</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Compare different job offers by calculating true take-home pay and evaluate benefits beyond base salary.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-xs md:text-sm text-gray-700">
                  <strong>Important:</strong> Salary calculations provide estimates based on common assumptions. Actual pay may differ due to company policies, overtime rules, and specific employment agreements.
                </p>
              </div>
            </div>

            {/* Salary vs Wage */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">Salary vs Wage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Salary</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">
                    A salary is normally paid on a regular basis, and the amount normally does not fluctuate based on the quality or quantity of work performed. 
                    An employee's salary is commonly defined as an annual figure in an employment contract that is signed upon hiring.
                  </p>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Wage</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">
                    There are several technical differences between the terms "wage" and "salary." The word "wage" is best associated with employee 
                    compensation based on the number of hours worked multiplied by an hourly rate of pay. Wage-earners tend to be non-exempt, 
                    which means they are subject to overtime wage regulations.
                  </p>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">How Calculations Work</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <p className="font-mono text-xs md:text-sm text-gray-800 mb-2">Using a $30 hourly rate example:</p>
                    <p className="font-mono text-xs md:text-sm text-gray-800 mb-2">$30 × 8 hours × 260 days = $62,400 (unadjusted)</p>
                    <p className="font-mono text-xs md:text-sm text-gray-800">$30 × 8 hours × (260 - 25) days = $56,400 (adjusted)</p>
                  </div>
                  <p className="text-xs md:text-sm text-gray-800 mt-2">The adjusted calculation subtracts holidays and vacation days from total working days.</p>
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

export default SalaryCalculator;