import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import Head from "next/head";
import Link from 'next/link';
import { Calculator, BarChart3, TrendingUp,  RefreshCw } from 'lucide-react';

const StandardDeviationCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inputData, setInputData] = useState('11, 12, 23, 23, 16, 23, 21, 18');
  const [dataType, setDataType] = useState('Population');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);

  const parseNumbers = (input) => {
    try {
      const numbers = input
        .split(/[,\s\n\t]+/)
        .map(str => str.trim())
        .filter(str => str !== '' && str !== ',')
        .map(str => {
          const num = parseFloat(str);
          if (isNaN(num)) throw new Error(`"${str}" is not a valid number`);
          return num;
        });
      
      if (numbers.length === 0) throw new Error('No valid numbers found');
      return numbers;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const calculateMean = (numbers) => {
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  };

  const calculateVariance = (numbers, mean, isPopulation = true) => {
    const sumSquaredDiffs = numbers.reduce((sum, num) => {
      const diff = num - mean;
      return sum + (diff * diff);
    }, 0);
    
    const divisor = isPopulation ? numbers.length : numbers.length - 1;
    return sumSquaredDiffs / divisor;
  };

  const calculateStandardDeviation = (variance) => {
    return Math.sqrt(variance);
  };

  const getZScore = (confidenceLevel) => {
    const zScores = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576,
      0.999: 3.291
    };
    return zScores[confidenceLevel] || 1.96;
  };

  const calculateMarginOfError = (standardDeviation, sampleSize, confidenceLevel = 0.95) => {
    const zScore = getZScore(confidenceLevel);
    const standardError = standardDeviation / Math.sqrt(sampleSize);
    return zScore * standardError;
  };

  const calculate = () => {
    setError('');
    
    try {
      const numbers = parseNumbers(inputData);
      
      if (numbers.length < 2 && dataType === 'Sample') {
        setError('Sample standard deviation requires at least 2 data points.');
        return;
      }

      if (numbers.length < 1) {
        setError('At least 1 data point is required.');
        return;
      }

      const mean = calculateMean(numbers);
      const isPopulation = dataType === 'Population';
      const variance = calculateVariance(numbers, mean, isPopulation);
      const standardDeviation = calculateStandardDeviation(variance);
      const marginOfError = calculateMarginOfError(standardDeviation, numbers.length, confidenceLevel);
      
      const sortedNumbers = [...numbers].sort((a, b) => a - b);
      const min = sortedNumbers[0];
      const max = sortedNumbers[sortedNumbers.length - 1];
      const range = max - min;
      const sum = numbers.reduce((sum, num) => sum + num, 0);
      
      const median = sortedNumbers.length % 2 === 0
        ? (sortedNumbers[sortedNumbers.length / 2 - 1] + sortedNumbers[sortedNumbers.length / 2]) / 2
        : sortedNumbers[Math.floor(sortedNumbers.length / 2)];

      const frequency = {};
      let maxFreq = 0;
      let modes = [];
      
      numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
          maxFreq = frequency[num];
          modes = [num];
        } else if (frequency[num] === maxFreq && maxFreq > 1) {
          modes.push(num);
        }
      });

      if (maxFreq === 1) modes = [];

      const coefficientOfVariation = (standardDeviation / Math.abs(mean)) * 100;

      setResults({
        count: numbers.length,
        sum: sum,
        mean: mean,
        median: median,
        mode: modes,
        range: range,
        min: min,
        max: max,
        variance: variance,
        standardDeviation: standardDeviation,
        marginOfError: marginOfError,
        confidenceLevel: confidenceLevel,
        dataType: dataType,
        coefficientOfVariation: coefficientOfVariation,
        standardError: standardDeviation / Math.sqrt(numbers.length)
      });

    } catch (err) {
      setError(err.message);
      setResults(null);
    }
  };

  const clear = () => {
    setInputData('');
    setDataType('Population');
    setConfidenceLevel(0.95);
    setResults(null);
    setError('');
  };

  const formatNumber = (num, precision = 4) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A';
    return Number(num).toFixed(precision).replace(/\.?0+$/, '');
  };

  const generateSampleData = (type) => {
    let data = [];
    switch (type) {
      case 'normal':
        data = [85, 87, 89, 91, 93, 95, 97, 99, 101, 103, 105, 107, 109, 111, 113];
        break;
      case 'scores':
        data = [78, 82, 85, 88, 90, 92, 94, 96, 98, 100];
        break;
      case 'temperatures':
        data = [68.2, 69.1, 70.5, 71.8, 72.3, 73.0, 73.7, 74.2, 74.8, 75.5];
        break;
      default:
        data = [11, 12, 23, 23, 16, 23, 21, 18];
    }
    setInputData(data.join(', '));
  };

  return (
     <>
     <Head>
        <title>Standard Deviation Calculator | Free Online Stats Tool


</title>
        <meta
          name="description"
          content="Use our free Standard Deviation Calculator to quickly compute data dispersion and variation. Fast, accurate, and perfect for students, researchers, and analysts.

  
  "
        />
        <meta name="keywords" content=" Standard Deviation Calculator, Online Standard Deviation Calculator, Free Standard Deviation Calculator, Statistics Standard Deviation Calculator, SD Calculator, Data Standard Deviation Calculator, Sample Standard Deviation Calculator, Population Standard Deviation Calculator, Variance Calculator, Math Standard Deviation Calculator 
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
        <div className="bg-[#111827] text-white p-4 font-bold text-lg">
          Math Calculator Tools
        </div>
        <div className="p-0">
          <Link href="/Math/scientific-calculator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🔬</span>
              <span className="text-gray-900 font-medium">Scientific Calculator</span>
            </div>
          </Link>
          <Link href="/Math/fraction-calculator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">➗</span>
              <span className="text-gray-900 font-medium">Fraction Calculator</span>
            </div>
          </Link>
          <Link href="/Math/percentage-calculator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">📊</span>
              <span className="text-gray-900 font-medium">Percentage Calculator</span>
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
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 cursor-pointer transition-colors">
              <span className="text-xl">📈</span>
              <span className="text-gray-900 font-semibold">Standard Deviation Calculator</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gray-900 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Standard Deviation Calculator</h2>
              <p className="text-red-100 text-sm md:text-base">
                Calculate standard deviation, variance, and comprehensive statistical analysis for your data set. 
                Enter your numbers and get detailed insights including confidence intervals and distribution analysis.
              </p>
            </div>

           <div className="p-4 md:p-8">
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-3">Calculate Based On</label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <select 
        value={dataType}
        onChange={(e) => setDataType(e.target.value)}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
      >
        <option value="Population">Population (σ)</option>
        <option value="Sample">Sample (s)</option>
      </select>
      
      <select
        value={confidenceLevel}
        onChange={(e) => setConfidenceLevel(parseFloat(e.target.value))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
      >
        <option value={0.90}>90% Confidence Level</option>
        <option value={0.95}>95% Confidence Level</option>
        <option value={0.99}>99% Confidence Level</option>
        <option value={0.999}>99.9% Confidence Level</option>
      </select>
    </div>
  </div>

  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-3">Your Data Set</label>
    <textarea
      value={inputData}
      onChange={(e) => setInputData(e.target.value)}
      className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
      rows="4"
      placeholder="Enter numbers separated by commas: 11, 12, 23, 23, 16, 23, 21, 18"
    />
    <div className="mt-2 text-sm text-gray-500">
      <span className="font-medium">Sample data:</span>
      <button onClick={() => generateSampleData('normal')} className="ml-2 text-gray-900 hover:underline">Normal Distribution</button> |
      <button onClick={() => generateSampleData('scores')} className="ml-1 text-gray-900 hover:underline">Test Scores</button> |
      <button onClick={() => generateSampleData('temperatures')} className="ml-1 text-gray-900 hover:underline">Temperatures</button>
    </div>
  </div>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={calculate}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span>Calculate Statistics</span>
                </button>
                <button
                  onClick={clear}
                  className="sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-gray-900 px-6 py-4 rounded-lg mb-6">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {/* Results */}
              {results && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Statistical Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="text-center p-6 bg-white rounded-lg shadow border">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {formatNumber(results.standardDeviation)}
                      </div>
                      <div className="text-sm text-gray-600">Standard Deviation ({results.dataType === 'Population' ? 'σ' : 's'})</div>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-lg shadow border">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {formatNumber(results.variance)}
                      </div>
                      <div className="text-sm text-gray-600">Variance ({results.dataType === 'Population' ? 'σ²' : 's²'})</div>
                    </div>
                    
                    <div className="text-center p-6 bg-white rounded-lg shadow border">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        {formatNumber(results.mean)}
                      </div>
                      <div className="text-sm text-gray-600">Mean ({results.dataType === 'Population' ? 'μ' : 'x̄'})</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-orange-600">{results.count}</div>
                      <div className="text-sm text-gray-600">Count</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-red-600">{formatNumber(results.sum)}</div>
                      <div className="text-sm text-gray-600">Sum</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-indigo-600">{formatNumber(results.median)}</div>
                      <div className="text-sm text-gray-600">Median</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg border">
                      <div className="text-2xl font-bold text-teal-600">{formatNumber(results.range)}</div>
                      <div className="text-sm text-gray-600">Range</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Standard Deviation</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">What is Standard Deviation?</h4>
                <p className="text-gray-600 text-sm">
                  Standard deviation measures the spread of data around the mean. A low standard deviation indicates 
                  that data points tend to be close to the mean, while a high standard deviation indicates greater variability.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Population vs Sample</h4>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li><strong>Population:</strong> Use when you have data for the entire group</li>
                  <li><strong>Sample:</strong> Use when you have data from a subset of the population</li>
                </ul>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-blue-800 text-sm"><strong>Quick Tip:</strong> Standard deviation is widely used in finance, research, quality control, and data analysis to understand data variability.</p>
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="mt-6 mb-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Common Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Research & Analysis</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Quality control in manufacturing</li>
                  <li>• Financial risk assessment</li>
                  <li>• Scientific research analysis</li>
                  <li>• Educational testing and grading</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Practical Uses</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Weather forecasting</li>
                  <li>• Medical studies and trials</li>
                  <li>• Market research and surveys</li>
                  <li>• Performance metrics tracking</li>
                </ul>
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

export default StandardDeviationCalculator;