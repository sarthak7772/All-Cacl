import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator } from 'lucide-react';

const CompoundInterestCalculator = () => {
  const [inputRate, setInputRate] = useState(6);
  const [compoundFrequency, setCompoundFrequency] = useState('Monthly');
  const [outputRate, setOutputRate] = useState('6.1678');
  const [outputFrequency, setOutputFrequency] = useState('Annually');

  const frequencyMap = {
    'Daily': 365,
    'Weekly': 52,
    'Bi-weekly': 26,
    'Semi-monthly': 24,
    'Monthly': 12,
    'Bi-monthly': 6,
    'Quarterly': 4,
    'Semi-annually': 2,
    'Annually': 1,
    'Continuous': 'continuous'
  };

  const calculateEquivalentRate = () => {
    if (!inputRate || inputRate <= 0) return;

    const r = inputRate / 100;
    const n1 = frequencyMap[compoundFrequency];
    const n2 = frequencyMap[outputFrequency];

    let equivalentRate;

    if (n1 === 'continuous' && n2 === 'continuous') {
      equivalentRate = r;
    } else if (n1 === 'continuous') {
      equivalentRate = n2 * (Math.exp(r) - 1);
    } else if (n2 === 'continuous') {
      equivalentRate = Math.log(1 + r / n1) * n1;
    } else {
      const effectiveAnnualRate = Math.pow(1 + r / n1, n1) - 1;
      equivalentRate = n2 * (Math.pow(1 + effectiveAnnualRate, 1 / n2) - 1);
    }

    setOutputRate((equivalentRate * 100).toFixed(4));
  };

  const clearForm = () => {
    setInputRate(0);
    setCompoundFrequency('Monthly');
    setOutputRate('0.0000');
    setOutputFrequency('Annually');
  };

  return (
    <>
     <Head>
        <title>Compound Interest Calculator | Free Online Tool</title>
        <meta
          name="description"
          content="Use our free Compound Interest Calculator to easily calculate investment growth, savings, and returns. Fast, accurate, and perfect for financial planning."
        />
        <meta name="keywords" content="Compound Interest Calculator, Online Compound Interest Calculator, Investment Interest Calculator, Savings Compound Interest Calculator, Financial Compound Interest Calculator, Interest Growth Calculator, Free Compound Interest Calculator, Future Value Calculator, Money Growth Calculator, Compound Interest Tool" />
      </Head>
    <div className="min-h-screen bg-gray-100">
      <Header/>
      
      <div className="flex pt-14">
        {/* Left Sidebar - Hidden on mobile */}
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
        <div className="flex-1 lg:ml-64 -mt-15">
          <div className="container mx-auto px-4 py-6">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="bg-gray-800 text-white p-4 md:p-6 rounded-t-lg">
                <h1 className="text-xl md:text-2xl font-bold mb-2">Compound Interest Calculator</h1>
                <p className="text-gray-100 text-xs md:text-sm">
                  A Compound Interest Calculator helps users determine how their money grows over time when interest is added to the principal amount periodically. Unlike simple interest, compound interest allows you to earn interest on both the initial amount and the accumulated interest, resulting in faster growth.
                </p>
              </div>

              {/* Calculator Section */}
              <div className="p-4 md:p-6">
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-sm text-gray-700">
                          <th className="text-left pb-4 font-medium">Input Interest</th>
                          <th className="text-left pb-4 font-medium">Compound</th>
                          <th className="text-center pb-4 font-medium"></th>
                          <th className="text-left pb-4 font-medium">Output Interest</th>
                          <th className="text-left pb-4 font-medium">Compound</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pr-4">
                            <div className="flex">
                              <input
                                type="number"
                                value={inputRate}
                                onChange={(e) => setInputRate(parseFloat(e.target.value) || 0)}
                                className="w-16 px-2 py-2 border border-gray-300 text-right text-sm rounded-l"
                                step="0.01"
                              />
                              <span className="bg-white border border-gray-300 border-l-0 px-2 py-2 text-sm rounded-r">%</span>
                            </div>
                          </td>
                          <td className="pr-4">
                            <select
                              value={compoundFrequency}
                              onChange={(e) => setCompoundFrequency(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 text-sm bg-white rounded"
                            >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Bi-weekly">Bi-weekly</option>
                              <option value="Semi-monthly">Semi-monthly</option>
                              <option value="Monthly">Monthly (APR)</option>
                              <option value="Bi-monthly">Bi-monthly</option>
                              <option value="Quarterly">Quarterly</option>
                              <option value="Semi-annually">Semi-annually</option>
                              <option value="Annually">Annually</option>
                              <option value="Continuous">Continuous</option>
                            </select>
                          </td>
                          <td className="text-center px-4">
                            <span className="text-xl font-bold text-gray-600">=</span>
                          </td>
                          <td className="pr-4">
                            <div className="flex">
                              <input
                                type="text"
                                value={outputRate}
                                readOnly
                                className="w-20 px-2 py-2 border border-gray-300 text-right text-sm font-bold text-green-600 rounded-l bg-gray-50"
                              />
                              <span className="bg-white border border-gray-300 border-l-0 px-2 py-2 text-sm rounded-r">%</span>
                            </div>
                          </td>
                          <td>
                            <select
                              value={outputFrequency}
                              onChange={(e) => setOutputFrequency(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 text-sm bg-white rounded"
                            >
                              <option value="Daily">Daily</option>
                              <option value="Weekly">Weekly</option>
                              <option value="Bi-weekly">Bi-weekly</option>
                              <option value="Semi-monthly">Semi-monthly</option>
                              <option value="Monthly">Monthly</option>
                              <option value="Bi-monthly">Bi-monthly</option>
                              <option value="Quarterly">Quarterly</option>
                              <option value="Semi-annually">Semi-annually</option>
                              <option value="Annually">Annually (APY)</option>
                              <option value="Continuous">Continuous</option>
                            </select>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Stacked View */}
                  <div className="md:hidden space-y-4">
                    {/* Input Section */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">Input Interest Rate</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Interest Rate</label>
                          <div className="flex">
                            <input
                              type="number"
                              value={inputRate}
                              onChange={(e) => setInputRate(parseFloat(e.target.value) || 0)}
                              className="flex-1 px-3 py-2 border border-gray-300 text-right text-sm rounded-l"
                              step="0.01"
                            />
                            <span className="bg-white border border-gray-300 border-l-0 px-3 py-2 text-sm rounded-r">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600 mb-1 block">Compound Frequency</label>
                          <select
                            value={compoundFrequency}
                            onChange={(e) => setCompoundFrequency(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 text-sm bg-white rounded"
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Bi-weekly">Bi-weekly</option>
                            <option value="Semi-monthly">Semi-monthly</option>
                            <option value="Monthly">Monthly (APR)</option>
                            <option value="Bi-monthly">Bi-monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Semi-annually">Semi-annually</option>
                            <option value="Annually">Annually</option>
                            <option value="Continuous">Continuous</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Equals Sign */}
                    <div className="text-center">
                      <span className="text-2xl font-bold text-gray-600">⬇</span>
                    </div>

                    {/* Output Section */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h3 className="text-sm font-semibold text-green-700 mb-3">Output Interest Rate</h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-green-600 mb-1 block">Equivalent Rate</label>
                          <div className="flex">
                            <input
                              type="text"
                              value={outputRate}
                              readOnly
                              className="flex-1 px-3 py-2 border border-green-300 text-right text-sm font-bold text-green-700 rounded-l bg-white"
                            />
                            <span className="bg-white border border-green-300 border-l-0 px-3 py-2 text-sm rounded-r">%</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-green-600 mb-1 block">Compound Frequency</label>
                          <select
                            value={outputFrequency}
                            onChange={(e) => setOutputFrequency(e.target.value)}
                            className="w-full px-3 py-2 border border-green-300 text-sm bg-white rounded"
                          >
                            <option value="Daily">Daily</option>
                            <option value="Weekly">Weekly</option>
                            <option value="Bi-weekly">Bi-weekly</option>
                            <option value="Semi-monthly">Semi-monthly</option>
                            <option value="Monthly">Monthly</option>
                            <option value="Bi-monthly">Bi-monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Semi-annually">Semi-annually</option>
                            <option value="Annually">Annually (APY)</option>
                            <option value="Continuous">Continuous</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      onClick={calculateEquivalentRate}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-medium rounded transition-colors duration-200"
                    >
                      Calculate
                    </button>
                    <button
                      onClick={clearForm}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 text-sm font-medium rounded transition-colors duration-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Interest Information */}
                <div className="mt-6 md:mt-8 bg-gray-50 p-4 md:p-6 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-700 mb-4">Interest Rate Conversion Tips</h3>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    <li>• Different compounding frequencies can significantly affect the effective interest rate</li>
                    <li>• More frequent compounding results in higher effective annual rates</li>
                    <li>• Use this calculator to compare loan offers or investment options with different compounding periods</li>
                    <li>• Annual Percentage Rate (APR) and Annual Percentage Yield (APY) differ based on compounding frequency</li>
                  </ul>
                </div>

                {/* Accuracy & Limitations */}
                <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Accuracy & Limitations</h3>
                  <p className="text-xs md:text-sm text-gray-100">
                    Interest rate calculations are mathematical conversions based on standard formulas. Actual financial products 
                    may have additional fees, terms, or conditions that affect the true cost of borrowing or return on investment.
                  </p>
                </div>
              </div>
            </div>

            {/* What is Compound Interest Section */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">What is Compound Interest?</h2>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                Interest is the cost of using borrowed money, or more specifically, the amount a lender receives for 
                advancing money to a borrower. When paying interest, the borrower will mostly pay a percentage of 
                the principal (the borrowed amount). The concept of interest can be categorized into simple interest or 
                compound interest.
              </p>
              
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                Simple interest refers to interest earned only on the principal, usually denoted as a specified 
                percentage of the principal. Compound interest is widely used instead. Compound 
                interest is interest earned on both the principal and on the accumulated interest.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2 text-sm md:text-base">Example:</h4>
                <p className="text-xs md:text-sm text-gray-700 mb-2">$100 at 10% simple interest for 2 years:</p>
                <div className="font-mono text-xs md:text-sm bg-white p-2 rounded text-center">
                  $100 × 10% × 2 years = $20
                </div>
                <p className="text-xs md:text-sm text-gray-700 mt-3 mb-2">$100 at 10% compound interest for 2 years:</p>
                <div className="font-mono text-xs md:text-sm bg-white p-2 rounded text-center">
                  Year 1: $100 × 10% = $10<br/>
                  Year 2: ($100 + $10) × 10% = $11<br/>
                  Total: $10 + $11 = $21
                </div>
              </div>
            </div>

            {/* Compound Interest Formulas */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-4">Compound Interest Formulas</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Basic Compound Interest Formula</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center font-mono text-base md:text-lg mb-4">
                      A<sub>t</sub> = A<sub>0</sub>(1 + r)<sup>n</sup>
                    </div>
                    <div className="text-xs md:text-sm text-gray-700 space-y-1">
                      <p><strong>Where:</strong></p>
                      <p>A₀ = principal amount (initial investment)</p>
                      <p>A<sub>t</sub> = amount after time t</p>
                      <p>r = interest rate</p>
                      <p>n = number of compounding periods</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Compound Interest with Different Frequencies</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center font-mono text-base md:text-lg mb-4">
                      A<sub>t</sub> = A<sub>0</sub> × (1 + r/n)<sup>nt</sup>
                    </div>
                    <div className="text-xs md:text-sm text-gray-700 space-y-1">
                      <p><strong>Where:</strong></p>
                      <p>A₀ = principal amount</p>
                      <p>A<sub>t</sub> = amount after time t</p>
                      <p>n = number of compounding periods per year</p>
                      <p>r = annual interest rate</p>
                      <p>t = number of years</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Continuous Compounding</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center font-mono text-base md:text-lg mb-4">
                      A<sub>t</sub> = A<sub>0</sub>e<sup>rt</sup>
                    </div>
                    <div className="text-xs md:text-sm text-gray-700 space-y-1">
                      <p><strong>Where:</strong></p>
                      <p>A₀ = principal amount</p>
                      <p>A<sub>t</sub> = amount after time t</p>
                      <p>r = interest rate</p>
                      <p>t = time in years</p>
                      <p>e = mathematical constant (~2.718)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Using Interest Rate Information */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-gray-700 font-semibold mb-6 text-base md:text-lg">Using Interest Rate Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center bg-green-50 rounded-lg p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl md:text-2xl">💰</span>
                  </div>
                  <h4 className="font-semibold text-green-700 text-sm md:text-base">Investment Planning</h4>
                  <p className="text-xs text-gray-600">
                    Compare different investment options by understanding their effective annual yields.
                  </p>
                </div>

                <div className="text-center bg-blue-50 rounded-lg p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl md:text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-blue-700 text-sm md:text-base">Loan Comparison</h4>
                  <p className="text-xs text-gray-600">
                    Understand the true cost of loans with different compounding frequencies.
                  </p>
                </div>

                <div className="text-center bg-purple-50 rounded-lg p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl md:text-2xl">📈</span>
                  </div>
                  <h4 className="font-semibold text-purple-700 text-sm md:text-base">Growth Analysis</h4>
                  <p className="text-xs text-gray-600">
                    Analyze how compounding frequency affects long-term wealth accumulation.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-base md:text-lg mr-2">⚠️</span>
                  <div>
                    <p className="text-xs text-yellow-800">
                      <strong>Important:</strong> Interest rate calculations are mathematical conversions. Real financial products may have 
                      additional fees, terms, or conditions. Always read the fine print and consult financial advisors.
                    </p>
                  </div>
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

export default CompoundInterestCalculator;