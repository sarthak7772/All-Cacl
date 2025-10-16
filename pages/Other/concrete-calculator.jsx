import React, { useState } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Layers, Target, Building, Hammer,  CheckCircle2, Settings } from 'lucide-react';

const ConcreteCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('slab');
  
  const [slabData, setSlabData] = useState({
    length: 5,
    width: 2.5,
    thickness: 10,
    quantity: 1,
    lengthUnit: 'meters',
    widthUnit: 'meters',
    thicknessUnit: 'centimeters',
    wastePercentage: 10
  });

  const [cylinderData, setCylinderData] = useState({
    diameter: 0.5,
    height: 2,
    quantity: 1,
    diameterUnit: 'meters',
    heightUnit: 'meters',
    wastePercentage: 5
  });

  const [results, setResults] = useState({
    slab: null,
    cylinder: null
  });

  const [concreteType, setConcreteType] = useState('standard');

  const concreteMixes = {
    'standard': { density: 2400, strength: 'M20', ratio: '1:1.5:3' },
    'high-strength': { density: 2450, strength: 'M35', ratio: '1:1:2' },
    'lightweight': { density: 1800, strength: 'M15', ratio: '1:2:4' },
    'heavy-duty': { density: 2500, strength: 'M40', ratio: '1:1:1.5' }
  };

  const convertToMeters = (value, unit) => {
    switch(unit) {
      case 'centimeters': return value / 100;
      case 'millimeters': return value / 1000;
      case 'feet': return value * 0.3048;
      case 'inches': return value * 0.0254;
      case 'meters':
      default: return value;
    }
  };

  const calculateMaterials = (volume) => {
    const mixRatios = {
      '1:1.5:3': { cement: 7, sand: 10.5, aggregate: 21 },
      '1:2:4': { cement: 6.5, sand: 13, aggregate: 26 },
      '1:1:2': { cement: 8, sand: 8, aggregate: 16 },
      '1:1:1.5': { cement: 9, sand: 9, aggregate: 13.5 }
    };
    
    const mix = concreteMixes[concreteType];
    const ratio = mixRatios[mix.ratio];
    
    return {
      cement: (volume * ratio.cement).toFixed(1),
      sand: (volume * ratio.sand).toFixed(1),
      aggregate: (volume * ratio.aggregate).toFixed(1),
      cementBags: Math.ceil(volume * ratio.cement / 0.05),
      water: Math.round(volume * 200)
    };
  };

  const calculateSlab = () => {
    const length = convertToMeters(slabData.length, slabData.lengthUnit);
    const width = convertToMeters(slabData.width, slabData.widthUnit);
    const thickness = convertToMeters(slabData.thickness, slabData.thicknessUnit);
    
    const baseVolume = length * width * thickness * slabData.quantity;
    const wasteVolume = baseVolume * (slabData.wastePercentage / 100);
    const totalVolume = baseVolume + wasteVolume;
    
    const mix = concreteMixes[concreteType];
    const weight = totalVolume * mix.density;
    const materials = calculateMaterials(totalVolume);
    
    setResults(prev => ({
      ...prev,
      slab: {
        baseVolume: baseVolume.toFixed(3),
        totalVolume: totalVolume.toFixed(3),
        weight: weight.toFixed(0),
        area: (length * width * slabData.quantity).toFixed(2),
        cubicYards: (totalVolume * 1.308).toFixed(3),
        materials,
        mix: mix
      }
    }));
  };

  const calculateCylinder = () => {
    const diameter = convertToMeters(cylinderData.diameter, cylinderData.diameterUnit);
    const height = convertToMeters(cylinderData.height, cylinderData.heightUnit);
    
    const radius = diameter / 2;
    const baseVolume = Math.PI * radius * radius * height * cylinderData.quantity;
    const wasteVolume = baseVolume * (cylinderData.wastePercentage / 100);
    const totalVolume = baseVolume + wasteVolume;
    
    const mix = concreteMixes[concreteType];
    const weight = totalVolume * mix.density;
    const materials = calculateMaterials(totalVolume);
    
    setResults(prev => ({
      ...prev,
      cylinder: {
        baseVolume: baseVolume.toFixed(3),
        totalVolume: totalVolume.toFixed(3),
        weight: weight.toFixed(0),
        surfaceArea: (2 * Math.PI * radius * (radius + height) * cylinderData.quantity).toFixed(2),
        cubicYards: (totalVolume * 1.308).toFixed(3),
        materials,
        mix: mix
      }
    }));
  };

  const clearResults = (type) => {
    setResults(prev => ({
      ...prev,
      [type]: null
    }));
  };

  const ResultsDisplay = ({ result, type, title }) => {
    if (!result) return null;

    return (
      <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4 lg:p-6">
        <div className="flex items-center mb-4">
          <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">{title} Results</h3>
        </div>
        
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border-l-4 border-gray-900">
            <p className="text-sm text-gray-600 font-medium">Base Volume</p>
            <p className="text-2xl font-bold text-gray-900">{result.baseVolume} m³</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 font-medium">Total Volume</p>
            <p className="text-2xl font-bold text-orange-600">{result.totalVolume} m³</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 font-medium">Total Weight</p>
            <p className="text-2xl font-bold text-blue-600">{result.weight} kg</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
            <p className="text-sm text-gray-600 font-medium">Cubic Yards</p>
            <p className="text-2xl font-bold text-purple-600">{result.cubicYards} yd³</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 lg:p-6 border">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Layers className="w-5 h-5 mr-2 text-gray-900" />
            Materials Required ({result.mix.strength} - {result.mix.ratio})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                <span className="text-sm font-bold text-gray-900">C</span>
              </div>
              <p className="text-sm text-gray-900">Cement</p>
              <p className="font-bold text-gray-900">{result.materials.cement} m³</p>
              <p className="text-xs text-gray-900">{result.materials.cementBags} bags</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                <span className="text-sm font-bold text-gray-900">S</span>
              </div>
              <p className="text-sm text-gray-900">Sand</p>
              <p className="font-bold text-gray-900">{result.materials.sand} m³</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                <span className="text-sm font-bold text-gray-900">A</span>
              </div>
              <p className="text-sm text-gray-900">Aggregate</p>
              <p className="font-bold text-gray-900">{result.materials.aggregate} m³</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                <span className="text-sm font-bold text-gray-900">W</span>
              </div>
              <p className="text-sm text-gray-900">Water</p>
              <p className="font-bold text-gray-900">{result.materials.water} L</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                <span className="text-sm font-bold text-gray-900">$</span>
              </div>
              <p className="text-sm text-gray-900">Est. Cost</p>
              <p className="font-bold text-gray-900">${(result.totalVolume * 85).toFixed(0)}</p>
              <p className="text-xs text-gray-900">USD approx</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (

      <>
     <Head>
        <title>Concrete Calculator | Free Online Construction Tool



</title>
        <meta
          name="description"
          content="Use our free Concrete Calculator to estimate material needs for your project. Quick, accurate, and easy — perfect for builders, contractors, and DIY projects.

  "
        />
        <meta name="keywords" content="Concrete Calculator, Online Concrete Calculator, Free Concrete Calculator, Cement Calculator, Concrete Volume Calculator, Construction Concrete Calculator, Concrete Estimator, Ready Mix Concrete Calculator, Building Material Calculator, Concrete Measurement Tool.
" />
     
      </Head>
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Mobile Menu Button */}
      <Header/>
      

      
      {/* Sidebar */}
      {/* <div className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}> */}
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
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🏗️</span>
              <span className="text-gray-900 font-semibold">Concrete Calculator</span>
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
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors">
              <span className="text-xl">🔄</span>
              <span className="text-gray-900 font-medium">Conversion Calculator</span>
            </div>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8 pt-16 lg:pt-8 -mt-5">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <Hammer className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Concrete Calculator</h1>
          </div>
          
          <p className="text-gray-700 mb-8 leading-relaxed text-sm lg:text-base">
            Calculate precise concrete volumes, material requirements, and costs for various construction projects. 
            Includes waste allowances, multiple mix ratios, and detailed material breakdowns.
          </p>

          {/* Concrete Specifications */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-4 flex items-center text-gray-900">
              <Settings className="w-6 h-6 mr-3" />
              Concrete Specifications
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Concrete Type</label>
                <select
                  value={concreteType}
                  onChange={(e) => setConcreteType(e.target.value)}
                  className="w-full text-gray-900 px-4 py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="standard">Standard Concrete (M20) - General Purpose</option>
                  <option value="high-strength">High Strength (M35) - Heavy Loads</option>
                  <option value="lightweight">Lightweight (M15) - Non-structural</option>
                  <option value="heavy-duty">Heavy Duty (M40) - Infrastructure</option>
                </select>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Current Mix Properties</h3>
                <div className="space-y-1 text-sm text-gray-900">
                  <p><span className="font-medium">Strength Grade:</span> {concreteMixes[concreteType].strength}</p>
                  <p><span className="font-medium">Mix Ratio:</span> {concreteMixes[concreteType].ratio}</p>
                  <p><span className="font-medium">Density:</span> {concreteMixes[concreteType].density} kg/m³</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden mb-8">
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {[
                { id: 'slab', icon: Layers, label: 'Slabs' },
                { id: 'cylinder', icon: Target, label: 'Cylinders' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 lg:px-6 py-4 text-sm font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

          {/* Slab Calculator */}
{activeTab === 'slab' && (
  <div className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col sm:flex-row sm:items-center mb-6">
      <Layers className="w-6 h-6 mr-0 sm:mr-3 text-gray-900 mb-2 sm:mb-0" />
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center sm:text-left">
        Slabs, Walls & Rectangular Footings
      </h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      {/* Length */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">Length</label>
        <div className="flex">
          <input
            type="number"
            value={slabData.length}
            onChange={(e) =>
              setSlabData((prev) => ({
                ...prev,
                length: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2.5 text-gray-900 border border-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            step="0.1"
          />
          <select
            value={slabData.lengthUnit}
            onChange={(e) =>
              setSlabData((prev) => ({ ...prev, lengthUnit: e.target.value }))
            }
            className="px-3 py-2.5 text-gray-900 border border-l-0 border-gray-900 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="meters">m</option>
            <option value="feet">ft</option>
            <option value="centimeters">cm</option>
          </select>
        </div>
      </div>

      {/* Width */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">Width</label>
        <div className="flex">
          <input
            type="number"
            value={slabData.width}
            onChange={(e) =>
              setSlabData((prev) => ({
                ...prev,
                width: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2.5 text-gray-900 border border-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            step="0.1"
          />
          <select
            value={slabData.widthUnit}
            onChange={(e) =>
              setSlabData((prev) => ({ ...prev, widthUnit: e.target.value }))
            }
            className="px-3 py-2.5 text-gray-900 border border-l-0 border-gray-900 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="meters">m</option>
            <option value="feet">ft</option>
            <option value="centimeters">cm</option>
          </select>
        </div>
      </div>

      {/* Thickness */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">Thickness</label>
        <div className="flex">
          <input
            type="number"
            value={slabData.thickness}
            onChange={(e) =>
              setSlabData((prev) => ({
                ...prev,
                thickness: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2.5 text-gray-900 border border-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            step="0.1"
          />
          <select
            value={slabData.thicknessUnit}
            onChange={(e) =>
              setSlabData((prev) => ({
                ...prev,
                thicknessUnit: e.target.value,
              }))
            }
            className="px-3 py-2.5 text-gray-900 border border-l-0 border-gray-900 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="centimeters">cm</option>
            <option value="meters">m</option>
            <option value="inches">in</option>
          </select>
        </div>
      </div>

      {/* Quantity */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
        <input
          type="number"
          value={slabData.quantity}
          onChange={(e) =>
            setSlabData((prev) => ({
              ...prev,
              quantity: parseInt(e.target.value) || 1,
            }))
          }
          className="w-full px-3 py-2.5 text-gray-900 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          min="1"
        />
      </div>
    </div>
  


    {/* Waste */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-1">
        Waste Allowance (%)
      </label>
      <input
        type="range"
        min="0"
        max="25"
        value={slabData.wastePercentage}
        onChange={(e) =>
          setSlabData((prev) => ({
            ...prev,
            wastePercentage: parseInt(e.target.value),
          }))
        }
        className="w-full accent-gray-900"
      />
      <div className="flex justify-between text-xs text-gray-900 mt-1">
        <span>0%</span>
        <span className="font-semibold text-gray-900">
          {slabData.wastePercentage}%
        </span>
        <span>25%</span>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={calculateSlab}
        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center text-lg font-semibold"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calculate Slab
      </button>
      <button
        onClick={() => clearResults('slab')}
        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
      >
        Clear
      </button>
    </div>

    <ResultsDisplay result={results.slab} type="slab" title="Slab" />
  </div>
)}

            {/* Cylinder Calculator */}
            {activeTab === 'cylinder' && (
  <div className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col sm:flex-row sm:items-center mb-6">
      <Target className="w-6 h-6 mr-0 sm:mr-3 text-gray-900 mb-2 sm:mb-0" />
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 text-center sm:text-left">
        Columns & Cylinders
      </h3>
    </div>

    {/* Inputs Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
      {/* Diameter */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">Diameter</label>
        <div className="flex">
          <input
            type="number"
            value={cylinderData.diameter}
            onChange={(e) =>
              setCylinderData((prev) => ({
                ...prev,
                diameter: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2.5 text-gray-900 border border-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            step="0.1"
          />
          <select
            value={cylinderData.diameterUnit}
            onChange={(e) =>
              setCylinderData((prev) => ({
                ...prev,
                diameterUnit: e.target.value,
              }))
            }
            className="px-3 py-2.5 text-gray-900 border border-l-0 border-gray-900 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="meters">m</option>
            <option value="feet">ft</option>
            <option value="centimeters">cm</option>
          </select>
        </div>
      </div>

      {/* Height */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">Height</label>
        <div className="flex">
          <input
            type="number"
            value={cylinderData.height}
            onChange={(e) =>
              setCylinderData((prev) => ({
                ...prev,
                height: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full px-3 py-2.5 text-gray-900 border border-gray-900 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            step="0.1"
          />
          <select
            value={cylinderData.heightUnit}
            onChange={(e) =>
              setCylinderData((prev) => ({
                ...prev,
                heightUnit: e.target.value,
              }))
            }
            className="px-3 py-2.5 text-gray-900 border border-l-0 border-gray-900 rounded-r-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="meters">m</option>
            <option value="feet">ft</option>
            <option value="centimeters">cm</option>
          </select>
        </div>
      </div>

      {/* Quantity */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-900 mb-2">Quantity</label>
        <input
          type="number"
          value={cylinderData.quantity}
          onChange={(e) =>
            setCylinderData((prev) => ({
              ...prev,
              quantity: parseInt(e.target.value) || 1,
            }))
          }
          className="w-full px-3 py-2.5 text-gray-900 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          min="1"
        />
      </div>
    </div>

    {/* Waste Allowance */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-900 mb-2">Waste Allowance (%)</label>
      <input
        type="range"
        min="0"
        max="25"
        value={cylinderData.wastePercentage}
        onChange={(e) =>
          setCylinderData((prev) => ({
            ...prev,
            wastePercentage: parseInt(e.target.value),
          }))
        }
        className="w-full accent-gray-900"
      />
      <div className="flex justify-between text-xs text-gray-900 mt-1">
        <span>0%</span>
        <span className="font-semibold text-gray-900">{cylinderData.wastePercentage}%</span>
        <span>25%</span>
      </div>
    </div>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={calculateCylinder}
        className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center text-base sm:text-lg font-semibold"
      >
        <Calculator className="w-5 h-5 mr-2" />
        Calculate Cylinder
      </button>
      <button
        onClick={() => clearResults('cylinder')}
        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-base sm:text-lg font-semibold"
      >
        Clear
      </button>
    </div>

    {/* Results */}
    <ResultsDisplay result={results.cylinder} type="cylinder" title="Cylinder" />
  </div>
            )}
  </div>
  


          {/* Construction Tips */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-6">
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">
              Construction Tips
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Concrete Mixing Guidelines</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Always add cement to water, never water to cement</li>
                  <li>• Mix for 3-5 minutes for optimal consistency</li>
                  <li>• Use clean, potable water for all mixes</li>
                  <li>• Maintain water-cement ratio between 0.4-0.6</li>
                  <li>• Test slump before pouring (50-150mm typical)</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Curing Best Practices</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Keep concrete moist for at least 7 days</li>
                  <li>• Protect from direct sunlight and wind</li>
                  <li>• Maintain temperature above 5°C (41°F)</li>
                  <li>• Use curing compounds in dry conditions</li>
                  <li>• Allow 28 days for full strength development</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <p className="text-sm text-yellow-800">
                <strong>Safety Note:</strong> Always wear appropriate PPE including safety glasses, gloves, and dust masks when handling cement. 
                Ensure proper ventilation and follow local building codes.
              </p>
            </div>
          </div>

          {/* Understanding Concrete */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-6">
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">Understanding Concrete Composition</h3>
            
            <div className="space-y-4 text-gray-700 text-sm lg:text-base">
              <p>
                <strong>Concrete</strong> is a composite material consisting of aggregate (stone and sand) bonded together 
                with cement and water. The chemical reaction between cement and water, called hydration, creates the binding 
                matrix that gives concrete its strength and durability.
              </p>
              
              <div className="bg-gray-50 border-l-4 border-gray-900 p-4 rounded">
                <div className="flex items-center mb-3">
                  <Layers className="w-5 h-5 mr-2 text-gray-900" />
                  <span className="font-semibold text-gray-800">Key Components:</span>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li><strong>Cement (10-15%):</strong> Binding agent, typically Portland cement</li>
                  <li><strong>Water (15-20%):</strong> Activates cement hydration process</li>
                  <li><strong>Fine Aggregate (25-30%):</strong> Sand particles under 4.75mm</li>
                  <li><strong>Coarse Aggregate (35-40%):</strong> Gravel or crushed stone over 4.75mm</li>
                  <li><strong>Air (5-8%):</strong> Entrapped and entrained air voids</li>
                </ul>
              </div>

              <h4 className="text-lg font-semibold text-gray-800 mt-6">Concrete Strength Classifications</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Standard Grades</h5>
                    <div className="space-y-2 text-sm">
                      <p><strong>M15:</strong> 15 MPa - Non-structural work</p>
                      <p><strong>M20:</strong> 20 MPa - Residential construction</p>
                      <p><strong>M25:</strong> 25 MPa - Commercial buildings</p>
                      <p><strong>M35:</strong> 35 MPa - High-rise structures</p>
                      <p><strong>M40+:</strong> 40+ MPa - Infrastructure projects</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Mix Design Ratios</h5>
                    <div className="space-y-2 text-sm">
                      <p><strong>1:2:4</strong> - General purpose, moderate strength</p>
                      <p><strong>1:1.5:3</strong> - Standard construction grade</p>
                      <p><strong>1:1:2</strong> - High strength applications</p>
                      <p><strong>1:3:6</strong> - Mass concrete, low strength</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculation Methodology & Accuracy */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-6">
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">Calculation Methodology & Accuracy</h3>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-sm lg:text-base">
                Our calculator uses industry-standard formulas and material properties to provide accurate estimates. 
                All calculations account for material density, waste factors, and standard construction practices.
              </p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Volume Calculation</h4>
                  <p className="text-sm text-gray-600">Geometric formulas for precise volume estimation based on shape</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                    <Target className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Material Estimation</h4>
                  <p className="text-sm text-gray-600">Industry ratios for cement, sand, and aggregate quantities</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Waste Factor</h4>
                  <p className="text-sm text-gray-600">Allowance for cutting, spillage, and over-excavation</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 lg:p-6 rounded-lg border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Calculation Formulas</h4>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Slab Volume Formula:</p>
                    <div className="bg-white p-3 rounded border border-gray-300 font-mono text-gray-700">
                      Volume = Length × Width × Thickness × Quantity
                    </div>
                    <p className="text-xs text-gray-600 mt-1">All dimensions converted to meters for consistent calculation</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Cylinder Volume Formula:</p>
                    <div className="bg-white p-3 rounded border border-gray-300 font-mono text-gray-700">
                      Volume = π × (Diameter/2)² × Height × Quantity
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Using π = 3.14159 for accurate circular calculations</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Total Volume with Waste:</p>
                    <div className="bg-white p-3 rounded border border-gray-300 font-mono text-gray-700">
                      Total Volume = Base Volume × (1 + Waste%/100)
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Waste percentage accounts for material loss during construction</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Material Weight Calculation:</p>
                    <div className="bg-white p-3 rounded border border-gray-300 font-mono text-gray-700">
                      Weight (kg) = Total Volume (m³) × Concrete Density (kg/m³)
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Density varies by concrete type: 1800-2500 kg/m³</p>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Cement Bags Required:</p>
                    <div className="bg-white p-3 rounded border border-gray-300 font-mono text-gray-700">
                      Bags = Cement Volume (m³) ÷ 0.05 (50kg bag volume)
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Standard 50kg cement bag occupies approximately 0.05 m³</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-800 mb-1">Accuracy & Limitations</h4>
                    <p className="text-sm text-gray-700">
                      Calculations provide estimates based on standard engineering formulas and industry practices. 
                      Actual requirements may vary based on site conditions, material quality, temperature, humidity, 
                      and construction methods. Always consult with structural engineers and follow local building codes. 
                      Order slightly more material than calculated to account for field variations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-green-50 p-4 rounded border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">✓ Factors Included</h5>
                  <ul className="space-y-1 text-green-700">
                    <li>• Unit conversions (metric/imperial)</li>
                    <li>• Material density variations</li>
                    <li>• Standard waste allowances</li>
                    <li>• Mix ratio specifications</li>
                    <li>• Multiple structure types</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded border border-orange-200">
                  <h5 className="font-semibold text-orange-800 mb-2">! Not Included</h5>
                  <ul className="space-y-1 text-orange-700">
                    <li>• Reinforcement steel requirements</li>
                    <li>• Formwork/shuttering materials</li>
                    <li>• Labor and equipment costs</li>
                    <li>• Transportation charges</li>
                    <li>• Site-specific soil conditions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Reference Guide</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Standard Concrete Mixes</h4>
                <div className="text-sm space-y-1">
                  <p className="font-mono text-gray-600">1:2:4 - General purpose</p>
                  <p className="font-mono text-gray-600">1:1.5:3 - Standard grade</p>
                  <p className="font-mono text-gray-600">1:1:2 - High strength</p>
                  <p className="font-mono text-gray-600">1:3:6 - Mass concrete</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Typical Densities</h4>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">Normal concrete: 2400 kg/m³</p>
                  <p className="text-gray-600">Lightweight: 1800 kg/m³</p>
                  <p className="text-gray-600">Heavy concrete: 2500+ kg/m³</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Common Waste Factors</h4>
                <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                  <li>Slabs: 5-10%</li>
                  <li>Columns: 2-8%</li>
                  <li>Stairs: 10-20%</li>
                  <li>Foundations: 5-15%</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-gray-100 border-l-4 border-gray-900 p-4 rounded">
              <p className="text-sm text-gray-800">
                <strong>Pro Tip:</strong> Always order 5-10% extra concrete to account for variations in excavation depth and potential spillage during pouring.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
    </>
  );
};

export default ConcreteCalculator;