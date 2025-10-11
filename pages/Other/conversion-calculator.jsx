import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import {  ArrowRightLeft } from 'lucide-react';

const UnitConverter = () => {
  const [activeTab, setActiveTab] = useState('Length');
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const conversionData = {
    Length: {
      units: ['Meter', 'Kilometer', 'Centimeter', 'Millimeter', 'Micrometer', 'Nanometer', 'Mile', 'Yard', 'Foot', 'Inch'],
      factors: {
        'Meter': 1,
        'Kilometer': 1000,
        'Centimeter': 0.01,
        'Millimeter': 0.001,
        'Micrometer': 0.000001,
        'Nanometer': 0.000000001,
        'Mile': 1609.34,
        'Yard': 0.9144,
        'Foot': 0.3048,
        'Inch': 0.0254
      }
    },
    Temperature: {
      units: ['Celsius', 'Fahrenheit', 'Kelvin'],
      convert: (value, from, to) => {
        let celsius;
        
        switch(from) {
          case 'Celsius':
            celsius = value;
            break;
          case 'Fahrenheit':
            celsius = (value - 32) * 5/9;
            break;
          case 'Kelvin':
            celsius = value - 273.15;
            break;
          default:
            return 0;
        }
        
        switch(to) {
          case 'Celsius':
            return celsius;
          case 'Fahrenheit':
            return celsius * 9/5 + 32;
          case 'Kelvin':
            return celsius + 273.15;
          default:
            return 0;
        }
      }
    },
    Area: {
      units: ['Square Meter', 'Square Kilometer', 'Square Centimeter', 'Square Millimeter', 'Square Mile', 'Square Yard', 'Square Foot', 'Square Inch', 'Hectare', 'Acre'],
      factors: {
        'Square Meter': 1,
        'Square Kilometer': 1000000,
        'Square Centimeter': 0.0001,
        'Square Millimeter': 0.000001,
        'Square Mile': 2589988.11,
        'Square Yard': 0.836127,
        'Square Foot': 0.092903,
        'Square Inch': 0.00064516,
        'Hectare': 10000,
        'Acre': 4046.86
      }
    },
    Volume: {
      units: ['Liter', 'Milliliter', 'Cubic Meter', 'Cubic Centimeter', 'Cubic Inch', 'Cubic Foot', 'Gallon (US)', 'Quart (US)', 'Pint (US)', 'Cup (US)'],
      factors: {
        'Liter': 1,
        'Milliliter': 0.001,
        'Cubic Meter': 1000,
        'Cubic Centimeter': 0.001,
        'Cubic Inch': 0.0163871,
        'Cubic Foot': 28.3168,
        'Gallon (US)': 3.78541,
        'Quart (US)': 0.946353,
        'Pint (US)': 0.473176,
        'Cup (US)': 0.236588
      }
    },
    Weight: {
      units: ['Kilogram', 'Gram', 'Milligram', 'Pound', 'Ounce', 'Ton (Metric)', 'Ton (US)', 'Stone'],
      factors: {
        'Kilogram': 1,
        'Gram': 0.001,
        'Milligram': 0.000001,
        'Pound': 0.453592,
        'Ounce': 0.0283495,
        'Ton (Metric)': 1000,
        'Ton (US)': 907.185,
        'Stone': 6.35029
      }
    }
  };

  useEffect(() => {
    const units = conversionData[activeTab].units;
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setFromValue('');
    setResult('');
  }, [activeTab]);

  const performConversion = () => {
    if (fromValue && fromUnit && toUnit && !isNaN(fromValue)) {
      const value = parseFloat(fromValue);
      let convertedValue;

      if (activeTab === 'Temperature') {
        convertedValue = conversionData[activeTab].convert(value, fromUnit, toUnit);
      } else {
        const factors = conversionData[activeTab].factors;
        const baseValue = value * factors[fromUnit];
        convertedValue = baseValue / factors[toUnit];
      }

      setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setResult('');
    }
  };

  const clearAll = () => {
    setFromValue('');
    setResult('');
  };

  return (
    <>
      <Head>
        <title>Unit Conversion Calculator | Free Online Converter Tool</title>
        <meta
          name="description"
          content="Convert between different units of measurement with precision. Length, weight, temperature, area, and volume conversions made easy."
        />
        <meta name="keywords" content="Unit Converter, Unit Conversion Calculator, Length Converter, Weight Converter, Temperature Converter, Area Converter, Volume Converter" />
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header/>

        <div className="flex flex-1 max-w-7xl mx-auto w-full">
          
          {/* Sidebar */}
          <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}>
            <div className="bg-gray-900 text-white p-4 font-bold text-lg">
              Other Calculator Tools
            </div>
            <div className="p-0">
              <a href="/Other/age-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">⏰</span>
                  <span className="text-gray-900 font-medium">Age Calculator</span>
                </div>
              </a>
              <a href="/Other/date-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">📆</span>
                  <span className="text-gray-900 font-medium">Date Calculator</span>
                </div>
              </a>
              <a href="/Other/time-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">⏱️</span>
                  <span className="text-gray-900 font-medium">Time Calculator</span>
                </div>
              </a>
              <a href="/Other/hours-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">🕐</span>
                  <span className="text-gray-900 font-medium">Hours Calculator</span>
                </div>
              </a>
              <a href="/Other/gpa-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">📚</span>
                  <span className="text-gray-900 font-medium">GPA Calculator</span>
                </div>
              </a>
              <a href="/Other/grade-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">✏️</span>
                  <span className="text-gray-900 font-medium">Grade Calculator</span>
                </div>
              </a>
              <a href="/Other/concrete-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">🏗️</span>
                  <span className="text-gray-900 font-medium">Concrete Calculator</span>
                </div>
              </a>
              <a href="/Other/subnet-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">🌐</span>
                  <span className="text-gray-900 font-medium">Subnet Calculator</span>
                </div>
              </a>
              <a href="/Other/password-calculator">
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                  <span className="text-xl">🔒</span>
                  <span className="text-gray-900 font-medium">Password Generator</span>
                </div>
              </a>
              <a href="/Other/conversion-calculator">
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer transition-colors">
                  <span className="text-xl">🔄</span>
                  <span className="text-gray-900 font-semibold">Conversion Calculator</span>
                </div>
              </a>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 bg-white p-4 lg:p-8 overflow-y-auto lg:ml-44">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Unit Conversion Calculator</h1>
            
            <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
              Convert between different units of measurement with precision. Choose your conversion type and get instant, 
              accurate results for length, weight, temperature, area, and volume measurements.
            </p>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Length', 'Temperature', 'Area', 'Volume', 'Weight'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium rounded transition-colors text-sm lg:text-base ${
                    activeTab === tab
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Calculator Form */}
            <div className="bg-gray-50 p-4 lg:p-6 rounded-lg mb-6 lg:mb-8 shadow">
              <div className="bg-gray-900 text-white p-3 rounded-t-lg -mx-4 lg:-mx-6 -mt-4 lg:-mt-6 mb-6">
                <h2 className="font-bold flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5" />
                  Conversion Result
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Convert From
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {conversionData[activeTab].units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Input Value
                </label>
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="Enter value to convert"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Convert To
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  {conversionData[activeTab].units.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={performConversion}
                  className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
                >
                  Convert Units
                </button>
                <button
                  onClick={clearAll}
                  className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
                >
                  Reset
                </button>
              </div>

              {result && fromValue && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">
                      {fromValue} {fromUnit} = {result} {toUnit}
                    </div>
                    <div className="text-sm text-gray-600">
                      {activeTab} Conversion
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Unit Conversion Quick Tips */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Unit Conversion Quick Tips</h3>
              <ul className="space-y-2 text-gray-700 text-sm lg:text-base">
                <li>• Double-check your input values to ensure accurate conversions</li>
                <li>• Remember that temperature conversions use different formulas than linear conversions</li>
                <li>• For scientific calculations, consider using more decimal places for precision</li>
                <li>• Some conversions may have slight rounding differences due to decimal precision</li>
              </ul>
            </div>

            {/* Understanding Unit Conversions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Understanding Unit Conversions</h3>
              
              <p className="text-gray-700 mb-4 text-sm lg:text-base">
                Unit conversion is the process of converting a measurement from one unit to another. This calculator 
                uses standardized conversion factors to ensure accurate results across different measurement systems.
              </p>

              <p className="text-gray-700 mb-4 text-sm lg:text-base">
                Each measurement type (length, weight, temperature, etc.) has its own set of conversion factors. 
                The calculator first converts your input to a base unit, then converts from the base unit to your 
                desired output unit.
              </p>

              <p className="text-gray-700 text-sm lg:text-base">
                Temperature conversions are special because they don't use simple multiplication factors. Instead, 
                they require formulas that account for different zero points and scale differences between Celsius, 
                Fahrenheit, and Kelvin.
              </p>
            </div>

            {/* Common Conversion Examples */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-6">Common Conversion Examples</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl mb-3">📏</div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Length</h4>
                  <p className="text-xs lg:text-sm text-gray-600">1 meter = 3.28 feet<br/>1 kilometer = 0.62 miles</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl mb-3">⚖️</div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Weight</h4>
                  <p className="text-xs lg:text-sm text-gray-600">1 kilogram = 2.20 pounds<br/>1 ounce = 28.35 grams</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl mb-3">🌡️</div>
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Temperature</h4>
                  <p className="text-xs lg:text-sm text-gray-600">0°C = 32°F = 273.15K<br/>100°C = 212°F = 373.15K</p>
                </div>
              </div>
            </div>

            {/* Accuracy Notice */}
            <div className="bg-gray-900 text-white p-4 lg:p-6 rounded-lg mb-6 lg:mb-8 shadow">
              <h3 className="text-base lg:text-lg font-bold mb-3">Accuracy & Precision</h3>
              <p className="text-sm opacity-90">
                This calculator uses standard conversion factors and provides results with up to 6 decimal places. 
                For professional or scientific applications, always verify critical measurements with official standards 
                and consider consulting with measurement specialists.
              </p>
            </div>

            {/* Conversion Systems */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow">
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-6">Measurement Systems</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">Metric System (SI)</h4>
                  <p className="text-xs lg:text-sm text-gray-700 mb-2">
                    The International System of Units is used worldwide and based on decimal multiples. 
                    Base units include meter (length), kilogram (mass), and Celsius/Kelvin (temperature).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">Imperial System</h4>
                  <p className="text-xs lg:text-sm text-gray-700 mb-2">
                    Primarily used in the United States, this system includes units like feet, pounds, and 
                    Fahrenheit. It's based on historical standards rather than decimal multiples.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer/>
      </div>
    </>
  );
};

export default UnitConverter;