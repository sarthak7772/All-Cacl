import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import Link from 'next/link';
import Head from "next/head";
import { Calculator,  } from 'lucide-react';

const TriangleCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [triangleData, setTriangleData] = useState({
    sideA: '',
    sideB: '',
    sideC: '',
    angleA: '',
    angleB: '',
    angleC: '',
    angleUnit: 'degree'
  });

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const getAngleInRadians = (angle) => {
    return triangleData.angleUnit === 'degree' 
      ? (angle * Math.PI) / 180 
      : angle;
  };

  const getAngleInDisplayUnit = (radians) => {
    return triangleData.angleUnit === 'degree' 
      ? (radians * 180) / Math.PI 
      : radians;
  };

  const validateTriangle = (a, b, c) => {
    return (a + b > c) && (a + c > b) && (b + c > a);
  };

  const calculateTriangle = () => {
    setError('');
    
    const { sideA, sideB, sideC, angleA, angleB, angleC } = triangleData;
    
    const a = parseFloat(sideA) || null;
    const b = parseFloat(sideB) || null;
    const c = parseFloat(sideC) || null;
    const A = parseFloat(angleA) || null;
    const B = parseFloat(angleB) || null;
    const C = parseFloat(angleC) || null;

    let calculatedSides = { a, b, c };
    let calculatedAngles = { A, B, C };

    try {
      const knownSides = [a, b, c].filter(x => x !== null).length;
      const knownAngles = [A, B, C].filter(x => x !== null).length;

      if (knownSides + knownAngles < 3) {
        setError('Please provide at least 3 values including at least one side.');
        return;
      }

      if (knownSides === 0) {
        setError('Please provide at least one side length.');
        return;
      }

      if (knownSides === 3) {
        if (!validateTriangle(a, b, c)) {
          setError('Invalid triangle: sides do not satisfy triangle inequality.');
          return;
        }

        calculatedAngles.A = Math.acos((b*b + c*c - a*a) / (2*b*c));
        calculatedAngles.B = Math.acos((a*a + c*c - b*b) / (2*a*c));
        calculatedAngles.C = Math.acos((a*a + b*b - c*c) / (2*a*b));
      }
      
      else if (knownSides === 2 && knownAngles === 1) {
        if (a && b && C) {
          const CRad = getAngleInRadians(C);
          calculatedSides.c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(CRad));
          calculatedAngles.A = Math.acos((b*b + calculatedSides.c*calculatedSides.c - a*a) / (2*b*calculatedSides.c));
          calculatedAngles.B = Math.PI - calculatedAngles.A - CRad;
        }
        else if (a && c && B) {
          const BRad = getAngleInRadians(B);
          calculatedSides.b = Math.sqrt(a*a + c*c - 2*a*c*Math.cos(BRad));
          calculatedAngles.A = Math.acos((calculatedSides.b*calculatedSides.b + c*c - a*a) / (2*calculatedSides.b*c));
          calculatedAngles.C = Math.PI - calculatedAngles.A - BRad;
        }
        else if (b && c && A) {
          const ARad = getAngleInRadians(A);
          calculatedSides.a = Math.sqrt(b*b + c*c - 2*b*c*Math.cos(ARad));
          calculatedAngles.B = Math.acos((calculatedSides.a*calculatedSides.a + c*c - b*b) / (2*calculatedSides.a*c));
          calculatedAngles.C = Math.PI - ARad - calculatedAngles.B;
        }
      }
      
      else if (knownAngles >= 2 && knownSides >= 1) {
        if (!calculatedAngles.A && calculatedAngles.B && calculatedAngles.C) {
          calculatedAngles.A = Math.PI - getAngleInRadians(calculatedAngles.B) - getAngleInRadians(calculatedAngles.C);
        }
        else if (calculatedAngles.A && !calculatedAngles.B && calculatedAngles.C) {
          calculatedAngles.B = Math.PI - getAngleInRadians(calculatedAngles.A) - getAngleInRadians(calculatedAngles.C);
        }
        else if (calculatedAngles.A && calculatedAngles.B && !calculatedAngles.C) {
          calculatedAngles.C = Math.PI - getAngleInRadians(calculatedAngles.A) - getAngleInRadians(calculatedAngles.B);
        }

        const ARad = calculatedAngles.A ? getAngleInRadians(calculatedAngles.A) : calculatedAngles.A;
        const BRad = calculatedAngles.B ? getAngleInRadians(calculatedAngles.B) : calculatedAngles.B;
        const CRad = calculatedAngles.C ? getAngleInRadians(calculatedAngles.C) : calculatedAngles.C;

        if (a && ARad && BRad && CRad) {
          calculatedSides.b = a * Math.sin(BRad) / Math.sin(ARad);
          calculatedSides.c = a * Math.sin(CRad) / Math.sin(ARad);
        }
        else if (b && ARad && BRad && CRad) {
          calculatedSides.a = b * Math.sin(ARad) / Math.sin(BRad);
          calculatedSides.c = b * Math.sin(CRad) / Math.sin(BRad);
        }
        else if (c && ARad && BRad && CRad) {
          calculatedSides.a = c * Math.sin(ARad) / Math.sin(CRad);
          calculatedSides.b = c * Math.sin(BRad) / Math.sin(CRad);
        }
      }

      const area = calculateArea(calculatedSides.a, calculatedSides.b, calculatedSides.c);
      const perimeter = calculatedSides.a + calculatedSides.b + calculatedSides.c;
      const semiperimeter = perimeter / 2;
      
      const inradius = area / semiperimeter;
      const circumradius = (calculatedSides.a * calculatedSides.b * calculatedSides.c) / (4 * area);

      const medianA = Math.sqrt((2 * calculatedSides.b * calculatedSides.b + 2 * calculatedSides.c * calculatedSides.c - calculatedSides.a * calculatedSides.a) / 4);
      const medianB = Math.sqrt((2 * calculatedSides.a * calculatedSides.a + 2 * calculatedSides.c * calculatedSides.c - calculatedSides.b * calculatedSides.b) / 4);
      const medianC = Math.sqrt((2 * calculatedSides.a * calculatedSides.a + 2 * calculatedSides.b * calculatedSides.b - calculatedSides.c * calculatedSides.c) / 4);

      const heightA = (2 * area) / calculatedSides.a;
      const heightB = (2 * area) / calculatedSides.b;
      const heightC = (2 * area) / calculatedSides.c;

      setResults({
        sides: calculatedSides,
        angles: {
          A: getAngleInDisplayUnit(calculatedAngles.A),
          B: getAngleInDisplayUnit(calculatedAngles.B),
          C: getAngleInDisplayUnit(calculatedAngles.C)
        },
        area: area,
        perimeter: perimeter,
        semiperimeter: semiperimeter,
        inradius: inradius,
        circumradius: circumradius,
        medians: { A: medianA, B: medianB, C: medianC },
        heights: { A: heightA, B: heightB, C: heightC },
        triangleType: getTriangleType(calculatedSides.a, calculatedSides.b, calculatedSides.c, calculatedAngles.A, calculatedAngles.B, calculatedAngles.C)
      });

    } catch (err) {
      setError('Invalid triangle configuration. Please check your inputs.');
      console.error(err);
    }
  };

  const calculateArea = (a, b, c) => {
    const s = (a + b + c) / 2;
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  };

  const getTriangleType = (a, b, c, A, B, C) => {
    const angles = [A, B, C].map(angle => triangleData.angleUnit === 'degree' ? angle : (angle * 180) / Math.PI);
    const sides = [a, b, c].sort((x, y) => x - y);
    
    let types = [];
    
    if (angles.some(angle => Math.abs(angle - 90) < 0.01)) {
      types.push('Right');
    } else if (angles.every(angle => angle < 90)) {
      types.push('Acute');
    } else {
      types.push('Obtuse');
    }
    
    if (Math.abs(sides[0] - sides[1]) < 0.01 && Math.abs(sides[1] - sides[2]) < 0.01) {
      types.push('Equilateral');
    } else if (Math.abs(sides[0] - sides[1]) < 0.01 || Math.abs(sides[1] - sides[2]) < 0.01 || Math.abs(sides[0] - sides[2]) < 0.01) {
      types.push('Isosceles');
    } else {
      types.push('Scalene');
    }
    
    return types.join(' ');
  };

  const clearAll = () => {
    setTriangleData({
      sideA: '',
      sideB: '',
      sideC: '',
      angleA: '',
      angleB: '',
      angleC: '',
      angleUnit: 'degree'
    });
    setResults(null);
    setError('');
  };

  const updateTriangleData = (field, value) => {
    setTriangleData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
     <>
     <Head>
        <title>Triangle Calculator | Free Online Geometry Tool


</title>
        <meta
          name="description"
          content="Use our free Triangle Calculator to compute area, perimeter, and angles instantly. Quick, accurate, and perfect for students, engineers, and designers.

  
  "
        />
        <meta name="keywords" content=" Triangle Calculator, Online Triangle Calculator, Free Triangle Calculator, Geometry Triangle Calculator, Triangle Area Calculator, Triangle Perimeter Calculator, Triangle Angle Calculator, Math Triangle Calculator, Triangle Solver, Triangle Measurement Calculator
" />
     
      </Head>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mobile Menu Button */}
      <Header/>
      
      
      
      

      {/* Sidebar */}
      {/* <div className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 pt-16`}> */}
        
        <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}><div className="bg-[#111827] text-white p-4 font-bold text-lg">
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
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🔺</span>
              <span className="text-gray-900 font-semibold">Triangle Calculator</span>
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
              <h2 className="text-2xl font-bold mb-2">Triangle Calculator</h2>
              <p className="text-red-100 text-sm md:text-base">
                Calculate comprehensive triangle properties with precision. Provide at least 3 values including one side to get 
                detailed analysis including angles, sides, area, and advanced geometric properties.
              </p>
            </div>

            <div className="p-4 md:p-8">
              {/* Angle Unit Selection */}
<div className="mb-6">
  <label className="block text-sm font-medium text-gray-900 mb-3">Angle Unit</label>
  <select 
    value={triangleData.angleUnit}
    onChange={(e) => updateTriangleData('angleUnit', e.target.value)}
    className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none text-base md:text-lg"
  >
    <option value="degree">Degrees (°)</option>
    <option value="radian">Radians (rad)</option>
  </select>
</div>

{/* Triangle Visualization */}
<div className="flex justify-center mb-8">
  <div className="bg-white p-6 rounded-lg border-2 border-gray-900">
    <svg width="400" height="280" viewBox="0 0 400 280" className="rounded">
      <polygon points="200,40 100,220 300,220" fill="rgba(59,130,246,0.1)" stroke="#2563EB" strokeWidth="3"/>
      <circle cx="200" cy="40" r="5" fill="#DC2626" />
      <circle cx="100" cy="220" r="5" fill="#DC2626" />
      <circle cx="300" cy="220" r="5" fill="#DC2626" />
      <text x="200" y="28" textAnchor="middle" className="text-lg font-bold fill-red-600">C</text>
      <text x="85" y="235" textAnchor="middle" className="text-lg font-bold fill-red-600">A</text>
      <text x="315" y="235" textAnchor="middle" className="text-lg font-bold fill-red-600">B</text>
      <text x="150" y="135" textAnchor="middle" className="text-sm font-semibold fill-green-600" transform="rotate(-65 150 135)">side b</text>
      <text x="250" y="135" textAnchor="middle" className="text-sm font-semibold fill-green-600" transform="rotate(65 250 135)">side a</text>
      <text x="200" y="245" textAnchor="middle" className="text-sm font-semibold fill-green-600">side c</text>
    </svg>
  </div>
</div>

{/* Side Inputs */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Side Lengths</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Side A</label>
      <input
        type="number"
        step="any"
        value={triangleData.sideA}
        onChange={(e) => updateTriangleData('sideA', e.target.value)}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Enter side A"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Side B</label>
      <input
        type="number"
        step="any"
        value={triangleData.sideB}
        onChange={(e) => updateTriangleData('sideB', e.target.value)}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Enter side B"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Side C</label>
      <input
        type="number"
        step="any"
        value={triangleData.sideC}
        onChange={(e) => updateTriangleData('sideC', e.target.value)}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Enter side C"
      />
    </div>
  </div>
</div>

{/* Angle Inputs */}
<div className="mb-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Angles</h3>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Angle A ({triangleData.angleUnit === 'degree' ? '°' : 'rad'})
      </label>
      <input
        type="number"
        step="any"
        value={triangleData.angleA}
        onChange={(e) => updateTriangleData('angleA', e.target.value)}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Enter angle A"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Angle B ({triangleData.angleUnit === 'degree' ? '°' : 'rad'})
      </label>
      <input
        type="number"
        step="any"
        value={triangleData.angleB}
        onChange={(e) => updateTriangleData('angleB', e.target.value)}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2  text-base md:text-lg"
        placeholder="Enter angle B"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">
        Angle C ({triangleData.angleUnit === 'degree' ? '°' : 'rad'})
      </label>
      <input
        type="number"
        step="any"
        value={triangleData.angleC}
        onChange={(e) => updateTriangleData('angleC', e.target.value)}
        className="w-full px-4 py-3 border border-gray-900 text-gray-900 rounded-lg focus:outline-none focus:ring-2 text-base md:text-lg"
        placeholder="Enter angle C"
      />
    </div>
  </div>
</div>
              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  onClick={calculateTriangle}
                  className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                >
                  <Calculator className="w-5 h-5" />
                  <span>Calculate</span>
                </button>
                <button
                  onClick={clearAll}
                  className="sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-base font-semibold shadow-lg"
                >
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
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Triangle Properties</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{results.area?.toFixed(2)}</div>
                        <div className="text-sm text-gray-900 font-medium">Area (sq units)</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-2">{results.perimeter?.toFixed(2)}</div>
                        <div className="text-sm text-gray-900 font-medium">Perimeter (units)</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-lg font-bold text-purple-600 mb-2">{results.triangleType}</div>
                        <div className="text-sm text-gray-900 font-medium">Type</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-lg font-bold text-orange-600">{results.sides.a?.toFixed(4)}</div>
                        <div className="text-sm text-gray-900">Side A</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-lg font-bold text-red-600">{results.sides.b?.toFixed(4)}</div>
                        <div className="text-sm text-gray-900">Side B</div>
                      </div>
                      <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="text-lg font-bold text-indigo-600">{results.sides.c?.toFixed(4)}</div>
                        <div className="text-sm text-gray-900">Side C</div>
                      </div>
                      <div className="text-center p-3 bg-teal-50 rounded-lg border border-teal-200">
                        <div className="text-lg font-bold text-teal-600">{results.angles.A?.toFixed(2)}</div>
                        <div className="text-sm text-gray-900">Angle A</div>
                      </div>
                      <div className="text-center p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                        <div className="text-lg font-bold text-cyan-600">{results.angles.B?.toFixed(2)}</div>
                        <div className="text-sm text-gray-900">Angle B</div>
                      </div>
                      <div className="text-center p-3 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="text-lg font-bold text-pink-600">{results.angles.C?.toFixed(2)}</div>
                        <div className="text-sm text-gray-900">Angle C</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Advanced Measurements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Medians</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between p-2 bg-blue-50 rounded">
                            <span className="text-sm">Median to side A:</span>
                            <span className="font-bold text-blue-600">{results.medians.A?.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm">Median to side B:</span>
                            <span className="font-bold text-green-600">{results.medians.B?.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-purple-50 rounded">
                            <span className="text-sm">Median to side C:</span>
                            <span className="font-bold text-purple-600">{results.medians.C?.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Heights</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between p-2 bg-orange-50 rounded">
                            <span className="text-sm">Height to side A:</span>
                            <span className="font-bold text-orange-600">{results.heights?.A?.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-red-50 rounded">
                            <span className="text-sm">Height to side B:</span>
                            <span className="font-bold text-red-600">{results.heights?.B?.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between p-2 bg-indigo-50 rounded">
                            <span className="text-sm">Height to side C:</span>
                            <span className="font-bold text-indigo-600">{results.heights?.C?.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Triangle Calculations</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">What is a Triangle?</h4>
                <p className="text-gray-600 text-sm">A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry. The sum of the interior angles of any triangle is always 180 degrees (or π radians).</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Triangle Calculation Methods</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-700 mb-2">SSS (Side-Side-Side)</h5>
                    <p className="text-gray-600">When all three sides are known, use the Law of Cosines to find all angles.</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-green-700 mb-2">SAS (Side-Angle-Side)</h5>
                    <p className="text-gray-600">When two sides and the included angle are known, use the Law of Cosines to find the third side.</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-purple-700 mb-2">AAS/ASA</h5>
                    <p className="text-gray-600">When two angles and one side are known, use the Law of Sines to find the remaining sides.</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Triangle Types</h4>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li><strong>By Angles:</strong> Acute (all angles &lt; 90°), Right (one angle = 90°), Obtuse (one angle &gt; 90°)</li>
                  <li><strong>By Sides:</strong> Equilateral (all sides equal), Isosceles (two sides equal), Scalene (all sides different)</li>
                </ul>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <p className="text-blue-800 text-sm"><strong>Quick Tip:</strong> Always provide at least one side length for accurate calculations. The triangle inequality theorem states that the sum of any two sides must be greater than the third side.</p>
              </div>
            </div>
          </div>

          {/* Formulas Section */}
          <div className="mt-6 mb-12 bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Important Triangle Formulas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Area Calculations</h4>
                <ul className="space-y-2 text-sm text-green-700">
                  <li><strong>Heron's Formula:</strong> A = √[s(s-a)(s-b)(s-c)]</li>
                  <li><strong>Base × Height:</strong> A = ½ × base × height</li>
                  <li><strong>Two sides + angle:</strong> A = ½ab sin(C)</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Law of Cosines & Sines</h4>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li><strong>Law of Cosines:</strong> c² = a² + b² - 2ab cos(C)</li>
                  <li><strong>Law of Sines:</strong> a/sin(A) = b/sin(B) = c/sin(C)</li>
                  <li><strong>Angle Sum:</strong> A + B + C = 180° (π radians)</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg mt-6">
              <h4 className="font-semibold text-yellow-800 text-lg mb-3">Calculation Tips:</h4>
              <ul className="text-yellow-700 space-y-2 text-sm">
                <li>• Ensure at least one side length is provided for valid triangle calculations</li>
                <li>• Double-check that your inputs satisfy the triangle inequality theorem</li>
                <li>• Remember that the sum of any two sides must be greater than the third side</li>
                <li>• Angles in a triangle always sum to 180° (or π radians)</li>
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

export default TriangleCalculator;