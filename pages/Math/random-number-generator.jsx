import React, { useState } from 'react';
import Link from 'next/link';
import Head from "next/head"
import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import { Calculator, Shuffle, Download, Copy, RefreshCw, Dice6, Target, BarChart3,  } from 'lucide-react';

const RandomNumberGenerator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [basicGenerator, setBasicGenerator] = useState({
    lowerLimit: 1,
    upperLimit: 100
  });

  const [comprehensiveGenerator, setComprehensiveGenerator] = useState({
    lowerLimit: 0.2,
    upperLimit: 112.5,
    count: 1,
    type: 'Decimal',
    precision: 2
  });

  const [advancedGenerator, setAdvancedGenerator] = useState({
    distributionType: 'uniform',
    mean: 50,
    standardDeviation: 15,
    count: 10,
    allowDuplicates: true,
    sortResults: false
  });

  const [results, setResults] = useState({
    basic: [],
    comprehensive: [],
    advanced: []
  });

  const [copySuccess, setCopySuccess] = useState('');

  const generateRandomInteger = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateRandomDecimal = (min, max, precision) => {
    const random = Math.random() * (max - min) + min;
    return parseFloat(random.toFixed(precision));
  };

  const generateNormalRandom = (mean, stdDev) => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return z * stdDev + mean;
  };

  const generateBasicRandom = () => {
    const { lowerLimit, upperLimit } = basicGenerator;
    
    if (lowerLimit >= upperLimit) {
      alert('Lower limit must be less than upper limit');
      return;
    }
    
    const randomNumber = generateRandomInteger(lowerLimit, upperLimit);
    setResults(prev => ({
      ...prev,
      basic: [randomNumber]
    }));
  };

  const generateComprehensiveRandom = () => {
    const { lowerLimit, upperLimit, count, type, precision } = comprehensiveGenerator;
    
    if (lowerLimit >= upperLimit) {
      alert('Lower limit must be less than upper limit');
      return;
    }
    
    if (count <= 0 || count > 10000) {
      alert('Please enter a valid count between 1 and 10000');
      return;
    }
    
    const generatedNumbers = [];
    
    for (let i = 0; i < count; i++) {
      let randomNumber;
      
      if (type === 'Integer') {
        randomNumber = generateRandomInteger(lowerLimit, upperLimit);
      } else {
        randomNumber = generateRandomDecimal(lowerLimit, upperLimit, precision);
      }
      
      generatedNumbers.push(randomNumber);
    }
    
    setResults(prev => ({
      ...prev,
      comprehensive: generatedNumbers
    }));
  };

  const generateAdvancedRandom = () => {
    const { distributionType, mean, standardDeviation, count, allowDuplicates, sortResults } = advancedGenerator;
    
    if (count <= 0 || count > 10000) {
      alert('Please enter a valid count between 1 and 10000');
      return;
    }
    
    let generatedNumbers = [];
    
    for (let i = 0; i < count; i++) {
      let randomNumber;
      
      switch (distributionType) {
        case 'normal':
          randomNumber = Math.round(generateNormalRandom(mean, standardDeviation));
          break;
        case 'uniform':
          randomNumber = generateRandomInteger(1, 100);
          break;
        case 'exponential':
          randomNumber = Math.round(-Math.log(1 - Math.random()) * 10);
          break;
        default:
          randomNumber = generateRandomInteger(1, 100);
      }
      
      if (!allowDuplicates && generatedNumbers.includes(randomNumber)) {
        i--;
        continue;
      }
      
      generatedNumbers.push(randomNumber);
    }
    
    if (sortResults) {
      generatedNumbers.sort((a, b) => a - b);
    }
    
    setResults(prev => ({
      ...prev,
      advanced: generatedNumbers
    }));
  };

  const copyToClipboard = (numbers) => {
    const text = numbers.join(', ');
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const downloadResults = (numbers, filename) => {
    const text = numbers.join('\n');
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearBasic = () => {
    setBasicGenerator({
      lowerLimit: 0,
      upperLimit: 0
    });
    setResults(prev => ({
      ...prev,
      basic: []
    }));
  };

  const clearComprehensive = () => {
    setComprehensiveGenerator({
      lowerLimit: 0,
      upperLimit: 0,
      count: 0,
      type: 'Decimal',
      precision: 2
    });
    setResults(prev => ({
      ...prev,
      comprehensive: []
    }));
  };

  const clearAdvanced = () => {
    setAdvancedGenerator({
      distributionType: 'uniform',
      mean: 0,
      standardDeviation: 0,
      count: 0,
      allowDuplicates: true,
      sortResults: false
    });
    setResults(prev => ({
      ...prev,
      advanced: []
    }));
  };

  return (
     <>
     <Head>
        <title>Random Number Generator | Free Online Number Tool


</title>
        <meta
          name="description"
          content="Use our free Random Number Generator to create random numbers instantly. Quick, easy, and perfect for games, contests, and statistical needs online.

  
  "
        />
        <meta name="keywords" content=" Random Number Generator, Online Random Number Generator, Free Random Number Generator, Number Generator Tool, Random Number Picker, Random Digit Generator, Random Number Calculator, Free Number Generator, Quick Random Number Generator, Random Value Generator

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
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🎲</span>
              <span className="text-gray-900 font-semibold">Random Number Generator</span>
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
            <div className="bg-gray-900 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">Random Number Generator</h2>
              <p className="text-red-100 text-sm md:text-base">
                Generate random numbers for statistical analysis, simulations, gaming, and research. 
                Choose from basic integer generation, comprehensive decimal control, or advanced distribution patterns.
              </p>
            </div>

            <div className="p-4 md:p-8">
              {/* Basic Random Number Generator */}
              <div className="mb-8">
  <div className="flex items-center gap-3 mb-4">
    <Target className="w-6 h-6 text-gray-900" />
    <h3 className="text-xl font-bold text-gray-900">Quick Random Generator</h3>
  </div>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Lower Limit</label>
      <input
        type="number"
        value={basicGenerator.lowerLimit}
        onChange={(e) => setBasicGenerator(prev => ({...prev, lowerLimit: parseInt(e.target.value) || 0}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Enter lower limit"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Upper Limit</label>
      <input
        type="number"
        value={basicGenerator.upperLimit}
        onChange={(e) => setBasicGenerator(prev => ({...prev, upperLimit: parseInt(e.target.value) || 0}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2 text-base md:text-lg"
        placeholder="Enter upper limit"
      />
    </div>
  </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={generateBasicRandom}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                  >
                    <Shuffle className="w-5 h-5" />
                    <span>Generate Number</span>
                  </button>
                  <button
                    onClick={clearBasic}
                    className="sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Clear</span>
                  </button>
                </div>

                {results.basic.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xl font-bold text-gray-800">Generated Number</h4>
                      <button
                        onClick={() => copyToClipboard(results.basic)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <div className="text-4xl font-bold text-green-700 text-center py-4">
                      {results.basic[0]}
                    </div>
                  </div>
                )}
              </div>

              {/* Comprehensive Generator */}
              <div className="mb-8">
  <div className="flex items-center gap-3 mb-4">
    <BarChart3 className="w-6 h-6 text-gray-900" />
    <h3 className="text-xl font-bold text-gray-900">Advanced Generator</h3>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Lower Limit</label>
      <input
        type="number"
        step="0.01"
        value={comprehensiveGenerator.lowerLimit}
        onChange={(e) => setComprehensiveGenerator(prev => ({...prev, lowerLimit: parseFloat(e.target.value) || 0}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none   text-base md:text-lg"
        placeholder="Enter lower limit"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Upper Limit</label>
      <input
        type="number"
        step="0.01"
        value={comprehensiveGenerator.upperLimit}
        onChange={(e) => setComprehensiveGenerator(prev => ({...prev, upperLimit: parseFloat(e.target.value) || 0}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Enter upper limit"
      />
    </div>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Number Count</label>
      <input
        type="number"
        min="1"
        max="10000"
        value={comprehensiveGenerator.count}
        onChange={(e) => setComprehensiveGenerator(prev => ({...prev, count: parseInt(e.target.value) || 0}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2 text-base md:text-lg"
        placeholder="Count"
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Number Type</label>
      <select
        value={comprehensiveGenerator.type}
        onChange={(e) => setComprehensiveGenerator(prev => ({...prev, type: e.target.value}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
      >
        <option value="Integer">Integer</option>
        <option value="Decimal">Decimal</option>
      </select>
    </div>

    {comprehensiveGenerator.type === 'Decimal' && (
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Decimal Places</label>
        <input
          type="number"
          min="1"
          max="10"
          value={comprehensiveGenerator.precision}
          onChange={(e) => setComprehensiveGenerator(prev => ({...prev, precision: parseInt(e.target.value) || 1}))}
          className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2 text-base md:text-lg"
          placeholder="Precision"
        />
      </div>
    )}
  </div>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={generateComprehensiveRandom}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                  >
                    <Shuffle className="w-5 h-5" />
                    <span>Generate Numbers</span>
                  </button>
                  <button
                    onClick={clearComprehensive}
                    className="sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Clear</span>
                  </button>
                </div>

                {results.comprehensive.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-gray-800">
                        Generated Numbers ({results.comprehensive.length})
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(results.comprehensive)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                        <button
                          onClick={() => downloadResults(results.comprehensive, 'random-numbers.txt')}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto">
                      {results.comprehensive.length === 1 ? (
                        <div className="text-4xl font-bold text-green-700 text-center py-4">
                          {results.comprehensive[0]}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                          {results.comprehensive.map((number, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border shadow-sm text-center font-mono font-semibold text-green-700">
                              {number}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {results.comprehensive.length > 1 && (
                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="bg-white p-3 rounded-lg text-center border">
                          <div className="font-bold text-green-700">{results.comprehensive.length}</div>
                          <div className="text-gray-600">Count</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center border">
                          <div className="font-bold text-green-700">{Math.min(...results.comprehensive)}</div>
                          <div className="text-gray-600">Minimum</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center border">
                          <div className="font-bold text-green-700">{Math.max(...results.comprehensive)}</div>
                          <div className="text-gray-600">Maximum</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg text-center border">
                          <div className="font-bold text-green-700">{(results.comprehensive.reduce((a, b) => a + b, 0) / results.comprehensive.length).toFixed(2)}</div>
                          <div className="text-gray-600">Average</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Advanced Distribution Generator */}
              <div className="mb-8">
  <h3 className="text-xl font-bold text-gray-900 mb-4">Distribution-Based Generator</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Distribution Type</label>
      <select
        value={advancedGenerator.distributionType}
        onChange={(e) => setAdvancedGenerator(prev => ({...prev, distributionType: e.target.value}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
      >
        <option value="uniform">Uniform Distribution</option>
        <option value="normal">Normal Distribution</option>
        <option value="exponential">Exponential Distribution</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Number Count</label>
      <input
        type="number"
        min="1"
        max="1000"
        value={advancedGenerator.count}
        onChange={(e) => setAdvancedGenerator(prev => ({...prev, count: parseInt(e.target.value) || 0}))}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Count"
      />
    </div>
  </div>

  {advancedGenerator.distributionType === 'normal' && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Mean</label>
        <input
          type="number"
          value={advancedGenerator.mean}
          onChange={(e) => setAdvancedGenerator(prev => ({...prev, mean: parseFloat(e.target.value) || 0}))}
          className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
          placeholder="Mean"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Standard Deviation</label>
        <input
          type="number"
          value={advancedGenerator.standardDeviation}
          onChange={(e) => setAdvancedGenerator(prev => ({...prev, standardDeviation: parseFloat(e.target.value) || 0}))}
          className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
          placeholder="Std Dev"
        />
      </div>
    </div>
  )}

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <div className="flex items-center">
      <input
        type="checkbox"
        id="allowDuplicates"
        checked={advancedGenerator.allowDuplicates}
        onChange={(e) => setAdvancedGenerator(prev => ({...prev, allowDuplicates: e.target.checked}))}
        className="mr-3 w-4 h-4 text-gray-900 "
      />
      <label htmlFor="allowDuplicates" className="text-sm font-medium text-gray-900">Allow Duplicate Numbers</label>
    </div>
    <div className="flex items-center">
      <input
        type="checkbox"
        id="sortResults"
        checked={advancedGenerator.sortResults}
        onChange={(e) => setAdvancedGenerator(prev => ({...prev, sortResults: e.target.checked}))}
        className="mr-3 w-4 h-4 text-gray-900 "
      />
      <label htmlFor="sortResults" className="text-sm font-medium text-gray-900">Sort Results Ascending</label>
    </div>
  </div>
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  <button
                    onClick={generateAdvancedRandom}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                  >
                    <BarChart3 className="w-5 h-5" />
                    <span>Generate Distribution</span>
                  </button>
                  <button
                    onClick={clearAdvanced}
                    className="sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Clear</span>
                  </button>
                </div>

                {results.advanced.length > 0 && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xl font-bold text-gray-800">
                        Distribution Results ({results.advanced.length})
                      </h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copyToClipboard(results.advanced)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                        <button
                          onClick={() => downloadResults(results.advanced, `${advancedGenerator.distributionType}-distribution.txt`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                        {results.advanced.map((number, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg border shadow-sm text-center font-mono font-semibold text-purple-700">
                            {number}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="bg-white p-3 rounded-lg text-center border">
                        <div className="font-bold text-purple-700">{results.advanced.length}</div>
                        <div className="text-gray-600">Count</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center border">
                        <div className="font-bold text-purple-700">{Math.min(...results.advanced)}</div>
                        <div className="text-gray-600">Minimum</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center border">
                        <div className="font-bold text-purple-700">{Math.max(...results.advanced)}</div>
                        <div className="text-gray-600">Maximum</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center border">
                        <div className="font-bold text-purple-700">{(results.advanced.reduce((a, b) => a + b, 0) / results.advanced.length).toFixed(2)}</div>
                        <div className="text-gray-600">Average</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg text-center border">
                        <div className="font-bold text-purple-700">{advancedGenerator.distributionType}</div>
                        <div className="text-gray-600">Distribution</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Random Number Generation</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">What Are Random Numbers?</h4>
                <p className="text-gray-600 text-sm">
                  Random numbers are sequences that lack any predictable pattern and appear to occur by chance. 
                  They're essential in statistics, simulations, cryptography, and many computational applications.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Distribution Types</h4>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li><strong>Uniform:</strong> All values equally likely within range</li>
                  <li><strong>Normal:</strong> Bell curve distribution around mean</li>
                  <li><strong>Exponential:</strong> Decreasing probability for larger values</li>
                </ul>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-blue-800 text-sm"><strong>Quick Tip:</strong> Use uniform distribution for simple randomization, normal distribution for statistical modeling, and exponential for time-based events.</p>
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="mt-6 mb-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Common Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Statistical Analysis</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Statistical sampling and analysis</li>
                  <li>• Monte Carlo simulations</li>
                  <li>• Scientific research and modeling</li>
                  <li>• Software testing and QA</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Practical Uses</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• Gaming and lottery systems</li>
                  <li>• Cryptographic key generation</li>
                  <li>• Art and creative applications</li>
                  <li>• Educational demonstrations</li>
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

export default RandomNumberGenerator;