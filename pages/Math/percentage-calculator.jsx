import Link from 'next/link';
import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, BarChart3, TrendingUp, Info, RefreshCw,  } from 'lucide-react';

const PercentageCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [calculationMethod, setCalculationMethod] = useState('basic');
  const [basicCalc, setBasicCalc] = useState({ percentage: '', value: '' });
  const [phraseCalc1, setPhraseCalc1] = useState({ percentage: '', value: '' });
  const [phraseCalc2, setPhraseCalc2] = useState({ value: '', total: '' });
  const [phraseCalc3, setPhraseCalc3] = useState({ value: '', percentage: '' });
  const [diffCalc, setDiffCalc] = useState({ value1: '', value2: '' });
  const [changeCalc, setChangeCalc] = useState({ value: '', percentage: '', operation: 'increase' });
  const [results, setResults] = useState({
    basic: null, phrase1: null, phrase2: null, phrase3: null, difference: null, change: null
  });

  const calculateBasic = () => {
    const percentage = parseFloat(basicCalc.percentage);
    const value = parseFloat(basicCalc.value);
    if (isNaN(percentage) || isNaN(value)) return alert('Please enter valid numbers');
    const result = (percentage / 100) * value;
    setResults(prev => ({ ...prev, basic: parseFloat(result.toFixed(4)) }));
  };

  const calculatePhrase1 = () => {
    const percentage = parseFloat(phraseCalc1.percentage);
    const value = parseFloat(phraseCalc1.value);
    if (isNaN(percentage) || isNaN(value)) return alert('Please enter valid numbers');
    const result = (percentage / 100) * value;
    setResults(prev => ({ ...prev, phrase1: parseFloat(result.toFixed(4)) }));
  };

  const calculatePhrase2 = () => {
    const value = parseFloat(phraseCalc2.value);
    const total = parseFloat(phraseCalc2.total);
    if (isNaN(value) || isNaN(total) || total === 0) return alert('Please enter valid numbers (total cannot be zero)');
    const result = (value / total) * 100;
    setResults(prev => ({ ...prev, phrase2: parseFloat(result.toFixed(4)) }));
  };

  const calculatePhrase3 = () => {
    const value = parseFloat(phraseCalc3.value);
    const percentage = parseFloat(phraseCalc3.percentage);
    if (isNaN(value) || isNaN(percentage) || percentage === 0) return alert('Please enter valid numbers (percentage cannot be zero)');
    const result = (value / percentage) * 100;
    setResults(prev => ({ ...prev, phrase3: parseFloat(result.toFixed(4)) }));
  };

  const calculateDifference = () => {
    const value1 = parseFloat(diffCalc.value1);
    const value2 = parseFloat(diffCalc.value2);
    if (isNaN(value1) || isNaN(value2)) return alert('Please enter valid numbers');
    const average = (value1 + value2) / 2;
    if (average === 0) return alert('Average cannot be zero');
    const difference = Math.abs(value1 - value2);
    const result = (difference / average) * 100;
    setResults(prev => ({ ...prev, difference: parseFloat(result.toFixed(4)) }));
  };

  const calculateChange = () => {
    const value = parseFloat(changeCalc.value);
    const percentage = parseFloat(changeCalc.percentage);
    if (isNaN(value) || isNaN(percentage)) return alert('Please enter valid numbers');
    let result = changeCalc.operation === 'increase' 
      ? value * (1 + percentage / 100) 
      : value * (1 - percentage / 100);
    setResults(prev => ({ ...prev, change: parseFloat(result.toFixed(4)) }));
  };

  const resetCalculator = () => {
    setBasicCalc({ percentage: '', value: '' });
    setPhraseCalc1({ percentage: '', value: '' });
    setPhraseCalc2({ value: '', total: '' });
    setPhraseCalc3({ value: '', percentage: '' });
    setDiffCalc({ value1: '', value2: '' });
    setChangeCalc({ value: '', percentage: '', operation: 'increase' });
    setResults({ basic: null, phrase1: null, phrase2: null, phrase3: null, difference: null, change: null });
  };

  const executeCalculation = () => {
    switch(calculationMethod) {
      case 'basic': calculateBasic(); break;
      case 'phrase1': calculatePhrase1(); break;
      case 'phrase2': calculatePhrase2(); break;
      case 'phrase3': calculatePhrase3(); break;
      case 'difference': calculateDifference(); break;
      case 'change': calculateChange(); break;
      default: alert('Please select a calculation method');
    }
  };

  const getCurrentResult = () => {
    switch(calculationMethod) {
      case 'basic': return results.basic;
      case 'phrase1': return results.phrase1;
      case 'phrase2': return results.phrase2;
      case 'phrase3': return results.phrase3;
      case 'difference': return results.difference;
      case 'change': return results.change;
      default: return null;
    }
  };

  const getResultDisplay = () => {
    const result = getCurrentResult();
    if (result === null) return '';
    switch(calculationMethod) {
      case 'basic': return `${basicCalc.percentage}% of ${basicCalc.value} = ${result}`;
      case 'phrase1': return `${phraseCalc1.percentage}% of ${phraseCalc1.value} = ${result}`;
      case 'phrase2': return `${phraseCalc2.value} is ${result}% of ${phraseCalc2.total}`;
      case 'phrase3': return `${phraseCalc3.value} is ${phraseCalc3.percentage}% of ${result}`;
      case 'difference': return `Percentage Difference: ${result}%`;
      case 'change': return `${changeCalc.value} ${changeCalc.operation}d by ${changeCalc.percentage}% = ${result}`;
      default: return '';
    }
  };

  return (
     <>
     <Head>
        <title>Percentage Calculator | Free Online Math Tool


</title>
        <meta
          name="description"
          content="Use our free Percentage Calculator to quickly find percentages, percentage changes, and more. Fast, accurate, and easy-to-use online percentage tool.

  "
        />
        <meta name="keywords" content=" Percentage Calculator, Online Percentage Calculator, Free Percentage Calculator, Percent Calculator, Percentage Change Calculator, Math Percentage Calculator, Quick Percentage Calculator, Percentage Tool, Percentage Solver, Easy Percentage Calculator

" />
     
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Mobile Menu Button */}

        <Header/>
        

        {/* Sidebar */}
        {/* <div className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 pt-16`}> */}
          <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
          <div className="bg-[#1f456E] text-white p-4 font-bold text-lg">
            Math Calculator Tools
          </div>
          <div className="p-0">
            <Link href="/Math/scientific-calculator">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl">🔬</span>
                <span className="text- font-medium">Scientific Calculator</span>
              </div>
            </Link>
            <Link href="/Math/fraction-calculator">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl">➗</span>
                <span className="text-[#1f456e] font-medium">Fraction Calculator</span>
              </div>
            </Link>
            <Link href="/Math/percentage-calculator">
              <div className="flex items-center gap-3 px-4 py-3 bg-red-50 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl">📊</span>
                <span className="text-gray-900 font-semibold">Percentage Calculator</span>
              </div>
            </Link>
            <Link href="/Math/random-number-generator">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl">🎲</span>
                <span className="text-gray-900 font-medium">Random Number Generator</span>
              </div>
            </Link>
            <Link href="/Math/triangle-calculator">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl">🔺</span>
                <span className="text-gray-900 font-medium">Triangle Calculator</span>
              </div>
            </Link>
            <Link href="/Math/standard-deviation-calculator">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors">
                <span className="text-xl">📈</span>
                <span className="text-gray-900 font-medium">Standard Deviation Calculator</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-64 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-[#1a2433] text-white p-6">
                <h2 className="text-2xl font-bold mb-2">Percentage Calculator</h2>
                <p className="text-red-100 text-sm md:text-base">
                  Calculate percentages, ratios, and mathematical relationships with precision. 
                  Choose your calculation method and enter values to get accurate results instantly.
                </p>
              </div>

              <div className="p-4 md:p-8">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-[#1a2433] mb-3">Select Calculation Method</label>
                  <select value={calculationMethod} onChange={(e) => setCalculationMethod(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg">
                    <option value="basic">Basic Percentage (X% of Y)</option>
                    <option value="phrase1">What is X% of Y?</option>
                    <option value="phrase2">X is what % of Y?</option>
                    <option value="phrase3">X is Y% of what?</option>
                    <option value="difference">Percentage Difference</option>
                    <option value="change">Percentage Increase/Decrease</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
                  {calculationMethod === 'basic' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Percentage (%)</label>
                        <input type="number" value={basicCalc.percentage} onChange={(e) => setBasicCalc(prev => ({...prev, percentage: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter percentage" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Value</label>
                        <input type="number" value={basicCalc.value} onChange={(e) => setBasicCalc(prev => ({...prev, value: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter value" />
                      </div>
                    </>
                  )}
                  {calculationMethod === 'phrase1' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Percentage (%)</label>
                        <input type="number" value={phraseCalc1.percentage} onChange={(e) => setPhraseCalc1(prev => ({...prev, percentage: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter percentage" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Of Value</label>
                        <input type="number" value={phraseCalc1.value} onChange={(e) => setPhraseCalc1(prev => ({...prev, value: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter value" />
                      </div>
                    </>
                  )}
                  {calculationMethod === 'phrase2' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-[#1a2433] mb-2">Part Value</label>
                        <input type="number" value={phraseCalc2.value} onChange={(e) => setPhraseCalc2(prev => ({...prev, value: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter part value" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Total Value</label>
                        <input type="number" value={phraseCalc2.total} onChange={(e) => setPhraseCalc2(prev => ({...prev, total: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter total value" />
                      </div>
                    </>
                  )}
                  {calculationMethod === 'phrase3' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Known Value</label>
                        <input type="number" value={phraseCalc3.value} onChange={(e) => setPhraseCalc3(prev => ({...prev, value: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter known value" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Percentage (%)</label>
                        <input type="number" value={phraseCalc3.percentage} onChange={(e) => setPhraseCalc3(prev => ({...prev, percentage: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter percentage" />
                      </div>
                    </>
                  )}
                  {calculationMethod === 'difference' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">First Value</label>
                        <input type="number" value={diffCalc.value1} onChange={(e) => setDiffCalc(prev => ({...prev, value1: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter first value" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Second Value</label>
                        <input type="number" value={diffCalc.value2} onChange={(e) => setDiffCalc(prev => ({...prev, value2: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter second value" />
                      </div>
                    </>
                  )}
                  {calculationMethod === 'change' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Original Value</label>
                        <input type="number" value={changeCalc.value} onChange={(e) => setChangeCalc(prev => ({...prev, value: e.target.value}))} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter original value" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1a2433] mb-2">Percentage Change (%)</label>
                        <div className="flex gap-2">
                          <select value={changeCalc.operation} onChange={(e) => setChangeCalc(prev => ({...prev, operation: e.target.value}))} className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                            <option value="increase">Increase</option>
                            <option value="decrease">Decrease</option>
                          </select>
                          <input type="number" value={changeCalc.percentage} onChange={(e) => setChangeCalc(prev => ({...prev, percentage: e.target.value}))} className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-base md:text-lg" placeholder="Enter %" />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button onClick={executeCalculation} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg">
                    <Calculator className="w-5 h-5" /><span>Calculate</span>
                  </button>
                  <button onClick={resetCalculator} className="sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg">
                    <RefreshCw className="w-5 h-5" /><span>Clear</span>
                  </button>
                </div>

                {getCurrentResult() !== null && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center mb-3">
                      <BarChart3 className="w-6 h-6 mr-3 text-green-600" />
                      <h3 className="text-xl font-bold text-[#1a2433]">Result</h3>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-green-700 break-words">{getResultDisplay()}</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Percentage Calculations</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-[#1a2433] mb-2">What is a Percentage?</h4>
                  <p className="text-gray-600 text-sm">A percentage is a number or ratio expressed as a fraction of 100. It is denoted using the percent symbol "%". For example, 45% means 45 out of 100, or 45/100, or 0.45.</p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#1a2433] mb-2">Basic Formula</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-[#1a2433] font-mono text-sm">Percentage = (Part/Whole) × 100</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#1a2433] mb-2">Common Uses</h4>
                  <ul className="text-[#1a2433] text-sm space-y-1 list-disc list-inside">
                    <li>Calculate discounts and tax rates</li>
                    <li>Analyze data and statistics</li>
                    <li>Measure growth and change over time</li>
                    <li>Express proportions and ratios</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <p className="text-blue-800 text-sm"><strong>Quick Tip:</strong> To convert a percentage to a decimal, divide by 100. To convert a decimal to a percentage, multiply by 100.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 mb-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Using Your Statistics for Data Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <div className="bg-green-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-green-800 mb-3 text-lg">Data Quality Assessment</h4>
                  <p className="text-sm text-green-700">Monitor data consistency, identify outliers, and assess distribution patterns based on statistical measures and variability analysis.</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-blue-800 mb-3 text-lg">Decision Making</h4>
                  <p className="text-sm text-blue-700">Use statistical measures to make informed decisions throughout your analysis process and performance evaluation.</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="bg-purple-100 w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Calculator className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-purple-800 mb-3 text-lg">Trend Analysis</h4>
                  <p className="text-sm text-purple-700">Plan statistical monitoring, forecasting models, and analytical preparation around your statistical distribution patterns.</p>
                </div>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
                <div className="flex items-center mb-3">
                  <Info className="w-6 h-6 text-yellow-600 mr-3" />
                  <span className="font-semibold text-yellow-800 text-lg">Statistical Analysis Tips:</span>
                </div>
                <ul className="text-yellow-700 space-y-2 text-sm">
                  <li>• Always validate your percentage calculations with multiple methods when dealing with critical data</li>
                  <li>• Consider margin of error and confidence intervals for statistical significance</li>
                  <li>• Use percentage calculations to identify trends and patterns in your datasets</li>
                  <li>• Combine percentage analysis with other statistical measures for comprehensive insights</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
      </>
   
  );
};

export default PercentageCalculator;