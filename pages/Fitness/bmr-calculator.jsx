import Head from "next/head";
import React, { useState } from 'react';
 import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import { Calculator, Activity, Target, TrendingUp,  } from 'lucide-react';

const BMRCalculator = () => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState(70);
  const [units, setUnits] = useState('metric');
  const [bmr, setBmr] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [equation, setEquation] = useState('mifflin');
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

  const calculateBMR = () => {
    let heightInCm, weightInKg;
    
    if (units === 'metric') {
      heightInCm = height;
      weightInKg = weight;
    } else {
      heightInCm = height * 2.54;
      weightInKg = weight * 0.453592;
    }

    let bmrValue;
    
    switch (equation) {
      case 'mifflin':
        if (gender === 'male') {
          bmrValue = 10 * weightInKg + 6.25 * heightInCm - 5 * age + 5;
        } else {
          bmrValue = 10 * weightInKg + 6.25 * heightInCm - 5 * age - 161;
        }
        break;
        
      case 'harris':
        if (gender === 'male') {
          bmrValue = 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * age + 88.362;
        } else {
          bmrValue = 9.247 * weightInKg + 3.098 * heightInCm - 4.330 * age + 447.593;
        }
        break;
        
      case 'katch':
        const estimatedBodyFat = gender === 'male' ? 15 : 25;
        const leanBodyMass = weightInKg * (1 - estimatedBodyFat / 100);
        bmrValue = 370 + (21.6 * leanBodyMass);
        break;
        
      default:
        bmrValue = 10 * weightInKg + 6.25 * heightInCm - 5 * age + (gender === 'male' ? 5 : -161);
    }
    
    setBmr(Math.round(bmrValue));
  };

  const getActivityLevels = () => {
    if (!bmr) return [];
    
    return [
      { level: 'Sedentary (Office job, no exercise)', multiplier: 1.2, color: 'text-red-600' },
      { level: 'Light activity (1-3 days/week)', multiplier: 1.375, color: 'text-orange-500' },
      { level: 'Moderate activity (3-5 days/week)', multiplier: 1.55, color: 'text-yellow-600' },
      { level: 'High activity (6-7 days/week)', multiplier: 1.725, color: 'text-green-600' },
      { level: 'Very high activity (2x/day, intense)', multiplier: 1.9, color: 'text-blue-600' },
      { level: 'Extreme activity (physical job + exercise)', multiplier: 2.1, color: 'text-purple-600' }
    ].map(item => ({
      ...item,
      calories: Math.round(bmr * item.multiplier)
    }));
  };

  const reset = () => {
    setAge(0);
    setHeight(0);
    setWeight(0);
    setBmr(null);
  };

  const activityLevels = getActivityLevels();

  return (
     <>
     <Head>
        <title>BMR Calculator | Free Online Basal Metabolic Rate Tool


</title>
        <meta
          name="description"
          content="Use our free BMR Calculator to estimate your daily calorie needs. Quick, accurate, and easy — the best online Basal Metabolic Rate calculator tool.
  
  "
        />
        <meta name="keywords" content=" BMR Calculator, Basal Metabolic Rate Calculator, Online BMR Calculator, Free BMR Calculator, BMR Calculation Tool, Daily Calorie Needs Calculator, BMR Estimator, Health BMR Calculator, Fitness BMR Calculator, Basal Rate Calculator

" />
     
      </Head>
    <div className="min-h-screen bg-gray-50">
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
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 mb-6 md:mb-8">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <Activity className="w-6 h-6 md:w-8 md:h-8 text-gray-900" />
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Basal Metabolic Rate Calculator</h1>
              </div>
              
              <p className="text-gray-600 text-sm md:text-lg leading-relaxed">
                Discover your body's energy requirements at rest. Calculate your BMR to understand how many calories 
                your body burns daily to maintain basic physiological functions.
              </p>
            </div>

            {/* Calculator Card */}
            <div className="bg-white rounded-xl shadow-lg border-l-4 border-gray-900 p-4 md:p-8 mb-6 md:mb-8">
              {/* Unit Toggle */}
              <div className="flex bg-gray-100 rounded-lg mb-6 p-1">
                <button onClick={() => setUnits('metric')}
                  className={`flex-1 py-2  md:py-3 px-4 md:px-6 font-semibold rounded-lg transition-all text-sm md:text-base ${
                    units === 'metric' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                  Metric Units
                </button>
                <button onClick={() => setUnits('us')}
                  className={`flex-1 py-2 md:py-3 px-4 md:px-6 font-semibold rounded-lg transition-all text-sm md:text-base ${
                    units === 'us' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                  Imperial Units
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Input Section */}
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Age</label>
                    <input type="number" value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full text-gray-900 px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      placeholder="Enter your age"/>
                    <p className="text-xs md:text-sm text-gray-900 mt-1">Age range: 15-80 years</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Gender</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" value="male"
                          checked={gender === 'male'}
                          onChange={(e) => setGender(e.target.value)}
                          className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 text-gray-900"/>
                        <span className="text-sm md:text-lg text-gray-900">Male</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" value="female"
                          checked={gender === 'female'}
                          onChange={(e) => setGender(e.target.value)}
                          className="mr-2 md:mr-3 w-4 h-4 md:w-5 md:h-5 text-gray-900"/>
                        <span className="text-sm md:text-lg text-gray-900">Female</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Height</label>
                    <div className="relative">
                      <input type="number" value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full  text-gray-900 px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-16"
                        placeholder={units === 'metric' ? '175' : '69'}/>
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-medium text-sm">
                        {units === 'metric' ? 'cm' : 'in'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Weight</label>
                    <div className="relative">
                      <input type="number" value={weight}
                        onChange={(e) => setWeight(Number(e.target.value))}
                        className="w-full  text-gray-900 px-4 py-2 md:py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-16"
                        placeholder={units === 'metric' ? '70' : '154'}/>
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-medium text-sm">
                        {units === 'metric' ? 'kg' : 'lbs'}
                      </span>
                    </div>
                  </div>

                  {/* Advanced Options */}
                  <div>
                    <button onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-gray-900 hover:text-gray-700 font-medium text-xs md:text-sm flex items-center transition-colors">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                    </button>
                    
                    {showAdvanced && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Calculation Method</label>
                        <select value={equation}
                          onChange={(e) => setEquation(e.target.value)}
                          className="w-full text-gray-900 px-3 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm">
                          <option value="mifflin">Mifflin-St Jeor (Recommended)</option>
                          <option value="harris">Harris-Benedict (Revised)</option>
                          <option value="katch">Katch-McArdle</option>
                        </select>
                        <p className="text-xs text-gray-900 mt-1">Mifflin-St Jeor is most accurate for general population</p>
                      </div>
                    )}
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-4">
                    <button onClick={calculateBMR}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold flex items-center justify-center space-x-2 text-sm md:text-base">
                      <Activity className="w-4 h-4 md:w-5 md:h-5" />
                      <span>Calculate BMR</span>
                    </button>
                    <button onClick={reset}
                      className="px-4 md:px-6 py-2 md:py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors text-sm md:text-base">
                      Reset
                    </button>
                  </div>
                </div>

                {/* Results Section */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-6">
                  {bmr ? (
                    <div className="space-y-4 md:space-y-6">
                      <div className="text-center">
                        <div className="text-4xl md:text-5xl font-bold mb-2 text-gray-900">
                          {bmr.toLocaleString()}
                        </div>
                        <div className="text-base md:text-lg text-gray-700 font-medium">Calories per day</div>
                        <div className="text-xs md:text-sm text-gray-600 mt-1">Your Basal Metabolic Rate</div>
                      </div>

                      <div className="space-y-2 md:space-y-3">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm md:text-base">
                          <Target className="w-4 h-4 mr-2" />
                          Daily Calorie Needs by Activity
                        </h4>
                        
                        {activityLevels.map((level, index) => (
                          <div key={index} className="bg-white rounded-lg p-2 md:p-3 flex justify-between items-center shadow-sm">
                            <div className="flex-1">
                              <div className="text-xs md:text-sm font-medium text-gray-800">{level.level}</div>
                            </div>
                            <div className={`font-bold text-base md:text-lg ${level.color}`}>
                              {level.calories.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-white rounded-lg p-3 md:p-4 text-xs md:text-sm text-gray-600 space-y-2">
                        <div><strong>Note:</strong> These are estimates based on statistical data.</div>
                        <div>Individual rates can vary by ±15% due to genetics and other factors.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 md:py-12">
                      <Activity className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500 text-sm md:text-lg">Enter your details and click Calculate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Educational Content */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Understanding Your Basal Metabolic Rate</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">What is BMR?</h4>
                  <p className="text-gray-600 mb-4 text-sm md:text-base">
                    Your Basal Metabolic Rate represents the minimum energy your body requires to maintain essential 
                    physiological functions while at complete rest.
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    BMR typically accounts for 60-75% of your total daily energy expenditure.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Why It Matters</h4>
                  <ul className="space-y-2 text-gray-600 text-sm md:text-base">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Foundation for weight management planning</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Helps set appropriate calorie targets</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>Guides nutrition and fitness decisions</span>
                    </li>
                  </ul>
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

export default BMRCalculator;