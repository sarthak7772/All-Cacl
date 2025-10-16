import Head from "next/head";
import React, { useState, useEffect } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Target, Zap, TrendingUp, Activity } from 'lucide-react';

const CalorieCalculator = () => {
  const [unitSystem, setUnitSystem] = useState('metric');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [bmr, setBmr] = useState(null);
  const [dailyCalories, setDailyCalories] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [bodyFatPercentage, setBodyFatPercentage] = useState('');
  const [calculationMethod, setCalculationMethod] = useState('mifflin');

  const healthTools = [
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

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary - desk job, minimal exercise', factor: 1.2 },
    { value: 'light', label: 'Light activity - 1-3 workouts per week', factor: 1.375 },
    { value: 'moderate', label: 'Moderate activity - 3-5 workouts per week', factor: 1.55 },
    { value: 'active', label: 'Active lifestyle - 6-7 workouts per week', factor: 1.725 },
    { value: 'very_active', label: 'Very active - intense daily training', factor: 1.9 }
  ];

  const calculateBMR = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (!ageNum || !heightNum || !weightNum) return null;

    let heightInCm, weightInKg;
    
    if (unitSystem === 'metric') {
      heightInCm = heightNum;
      weightInKg = weightNum;
    } else {
      heightInCm = heightNum * 2.54;
      weightInKg = weightNum * 0.453592;
    }

    let bmrValue;
    
    if (calculationMethod === 'mifflin') {
      if (gender === 'male') {
        bmrValue = 10 * weightInKg + 6.25 * heightInCm - 5 * ageNum + 5;
      } else {
        bmrValue = 10 * weightInKg + 6.25 * heightInCm - 5 * ageNum - 161;
      }
    } else if (calculationMethod === 'harris') {
      if (gender === 'male') {
        bmrValue = 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * ageNum + 88.362;
      } else {
        bmrValue = 9.247 * weightInKg + 3.098 * heightInCm - 4.330 * ageNum + 447.593;
      }
    } else if (calculationMethod === 'katch') {
      const bfp = parseFloat(bodyFatPercentage);
      if (!bfp) return null;
      const leanBodyMass = weightInKg * (1 - bfp / 100);
      bmrValue = 370 + 21.6 * leanBodyMass;
    }

    return Math.round(bmrValue);
  };

  const calculateDailyCalories = () => {
    const bmrValue = calculateBMR();
    if (!bmrValue) return;
    
    const activityFactor = activityLevels.find(level => level.value === activityLevel)?.factor || 1.55;
    const dailyCaloriesValue = Math.round(bmrValue * activityFactor);

    setBmr(bmrValue);
    setDailyCalories(dailyCaloriesValue);
  };

  const clearCalorieForm = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setGender('male');
    setActivityLevel('moderate');
    setBodyFatPercentage('');
    setCalculationMethod('mifflin');
    setBmr(null);
    setDailyCalories(null);
  };

  const handleUnitToggle = (system) => {
    setUnitSystem(system);
    setHeight('');
    setWeight('');
    setBmr(null);
    setDailyCalories(null);
  };

  return (
    <>
      <Head>
        <title>Calorie Calculator | Free Online Calorie Counting Tool</title>
        <meta
          name="description"
          content="Use our free Calorie Calculator to track daily calorie intake, monitor nutrition, and meet health goals. Quick, accurate, and easy-to-use online tool."
        />
        <meta name="keywords" content="Calorie Calculator, Online Calorie Calculator, Free Calorie Calculator, Daily Calorie Calculator, Nutrition Calorie Calculator, Calorie Intake Calculator, Food Calorie Calculator, Healthy Calorie Calculator, BMI Calorie Calculator, Calorie Counting Tool" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header/>
        
        <div className="flex pt-14">
          {/* Left Sidebar - Hidden on mobile */}
          <div className="hidden lg:block fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40">
            <div className="bg-gray-900 text-white p-3">
              <h3 className="font-bold">Health & Fitness Tools</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                {healthTools.map((tool, index) => (
                  <a
                    key={index}
                    href={tool.href}
                    className={`flex items-center gap-2 p-2 rounded transition-colors ${
                      tool.name === 'Calorie Calculator' 
                        ? 'text-gray-900 bg-gray-100 font-semibold' 
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tool.emoji}</span>
                    <span>{tool.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 p-4 md:p-6 -mt-15">
            <div className="max-w-5xl lg:mx-auto">
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900" />
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Daily Calorie Calculator</h1>
                </div>
                
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Calculate your personalized daily calorie needs based on your metabolism, activity level, and health goals. 
                  Our advanced algorithms use multiple validated equations to provide accurate estimates for optimal nutrition planning.
                </p>
              </div>

              {/* Calculator Card */}
              <div className="bg-white rounded-xl shadow-lg border-l-4 border-gray-900 p-4 sm:p-6 lg:p-8 mb-6">
                {/* Unit Toggle */}
                <div className="flex bg-gray-100 rounded-lg mb-6 p-1">
                  <button
                    onClick={() => handleUnitToggle('metric')}
                    className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 font-semibold rounded-lg transition-all text-sm sm:text-base ${
                      unitSystem === 'metric' 
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Metric
                  </button>
                  <button
                    onClick={() => handleUnitToggle('us')}
                    className={`flex-1 py-2 sm:py-3 px-3 sm:px-6 font-semibold rounded-lg transition-all text-sm sm:text-base ${
                      unitSystem === 'us' 
                        ? 'bg-gray-900 text-white shadow-md' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Imperial
                  </button>
                </div>

                <div className="space-y-6">
                 
                  {/* Basic Information */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Age</label>
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter age"
                        className="w-full px-4 py-3 text-gray-900 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      />
                      <p className="text-xs text-gray-900 mt-1">Age range: 15-80 years</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">Gender</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            value="male"
                            checked={gender === 'male'}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-3 w-5 h-5 text-gray-900"
                          />
                          <span className="text-base text-gray-900">Male</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            value="female"
                            checked={gender === 'female'}
                            onChange={(e) => setGender(e.target.value)}
                            className="mr-3 w-5 h-5 text-gray-900"
                          />
                          <span className="text-base text-gray-900">Female</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Height</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder={unitSystem === 'metric' ? 'e.g., 175' : 'e.g., 69'}
                          className="w-full text-gray-900 px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-16"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-medium">
                          {unitSystem === 'metric' ? 'cm' : 'in'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Weight</label>
                      <div className="relative">
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder={unitSystem === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                          className="w-full px-4 text-gray-900 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-16"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-medium">
                          {unitSystem === 'metric' ? 'kg' : 'lbs'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Level */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">Activity Level</label>
                    <div className="space-y-2">
                      {activityLevels.map((level) => (
                        <label key={level.value} className="flex items-center p-3 border-2 border-gray-900 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            value={level.value}
                            checked={activityLevel === level.value}
                            onChange={(e) => setActivityLevel(e.target.value)}
                            className="mr-3 w-5 h-5 text-gray-900 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <span className="font-medium text-sm sm:text-base text-gray-900">{level.label}</span>
                            <span className="text-xs sm:text-sm text-gray-900 ml-2">({level.factor}x)</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div>
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="text-gray-900 hover:text-gray-700 font-medium text-sm flex items-center transition-colors"
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
                    </button>
                    
                    {showAdvanced && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-900 mb-2">BMR Calculation Method</label>
                          <select
                            value={calculationMethod}
                            onChange={(e) => setCalculationMethod(e.target.value)}
                            className="w-full  text-gray-900 px-3 py-2 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                          >
                            <option value="mifflin">Mifflin-St Jeor (Most Accurate)</option>
                            <option value="harris">Harris-Benedict (Traditional)</option>
                            <option value="katch">Katch-McArdle (Body Fat Based)</option>
                          </select>
                        </div>

                        {calculationMethod === 'katch' && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-900 mb-2">Body Fat Percentage</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={bodyFatPercentage}
                                onChange={(e) => setBodyFatPercentage(e.target.value)}
                                placeholder="e.g., 15"
                                className="w-full text-gray-900 px-4 py-3 border-2 border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900 pr-12"
                                step="0.1"
                              />
                              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-medium">%</span>
                            </div>
                            <p className="text-xs text-gray-900 mt-1">Required for Katch-McArdle formula accuracy</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={calculateDailyCalories}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                    >
                      <Activity className="w-5 h-5" />
                      <span>Calculate Calories</span>
                    </button>
                    <button
                      onClick={clearCalorieForm}
                      className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Results Display */}
                {dailyCalories && (
                  <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center text-gray-900">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                      Your Daily Calorie Requirements
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">{bmr}</div>
                        <div className="text-sm text-gray-600">Basal Metabolic Rate</div>
                        <div className="text-xs text-gray-500">calories at rest</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-2xl sm:text-3xl font-bold mb-2 text-green-600">{dailyCalories}</div>
                        <div className="text-sm text-gray-600">Total Daily Energy</div>
                        <div className="text-xs text-gray-500">with activity included</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                      <h4 className="font-bold mb-4 text-gray-800">Personalized Nutrition Goals:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="font-semibold text-blue-800">Maintain Current Weight</div>
                          <div className="text-blue-700">{dailyCalories} calories/day</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <div className="font-semibold text-green-800">Gradual Weight Loss</div>
                          <div className="text-green-700">{dailyCalories - 300} calories/day</div>
                          <div className="text-xs text-green-600">-0.6 lbs per week</div>
                        </div>
                        <div className="p-3 bg-yellow-50 rounded-lg">
                          <div className="font-semibold text-yellow-800">Moderate Weight Loss</div>
                          <div className="text-yellow-700">{dailyCalories - 500} calories/day</div>
                          <div className="text-xs text-yellow-600">-1 lb per week</div>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-semibold text-purple-800">Lean Muscle Gain</div>
                          <div className="text-purple-700">{dailyCalories + 300} calories/day</div>
                          <div className="text-xs text-purple-600">+0.5-1 lb per week</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-600 rounded">
                        <p className="text-sm text-gray-700">
                          <strong>Health Note:</strong> Sustainable weight changes occur at 0.5-2 pounds per week. 
                          Extreme calorie restriction can slow metabolism and should only be done under medical supervision.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Educational Content */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Understanding Calorie Requirements</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-6 lg:mb-8">
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">What Are Calories?</h4>
                    <p className="text-sm md:text-base text-gray-600 mb-4">
                      Calories measure the energy your body needs to function. Your total daily energy expenditure includes your 
                      basal metabolic rate plus energy used for activity and digestion.
                    </p>
                    <p className="text-sm md:text-base text-gray-600">
                      Understanding your calorie needs is essential for maintaining, losing, or gaining weight in a healthy, sustainable way.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Activity Factors</h4>
                    <ul className="space-y-2 text-sm md:text-base text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Sedentary: Office work, minimal exercise</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Moderate: Regular exercise 3-5 days/week</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Active: Intense daily physical activity</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-l-4 border-gray-900 p-4 sm:p-6 rounded-lg">
                  <h4 className="font-bold text-gray-900 mb-3">Healthy Weight Management:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <ul className="space-y-2">
                      <li>• Aim for 0.5-2 lbs per week weight change</li>
                      <li>• Focus on whole, nutrient-dense foods</li>
                      <li>• Combine diet with regular exercise</li>
                    </ul>
                    <ul className="space-y-2">
                      <li>• Stay hydrated throughout the day</li>
                      <li>• Get adequate sleep and manage stress</li>
                      <li>• Consult professionals for guidance</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
                <h3 className="font-bold text-lg mb-4 text-gray-900">Calorie Tips</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Track your intake consistently for best results</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Quality matters as much as quantity - choose nutrient-dense foods</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Adjust your intake as your weight and activity level changes</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-gray-900 mt-2 mr-3 flex-shrink-0"></div>
                    <p>Be patient - sustainable changes take time</p>
                  </div>
                </div>
              </div>

              {/* Accuracy Note */}
              <div className="bg-gray-900 text-white rounded-xl p-4 sm:p-6 mb-12">
                <h4 className="font-bold mb-3">Accuracy & Limitations</h4>
                <p className="text-sm opacity-90 leading-relaxed">
                  Calorie calculations provide estimates based on population averages. Individual needs may vary due to genetics, 
                  metabolism, and other factors. Consult healthcare professionals for personalized nutrition advice.
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

export default CalorieCalculator;