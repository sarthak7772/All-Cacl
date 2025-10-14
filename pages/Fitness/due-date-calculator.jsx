import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Activity, Target, TrendingUp, Heart, User, Calendar, Zap } from 'lucide-react';

const DueDateCalculator = () => {
  const [estimateMethod, setEstimateMethod] = useState('lastPeriod');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [dueDate, setDueDate] = useState(null);
  const [conceptionDate, setConceptionDate] = useState(null);
  const [gestationalWeeks, setGestationalWeeks] = useState(0);
  const [trimester, setTrimester] = useState(1);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const years = Array.from({ length: 10 }, (_, i) => String(2020 + i));
  const cycleLengths = Array.from({ length: 16 }, (_, i) => String(20 + i));

  const calculateDueDate = () => {
    if (!selectedMonth || !selectedDay || !selectedYear) {
      alert('Please select a complete date');
      return;
    }

    const monthIndex = months.indexOf(selectedMonth);
    const lastPeriodDate = new Date(parseInt(selectedYear), monthIndex, parseInt(selectedDay));
    
    // Validate date is not in the future
    const today = new Date();
    if (lastPeriodDate > today) {
      alert('Last period date cannot be in the future');
      return;
    }

    // Calculate due date (280 days from LMP)
    const calculatedDueDate = new Date(lastPeriodDate);
    calculatedDueDate.setDate(calculatedDueDate.getDate() + 280);
    
    // Calculate conception date (approximately 14 days after LMP)
    const calculatedConceptionDate = new Date(lastPeriodDate);
    calculatedConceptionDate.setDate(calculatedConceptionDate.getDate() + 14);
    
    // Calculate gestational age
    const daysSinceLMP = Math.floor((today - lastPeriodDate) / (1000 * 60 * 60 * 24));
    const weeks = Math.max(0, Math.floor(daysSinceLMP / 7));
    
    // Determine trimester
    let currentTrimester = 1;
    if (weeks >= 13 && weeks < 27) currentTrimester = 2;
    else if (weeks >= 27) currentTrimester = 3;
    
    setDueDate(calculatedDueDate);
    setConceptionDate(calculatedConceptionDate);
    setGestationalWeeks(weeks);
    setTrimester(currentTrimester);
  };

  const resetForm = () => {
    setEstimateMethod('lastPeriod');
    setSelectedMonth('');
    setSelectedDay('');
    setSelectedYear('');
    setCycleLength('28');
    setDueDate(null);
    setConceptionDate(null);
    setGestationalWeeks(0);
    setTrimester(1);
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

  return (
    <>
      <Head>
        <title>Due Date Calculator | Free Pregnancy Due Date Tool</title>
        <meta
          name="description"
          content="Use our free Due Date Calculator to estimate your baby's delivery date. Fast, accurate, and easy — your trusted online pregnancy due date calculator."
        />
        <meta name="keywords" content="Due Date Calculator, Online Due Date Calculator, Free Due Date Calculator, Pregnancy Due Date Calculator, Baby Due Date Calculator, Pregnancy Calculator, Delivery Date Calculator, Maternity Calculator, Due Date Tool" />
      </Head>
      
      <div className="min-h-screen bg-gray-100">
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
                <a href="/Fitness/due-date-calculator" className="text-gray-900 bg-gray-100 font-semibold flex items-center gap-2 p-2 rounded transition-colors">
                  <span className="text-lg">📅</span>
                  <span>Due Date Calculator</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 px-4 py-6 -mt-15">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Due Date Calculator</h1>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                Discover your baby's estimated delivery date. Calculate your due date to understand pregnancy milestones 
                based on your last menstrual period and cycle length for optimal pregnancy planning.
              </p>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium">
                  Due Date Calculator
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* Input Section */}
                  <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-gray-900">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Estimate Based On</label>
                        <select
                          value={estimateMethod}
                          onChange={(e) => setEstimateMethod(e.target.value)}
                          className="w-full px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="lastPeriod">Last Period</option>
                          <option value="ultrasound">Ultrasound</option>
                          <option value="conception">Conception Date</option>
                          <option value="ivf">IVF Transfer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Last Period Date</label>
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Month</option>
                            {months.map((month) => (
                              <option key={month} value={month}>{month}</option>
                            ))}
                          </select>
                          
                          <select
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                            className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Day</option>
                            {days.map((day) => (
                              <option key={day} value={day}>{day}</option>
                            ))}
                          </select>
                          
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                          >
                            <option value="">Year</option>
                            {years.map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Cycle Length (days)</label>
                        <select
                          value={cycleLength}
                          onChange={(e) => setCycleLength(e.target.value)}
                          className="w-full text-gray-900 px-3 py-2 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          {cycleLengths.map((cycle) => (
                            <option key={cycle} value={cycle}>{cycle}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={calculateDueDate}
                          className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          Calculate Due Date
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
                    {dueDate ? (
                      <div>
                        <div className="text-center mb-6 p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-gray-900 mb-2">
                            {formatDate(dueDate)}
                          </div>
                          <div className="text-sm text-gray-600">
                            Estimated Due Date
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Conception Date (estimated)</div>
                            <div className="font-semibold text-blue-600">{formatDate(conceptionDate)}</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Current Gestational Age</div>
                            <div className="font-semibold text-green-600">{gestationalWeeks} weeks</div>
                          </div>

                          <div className="bg-white p-3 rounded-lg shadow-sm">
                            <div className="text-gray-600 text-xs font-medium mb-1">Current Trimester</div>
                            <div className="font-semibold text-orange-500">
                              {trimester === 1 ? 'First' : trimester === 2 ? 'Second' : 'Third'} Trimester
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-700 border border-blue-200">
                          <strong>Note:</strong> Only 4% of births occur on the estimated due date. 
                          Most babies are born within a 2-week window before or after the due date.
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Enter your last period date and click Calculate to see your due date</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Due Date Quick Tips */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Due Date Quick Tips
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Keep in mind your due date for scheduled prenatal visits as it shows pregnancy progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Regular prenatal care helps maintain healthy pregnancy by monitoring development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Due dates can vary. Understand that individuals with similar cycles can be different</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Proper nutrition has beneficial effects, supporting healthy fetal development</span>
                  </li>
                </ul>
              </div>

              {/* Accuracy & Limitations */}
              <div className="mt-6 bg-gray-900 text-white rounded-lg p-6">
                <h3 className="text-lg font-bold mb-3">⚠️ Accuracy & Limitations</h3>
                <p className="text-sm leading-relaxed">
                  Due date calculations are statistical estimates that work well for population 
                  assessments but may not perfectly match your individual pregnancy timeline. For 
                  the most accurate assessment, consider professional ultrasound dating and regular 
                  prenatal care.
                </p>
              </div>

              {/* Understanding Your Due Date */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Your Due Date</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your Due Date represents the estimated completion of a full-term pregnancy at 40 weeks gestation. Think of it as the target endpoint 
                  for fetal development - when your baby's organs, brain, and body systems reach maturity for safe delivery.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Due dates</strong> are typically calculated from the first day of your last menstrual period (LMP), adding 280 days or 40 weeks. 
                  This method accounts for the two weeks before conception occurs, making it easier to track pregnancy milestones.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Understanding your <strong>due date</strong> is crucial for prenatal care scheduling, birth planning, and monitoring fetal development. It provides healthcare 
                  providers with a timeline to assess whether your pregnancy is progressing normally.
                </p>
              </div>

              {/* Due Date Calculation Methods */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Due Date Calculation Methods</h2>
                
                <div className="space-y-5">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Last Menstrual Period (LMP) Method</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-600 mb-2 text-sm">
                      <div><strong>Formula:</strong> LMP + 280 days (40 weeks)</div>
                      <div><strong>Naegele's Rule:</strong> LMP + 1 year - 3 months + 7 days</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Most common method used by healthcare providers. Based on a standard 28-day cycle with ovulation on day 14.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Ultrasound Dating</h3>
                    <div className="bg-gray-50 p-4  text-gray-600 rounded mb-2 text-sm">
                      <div><strong>First Trimester:</strong> Most accurate (±5-7 days)</div>
                      <div><strong>Second Trimester:</strong> Less accurate (±7-10 days)</div>
                    </div>
                    <p className="text-sm text-gray-600">
                      Uses fetal measurements to estimate gestational age. Most accurate when performed early in pregnancy.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Conception Date Method</h3>
                    <div className="bg-gray-50 p-4 text-gray-600 rounded mb-2 text-sm">
                      <strong>Formula: Conception date + 266 days (38 weeks)</strong>
                    </div>
                    <p className="text-sm text-gray-600">
                      Used when exact conception date is known (IVF, fertility treatments). 
                      Accounts for actual fertilization rather than LMP.
                    </p>
                  </div>
                </div>
              </div>

              {/* Using Your Due Date for Pregnancy Planning */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Using Your Due Date for Pregnancy Planning</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-5 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-4xl mb-3">🩺</div>
                    <h3 className="font-semibold text-green-800 mb-2">Prenatal Care</h3>
                    <p className="text-sm text-gray-700">
                      Schedule regular checkups 
                      throughout pregnancy to monitor 
                      fetal development and maternal 
                      health.
                    </p>
                  </div>

                  <div className="text-center p-5 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-4xl mb-3">📅</div>
                    <h3 className="font-semibold text-blue-800 mb-2">Birth Planning</h3>
                    <p className="text-sm text-gray-700">
                      Prepare for delivery by 
                      organizing maternity leave, 
                      hospital arrangements, and 
                      birth plan preferences.
                    </p>
                  </div>

                  <div className="text-center p-5 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-4xl mb-3">👶</div>
                    <h3 className="font-semibold text-purple-800 mb-2">Baby Preparation</h3>
                    <p className="text-sm text-gray-700">
                      Organize nursery setup, 
                      baby supplies, and newborn 
                      care essentials before 
                      your due date arrives.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> Due date calculations provide estimates. Individual pregnancies may vary based on cycle length, conception timing, and fetal development. 
                    Always consult healthcare professionals for personalized prenatal care.
                  </p>
                </div>
              </div>

              {/* Factors That Influence Your Due Date */}
              <div className="mt-6 mb-12 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Factors That Influence Your Due Date</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Menstrual Cycle Length
                      </h3>
                      <p className="text-sm text-gray-700">
                        Women with longer or shorter cycles than the standard 28 days may ovulate 
                        earlier or later, affecting actual conception timing and due date accuracy.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Maternal Age
                      </h3>
                      <p className="text-sm text-gray-700">
                        First-time mothers and older mothers may have longer pregnancies, 
                        while experienced mothers might deliver earlier.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Previous Pregnancy History
                      </h3>
                      <p className="text-sm text-gray-700">
                        Pattern of previous pregnancy lengths can influence current pregnancy duration 
                        and delivery timing.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4" />
                        Genetic Factors
                      </h3>
                      <p className="text-sm text-gray-700">
                        Family history of pregnancy lengths can influence your due date, as genetic 
                        factors affect gestation duration patterns.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Fetal Development
                      </h3>
                      <p className="text-sm text-gray-700">
                        Individual fetal growth rates and development patterns can influence 
                        when natural labor begins relative to estimated due date.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Health Conditions
                      </h3>
                      <p className="text-sm text-gray-700">
                        Maternal health conditions, pregnancy complications, and medical interventions 
                        can affect pregnancy duration and delivery timing.
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

export default DueDateCalculator;