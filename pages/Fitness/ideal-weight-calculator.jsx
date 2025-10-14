import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import { Calculator, Target, Users, TrendingUp, Activity } from 'lucide-react';

const IdealWeightCalculator = () => {
  const [activeTab, setActiveTab] = useState('US Units');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [results, setResults] = useState(null);

  const calculateIdealWeight = () => {
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);

    // Validation
    if (!heightNum || !ageNum) {
      alert('Please fill in all required fields');
      return;
    }

    if (ageNum < 2 || ageNum > 80) {
      alert('Age must be between 2 and 80 years');
      return;
    }

    const heightInCm = activeTab === 'US Units' ? heightNum * 2.54 : heightNum;
    const heightInInches = heightInCm / 2.54;
    const heightOverFiveFeet = Math.max(0, heightInInches - 60);

    const calculatedResults = {};

    if (gender === 'male') {
      calculatedResults.robinson = 52 + (1.9 * heightOverFiveFeet);
      calculatedResults.miller = 56.2 + (1.41 * heightOverFiveFeet);
      calculatedResults.devine = 50 + (2.3 * heightOverFiveFeet);
      calculatedResults.hamwi = 48 + (2.7 * heightOverFiveFeet);
    } else {
      calculatedResults.robinson = 49 + (1.7 * heightOverFiveFeet);
      calculatedResults.miller = 53.1 + (1.36 * heightOverFiveFeet);
      calculatedResults.devine = 45.5 + (2.3 * heightOverFiveFeet);
      calculatedResults.hamwi = 45.5 + (2.2 * heightOverFiveFeet);
    }

    const heightInMeters = heightInCm / 100;
    const minHealthyWeight = 18.5 * heightInMeters * heightInMeters;
    const maxHealthyWeight = 25 * heightInMeters * heightInMeters;

    setResults({
      ...calculatedResults,
      healthyBMIMin: minHealthyWeight,
      healthyBMIMax: maxHealthyWeight,
      heightInCm,
      heightInInches
    });
  };

  const clearForm = () => {
    setAge('');
    setGender('male');
    setHeight('');
    setResults(null);
  };

  const formatWeight = (weightKg) => {
    if (activeTab === 'US Units') {
      return `${(weightKg * 2.20462).toFixed(1)} lbs`;
    }
    return `${weightKg.toFixed(1)} kg`;
  };

  return (
    <>
      <Head>
        <title>Ideal Weight Calculator | Free Healthy Weight Tool</title>
        <meta
          name="description"
          content="Use our free Ideal Weight Calculator to determine your healthy weight range. Fast, accurate, and easy — your trusted online ideal weight calculator."
        />
        <meta name="keywords" content="Ideal Weight Calculator, Online Ideal Weight Calculator, Free Ideal Weight Calculator, Healthy Weight Calculator, BMI Ideal Weight Calculator, Body Ideal Weight Calculator, Weight Range Calculator, Fitness Ideal Weight Calculator, Weight Management Calculator, Ideal Weight Tool" />
      </Head>

      <div className="min-h-screen bg-gray-50">
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
                <a href="/Fitness/body-fat-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">💪</span>
                  <span>Body Fat Calculator</span>
                </a>
                <a href="/Fitness/bmr-calculator" className="text-gray-900 hover:bg-gray-100 flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">⚡</span>
                  <span>BMR Calculator</span>
                </a>
                <a href="/Fitness/ideal-weight-calculator" className="text-gray-900 bg-gray-100 font-semibold flex items-center gap-2 p-2 rounded transition-colors">
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
              {/* Page Title */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                  Ideal Weight Range Calculator
                </h1>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Determine your healthy weight range using scientifically validated formulas developed by leading researchers. 
                  Our comprehensive analysis provides multiple perspectives on optimal body weight for your height and gender.
                </p>
              </div>

              {/* Calculator Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                {/* Unit System Toggle */}
                <div className="flex">
                  <button
                    onClick={() => {
                      setActiveTab('US Units');
                      setHeight('');
                      setResults(null);
                    }}
                    className={`flex-1 py-2 px-4 text-sm font-medium ${
                      activeTab === 'US Units' 
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    US Units
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('Metric Units');
                      setHeight('');
                      setResults(null);
                    }}
                    className={`flex-1 py-2 px-4 text-sm font-medium ${
                      activeTab === 'Metric Units' 
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Metric Units
                  </button>
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* Input Section */}
                  <div className="flex-1 p-6">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Age</label>
                        <input
                          type="number"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="Enter age"
                          className="w-full text-gray-900 px-4 py-3 border border-gray-900 rounded-lg focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
                        />
                        <p className="text-xs text-gray-900 mt-1">Age range: 2-80 years</p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">Gender</label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center cursor-pointer p-3 border border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="gender"
                              value="male"
                              checked={gender === 'male'}
                              onChange={(e) => setGender(e.target.value)}
                              className="mr-2"
                            />
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm">Male</span>
                          </label>
                          <label className="flex items-center cursor-pointer p-3 border text-gray-900  border-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                            <input
                              type="radio"
                              name="gender"
                              value="female"
                              checked={gender === 'female'}
                              onChange={(e) => setGender(e.target.value)}
                              className="mr-2"
                            />
                            <Users className="w-4 h-4 mr-2" />
                            <span className="text-sm">Female</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Height</label>
                        <div className="relative">
                          <input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder={activeTab === 'US Units' ? 'e.g., 69' : 'e.g., 175'}
                            className="w-full text-gray-900 px-4 py-3 border border-gray-900 rounded-lg focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors pr-20"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-900 font-medium text-sm">
                            {activeTab === 'US Units' ? 'inches' : 'cm'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={calculateIdealWeight}
                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Activity className="w-5 h-5" />
                        <span>Calculate Range</span>
                      </button>
                      <button
                        onClick={clearForm}
                        className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="lg:w-96 bg-gray-50 p-6 border-t lg:border-t-0 lg:border-l">
                    {results ? (
                      <div>
                        <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
                          <Target className="w-5 h-5 mr-2" />
                          Optimal Weight Analysis
                        </h3>
                        
                        <div className="space-y-3">
                          {[
                            { name: 'Robinson Formula (1983)', value: results.robinson, description: 'Most widely accepted' },
                            { name: 'Miller Formula (1983)', value: results.miller, description: 'Conservative estimate' },
                            { name: 'Devine Formula (1974)', value: results.devine, description: 'Medical standard' },
                            { name: 'Hamwi Formula (1964)', value: results.hamwi, description: 'Clinical dosage basis' },
                          ].map((formula, index) => (
                            <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                  <div className="font-semibold text-gray-800 text-sm">{formula.name}</div>
                                  <div className="text-xs text-gray-600">{formula.description}</div>
                                </div>
                                <div className="font-bold text-lg text-gray-900 whitespace-nowrap">
                                  {formatWeight(formula.value)}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                <div className="font-semibold text-green-800 text-sm">WHO Healthy BMI Range</div>
                                <div className="text-xs text-green-600">BMI 18.5-25 range</div>
                              </div>
                              <div className="font-bold text-sm text-green-700 whitespace-nowrap">
                                {formatWeight(results.healthyBMIMin)} - {formatWeight(results.healthyBMIMax)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded text-xs text-gray-700">
                          <strong>Clinical Note:</strong> These formulas provide reference ranges, not absolute targets. 
                          Individual health depends on body composition, fitness level, and overall wellness.
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <Target className="w-16 h-16 mx-auto text-gray-400 mb-4 opacity-50" />
                        <p className="text-sm text-gray-500">Enter your details and calculate to see your optimal weight range</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Information Sections */}
              <div className="space-y-6">
                {/* Understanding Optimal Weight */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">
                    Understanding Healthy Weight Ranges
                  </h2>
                  <div className="text-sm text-gray-700 leading-relaxed space-y-4">
                    <p>
                      The concept of "ideal" weight has evolved significantly from its original medical purpose of calculating drug dosages 
                      to becoming a broader health assessment tool. Modern research emphasizes that healthy weight exists within a range 
                      rather than a single number.
                    </p>
                    <p>
                      Contemporary health science recognizes that optimal weight depends on numerous factors including muscle mass, 
                      bone density, body composition, metabolic health, and overall fitness level. Athletes may weigh more 
                      than traditional formulas suggest while maintaining excellent health due to higher muscle mass.
                    </p>
                    <p>
                      Rather than pursuing a specific weight target, focus on sustainable lifestyle habits including regular physical activity, 
                      balanced nutrition, adequate sleep, and stress management.
                    </p>
                  </div>
                </div>

                {/* Scientific Formulas */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Evidence-Based Calculation Methods
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border-l-4 border-blue-500 bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Robinson Formula (1983)</h3>
                      <div className="bg-white text-gray-900 p-4 rounded text-sm mb-3">
                        <div className="mb-2"><strong>Male:</strong> 52 kg + (1.9 kg × inches over 5 feet)</div>
                        <div><strong>Female:</strong> 49 kg + (1.7 kg × inches over 5 feet)</div>
                      </div>
                      <p className="text-sm text-gray-900">
                        Refined modification of the Devine formula, providing more conservative estimates. 
                        Widely used in clinical settings for its balanced approach.
                      </p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-green-500 bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Miller Formula (1983)</h3>
                      <div className="bg-white text-gray-900 p-4 rounded text-sm mb-3">
                        <div className="mb-2"><strong>Male:</strong> 56.2 kg + (1.41 kg × inches over 5 feet)</div>
                        <div><strong>Female:</strong> 53.1 kg + (1.36 kg × inches over 5 feet)</div>
                      </div>
                      <p className="text-sm text-gray-900">
                        Alternative modification offering higher baseline weights, particularly beneficial for individuals 
                        with larger body frames or higher muscle mass.
                      </p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-purple-500 bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Devine Formula (1974)</h3>
                      <div className="bg-white text-gray-900 p-4 rounded text-sm mb-3">
                        <div className="mb-2"><strong>Male:</strong> 50 kg + (2.3 kg × inches over 5 feet)</div>
                        <div><strong>Female:</strong> 45.5 kg + (2.3 kg × inches over 5 feet)</div>
                      </div>
                      <p className="text-sm text-gray-900">
                        Most commonly used formula in medical practice. Originally developed for pharmaceutical dosing 
                        but became the standard for weight assessment.
                      </p>
                    </div>
                    
                    <div className="p-4 border-l-4 border-orange-500 bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Hamwi Formula (1964)</h3>
                      <div className="bg-white text-gray-900 p-4 rounded text-sm mb-3">
                        <div className="mb-2"><strong>Male:</strong> 48 kg + (2.7 kg × inches over 5 feet)</div>
                        <div><strong>Female:</strong> 45.5 kg + (2.2 kg × inches over 5 feet)</div>
                      </div>
                      <p className="text-sm text-gray-900">
                        Historic formula providing the foundation for modern weight calculations. Still relevant for 
                        specific medical applications.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Factors Affecting Weight */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Factors Influencing Healthy Weight
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">Body Composition</h4>
                        <p className="text-sm text-gray-700">
                          Muscle tissue is denser than fat tissue. Athletes may weigh more 
                          while maintaining excellent health due to higher muscle mass.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">Frame Size</h4>
                        <p className="text-sm text-gray-700">
                          Bone structure varies significantly. Larger frames naturally support more weight, 
                          while smaller frames may be healthy at lower weights.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">Age Considerations</h4>
                        <p className="text-sm text-gray-700">
                          Metabolism and body composition change with age. Slight weight increases may be normal 
                          as muscle mass naturally decreases after age 30.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">Genetic Factors</h4>
                        <p className="text-sm text-gray-700">
                          Hereditary influences affect metabolism, body fat distribution, and natural body composition.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">Activity Level</h4>
                        <p className="text-sm text-gray-700">
                          Regular exercise, especially resistance training, increases muscle mass and bone density, 
                          potentially resulting in higher healthy weights.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2">Health Status</h4>
                        <p className="text-sm text-gray-700">
                          Medical conditions and medications can influence healthy weight ranges. 
                          Professional guidance is essential for assessment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Health-Focused Approach */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Modern Health-Centered Approach
                  </h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">Functional Fitness</h4>
                      <p className="text-sm text-gray-600">
                        Focus on what your body can do. Prioritize strength, endurance, 
                        and flexibility over scale weight.
                      </p>
                    </div>
                    
                    <div className="text-center p-6 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">Metabolic Health</h4>
                      <p className="text-sm text-gray-600">
                        Emphasize blood pressure, cholesterol, blood sugar, 
                        and cardiovascular fitness.
                      </p>
                    </div>
                    
                    <div className="text-center p-6 border border-gray-200 rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-800 mb-2">Sustainable Habits</h4>
                      <p className="text-sm text-gray-600">
                        Build lasting changes including balanced nutrition, regular movement, 
                        and quality sleep.
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Professional Guidance:</strong> These calculations provide general references only. 
                      For personalized assessment, consult healthcare professionals.
                    </p>
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

export default IdealWeightCalculator;