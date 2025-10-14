import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import { Calculator, Activity, Baby,  Calendar, Clock, Heart, TrendingUp, User, Zap } from 'lucide-react';

const PregnancyCalculator = () => {
  const [calculationMethod, setCalculationMethod] = useState('Due Date');
  const [month, setMonth] = useState('Jan');
  const [day, setDay] = useState('1');
  const [year, setYear] = useState('2025');
  const [results, setResults] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 10 }, (_, i) => String(2024 + i));

  const calculatePregnancy = () => {
    const inputDate = new Date(`${month} ${day}, ${year}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
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
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280);
      conceptionDate = new Date(lmpDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14);
    }
    else if (calculationMethod === 'Conception Date') {
      conceptionDate = inputDate;
      dueDate = new Date(conceptionDate);
      dueDate.setDate(dueDate.getDate() + 266);
      lmpDate = new Date(conceptionDate);
      lmpDate.setDate(lmpDate.getDate() - 14);
    }
    else if (calculationMethod === 'Ultrasound Date') {
      lmpDate = inputDate;
      dueDate = new Date(lmpDate);
      dueDate.setDate(dueDate.getDate() + 280);
      conceptionDate = new Date(lmpDate);
      conceptionDate.setDate(conceptionDate.getDate() + 14);
    }
    else if (calculationMethod === 'IVF Transfer Date') {
      conceptionDate = inputDate;
      dueDate = new Date(conceptionDate);
      dueDate.setDate(dueDate.getDate() + 266);
      lmpDate = new Date(conceptionDate);
      lmpDate.setDate(lmpDate.getDate() - 14);
    }
    
    const daysSinceLMP = Math.floor((today - lmpDate) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.max(0, Math.floor(daysSinceLMP / 7));
    
    const firstTrimesterEnd = new Date(lmpDate);
    firstTrimesterEnd.setDate(firstTrimesterEnd.getDate() + 84);
    
    const secondTrimesterEnd = new Date(lmpDate);
    secondTrimesterEnd.setDate(secondTrimesterEnd.getDate() + 196);
    
    const daysRemaining = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
    
    setResults({
      dueDate,
      conceptionDate,
      lmpDate,
      currentWeek,
      firstTrimesterEnd,
      secondTrimesterEnd,
      thirdTrimesterEnd: dueDate,
      totalWeeks: 40,
      daysRemaining,
      daysSinceLMP
    });
  };

  const resetForm = () => {
    setCalculationMethod('Due Date');
    setMonth('Jan');
    setDay('1');
    setYear('2025');
    setResults(null);
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

  const formatFullDate = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
     <>
     <Head>
        <title>Pregnancy Calculator | Free Due Date & Trimester Tool
</title>
        <meta
          name="description"
          content="Use our free Pregnancy Calculator to estimate your due date, track trimesters, and monitor your pregnancy journey. Accurate, fast, and easy-to-use.

  "
        />
        <meta name="keywords" content=" Pregnancy Calculator, Due Date Calculator, Online Pregnancy Calculator, Free Pregnancy Calculator, Trimester Calculator, Pregnancy Tracker, Baby Due Date Calculator, Pregnancy Week Calculator, Conception Date Calculator, Pregnancy Planning Calculator 

" />
     
      </Head>
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      {/*<div className="bg-red-800 text-white px-4 py-3 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-red-700 rounded transition-colors">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="bg-white text-red-800 p-1 rounded">
                <Calculator className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg">Calculato</span>
            </a>
          </div>
        </div>
      </div>*/}
      <Header/>
                          

      <div className="flex mt-14">
        {/* Sidebar */}
        <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
          <div className="bg-gray-900 text-white p-3">
            <h3 className="font-bold">Health & Fitness Tools</h3>
          </div>
          <div className="p-4">
            <div className="space-y-2 text-sm">
              {healthTools.map((tool, index) => (
                <a key={index} href={tool.href} onClick={() => setSidebarOpen(false)}
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pregnancy Calculator</h1>
            <p className="text-gray-600 mb-6 text-xs md:text-sm leading-relaxed">
              Calculate your pregnancy timeline and milestones. Enter your due date to understand developmental stages 
              and important dates throughout your pregnancy journey.
            </p>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Calculator Header */}
              <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium">
                Pregnancy Calculator
              </div>

              <div className="flex flex-col lg:flex-row">
                {/* Input Section */}
               <div className="flex-1 p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-gray-900">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Calculate Based On</label>
                      <select value={calculationMethod}
                        onChange={(e) => setCalculationMethod(e.target.value)}
                        className="w-full  text-gray-900 px-3 py-2 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-800">
                        <option value="Due Date">Due Date</option>
                        <option value="Last Period">Last Period</option>
                        <option value="Ultrasound Date">Ultrasound Date</option>
                        <option value="Conception Date">Conception Date</option>
                        <option value="IVF Transfer Date">IVF Transfer Date</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        {calculationMethod === 'Due Date' && 'Your Due Date'}
                        {calculationMethod === 'Last Period' && 'First Day of Last Period'}
                        {calculationMethod === 'Conception Date' && 'Conception Date'}
                        {calculationMethod === 'Ultrasound Date' && 'Ultrasound Date'}
                        {calculationMethod === 'IVF Transfer Date' && 'IVF Transfer Date'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <select value={month} onChange={(e) => setMonth(e.target.value)}
                          className="px-3 py-2 text-gray-900  border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-800">
                          {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                        
                        <select value={day} onChange={(e) => setDay(e.target.value)}
                          className="px-3 py-2 text-gray-900  border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-800">
                          {days.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        
                        <select value={year} onChange={(e) => setYear(e.target.value)}
                          className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-800">
                          {years.map((y) => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button onClick={calculatePregnancy}
                        className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                        <Zap className="h-4 w-4" />
                        Calculate
                      </button>
                      <button onClick={resetForm}
                        className="px-6 py-2.5 bg-gray-400 text-white rounded-md text-sm font-medium hover:bg-gray-500 transition-colors">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="w-full lg:w-96 bg-red-50 p-4 md:p-6">
                  <div className="mb-4">
                    <h3 className="text-base md:text-lg font-bold text-gray-900">Results</h3>
                  </div>
                  {results ? (
                    <div>
                      <div className="text-center mb-6 p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                          Week {results.currentWeek}
                        </div>
                        <div className="text-xs md:text-sm text-gray-600">
                          of {results.totalWeeks} weeks
                        </div>
                        {results.currentWeek > 40 && (
                          <div className="text-xs text-orange-600 mt-2">
                            Past due date
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 text-xs md:text-sm">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 text-xs font-medium mb-1">Due Date</div>
                          <div className="font-semibold text-blue-600">{formatFullDate(results.dueDate)}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 text-xs font-medium mb-1">Conception Date (estimated)</div>
                          <div className="font-semibold text-green-600">{formatFullDate(results.conceptionDate)}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 text-xs font-medium mb-1">Last Menstrual Period</div>
                          <div className="font-semibold text-orange-500">{formatFullDate(results.lmpDate)}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 text-xs font-medium mb-1">First Trimester Ends (Week 12)</div>
                          <div className="font-semibold text-purple-600">{formatFullDate(results.firstTrimesterEnd)}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 text-xs font-medium mb-1">Second Trimester Ends (Week 28)</div>
                          <div className="font-semibold text-pink-600">{formatFullDate(results.secondTrimesterEnd)}</div>
                        </div>

                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="text-gray-600 text-xs font-medium mb-1">Days Remaining</div>
                          <div className="font-semibold text-gray-900">
                            {results.daysRemaining > 0 ? `${results.daysRemaining} days` : 'Due date passed'}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-700 border border-blue-200">
                        <strong>Note:</strong> Only 4% of births occur on the estimated due date. 
                        Most babies are born within 2 weeks before or after the due date.
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Baby className="h-10 h-10 md:h-12 md:w-12 mx-auto mb-3 opacity-50" />
                      <p className="text-xs md:text-sm">Enter your due date and click Calculate to see your pregnancy timeline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pregnancy Quick Tips */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Pregnancy Quick Tips
              </h3>
              <ul className="grid md:grid-cols-2 gap-3 text-xs md:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 text-lg">•</span>
                  <span>Track your pregnancy milestones for scheduled prenatal visits to monitor fetal development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 text-lg">•</span>
                  <span>Regular prenatal care helps maintain a healthy pregnancy by tracking growth and development</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 text-lg">•</span>
                  <span>Pregnancy duration can vary by 10%. Individuals with similar due dates can deliver at different times</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-900 text-lg">•</span>
                  <span>Proper prenatal nutrition supports healthy fetal development and maternal health</span>
                </li>
              </ul>
            </div>

            {/* Accuracy & Limitations */}
            <div className="mt-6 bg-gray-900 text-white rounded-lg p-4 md:p-6">
              <h3 className="text-base md:text-lg font-bold mb-3">Accuracy & Limitations</h3>
              <p className="text-xs md:text-sm leading-relaxed">
                Pregnancy calculations are statistical estimates that work well for prenatal care planning 
                but may not perfectly match your individual pregnancy timeline. For 
                the most accurate assessment, consult with your healthcare provider for professional ultrasound dating and regular 
                prenatal monitoring.
              </p>
            </div>

            {/* Understanding Your Pregnancy Timeline */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">Understanding Your Pregnancy Timeline</h2>
              <p className="text-gray-700 leading-relaxed mb-4 text-xs md:text-sm">
                Your Pregnancy Timeline represents the developmental progression from conception to birth over approximately 40 weeks. Think of it as the roadmap 
                for fetal growth - tracking organ development, size milestones, and preparation for delivery.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4 text-xs md:text-sm">
                <strong>Pregnancy</strong> is typically calculated from the first day of your last menstrual period (LMP), adding 280 days or 40 weeks. 
                This gestational age method accounts for the two weeks before conception occurs, making it the standard for medical dating.
              </p>

              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                Understanding your <strong>pregnancy timeline</strong> is crucial for prenatal care scheduling, monitoring fetal development, and preparing for childbirth.
              </p>
            </div>

            {/* Using Your Pregnancy Timeline */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-4">Using Your Pregnancy Timeline for Health Planning</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="text-center p-4 md:p-5 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-3xl md:text-4xl mb-3">🩺</div>
                  <h3 className="font-semibold text-green-800 mb-2 text-sm md:text-base">Prenatal Care</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Schedule regular checkups, screenings, and ultrasounds based on gestational age milestones.
                  </p>
                </div>

                <div className="text-center p-4 md:p-5 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-3xl md:text-4xl mb-3">📊</div>
                  <h3 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">Development Tracking</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Monitor fetal growth and development milestones throughout each trimester and pregnancy stage.
                  </p>
                </div>

                <div className="text-center p-4 md:p-5 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-3xl md:text-4xl mb-3">📅</div>
                  <h3 className="font-semibold text-purple-800 mb-2 text-sm md:text-base">Birth Preparation</h3>
                  <p className="text-xs md:text-sm text-gray-700">
                    Plan maternity leave, hospital arrangements, and newborn care preparation around your due date.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                <p className="text-xs md:text-sm text-gray-700">
                  <strong>Important:</strong> Pregnancy calculations provide estimates. Individual pregnancies may vary. 
                  Always consult healthcare professionals for personalized prenatal care and guidance.
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

export default PregnancyCalculator;