import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, } from 'lucide-react';

const FractionCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [num1, setNum1] = useState('2');
  const [den1, setDen1] = useState('9');
  const [num2, setNum2] = useState('3');
  const [den2, setDen2] = useState('8');
  const [operation, setOperation] = useState('+');
  const [basicResult, setBasicResult] = useState('');

  const [mixedNum1, setMixedNum1] = useState('-1 3/4');
  const [mixedNum2, setMixedNum2] = useState('2 5/7');
  const [mixedOperation, setMixedOperation] = useState('+');
  const [mixedResult, setMixedResult] = useState('');

  const [simplifyNum, setSimplifyNum] = useState('101');
  const [simplifyDen, setSimplifyDen] = useState('980');
  const [simplifyResult, setSimplifyResult] = useState('');

  const [decimal, setDecimal] = useState('1.375');
  const [decimalResult, setDecimalResult] = useState('');

  const [fracToDecNum, setFracToDecNum] = useState('2');
  const [fracToDecDen, setFracToDecDen] = useState('9');
  const [fracToDecResult, setFracToDecResult] = useState('');

  const [bigNum1, setBigNum1] = useState('1234');
  const [bigDen1, setBigDen1] = useState('748892928829');
  const [bigNum2, setBigNum2] = useState('3343442113223223433');
  const [bigDen2, setBigDen2] = useState('88772773882828828288');
  const [bigOperation, setBigOperation] = useState('+');
  const [bigResult, setBigResult] = useState('');

  const gcd = (a, b) => {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  };

  const simplifyFraction = (num, den) => {
    if (den === 0) return { num: 0, den: 1 };
    const divisor = gcd(num, den);
    let simplifiedNum = num / divisor;
    let simplifiedDen = den / divisor;
    
    if (simplifiedDen < 0) {
      simplifiedNum = -simplifiedNum;
      simplifiedDen = -simplifiedDen;
    }
    
    return { num: simplifiedNum, den: simplifiedDen };
  };

  const parseMixedNumber = (mixed) => {
    const trimmed = mixed.trim();
    const parts = trimmed.split(' ');
    
    if (parts.length === 1) {
      if (parts[0].includes('/')) {
        const [num, den] = parts[0].split('/').map(Number);
        return { whole: 0, num: num || 0, den: den || 1 };
      } else {
        return { whole: Number(parts[0]) || 0, num: 0, den: 1 };
      }
    } else if (parts.length === 2) {
      const whole = Number(parts[0]) || 0;
      if (parts[1].includes('/')) {
        const [num, den] = parts[1].split('/').map(Number);
        return { whole, num: num || 0, den: den || 1 };
      }
    }
    
    return { whole: 0, num: 0, den: 1 };
  };

  const mixedToImproper = (whole, num, den) => {
    if (whole < 0) {
      return { num: whole * den - Math.abs(num), den };
    }
    return { num: whole * den + Math.abs(num), den };
  };

  const improperToMixed = (num, den) => {
    const simplified = simplifyFraction(num, den);
    const whole = Math.floor(Math.abs(simplified.num) / simplified.den);
    const remainder = Math.abs(simplified.num) % simplified.den;
    
    if (simplified.num < 0) {
      return { whole: -whole, num: remainder, den: simplified.den };
    }
    return { whole, num: remainder, den: simplified.den };
  };

  const formatMixedNumber = (whole, num, den) => {
    if (num === 0 || den === 0) return whole.toString();
    if (whole === 0) return `${num}/${den}`;
    if (whole < 0 && num > 0) {
      return `${whole} ${num}/${den}`;
    }
    return `${whole} ${Math.abs(num)}/${den}`;
  };

  const calculateBasicFraction = () => {
    const n1 = parseInt(num1) || 0;
    const d1 = parseInt(den1) || 1;
    const n2 = parseInt(num2) || 0;
    const d2 = parseInt(den2) || 1;

    if (d1 === 0 || d2 === 0) {
      setBasicResult('Error: Division by zero');
      return;
    }

    let resultNum, resultDen;

    switch (operation) {
      case '+':
        resultNum = n1 * d2 + n2 * d1;
        resultDen = d1 * d2;
        break;
      case '-':
        resultNum = n1 * d2 - n2 * d1;
        resultDen = d1 * d2;
        break;
      case '*':
        resultNum = n1 * n2;
        resultDen = d1 * d2;
        break;
      case '/':
        if (n2 === 0) {
          setBasicResult('Error: Division by zero');
          return;
        }
        resultNum = n1 * d2;
        resultDen = d1 * n2;
        break;
      default:
        resultNum = 0;
        resultDen = 1;
    }

    const simplified = simplifyFraction(resultNum, resultDen);
    const mixed = improperToMixed(simplified.num, simplified.den);
    
    if (mixed.num === 0) {
      setBasicResult(`${simplified.num}/${simplified.den} = ${mixed.whole}`);
    } else {
      setBasicResult(`${simplified.num}/${simplified.den} = ${formatMixedNumber(mixed.whole, mixed.num, mixed.den)}`);
    }
  };

  const calculateMixedNumbers = () => {
    try {
      const mixed1 = parseMixedNumber(mixedNum1);
      const mixed2 = parseMixedNumber(mixedNum2);
      
      const improper1 = mixedToImproper(mixed1.whole, mixed1.num, mixed1.den);
      const improper2 = mixedToImproper(mixed2.whole, mixed2.num, mixed2.den);

      let resultNum, resultDen;

      switch (mixedOperation) {
        case '+':
          resultNum = improper1.num * improper2.den + improper2.num * improper1.den;
          resultDen = improper1.den * improper2.den;
          break;
        case '-':
          resultNum = improper1.num * improper2.den - improper2.num * improper1.den;
          resultDen = improper1.den * improper2.den;
          break;
        case '*':
          resultNum = improper1.num * improper2.num;
          resultDen = improper1.den * improper2.den;
          break;
        case '/':
          if (improper2.num === 0) {
            setMixedResult('Error: Division by zero');
            return;
          }
          resultNum = improper1.num * improper2.den;
          resultDen = improper1.den * improper2.num;
          break;
        default:
          resultNum = 0;
          resultDen = 1;
      }

      const simplified = simplifyFraction(resultNum, resultDen);
      const mixed = improperToMixed(simplified.num, simplified.den);
      
      if (mixed.num === 0) {
        setMixedResult(`${simplified.num}/${simplified.den} = ${mixed.whole}`);
      } else {
        setMixedResult(`${simplified.num}/${simplified.den} = ${formatMixedNumber(mixed.whole, mixed.num, mixed.den)}`);
      }
    } catch (error) {
      setMixedResult('Error: Invalid input');
    }
  };

  const calculateSimplify = () => {
    const num = parseInt(simplifyNum) || 0;
    const den = parseInt(simplifyDen) || 1;
    
    if (den === 0) {
      setSimplifyResult('Error: Division by zero');
      return;
    }
    
    const simplified = simplifyFraction(num, den);
    setSimplifyResult(`${simplified.num}/${simplified.den}`);
  };

  const calculateDecimalToFraction = () => {
    const dec = parseFloat(decimal);
    if (isNaN(dec)) {
      setDecimalResult('Invalid decimal');
      return;
    }

    const isNegative = dec < 0;
    const absDecimal = Math.abs(dec);
    
    const str = absDecimal.toString();
    const decimalPlaces = str.includes('.') ? str.split('.')[1].length : 0;
    const denominator = Math.pow(10, decimalPlaces);
    const numerator = Math.round(absDecimal * denominator) * (isNegative ? -1 : 1);
    
    const simplified = simplifyFraction(numerator, denominator);
    const mixed = improperToMixed(simplified.num, simplified.den);
    
    if (mixed.num === 0) {
      setDecimalResult(`${simplified.num}/${simplified.den} = ${mixed.whole}`);
    } else {
      setDecimalResult(`${simplified.num}/${simplified.den} = ${formatMixedNumber(mixed.whole, mixed.num, mixed.den)}`);
    }
  };

  const calculateFractionToDecimal = () => {
    const num = parseInt(fracToDecNum) || 0;
    const den = parseInt(fracToDecDen) || 1;
    
    if (den === 0) {
      setFracToDecResult('Undefined (division by zero)');
      return;
    }
    
    const result = num / den;
    if (result % 1 === 0) {
      setFracToDecResult(result.toString());
    } else {
      setFracToDecResult(result.toFixed(10).replace(/\.?0+$/, ''));
    }
  };

  const calculateBigNumbers = () => {
    try {
      const n1 = BigInt(bigNum1 || '0');
      const d1 = BigInt(bigDen1 || '1');
      const n2 = BigInt(bigNum2 || '0');
      const d2 = BigInt(bigDen2 || '1');

      if (d1 === 0n || d2 === 0n) {
        setBigResult('Error: Division by zero');
        return;
      }

      let resultNum, resultDen;

      switch (bigOperation) {
        case '+':
          resultNum = n1 * d2 + n2 * d1;
          resultDen = d1 * d2;
          break;
        case '-':
          resultNum = n1 * d2 - n2 * d1;
          resultDen = d1 * d2;
          break;
        case '*':
          resultNum = n1 * n2;
          resultDen = d1 * d2;
          break;
        case '/':
          if (n2 === 0n) {
            setBigResult('Error: Division by zero');
            return;
          }
          resultNum = n1 * d2;
          resultDen = d1 * n2;
          break;
        default:
          resultNum = 0n;
          resultDen = 1n;
      }

      setBigResult(`${resultNum.toString()}/${resultDen.toString()}`);
    } catch (error) {
      setBigResult('Error: Numbers too large or invalid');
    }
  };

  const clearAll = () => {
    setNum1('0');
    setDen1('0');
    setNum2('0');
    setDen2('0');
    setBasicResult('');
    
    setMixedNum1('0');
    setMixedNum2('0');
    setMixedResult('');
    
    setSimplifyNum('0');
    setSimplifyDen('0');
    setSimplifyResult('');
    
    setDecimal('0');
    setDecimalResult('');
    
    setFracToDecNum('0');
    setFracToDecDen('0');
    setFracToDecResult('');
    
    setBigNum1('0');
    setBigDen1('0');
    setBigNum2('0');
    setBigDen2('0');
    setBigResult('');
  };

  return (
     <>
     <Head>
        <title>Fraction Calculator | Free Online Math Calculation Tool</title>
        <meta
          name="description"
          content="Use our free Fraction Calculator to add, subtract, multiply, and divide fractions easily. Quick, accurate, and perfect for students and math lovers."
        />
        <meta name="keywords" content="Fraction Calculator, Online Fraction Calculator, Free Fraction Calculator, Math Fraction Calculator, Fraction Addition Calculator, Fraction Subtraction Calculator, Fraction Multiplication Calculator, Fraction Division Calculator, Easy Fraction Calculator, Fraction Solver" />
     
      </Head>
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <Header/>  
      {/* Sidebar */}
      <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="bg-gray-900 text-white p-4 font-bold text-lg">
          Math Calculator Tools
        </div>
        <div className="p-0">
          <a href="/Math/scientific-calculator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🔬</span>
              <span className="text-gray-900 font-medium">Scientific Calculator</span>
            </div>
          </a>
          <a href="/Math/fraction-calculator">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">➗</span>
              <span className="text-gray-900 font-semibold">Fraction Calculator</span>
            </div>
          </a>
          <a href="/Math/percentage-calculator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">📊</span>
              <span className="text-gray-900 font-medium">Percentage Calculator</span>
            </div>
          </a>
          <a href="/Math/random-number-generator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🎲</span>
              <span className="text-gray-900 font-medium">Random Number Generator</span>
            </div>
          </a>
          <a href="/Math/triangle-calculator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🔺</span>
              <span className="text-gray-900 font-medium">Triangle Calculator</span>
            </div>
          </a>
          <a href="/Math/standard-deviation-calculator">
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors">
              <span className="text-xl">📈</span>
              <span className="text-gray-900 font-medium">Standard Deviation Calculator</span>
            </div>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className="max-w-6xl mx-auto p-4 lg:p-8 pt-16 lg:pt-8 -mt-5">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl font-bold text-gray-900">Fraction Calculator</h1>
          </div>
          
          <p className="text-gray-700 mb-8 leading-relaxed">
            Perform operations on fractions with ease. Calculate basic fractions, mixed numbers, simplify fractions, 
            and convert between fractions and decimals. Supports very large numbers with the big number calculator.
          </p>

          {/* Basic Fraction Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Fraction Calculator</h2>
            
            <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-4 sm:space-y-0 mb-4">
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  className="w-24 px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
                <div className="border-t-2 border-black w-24 my-1"></div>
                <input
                  type="number"
                  value={den1}
                  onChange={(e) => setDen1(e.target.value)}
                  className="w-24 px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
              </div>
              
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="px-4 py-2 text-xl border-2 border-gray-300 rounded focus:border-gray-900 focus:outline-none font-bold"
              >
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
              
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  className="w-24 px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
                <div className="border-t-2 border-black w-24 my-1"></div>
                <input
                  type="number"
                  value={den2}
                  onChange={(e) => setDen2(e.target.value)}
                  className="w-24 px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
              </div>
              
              <span className="text-2xl font-bold">=</span>
              
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <span className="text-sm lg:text-base break-all font-semibold text-gray-900">{basicResult || '?'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculateBasicFraction}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-semibold"
              >
                Calculate
              </button>
              <button
                onClick={() => setBasicResult('')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Mixed Numbers Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Mixed Numbers Calculator</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter mixed numbers like: -1 3/4 or 2 5/7</p>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
              <input
                type="text"
                value={mixedNum1}
                onChange={(e) => setMixedNum1(e.target.value)}
                className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                placeholder="-1 3/4"
              />
              
              <select
                value={mixedOperation}
                onChange={(e) => setMixedOperation(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              >
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
              
              <input
                type="text"
                value={mixedNum2}
                onChange={(e) => setMixedNum2(e.target.value)}
                className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                placeholder="2 5/7"
              />
              
              <span className="text-xl font-bold">=</span>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <span className="text-sm lg:text-base break-all font-semibold text-gray-900">{mixedResult || '?'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculateMixedNumbers}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-semibold"
              >
                Calculate
              </button>
              <button
                onClick={() => setMixedResult('')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Simplify Fractions Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Simplify Fractions Calculator</h2>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
              <div className="flex flex-col items-center w-full sm:w-32">
                <input
                  type="number"
                  value={simplifyNum}
                  onChange={(e) => setSimplifyNum(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
                <div className="border-t-2 border-black w-full my-1"></div>
                <input
                  type="number"
                  value={simplifyDen}
                  onChange={(e) => setSimplifyDen(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
              </div>
              
              <span className="text-xl font-bold">=</span>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <span className="text-sm lg:text-base break-all font-semibold text-gray-900">{simplifyResult || '?'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculateSimplify}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-semibold"
              >
                Calculate
              </button>
              <button
                onClick={() => setSimplifyResult('')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Decimal to Fraction Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Decimal to Fraction Calculator</h2>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
              <input
                type="number"
                step="any"
                value={decimal}
                onChange={(e) => setDecimal(e.target.value)}
                className="w-full sm:w-32 px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                placeholder="1.375"
              />
              
              <span className="text-xl font-bold">=</span>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <span className="text-sm lg:text-base break-all font-semibold text-gray-900">{decimalResult || '?'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculateDecimalToFraction}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-semibold"
              >
                Calculate
              </button>
              <button
                onClick={() => setDecimalResult('')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Fraction to Decimal Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Fraction to Decimal Calculator</h2>
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
              <div className="flex flex-col items-center w-full sm:w-32">
                <input
                  type="number"
                  value={fracToDecNum}
                  onChange={(e) => setFracToDecNum(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
                <div className="border-t-2 border-black w-full my-1"></div>
                <input
                  type="number"
                  value={fracToDecDen}
                  onChange={(e) => setFracToDecDen(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
              </div>
              
              <span className="text-xl font-bold">=</span>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <span className="text-sm lg:text-base break-all font-semibold text-gray-900">{fracToDecResult || '?'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculateFractionToDecimal}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-semibold"
              >
                Calculate
              </button>
              <button
                onClick={() => setFracToDecResult('')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Big Number Fraction Calculator */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Big Number Fraction Calculator</h2>
            <p className="text-gray-600 mb-4 text-sm">Use this calculator if the numerators or denominators are very big integers.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  value={bigNum1}
                  onChange={(e) => setBigNum1(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
                <div className="border-t-2 border-black w-full my-1"></div>
                <input
                  type="text"
                  value={bigDen1}
                  onChange={(e) => setBigDen1(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <input
                  type="text"
                  value={bigNum2}
                  onChange={(e) => setBigNum2(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
                <div className="border-t-2 border-black w-full my-1"></div>
                <input
                  type="text"
                  value={bigDen2}
                  onChange={(e) => setBigDen2(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-300 text-center text-sm rounded focus:border-gray-900 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0 mb-6">
              <select
                value={bigOperation}
                onChange={(e) => setBigOperation(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded focus:border-gray-900 focus:outline-none"
              >
                <option value="+">+</option>
                <option value="-">-</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
              
              <span className="text-xl font-bold">=</span>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <span className="text-sm lg:text-base break-all font-semibold text-gray-900">{bigResult || '?'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={calculateBigNumbers}
                className="bg-gray-900 text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors font-semibold"
              >
                Calculate
              </button>
              <button
                onClick={() => setBigResult('')}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors font-semibold"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Clear All Button */}
          <div className="mb-8 text-center">
            <button
              onClick={clearAll}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-bold shadow-md"
            >
              Clear All Calculators
            </button>
          </div>

          {/* Educational Content */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fraction Quick Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-gray-900 mr-2">•</span>
                <span>Fractions represent parts of a whole - the numerator is the part you have, the denominator is the total parts</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-2">•</span>
                <span>Always simplify fractions to their lowest terms by dividing both numerator and denominator by their GCD</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-2">•</span>
                <span>To add or subtract fractions, find a common denominator first</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-2">•</span>
                <span>To multiply fractions, multiply numerators together and denominators together</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-2">•</span>
                <span>To divide fractions, multiply by the reciprocal (flip the second fraction)</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-900 mr-2">•</span>
                <span>Mixed numbers should be converted to improper fractions before performing calculations</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Understanding Fractions</h3>
            
            <div className="space-y-6 text-gray-700">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">What is a Fraction?</h4>
                <p className="leading-relaxed">
                  In mathematics, a fraction is a number that represents a part of a whole. It consists of a numerator 
                  and a denominator. The numerator represents the number of equal parts of a whole, while the denominator 
                  is the total number of parts that make up said whole. For example, in the fraction 3/8, the numerator 
                  is 3, and the denominator is 8.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Addition and Subtraction</h4>
                <p className="leading-relaxed mb-2">
                  Unlike adding and subtracting integers, fractions require a common denominator. One method involves 
                  multiplying the numerators and denominators by the product of the other fraction's denominator.
                </p>
                <div className="bg-gray-100 p-4 rounded border-l-4 border-gray-900">
                  <p className="font-mono text-sm">Example: 3/4 + 1/6 = (3×6 + 1×4)/(4×6) = 22/24 = 11/12</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Multiplication</h4>
                <p className="leading-relaxed mb-2">
                  Multiplying fractions is straightforward - simply multiply the numerators together and the 
                  denominators together, then simplify the result.
                </p>
                <div className="bg-gray-100 p-4 rounded border-l-4 border-gray-900">
                  <p className="font-mono text-sm">Example: 3/4 × 1/6 = 3/24 = 1/8</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Division</h4>
                <p className="leading-relaxed mb-2">
                  To divide fractions, multiply by the reciprocal of the second fraction (flip the numerator and denominator).
                </p>
                <div className="bg-gray-100 p-4 rounded border-l-4 border-gray-900">
                  <p className="font-mono text-sm">Example: 3/4 ÷ 1/6 = 3/4 × 6/1 = 18/4 = 9/2 = 4 1/2</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Converting Decimals to Fractions</h4>
                <p className="leading-relaxed">
                  Each decimal place represents a power of 10. Count the decimal places, use that power of 10 as 
                  the denominator, and the digits as the numerator. For example: 0.25 = 25/100 = 1/4
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Practical Applications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-orange-50 p-3 rounded border border-orange-200">
                    <p className="font-semibold text-orange-800 mb-1">Cooking & Recipes</p>
                    <p className="text-sm">Essential for scaling recipes and measuring ingredients accurately</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="font-semibold text-blue-800 mb-1">Construction</p>
                    <p className="text-sm">Critical for precise measurements in building and engineering</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded border border-green-200">
                    <p className="font-semibold text-green-800 mb-1">Finance</p>
                    <p className="text-sm">Used in calculating interest rates and investment returns</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <p className="font-semibold text-purple-800 mb-1">Science & Medicine</p>
                    <p className="text-sm">Essential for dosage calculations and measurements</p>
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

export default FractionCalculator;