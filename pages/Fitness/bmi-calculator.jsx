import Head from "next/head";
import React, { useState } from 'react';
 import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Activity,  } from 'lucide-react';

const BMICalculator = () => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [units, setUnits] = useState('metric');
  const [bmi, setBmi] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fitnessTools = [
    { emoji: '⚖️', name: 'BMI Calculator', href: '/Fitness/bmi-calculator' },
    { emoji: '🔥', name: 'Calorie Calculator', href: '/Fitness/calorie-calculator' },
    { emoji: '💪', name: 'Body Fat Calculator', href: '/Fitness/body-fat-calculator' },
    { emoji: '⚡', name: 'BMR Calculator', href: '/Fitness/bmr-calculator' },
    { emoji: '🎯', name: 'Ideal Weight Calculator', href: '/Fitness/ideal-weight-calculator' },
    { emoji: '🏃', name: 'Pace Calculator', href: '/Fitness/pace-calculator' },
    { emoji: '🤰', name: 'Pregnancy Calculator', href: '/Fitness/pregnancy-calculator' },
    { emoji: '🍼', name: 'Pregnancy Conception Calculator', href: '/Fitness/pregnancy-conception-calculator' },
    { emoji: '📅', name: 'Due Date Calculator', href: '/Fitness/due-date-calculator' },
  ];

  const calculateBMI = () => {
    let heightInM, weightInKg;
    
    if (units === 'metric') {
      heightInM = height / 100;
      weightInKg = weight;
    } else {
      heightInM = height * 0.0254;
      weightInKg = weight * 0.453592;
    }
    
    const bmiValue = weightInKg / (heightInM * heightInM);
    setBmi(bmiValue);
  };

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmiValue < 25) return { category: 'Normal weight', color: 'text-green-600' };
    if (bmiValue < 30) return { category: 'Overweight', color: 'text-orange-500' };
    if (bmiValue < 35) return { category: 'Obese Class I', color: 'text-red-500' };
    if (bmiValue < 40) return { category: 'Obese Class II', color: 'text-red-600' };
    return { category: 'Obese Class III', color: 'text-red-700' };
  };

  const getIdealWeightRange = () => {
    if (units === 'metric') {
      const heightInM = height / 100;
      const minWeight = 18.5 * heightInM * heightInM;
      const maxWeight = 24.9 * heightInM * heightInM;
      return `${minWeight.toFixed(1)} - ${maxWeight.toFixed(1)} kg`;
    } else {
      const heightInM = height * 0.0254;
      const minWeightKg = 18.5 * heightInM * heightInM;
      const maxWeightKg = 24.9 * heightInM * heightInM;
      const minWeightLbs = minWeightKg * 2.20462;
      const maxWeightLbs = maxWeightKg * 2.20462;
      return `${minWeightLbs.toFixed(1)} - ${maxWeightLbs.toFixed(1)} lbs`;
    }
  };

  const resetForm = () => {
    setAge(0);
    setHeight(0);
    setWeight(0);
    setBmi(null);
  };

  const bmiCategory = bmi ? getBMICategory(bmi) : null;

  return (
    <>
     <Head>
        <title>BMI Calculator | Free Online Body Mass Index Tool


</title>
        <meta
          name="description"
          content="Use our free BMI Calculator to check your Body Mass Index instantly. Easy, accurate, and fast — the best online BMI calculator for health tracking.
  "
        />
        <meta name="keywords" content=" BMI Calculator, Online BMI Calculator, Body Mass Index Calculator, Free BMI Calculator, BMI Calculator Tool, BMI Calculator Online, Health BMI Calculator, BMI Measurement Calculator, BMI Checker, Body Index Calculator

" />
     
      </Head>
    <div className="min-h-screen bg-gray-200">
      <Header/>
       <div className="flex mt-14">
        {/* Sidebar */}
        <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="bg-gray-900 text-white p-3">
                   
            <h3 className="font-bold">Fitness & Health Tools</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2 text-sm">
              {fitnessTools.map((tool, index) => (
                <a key={index} href={tool.href} onClick={() => setSidebarOpen(false)}
                  className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span>{tool.emoji}</span>
                  <span>{tool.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full lg:ml-64 p-4 md:p-6 -mt-15">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Body Mass Index Calculator</h1>
            <p className="text-gray-600 mb-6 text-xs md:text-sm leading-relaxed">
              Discover your body's weight status at rest. Calculate your BMI to understand how many categories you fall into for 
              daily health assessment based on height, weight, and overall body composition.
            </p>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Unit Toggle */}
              <div className="flex flex-col sm:flex-row">
                <button onClick={() => setUnits('metric')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    units === 'metric' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  Metric Units
                </button>
                <button onClick={() => setUnits('imperial')}
                  className={`flex-1 py-2 px-4 text-sm font-medium ${
                    units === 'imperial' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                  Imperial Units
                </button>
                <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium text-center">
                  Result
                </div>
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Input Section */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <label className="sm:w-16 sm:text-right text-sm text-gray-900 font-medium">Age</label>
                      <input type="number" value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full text-gray-900 sm:w-20 px-2 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"/>
                      <span className="text-xs text-gray-900">ages: 15 - 80</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
  <label className="sm:w-16 sm:text-right text-gray-900 text-sm font-medium">
    Gender
  </label>
  <div className="flex space-x-4">
    <label className="flex items-center text-gray-900 text-sm">
      <input
        type="radio"
        value="male"
        checked={gender === 'male'}
        onChange={(e) => setGender(e.target.value)}
        className="mr-2"
      />
      Male
    </label>

    <label className="flex items-center text-gray-900 text-sm">
      <input
        type="radio"
        value="female"
        checked={gender === 'female'}
        onChange={(e) => setGender(e.target.value)}
        className="mr-2"
      />
      Female
    </label>
  </div>
</div>

                    

                    <div className="flex flex-col sm:flex-row text-gray-900 sm:items-center gap-2 sm:gap-4">
                      <label className="sm:w-16 sm:text-right text-sm font-medium">Height</label>
                      <input type="number" value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full sm:w-20 text-gray-900 px-2 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"/>
                      <span className="text-xs text-gray-900">
                        {units === 'metric' ? 'cm' : 'inches'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-900 sm:gap-4">
                      <label className="sm:w-16 sm:text-right text-sm font-medium">Weight</label>
                      <input type="number" value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full sm:w-20 text-gray-900 px-2 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"/>
                      <span className="text-xs text-gray-900">
                        {units === 'metric' ? 'kg' : 'lbs'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <button onClick={calculateBMI}
                        className="bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 flex items-center justify-center space-x-2">
                        <span>Calculate BMI</span>
                      </button>
                      <button onClick={resetForm}
                        className="bg-gray-400 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-500">
                        Reset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="w-full lg:w-80 bg-gray-50 p-4 md:p-6 border-t lg:border-t-0 lg:border-l">
                  {bmi ? (
                    <div>
                      <div className="text-center mb-6">
                        <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                          {bmi.toFixed(1)}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          kg/m² ({bmiCategory && <span className={bmiCategory.color}>{bmiCategory.category}</span>})
                        </div>
                      </div>

                      <div className="space-y-3 text-xs md:text-sm">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-600">Underweight (&lt;18.5)</span>
                          <span className="font-semibold text-blue-600">Low risk</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-600">Normal (18.5-24.9)</span>
                          <span className="font-semibold text-green-600">Healthy</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-600">Overweight (25-29.9)</span>
                          <span className="font-semibold text-orange-500">Moderate</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-600">Obese I (30-34.9)</span>
                          <span className="font-semibold text-red-500">High</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                          <span className="text-gray-600">Obese II (35-39.9)</span>
                          <span className="font-semibold text-red-600">Very High</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Obese III (≥40)</span>
                          <span className="font-semibold text-red-700">Extreme</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
                        <strong>Note:</strong> BMI is a screening tool. Consult healthcare professionals for comprehensive health assessment.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-10 h-10 md:h-12 md:w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-xs md:text-sm">Enter your details and click Calculate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BMI Quick Tips */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3">BMI Quick Tips</h3>
              <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>BMI is a useful screening tool but doesn't measure body fat directly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Athletes with high muscle mass may have high BMI despite low body fat</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>BMI should be considered alongside other health measurements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-500 mr-2">•</span>
                  <span>Consult healthcare professionals for personalized health assessment</span>
                </li>
              </ul>
            </div>

            {/* Accuracy & Limitations */}
            <div className="mt-6 bg-gray-900 text-white rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-3">Accuracy & Limitations</h3>
              <p className="text-xs md:text-sm leading-relaxed">
                BMI calculations are statistical estimates that work well for population 
                assessments but may not perfectly match your individual health status. For 
                the most accurate assessment, consider comprehensive health evaluations including body composition analysis.
              </p>
            </div>

            {/* Understanding Your BMI */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">Understanding Your Body Mass Index</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-xs md:text-sm">
                Your Body Mass Index (BMI) is a measure of body fat based on height and weight. It provides a general indication of whether you're at a healthy weight for your height.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4 text-xs md:text-sm">
                <strong>BMI</strong> is calculated by dividing weight in kilograms by height in meters squared. While not perfect, it's a useful screening tool for identifying potential weight-related health issues.
              </p>

              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                Understanding your <strong>BMI</strong> is helpful for health assessment, but should be considered alongside other factors like muscle mass, bone density, and overall body composition.
              </p>
            </div>

            {/* Using Your BMI */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">Using Your BMI for Health Goals</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-2">⚖️</div>
                  <h3 className="font-semibold text-green-800 mb-2 text-sm md:text-base">Weight Management</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Use BMI as one indicator to guide healthy weight management decisions.
                  </p>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-2">🏃</div>
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">Health Monitoring</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Track BMI changes over time as part of overall health monitoring.
                  </p>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl md:text-3xl mb-2">💪</div>
                  <h3 className="font-semibold text-purple-800 mb-2 text-sm md:text-base">Fitness Planning</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Combine BMI with fitness assessments for comprehensive health planning.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-xs md:text-sm text-gray-700">
                  <strong>Important:</strong> BMI is a screening tool, not a diagnostic measure. Consult healthcare professionals for personalized health advice and comprehensive assessments.
                </p>
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

export default BMICalculator;