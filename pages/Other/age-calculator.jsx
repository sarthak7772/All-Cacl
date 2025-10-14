import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import { Calendar,  } from 'lucide-react';

const AgeCalculator = () => {
  const today = new Date();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const [birthDate, setBirthDate] = useState({
    month: months[today.getMonth()],
    day: today.getDate().toString(),
    year: (today.getFullYear() - 25).toString()
  });
  
  const [ageAtDate, setAgeAtDate] = useState({
    month: months[today.getMonth()],
    day: today.getDate().toString(),
    year: today.getFullYear().toString()
  });
  
  const [result, setResult] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getDaysInMonth = (month, year) => {
    const monthIndex = months.indexOf(month);
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const generateDayOptions = (month, year) => {
    const daysInMonth = getDaysInMonth(month, year);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear + 10; i >= currentYear - 120; i--) {
      years.push(i);
    }
    return years;
  };

  const calculateAge = () => {
    try {
      if (!birthDate.month || !birthDate.day || !birthDate.year || 
          !ageAtDate.month || !ageAtDate.day || !ageAtDate.year) {
        setResult({ error: "Please select all date fields." });
        return;
      }

      const birthMonthIndex = months.indexOf(birthDate.month);
      const ageAtMonthIndex = months.indexOf(ageAtDate.month);
      
      const birth = new Date(
        parseInt(birthDate.year),
        birthMonthIndex,
        parseInt(birthDate.day)
      );
      
      const ageAt = new Date(
        parseInt(ageAtDate.year),
        ageAtMonthIndex,
        parseInt(ageAtDate.day)
      );

      if (isNaN(birth.getTime()) || isNaN(ageAt.getTime())) {
        setResult({ error: "Please enter valid dates." });
        return;
      }

      if (birth > ageAt) {
        setResult({ error: "Birth date cannot be after the age calculation date." });
        return;
      }

      let years = ageAt.getFullYear() - birth.getFullYear();
      let monthsDiff = ageAt.getMonth() - birth.getMonth();
      let days = ageAt.getDate() - birth.getDate();

      if (days < 0) {
        monthsDiff--;
        const previousMonth = new Date(ageAt.getFullYear(), ageAt.getMonth(), 0);
        days += previousMonth.getDate();
      }

      if (monthsDiff < 0) {
        years--;
        monthsDiff += 12;
      }

      const timeDifference = ageAt.getTime() - birth.getTime();
      const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);
      const totalHours = totalDays * 24;
      const totalMinutes = totalHours * 60;
      const totalSeconds = totalMinutes * 60;
      const totalYears = (totalDays / 365.25).toFixed(2);
      const totalMonths = Math.floor(years * 12 + monthsDiff + (days / 30.44));

      setResult({
        years,
        months: monthsDiff,
        days,
        totalYears,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        birthDateFormatted: birth.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        ageAtDateFormatted: ageAt.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    } catch (error) {
      setResult({ error: "Error calculating age. Please check your dates." });
    }
  };

  const handleDateChange = (type, field, value) => {
    const newDate = type === 'birth' 
      ? { ...birthDate, [field]: value }
      : { ...ageAtDate, [field]: value };

    if (field === 'month' || field === 'year') {
      const maxDays = getDaysInMonth(newDate.month, newDate.year);
      if (parseInt(newDate.day) > maxDays) {
        newDate.day = maxDays.toString();
      }
    }

    if (type === 'birth') {
      setBirthDate(newDate);
    } else {
      setAgeAtDate(newDate);
    }
  };

  const resetForm = () => {
    const today = new Date();
    setBirthDate({
      month: months[today.getMonth()],
      day: today.getDate().toString(),
      year: (today.getFullYear() - 25).toString()
    });
    setAgeAtDate({
      month: months[today.getMonth()],
      day: today.getDate().toString(),
      year: today.getFullYear().toString()
    });
    setResult(null);
  };

  return (
     <>
     <Head>
        <title>Age Calculator | Free Online Age Calculation Tool


</title>
        <meta
          name="description"
          content="Use our free Age Calculator to instantly find your exact age in years, months, and days. Fast, accurate, and easy-to-use online age calculation tool.

  "
        />
        <meta name="keywords" content="Age Calculator, Online Age Calculator, Free Age Calculator, Exact Age Calculator, Age in Years Calculator, Age in Months Calculator, Age in Days Calculator, Date of Birth Age Calculator, Birthday Calculator, Age Calculation Tool 
 
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
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">⏰</span>
              <span className="text-gray-900 font-semibold">Age Calculator</span>
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
            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🏗️</span>
              <span className="text-gray-900 font-medium">Concrete Calculator</span>
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
        <main className="flex-1 bg-white p-4 lg:p-8 pt-16 lg:pt-8 overflow-y-auto">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-gray-900" />
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Age Calculator</h1>
          </div>
          
          <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
            Calculate your exact age in years, months, and days between any two dates. Perfect for 
            finding out how old you are, how many days until your next birthday, or calculating age 
            differences between people.
          </p>

          {/* Calculator Form */}<div className="bg-gray-50 p-4 lg:p-6 rounded-lg mb-6 lg:mb-8 shadow">
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-2">
      Calculate Based On
    </label>
    <select className="w-full p-3 border border-gray-900 rounded-lg bg-white text-gray-900">
      <option>Birth Date</option>
    </select>
  </div>

  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-3">
      Your Birth Date
    </label>
    <div className="grid grid-cols-3 gap-2 lg:gap-4">
      <select
        value={birthDate.month}
        onChange={(e) => handleDateChange('birth', 'month', e.target.value)}
        className="w-full p-3 border border-gray-900 rounded-lg bg-white text-gray-900 text-sm lg:text-base"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      <select
        value={birthDate.day}
        onChange={(e) => handleDateChange('birth', 'day', e.target.value)}
        className="w-full p-3 border border-gray-900 rounded-lg bg-white text-gray-900 text-sm lg:text-base"
      >
        {generateDayOptions(birthDate.month, birthDate.year).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      <select
        value={birthDate.year}
        onChange={(e) => handleDateChange('birth', 'year', e.target.value)}
        className="w-full p-3 border border-gray-900 rounded-lg bg-white text-gray-900 text-sm lg:text-base"
      >
        {generateYearOptions().map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-3">
      Age at Date
    </label>
    <div className="grid grid-cols-3 gap-2 lg:gap-4">
      <select
        value={ageAtDate.month}
        onChange={(e) => handleDateChange('ageAt', 'month', e.target.value)}
        className="w-full p-3 border border-gray-900 rounded-lg bg-white text-gray-900 text-sm lg:text-base"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      <select
        value={ageAtDate.day}
        onChange={(e) => handleDateChange('ageAt', 'day', e.target.value)}
        className="w-full p-3 border border-gray-900 rounded-lg bg-white text-gray-900 text-sm lg:text-base"
      >
        {generateDayOptions(ageAtDate.month, ageAtDate.year).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>

      <select
        value={ageAtDate.year}
        onChange={(e) => handleDateChange('ageAt', 'year', e.target.value)}
        className="w-full p-3 border border-gray-900 rounded-lg bg-white text-gray-900 text-sm lg:text-base"
      >
        {generateYearOptions().map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>



            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={calculateAge}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
              >
                Calculate Age
              </button>
              <button
                onClick={resetForm}
                className="flex-1 sm:flex-none bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Error Display */}
          {result && result.error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 lg:mb-8">
              {result.error}
            </div>
          )}

          {/* Results */}
          {result && !result.error && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Age Calculation Result</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xs lg:text-sm text-gray-600 mb-2">
                    <strong>From:</strong> {result.birthDateFormatted}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">
                    <strong>To:</strong> {result.ageAtDateFormatted}
                  </div>
                </div>
                
                <div className="text-left lg:text-right">
                  <div className="text-xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {result.years} years, {result.months} months, {result.days} days
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600">{result.totalYears}</div>
                  <div className="text-xs lg:text-sm text-gray-600">Total Years</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-green-50 rounded-lg">
                  <div className="text-xl lg:text-2xl font-bold text-green-600">{result.totalMonths.toLocaleString()}</div>
                  <div className="text-xs lg:text-sm text-gray-600">Total Months</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl lg:text-2xl font-bold text-purple-600">{result.totalWeeks.toLocaleString()}</div>
                  <div className="text-xs lg:text-sm text-gray-600">Total Weeks</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-orange-50 rounded-lg">
                  <div className="text-xl lg:text-2xl font-bold text-orange-600">{result.totalDays.toLocaleString()}</div>
                  <div className="text-xs lg:text-sm text-gray-600">Total Days</div>
                </div>
              </div>
            </div>
          )}

          {/* Age Calculation Tips */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Age Calculation Quick Tips</h3>
            <ul className="space-y-2 text-gray-700 text-sm lg:text-base">
              <li>• Your age changes on your birthday each year, increasing by exactly one year</li>
              <li>• Age is calculated from your birth date to the current date or any specified date</li>
              <li>• Different cultures may have different conventions for calculating age</li>
              <li>• Leap years are automatically accounted for in age calculations</li>
            </ul>
          </div>

          {/* How Age Is Calculated */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">How Age Is Calculated</h3>
            
            <p className="text-gray-700 mb-4 text-sm lg:text-base">
              Age calculation determines the time elapsed between your birth date and another date (typically today). 
              The calculation accounts for years, months, and days, adjusting for varying month lengths and leap years.
            </p>

            <p className="text-gray-700 mb-4 text-sm lg:text-base">
              In most Western cultures, you turn a year older on your birthday. However, some cultures (like in Korea) 
              use different age calculation systems where everyone becomes a year older on New Year's Day.
            </p>

            <p className="text-gray-700 text-sm lg:text-base">
              This calculator uses the standard Western method, counting complete years, months, and days from 
              your birth date to the target date.
            </p>
          </div>

          {/* Common Uses */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-6">Common Uses for Age Calculation</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-3">🎂</div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Birthday Planning</h4>
                <p className="text-xs lg:text-sm text-gray-600">Calculate exact age for milestone birthdays and celebrations.</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-3">📋</div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Official Documents</h4>
                <p className="text-xs lg:text-sm text-gray-600">Verify age requirements for legal documents and applications.</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-3">👥</div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Age Comparison</h4>
                <p className="text-xs lg:text-sm text-gray-600">Calculate age differences between people or historical events.</p>
              </div>
            </div>
          </div>

          {/* Interesting Age Facts */}
          <div className="bg-gray-900 text-white p-4 lg:p-6 rounded-lg mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold mb-3">Interesting Age Facts</h3>
            <ul className="text-xs lg:text-sm space-y-2 opacity-90">
              <li>• You've lived approximately {result && !result.error ? result.totalHours.toLocaleString() : '219,000'} hours (if you're 25 years old)</li>
              <li>• The oldest verified person lived to 122 years and 164 days</li>
              <li>• Your actual birthday occurs only once every 4 years if you're born on February 29th</li>
              <li>• Different calendar systems (Gregorian, Islamic, Chinese) calculate age differently</li>
            </ul>
          </div>

          {/* Age Milestones */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-6">Common Age Milestones</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">Legal Milestones</h4>
                <ul className="text-xs lg:text-sm text-gray-700 space-y-2">
                  <li>• 16: Driving age in many countries</li>
                  <li>• 18: Legal adult in most countries</li>
                  <li>• 21: Drinking age in the United States</li>
                  <li>• 25: Car rental without surcharge (US)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">Life Milestones</h4>
                <ul className="text-xs lg:text-sm text-gray-700 space-y-2">
                  <li>• 30: Often considered start of mature adulthood</li>
                  <li>• 40: Traditional "over the hill" milestone</li>
                  <li>• 50: Golden jubilee celebration</li>
                  <li>• 65: Traditional retirement age</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer/>
    </div>
    </>
  );
};

export default AgeCalculator;1