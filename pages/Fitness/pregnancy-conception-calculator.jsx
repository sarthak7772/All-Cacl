import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Activity, Target, TrendingUp, Heart,  Zap, Calendar, User } from 'lucide-react';

const PregnancyConceptionCalculator = () => {
  const [calculationMethod, setCalculationMethod] = useState('Due Date');
  const [month, setMonth] = useState('Jan');
  const [day, setDay] = useState('1');
  const [year, setYear] = useState('2025');
  const [results, setResults] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 10 }, (_, i) => String(2024 + i));

  const calculateConception = () => {
    const inputDate = new Date(`${month} ${day}, ${year}`);
    inputDate.setHours(0, 0, 0, 0);
    
    let dueDate, conceptionDate, lmpDate;
    
    if (calculationMethod === 'Due Date') {
      dueDate = inputDate;
      conceptionDate = new Date(dueDate);
      conceptionDate.setDate(conceptionDate.getDate() - 266);
      lmpDate = new Date(dueDate);
      lmpDate.setDate(lmpDate.getDate() - 280);
    } 
    else if (calculationMethod === 'Last Period') {
      lmpDate = inputDate;
      conceptionDate = new Date(lmpDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14);
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280);
    }
    else if (calculationMethod === 'Ultrasound Date') {
      lmpDate = inputDate;
      conceptionDate = new Date(lmpDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14);
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280);
    }
    
    const earliestConception = new Date(conceptionDate);
    earliestConception.setDate(earliestConception.getDate() - 2);
    
    const latestConception = new Date(conceptionDate);
    latestConception.setDate(latestConception.getDate() + 2);

    const ovulationStart = new Date(conceptionDate);
    ovulationStart.setDate(ovulationStart.getDate() - 1);
    
    const ovulationEnd = new Date(conceptionDate);
    ovulationEnd.setDate(ovulationEnd.getDate() + 1);

    const fertileWindowStart = new Date(conceptionDate);
    fertileWindowStart.setDate(fertileWindowStart.getDate() - 5);
    
    const fertileWindowEnd = new Date(conceptionDate);
    fertileWindowEnd.setDate(fertileWindowEnd.getDate() + 1);

    setResults({
      estimatedConception: conceptionDate,
      conceptionRange: {
        start: earliestConception,
        end: latestConception
      },
      ovulationPeriod: {
        start: ovulationStart,
        end: ovulationEnd
      },
      fertileWindow: {
        start: fertileWindowStart,
        end: fertileWindowEnd
      },
      dueDate: dueDate
    });
  };

  const resetForm = () => {
    setCalculationMethod('Due Date');
    setMonth('Jan');
    setDay('1');
    setYear('2025');
    setResults(null);
  };

  const handleCalculatorClick = (e) => {
    e.preventDefault();
    window.location.href = '/';
  };

  const handleSidebarLinkClick = (e, path) => {
    e.preventDefault();
    window.location.href = `/${path}`;
  };

  const formatDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  return (
     <>
     <Head>
        <title>Pregnancy Conception Calculator | Free Ovulation Tool


</title>
        <meta
          name="description"
          content="Use our free Pregnancy Conception Calculator to estimate ovulation, fertile days, and conception date. Easy, accurate, and helpful for family planning.

  
  "
        />
        <meta name="keywords" content=" Pregnancy Conception Calculator, Conception Date Calculator, Ovulation Calculator, Fertility Calculator, Pregnancy Planning Calculator, Baby Conception Calculator, Due Date Calculator, Online Conception Calculator, Free Pregnancy Calculator, Fertile Days Calculator 

" />
     
      </Head>
    <div className="min-h-screen bg-gray-100">
      <Header/>

      {/* Left Sidebar - Health & Fitness Tools */}
      <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="bg-gray-900 text-white p-3">
          <h3 className="font-bold">Health & Fitness Tools</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2 text-sm">
            <a href="/Fitness/bmi-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/bmi-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">⚖️</span>
              <span>BMI Calculator</span>
            </a>
            <a href="/Fitness/calorie-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/calorie-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">🔥</span>
              <span>Calorie Calculator</span>
            </a>
            <a href="/Fitness/body-fat-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/body-fat-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">💪</span>
              <span>Body Fat Calculator</span>
            </a>
            <a href="/Fitness/bmr-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/bmr-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">⚡</span>
              <span>BMR Calculator</span>
            </a>
            <a href="/Fitness/ideal-weight-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/ideal-weight-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">🎯</span>
              <span>Ideal Weight Calculator</span>
            </a>
            <a href="/Fitness/pace-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/pace-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">🏃</span>
              <span>Pace Calculator</span>
            </a>
            <a href="/Fitness/pregnancy-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/pregnancy-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">🤰</span>
              <span>Pregnancy Calculator</span>
            </a>
            <a href="/Fitness/pregnancy-conception-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/pregnancy-conception-calculator')} className="text-gray-900 bg-gray-100 font-semibold hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">🍼</span>
              <span>Pregnancy Conception Calculator</span>
            </a>
            <a href="/Fitness/due-date-calculator" onClick={(e) => handleSidebarLinkClick(e, 'Fitness/due-date-calculator')} className="text-gray-900 hover:bg-gray-100 hover:underline flex items-center gap-2 p-2 rounded transition-colors">
              <span className="text-lg">📅</span>
              <span>Due Date Calculator</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full lg:ml-28 p-4 md:p-6 ">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pregnancy Conception Calculator</h1>
          <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
            Discover your conception timeline and fertile window at rest. Calculate your conception date to understand reproductive timing 
            based on your due date and ovulation cycles for optimal pregnancy planning and dating accuracy.
          </p>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium">
              Conception Calculator
            </div>

            <div className="flex flex-col lg:flex-row">
              {/* Input Section */}
              <div className="flex-1 p-6 border-r border-gray-900">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Calculate Based On</label>
                    <select
                      value={calculationMethod}
                      onChange={(e) => setCalculationMethod(e.target.value)}
                      className="w-full px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="Due Date">Due Date</option>
                      <option value="Last Period">Last Period</option>
                      <option value="Ultrasound Date">Ultrasound Date</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      {calculationMethod === 'Due Date' && 'Your Due Date'}
                      {calculationMethod === 'Last Period' && 'First Day of Last Period'}
                      {calculationMethod === 'Ultrasound Date' && 'Ultrasound Date'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        {months.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      
                      <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        {days.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                      
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={calculateConception}
                      className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Zap className="h-4 w-4" />
                      Calculate Conception
                    </button>
                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-gray-400 text-white rounded-md text-sm font-medium hover:bg-gray-500 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="lg:w-80 bg-gray-50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Results</h3>
                </div>
                {results ? (
                  <div>
                    <div className="text-center mb-6 p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {formatDate(results.estimatedConception)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Estimated Conception Date
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Conception Range</div>
                        <div className="font-semibold text-blue-600 text-xs">{formatDateRange(results.conceptionRange.start, results.conceptionRange.end)}</div>
                      </div>

                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Ovulation Period</div>
                        <div className="font-semibold text-green-600 text-xs">{formatDateRange(results.ovulationPeriod.start, results.ovulationPeriod.end)}</div>
                      </div>

                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Fertile Window</div>
                        <div className="font-semibold text-orange-500 text-xs">{formatDateRange(results.fertileWindow.start, results.fertileWindow.end)}</div>
                      </div>

                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Due Date</div>
                        <div className="font-semibold text-red-500">{formatDate(results.dueDate)}</div>
                      </div>

                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Sperm Survival Window</div>
                        <div className="font-semibold text-purple-600">3-5 days</div>
                      </div>

                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-gray-600 text-xs font-medium mb-1">Egg Survival Window</div>
                        <div className="font-semibold text-pink-600">12-24 hours</div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-700 border border-blue-200">
                      <strong>Note:</strong> Conception timing can vary based on cycle length, ovulation timing, 
                      and individual reproductive factors. These are estimates for planning purposes.
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Enter your date and click Calculate to see conception timeline</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Conception Quick Tips */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Conception Quick Tips
            </h3>
            <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Keep in mind your fertile window for conception planning as it shows optimal timing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Regular cycle tracking helps predict ovulation timing more accurately</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Conception timing can vary by 10%. Understand individuals with similar cycles can conceive at different times</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>Proper reproductive health has beneficial effects, supporting conception and early pregnancy development</span>
              </li>
            </ul>
          </div>

          {/* Accuracy & Limitations */}
          <div className="mt-6 bg-gray-900 text-white rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">⚠️ Accuracy & Limitations</h3>
            <p className="text-sm leading-relaxed">
              Conception calculations are statistical estimates that work well for reproductive planning 
              but may not perfectly match your individual ovulation timing. For 
              the most accurate assessment, consider ovulation tracking methods and fertility 
              monitoring.
            </p>
          </div>

          {/* Understanding Your Conception Timeline */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Conception Timeline</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your Conception Timeline represents the optimal window when fertilization can occur during your menstrual cycle. Think of it as the reproductive calendar 
              - tracking ovulation, egg viability, and sperm survival to identify peak fertility periods.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Conception</strong> occurs when sperm fertilizes an egg during ovulation, typically 10-16 days after the start of your menstrual period. 
              The fertile window includes the days when conception is possible, accounting for sperm survival (3-5 days) and egg viability (12-24 hours).
            </p>

            <p className="text-gray-700 leading-relaxed">
              Understanding your <strong>conception timeline</strong> is crucial for family planning, pregnancy dating, and reproductive health. It provides the foundation for 
              understanding when pregnancy began and estimating accurate due dates based on biological timing rather than calendar dates.
            </p>
          </div>

          {/* Conception Calculation Methods */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conception Calculation Methods</h2>
            
            <div className="space-y-5">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Due Date Back-Calculation (Recommended)</h3>
                <div className="bg-gray-50 text-gray-900 p-4 rounded mb-2 text-sm">
                  <div><strong>Formula:</strong> Due Date - 266 days = Estimated Conception</div>
                  <div><strong>Range:</strong> ±2-3 days for conception window</div>
                </div>
                <p className="text-sm text-gray-900">
                  Most accurate method when due date is established through early ultrasound dating.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Last Menstrual Period Method</h3>
                <div className="bg-gray-50  text-gray-900  p-4 rounded mb-2 text-sm">
                  <div><strong>Formula:</strong> LMP + 14 days = Estimated Conception</div>
                  <div><strong>Assumes:</strong> 28-day cycle with day 14 ovulation</div>
                </div>
                <p className="text-sm text-gray-900">
                  Less accurate for women with irregular cycles or different ovulation timing.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Ovulation Tracking Method</h3>
                <div className="bg-gray-50 text-gray-900  p-4 rounded mb-2 text-sm">
                  <strong>Uses basal body temperature, ovulation predictor kits, or ultrasound monitoring</strong>
                </div>
                <p className="text-sm text-gray-900">
                  Most precise method for determining actual ovulation and conception timing. 
                  Requires active fertility tracking or medical monitoring.
                </p>
              </div>
            </div>
          </div>

          {/* Using Your Conception Timeline for Family Planning */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Using Your Conception Timeline for Family Planning</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-5 bg-green-50 rounded-lg border border-green-200">
                <div className="text-4xl mb-3">📅</div>
                <h3 className="font-semibold text-green-800 mb-2">Pregnancy Dating</h3>
                <p className="text-sm text-gray-700">
                  Accurately date pregnancy 
                  beginning for proper prenatal 
                  care timing and fetal 
                  development tracking.
                </p>
              </div>

              <div className="text-center p-5 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-semibold text-blue-800 mb-2">Fertility Planning</h3>
                <p className="text-sm text-gray-700">
                  Identify optimal timing 
                  for conception attempts 
                  and understand fertile 
                  window patterns.
                </p>
              </div>

              <div className="text-center p-5 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-4xl mb-3">🧬</div>
                <h3 className="font-semibold text-purple-800 mb-2">Reproductive Health</h3>
                <p className="text-sm text-gray-700">
                  Monitor menstrual cycle 
                  patterns and ovulation 
                  timing for overall 
                  reproductive wellness.
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
              <p className="text-sm text-gray-700">
                <strong>Important:</strong> Conception calculations provide estimates based on average cycle patterns. Individual results may vary based on cycle length, ovulation timing, and reproductive health factors. 
                Consult healthcare professionals for personalized reproductive planning and guidance.
              </p>
            </div>
          </div>

          {/* Factors That Influence Your Conception Timeline */}
          <div className="mt-6 mb-12 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Factors That Influence Your Conception Timeline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Menstrual Cycle Length
                  </h3>
                  <p className="text-sm text-gray-700">
                    Cycles shorter or longer than 28 days affect ovulation timing. 
                    Ovulation typically occurs 12-16 days before the next period starts.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Ovulation Patterns
                  </h3>
                  <p className="text-sm text-gray-700">
                    Some women ovulate early or late in their cycle, affecting the 
                    fertile window and optimal conception timing.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Age and Fertility
                  </h3>
                  <p className="text-sm text-gray-700">
                    Age affects egg quality and ovulation regularity, influencing 
                    conception timing and fertility window characteristics.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Hormonal Factors
                  </h3>
                  <p className="text-sm text-gray-700">
                    Stress, thyroid function, and other hormonal influences can affect 
                    ovulation timing and cycle regularity.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Reproductive Health
                  </h3>
                  <p className="text-sm text-gray-700">
                    PCOS, endometriosis, and other conditions can impact ovulation 
                    predictability and conception timing.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Lifestyle Factors
                  </h3>
                  <p className="text-sm text-gray-700">
                    Diet, exercise, sleep patterns, and stress levels can influence 
                    menstrual cycle regularity and ovulation timing.
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

export default PregnancyConceptionCalculator;