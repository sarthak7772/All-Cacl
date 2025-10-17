import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Activity, Target, TrendingUp } from 'lucide-react';

const BodyFatCalculator = () => {
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [neck, setNeck] = useState(38);
  const [waist, setWaist] = useState(85);
  const [hip, setHip] = useState('');
  const [units, setUnits] = useState('metric');
  const [results, setResults] = useState(null);

  const calculateBodyFat = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const neckNum = parseFloat(neck);
    const waistNum = parseFloat(waist);
    const hipNum = gender === 'female' ? parseFloat(hip) : 0;

    // Validation
    if (!ageNum || !weightNum || !heightNum || !neckNum || !waistNum) {
      alert('Please fill in all required fields');
      return;
    }

    if (gender === 'female' && (!hip || !hipNum)) {
      alert('Please enter hip measurement for female calculation');
      return;
    }

    let bodyFatPercentage = 0;
    let bmiBodyFat = 0;

    let heightInCm = units === 'imperial' ? heightNum * 2.54 : heightNum;
    let weightInKg = units === 'imperial' ? weightNum * 0.453592 : weightNum;
    let neckInCm = units === 'imperial' ? neckNum * 2.54 : neckNum;
    let waistInCm = units === 'imperial' ? waistNum * 2.54 : waistNum;
    let hipInCm = gender === 'female' && hip ? (units === 'imperial' ? hipNum * 2.54 : hipNum) : 0;

    // U.S. Navy Method
    if (gender === 'male') {
      const logWaistNeck = Math.log10(waistInCm - neckInCm);
      const logHeight = Math.log10(heightInCm);
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450;
    } else {
      if (hipInCm > 0) {
        const logWaistHipNeck = Math.log10(waistInCm + hipInCm - neckInCm);
        const logHeight = Math.log10(heightInCm);
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight) - 450;
      }
    }

    // BMI Method
    const heightInM = heightInCm / 100;
    const bmi = weightInKg / (heightInM * heightInM);
    
    if (gender === 'male') {
      if (ageNum >= 18) {
        bmiBodyFat = 1.20 * bmi + 0.23 * ageNum - 16.2;
      } else {
        bmiBodyFat = 1.51 * bmi - 0.70 * ageNum - 2.2;
      }
    } else {
      if (ageNum >= 18) {
        bmiBodyFat = 1.20 * bmi + 0.23 * ageNum - 5.4;
      } else {
        bmiBodyFat = 1.51 * bmi - 0.70 * ageNum + 1.4;
      }
    }

    const bodyFatMass = (bodyFatPercentage / 100) * weightInKg;
    const leanBodyMass = weightInKg - bodyFatMass;

    let category = 'Average';
    if (gender === 'male') {
      if (bodyFatPercentage <= 5) category = 'Essential';
      else if (bodyFatPercentage <= 13) category = 'Athletes';
      else if (bodyFatPercentage <= 17) category = 'Fitness';
      else if (bodyFatPercentage <= 24) category = 'Average';
      else category = 'Obese';
    } else {
      if (bodyFatPercentage <= 13) category = 'Essential';
      else if (bodyFatPercentage <= 20) category = 'Athletes';
      else if (bodyFatPercentage <= 24) category = 'Fitness';
      else if (bodyFatPercentage <= 31) category = 'Average';
      else category = 'Obese';
    }

    setResults({
      bodyFatPercentage: bodyFatPercentage.toFixed(1),
      bmiBodyFat: bmiBodyFat.toFixed(1),
      category,
      bodyFatMass: bodyFatMass.toFixed(1),
      leanBodyMass: leanBodyMass.toFixed(1),
      bmi: bmi.toFixed(1)
    });
  };

  const resetForm = () => {
    setAge('');
    setGender('male');
    setWeight('');
    setHeight('');
    setNeck('');
    setWaist('');
    setHip('');
    setResults(null);
  };

  return (
    <>
      <Head>
        <title>Body Fat Calculator | Free Online Body Fat Tool</title>
        <meta
          name="description"
          content="Use our free Body Fat Calculator to measure body fat percentage quickly and accurately. Easy, fast, and perfect for tracking your fitness and health goals."
        />
        <meta name="keywords" content="Body Fat Calculator, Online Body Fat Calculator, Free Body Fat Calculator, Body Fat Percentage Calculator, BMI Body Fat Calculator, Fitness Body Fat Calculator, Body Composition Calculator, Health Body Fat Calculator, Body Fat Measurement Calculator, Body Fat Tool" />
      </Head>
      
      <div className="min-h-screen bg-gray-200">
        <Header/>
        
        <div className="flex pt-14">
          {/* Sidebar - Hidden on mobile */}
          <div className="hidden lg:block fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40">
            <div className="bg-gray-900 text-white p-3">
              <h3 className="font-bold">Health & Fitness Tools</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                <a href="/Fitness/bmi-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">⚖️</span>
                  <span>BMI Calculator</span>
                </a>
                <a href="/Fitness/calorie-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">🔥</span>
                  <span>Calorie Calculator</span>
                </a>
                <a href="/Fitness/body-fat-calculator" className="text-gray-900 bg-gray-100 font-semibold flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">💪</span>
                  <span>Body Fat Calculator</span>
                </a>
                <a href="/Fitness/bmr-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">⚡</span>
                  <span>BMR Calculator</span>
                </a>
                <a href="/Fitness/ideal-weight-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">🎯</span>
                  <span>Ideal Weight Calculator</span>
                </a>
                <a href="/Fitness/pace-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">🏃</span>
                  <span>Pace Calculator</span>
                </a>
                <a href="/Fitness/pregnancy-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">🤰</span>
                  <span>Pregnancy Calculator</span>
                </a>
                <a href="/Fitness/pregnancy-conception-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">🍼</span>
                  <span>Pregnancy Conception Calculator</span>
                </a>
                <a href="/Fitness/due-date-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">📅</span>
                  <span>Due Date Calculator</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 px-4 py-6 -mt-15">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Body Fat Calculator</h1>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                Discover your body's fat composition at rest. Calculate your body fat percentage to understand your health status 
                based on measurements and body composition analysis for optimal fitness planning.
              </p>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Unit Toggle */}
                <div className="flex">
                  <button
                    onClick={() => setUnits('metric')}
                    className={`flex-1 py-2 px-4 text-sm font-medium border-r ${
                      units === 'metric' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Metric Units
                  </button>
                  <button
                    onClick={() => setUnits('imperial')}
                    className={`flex-1 py-2 px-4 text-sm font-medium ${
                      units === 'imperial' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Imperial Units
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* Input Section */}
                  <div className="flex-1 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <label className="w-20 text-right text-sm text-gray-900">Age</label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-24 px-2 text-gray-900 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                        <span className="text-xs text-gray-900">ages: 15 - 80</span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="w-20 text-right text-sm text-gray-900">Gender</label>
                        <div className="flex space-x-4">
                          <label className="flex items-center text-sm text-gray-900">
                            <input
                              type="radio"
                              value="male"
                              checked={gender === 'male'}
                              onChange={(e) => setGender(e.target.value)}
                              className="mr-2"
                            />
                            Male
                          </label>
                          <label className="flex items-center text-sm text-gray-900">
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

                      <div className="flex items-center space-x-4">
                        <label className="w-20 text-right text-sm text-gray-900">Height</label>
                        <input
                          type="number"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-24 px-2 text-gray-900 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                        <span className="text-xs text-gray-900">
                          {units === 'metric' ? 'cm' : 'inches'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="w-20 text-right text-sm text-gray-900">Weight</label>
                        <input
                          type="number"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-24 px-2 text-gray-900  py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                        <span className="text-xs text-gray-900">
                          {units === 'metric' ? 'kg' : 'lbs'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="w-20 text-right text-sm text-gray-900">Neck</label>
                        <input
                          type="number"
                          value={neck}
                          onChange={(e) => setNeck(e.target.value)}
                          className="w-24 px-2 text-gray-900 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                        <span className="text-xs text-gray-900">
                          {units === 'metric' ? 'cm' : 'inches'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="w-20 text-right text-sm text-gray-900">Waist</label>
                        <input
                          type="number"
                          value={waist}
                          onChange={(e) => setWaist(e.target.value)}
                          className="w-24 px-2 text-gray-900 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                        />
                        <span className="text-xs text-gray-900">
                          {units === 'metric' ? 'cm' : 'inches'}
                        </span>
                      </div>

                      {gender === 'female' && (
                        <div className="flex items-center space-x-4">
                          <label className="w-20 text-right text-sm text-gray-900">Hip</label>
                          <input
                            type="number"
                            value={hip}
                            onChange={(e) => setHip(e.target.value)}
                            className="w-24 px-2 text-gray-900 py-1 border border-gray-900 rounded text-left text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                          />
                          <span className="text-xs text-gray-900">
                            {units === 'metric' ? 'cm' : 'inches'}
                          </span>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={calculateBodyFat}
                          className="flex-1 bg-green-600 text-white px-6 py-2 rounded text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Calculate Body Fat
                        </button>
                        <button
                          onClick={resetForm}
                          className="px-6 py-2 bg-gray-400 text-white rounded text-sm font-medium hover:bg-gray-500 transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="lg:w-80 bg-gray-50 p-6 border-t lg:border-t-0 lg:border-l">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900">Results</h3>
                    </div>
                    {results ? (
                      <div>
                        <div className="text-center mb-6 p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-5xl font-bold text-gray-900 mb-2">
                            {results.bodyFatPercentage}%
                          </div>
                          <div className="text-sm text-gray-600">
                            Body Fat ({results.category})
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Essential Fat</div>
                            <div className="font-semibold text-blue-600 text-xs">2-5% men, 10-13% women</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Athletes</div>
                            <div className="font-semibold text-green-600 text-xs">6-13% men, 14-20% women</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Fitness</div>
                            <div className="font-semibold text-orange-500 text-xs">14-17% men, 21-24% women</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Average</div>
                            <div className="font-semibold text-yellow-600 text-xs">18-24% men, 25-31% women</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Obese</div>
                            <div className="font-semibold text-red-600 text-xs">25%+ men, 32%+ women</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Body Fat Mass</div>
                            <div className="font-semibold text-purple-500">{results.bodyFatMass} kg</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Lean Body Mass</div>
                            <div className="font-semibold text-indigo-600">{results.leanBodyMass} kg</div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-700 border border-blue-200">
                          <strong>Note:</strong> These are estimations based on statistical data. 
                          Individual rates can vary by ±15% due to genetics and other factors.
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Enter your measurements and click Calculate</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Body Fat Quick Tips */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Body Fat Quick Tips
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Track your body fat percentage regularly to monitor metabolic health and fitness progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Strength training helps maintain lower body fat by preserving muscle mass</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Body fat can vary by 10-15% between individuals of similar size due to genetics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Proper nutrition has beneficial effects on body composition and overall health</span>
                  </li>
                </ul>
              </div>

              {/* Accuracy & Limitations */}
              <div className="mt-6 bg-gray-900 text-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3">⚠️ Accuracy & Limitations</h3>
                <p className="text-sm leading-relaxed">
                  Body fat calculations are statistical estimates that work well for population 
                  assessments but may not perfectly match your individual body composition. For 
                  the most accurate assessment, consider professional body composition testing.
                </p>
              </div>

              {/* Understanding Your Body Fat */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Body Fat Percentage</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your Body Fat Percentage represents the proportion of fat mass to total body weight. Think of it as a comprehensive measure 
                  of body composition - tracking adipose tissue distribution and overall health status.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Body Fat</strong> serves essential functions including energy storage, hormone production, and organ protection. 
                  However, excessive body fat can increase health risks while too little can impair physiological functions.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Understanding your <strong>body fat percentage</strong> is crucial for health assessment, fitness planning, and body composition goals. 
                  It provides more accurate health insights than weight or BMI alone.
                </p>
              </div>

              {/* Body Fat Calculation Methods */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Body Fat Calculation Methods</h2>
                
                <div className="space-y-5">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">U.S. Navy Method (Recommended)</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-900 mb-2 text-sm">
                      <div><strong>Men:</strong> Uses waist, neck, and height measurements</div>
                      <div><strong>Women:</strong> Uses waist, hip, neck, and height measurements</div>
                    </div>
                    <p className="text-sm text-gray-900">
                      Most accurate for the general population. Developed by the U.S. Navy and widely validated across diverse demographics.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg text-gray-900 font-semibold mb-2 text-gray-890">BMI Method</h3>
                    <div className="bg-gray-50 p-4 text-gray-900 rounded mb-2 text-sm">
                      <div><strong>Formula:</strong> Uses BMI and age to estimate body fat</div>
                      <div><strong>Accuracy:</strong> Moderate for general population</div>
                    </div>
                    <p className="text-sm text-gray-900">
                      Simple method using BMI and age. Less accurate than Navy method but useful for quick estimates.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">DEXA Scan Method</h3>
                    <div className="bg-gray-50 p-4 text-gray-900 rounded mb-2 text-sm">
                      <strong>Professional dual-energy X-ray absorptiometry scanning</strong>
                    </div>
                    <p className="text-sm text-gray-900">
                      Most accurate method available. Requires professional equipment and trained technicians. 
                      Gold standard for body composition analysis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Using Your Body Fat for Health Goals */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Using Your Body Fat for Health Goals</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-5 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-4xl mb-3">📉</div>
                    <h3 className="font-semibold text-green-800 mb-2">Fat Loss</h3>
                    <p className="text-sm text-gray-700">
                      Create a caloric deficit through balanced nutrition and exercise for sustainable fat reduction.
                    </p>
                  </div>

                  <div className="text-center p-5 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-4xl mb-3">⚖️</div>
                    <h3 className="font-semibold text-blue-800 mb-2">Maintenance</h3>
                    <p className="text-sm text-gray-700">
                      Balance caloric intake with expenditure to maintain healthy body composition.
                    </p>
                  </div>

                  <div className="text-center p-5 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-4xl mb-3">💪</div>
                    <h3 className="font-semibold text-purple-800 mb-2">Muscle Gain</h3>
                    <p className="text-sm text-gray-700">
                      Combine resistance training with adequate protein and calories for lean mass development.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> Body fat calculations provide estimates. Individual results may vary based on genetics, medical conditions, and other factors. 
                    Consult healthcare professionals for personalized nutrition and fitness advice.
                  </p>
                </div>
              </div>

              

              {/* Body Fat Categories Explained */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Body Fat Categories Explained</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800 mb-1">Essential Fat (2-5% Men, 10-13% Women)</h3>
                    <p className="text-sm text-gray-700">
                      The minimum fat required for basic physiological functions. Going below this level can be dangerous and 
                      affect hormone production, immune function, and organ protection.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800 mb-1">Athletes (6-13% Men, 14-20% Women)</h3>
                    <p className="text-sm text-gray-700">
                      Common range for competitive athletes and fitness enthusiasts. Provides athletic performance benefits 
                      while maintaining healthy physiological function.
                    </p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800 mb-1">Fitness (14-17% Men, 21-24% Women)</h3>
                    <p className="text-sm text-gray-700">
                      Healthy range for physically active individuals. Maintains good health markers while allowing 
                      for sustainable lifestyle and nutrition habits.
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800 mb-1">Average (18-24% Men, 25-31% Women)</h3>
                    <p className="text-sm text-gray-700">
                      Normal range for general population. Associated with acceptable health risks when combined 
                      with regular physical activity and balanced nutrition.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-800 mb-1">Obese (25%+ Men, 32%+ Women)</h3>
                    <p className="text-sm text-gray-700">
                      Elevated health risk category. Associated with increased risk of cardiovascular disease, diabetes, 
                      and other metabolic conditions. Medical consultation recommended.
                    </p>
                  </div>
                </div>
              </div>

              {/* Measurement Tips */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Measure Accurately</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📏</span> Neck Measurement
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Measure around the neck at the narrowest point, just below the Adam's apple. Keep the tape measure 
                      horizontal and snug but not tight.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📐</span> Waist Measurement
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      For men: Measure at the level of the navel. For women: Measure at the narrowest point of the waist. 
                      Stand naturally and exhale normally before measuring.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>📊</span> Hip Measurement (Women)
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Measure around the widest part of the hips and buttocks. Keep feet together and tape measure 
                      parallel to the floor.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>⏰</span> Best Practices
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Take measurements at the same time of day, preferably in the morning. Use a flexible measuring tape 
                      and take multiple measurements to ensure accuracy.
                    </p>
                  </div>
                </div>
              </div>

              {/* Factors That Influence Your Body Fat */}
              <div className="mt-6 mb-12 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Factors That Influence Your Body Fat</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Body Composition
                      </h3>
                      <p className="text-sm text-gray-700">
                        Muscle tissue burns more calories than fat tissue, even at rest. 
                        Athletes and those with higher muscle mass have lower body fat 
                        percentages and require more calories.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Age
                      </h3>
                      <p className="text-sm text-gray-700">
                        Body fat typically increases with age due to 
                        muscle mass loss and hormonal changes.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Gender
                      </h3>
                      <p className="text-sm text-gray-700">
                        Women generally have higher body fat percentages due to biological 
                        and hormonal differences.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Genetics</h3>
                      <p className="text-sm text-gray-700">
                        Hereditary factors can influence body fat distribution by up to 15%, explaining 
                        why some people have naturally different body compositions.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Environmental Factors</h3>
                      <p className="text-sm text-gray-700">
                        Diet, exercise, stress levels, and certain 
                        medications can significantly affect your body fat percentage.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Health Status</h3>
                      <p className="text-sm text-gray-700">
                        Thyroid disorders, hormonal imbalances, and certain medical 
                        conditions can significantly impact body fat distribution.
                      </p>
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

export default BodyFatCalculator;