import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calendar, Plus,  Clock } from 'lucide-react';

const DateCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Days Between Two Dates state
  const [daysBetween, setDaysBetween] = useState({
    startDate: { month: 'Jan', day: '1', year: '2024' },
    endDate: { month: 'Dec', day: '31', year: '2024' },
    includeEndDay: false
  });

  // Add/Subtract from Date state
  const [dateAddSubtract, setDateAddSubtract] = useState({
    startDate: { month: 'Jan', day: '1', year: '2024' },
    operation: '+',
    years: 0,
    months: 0,
    weeks: 0,
    days: 0,
    businessDays: false
  });

  const [daysBetweenResult, setDaysBetweenResult] = useState(null);
  const [addSubtractResult, setAddSubtractResult] = useState(null);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const federalHolidays2025 = [
    { name: "New Year's Day", date: "Jan. 1, 2025" },
    { name: "Martin Luther King Jr. Day", date: "Jan. 20, 2025" },
    { name: "President's Day", date: "Feb. 17, 2025" },
    { name: "Memorial Day", date: "May. 26, 2025" },
    { name: "Juneteenth Day", date: "Jun. 19, 2025" },
    { name: "Independence Day", date: "Jul. 4, 2025" },
    { name: "Labor Day", date: "Sep. 1, 2025" },
    { name: "Columbus Day", date: "Oct. 13, 2025" },
    { name: "Veteran's Day", date: "Nov. 11, 2025" },
    { name: "Thanksgiving", date: "Nov. 27, 2025" },
    { name: "Christmas", date: "Dec. 25, 2025" }
  ];

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
    for (let i = currentYear + 50; i >= currentYear - 100; i--) {
      years.push(i);
    }
    return years;
  };

  const createDateFromParts = (dateParts) => {
    const monthIndex = months.indexOf(dateParts.month);
    return new Date(parseInt(dateParts.year), monthIndex, parseInt(dateParts.day));
  };

  const calculateDaysBetween = () => {
    try {
      const startDate = createDateFromParts(daysBetween.startDate);
      const endDate = createDateFromParts(daysBetween.endDate);

      if (startDate > endDate) {
        setDaysBetweenResult({ error: "Start date must be before end date." });
        return;
      }

      const timeDifference = endDate.getTime() - startDate.getTime();
      let totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      
      if (daysBetween.includeEndDay) {
        totalDays += 1;
      }

      const totalWeeks = Math.floor(totalDays / 7);
      const remainingDays = totalDays % 7;

      let years = endDate.getFullYear() - startDate.getFullYear();
      let monthsCalc = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        monthsCalc--;
        const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += prevMonth.getDate();
      }

      if (monthsCalc < 0) {
        years--;
        monthsCalc += 12;
      }

      setDaysBetweenResult({
        totalDays,
        totalWeeks,
        remainingDays,
        years,
        months: monthsCalc,
        days,
        startDateFormatted: startDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        endDateFormatted: endDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    } catch (error) {
      setDaysBetweenResult({ error: "Please enter valid dates." });
    }
  };

  const calculateAddSubtract = () => {
    try {
      const startDate = createDateFromParts(dateAddSubtract.startDate);
      const result = new Date(startDate);

      const multiplier = dateAddSubtract.operation === '+' ? 1 : -1;

      result.setFullYear(result.getFullYear() + (dateAddSubtract.years * multiplier));
      result.setMonth(result.getMonth() + (dateAddSubtract.months * multiplier));
      
      const totalDaysToAdd = (dateAddSubtract.weeks * 7 + dateAddSubtract.days) * multiplier;
      result.setDate(result.getDate() + totalDaysToAdd);

      setAddSubtractResult({
        resultDate: result,
        resultFormatted: result.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        startDateFormatted: startDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      });
    } catch (error) {
      setAddSubtractResult({ error: "Please enter valid values." });
    }
  };

  const handleDaysBetweenChange = (field, subfield, value) => {
    setDaysBetween(prev => ({
      ...prev,
      [field]: subfield ? { ...prev[field], [subfield]: value } : value
    }));
  };

  const handleAddSubtractChange = (field, subfield, value) => {
    setDateAddSubtract(prev => ({
      ...prev,
      [field]: subfield ? { ...prev[field], [subfield]: value } : value
    }));
  };

  const clearDaysBetween = () => {
    setDaysBetween({
      startDate: { month: 'Jan', day: '1', year: '2024' },
      endDate: { month: 'Dec', day: '31', year: '2024' },
      includeEndDay: false
    });
    setDaysBetweenResult(null);
  };

  const clearAddSubtract = () => {
    setDateAddSubtract({
      startDate: { month: 'Jan', day: '1', year: '2024' },
      operation: '+',
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      businessDays: false
    });
    setAddSubtractResult(null);
  };

  return (
     <>
     <Head>
        <title>Date Calculator | Free Online Date Calculation Tool


</title>
        <meta
          name="description"
          content="Use our free Date Calculator to find the difference between dates, add days, or calculate future dates. Quick, accurate, and easy-to-use online tool.

  "
        />
        <meta name="keywords" content="Date Calculator, Online Date Calculator, Free Date Calculator, Date Difference Calculator, Days Between Dates Calculator, Add Days to Date Calculator, Future Date Calculator, Date Calculation Tool, Calendar Date Calculator, Easy Date Calculator 

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
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">📆</span>
              <span className="text-gray-900 font-semibold">Date Calculator</span>
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
      <div className="lg:ml-36 transition-all duration-300">
        <div className="max-w-5xl mx-auto p-4 lg:p-8 pt-16 lg:pt-8 ">
          {/* Title Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-8 h-8 text-gray-900" />
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Date Calculator
              </h1>
            </div>
            <p className="text-gray-600 text-base lg:text-lg">
              Calculate days between dates and add or subtract time periods. Discover precise date differences 
              and perform advanced date arithmetic for scheduling, planning, and time management.
            </p>
          </div>

          {/* Days Between Two Dates */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
            <div className="bg-gray-900 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-bold flex items-center">
                <Calendar className="w-6 h-6 mr-2" />
                Days Between Two Dates
              </h2>
            </div>

            <div className="p-4 lg:p-8">
              <p className="text-gray-700 mb-6">
                Find the number of years, months, weeks, and days between dates.
              </p>

              {/* Date Inputs */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
  {/* Start Date */}
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
    <div className="grid grid-cols-3 gap-2">
      <select
        value={daysBetween.startDate.month}
        onChange={(e) => handleDaysBetweenChange('startDate', 'month', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <select
        value={daysBetween.startDate.day}
        onChange={(e) => handleDaysBetweenChange('startDate', 'day', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {generateDayOptions(daysBetween.startDate.month, daysBetween.startDate.year).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <select
        value={daysBetween.startDate.year}
        onChange={(e) => handleDaysBetweenChange('startDate', 'year', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {generateYearOptions().map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>

  {/* End Date */}
  <div>
    <label className="block text-sm font-medium text-gray-900 mb-2">End Date</label>
    <div className="grid grid-cols-3 gap-2">
      <select
        value={daysBetween.endDate.month}
        onChange={(e) => handleDaysBetweenChange('endDate', 'month', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <select
        value={daysBetween.endDate.day}
        onChange={(e) => handleDaysBetweenChange('endDate', 'day', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {generateDayOptions(daysBetween.endDate.month, daysBetween.endDate.year).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <select
        value={daysBetween.endDate.year}
        onChange={(e) => handleDaysBetweenChange('endDate', 'year', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {generateYearOptions().map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>
</div>

{/* Options */}
<div className="mb-6">
  <label className="flex items-center text-gray-900">
    <input
      type="checkbox"
      checked={daysBetween.includeEndDay}
      onChange={(e) => handleDaysBetweenChange('includeEndDay', null, e.target.checked)}
      className="mr-2 accent-gray-900 border border-gray-900"
    />
    Include end day (add 1 day)
  </label>
</div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={calculateDaysBetween}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Calculate Date Difference
                </button>
                <button
                  onClick={clearDaysBetween}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Results */}
            {daysBetweenResult && !daysBetweenResult.error && (
              <div className="border-t border-gray-200 p-4 lg:p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Date Difference Result
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>From:</strong> {daysBetweenResult.startDateFormatted}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>To:</strong> {daysBetweenResult.endDateFormatted}
                  </div>
                </div>
                <div className="text-2xl font-bold mb-2 text-gray-900">
                  {daysBetweenResult.years} years, {daysBetweenResult.months} months, {daysBetweenResult.days} days
                </div>
                <div className="text-gray-700">
                  or {daysBetweenResult.totalDays} days total ({daysBetweenResult.totalWeeks} weeks and {daysBetweenResult.remainingDays} days)
                </div>
              </div>
            )}

            {daysBetweenResult && daysBetweenResult.error && (
              <div className="border-t border-gray-200 p-4 lg:p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {daysBetweenResult.error}
                </div>
              </div>
            )}
          </div>

          {/* Add/Subtract from Date */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
            <div className="bg-gray-900 text-white px-6 py-4 rounded-t-lg">
              <h2 className="text-xl font-bold flex items-center">
                <Plus className="w-6 h-6 mr-2" />
                Add to or Subtract from a Date
              </h2>
            </div>

            <div className="p-4 lg:p-8">
  <p className="text-gray-900 mb-6">
    Add or subtract years, months, weeks, and days from a starting date to find the result date.
  </p>

  {/* Start Date */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-2">Start Date</label>
    <div className="grid grid-cols-3 gap-2">
      <select
        value={dateAddSubtract.startDate.month}
        onChange={(e) => handleAddSubtractChange('startDate', 'month', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <select
        value={dateAddSubtract.startDate.day}
        onChange={(e) => handleAddSubtractChange('startDate', 'day', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {generateDayOptions(dateAddSubtract.startDate.month, dateAddSubtract.startDate.year).map(day => (
          <option key={day} value={day}>{day}</option>
        ))}
      </select>
      <select
        value={dateAddSubtract.startDate.year}
        onChange={(e) => handleAddSubtractChange('startDate', 'year', e.target.value)}
        className="p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      >
        {generateYearOptions().map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  </div>

  {/* Operation */}
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-900 mb-2">Operation</label>
    <select
      value={dateAddSubtract.operation}
      onChange={(e) => handleAddSubtractChange('operation', null, e.target.value)}
      className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
    >
      <option value="+">Add (+)</option>
      <option value="-">Subtract (-)</option>
    </select>
  </div>

  {/* Time Units */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Years</label>
      <input
        type="number"
        min="0"
        value={dateAddSubtract.years}
        onChange={(e) => handleAddSubtractChange('years', null, parseInt(e.target.value) || 0)}
        className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Months</label>
      <input
        type="number"
        min="0"
        value={dateAddSubtract.months}
        onChange={(e) => handleAddSubtractChange('months', null, parseInt(e.target.value) || 0)}
        className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Weeks</label>
      <input
        type="number"
        min="0"
        value={dateAddSubtract.weeks}
        onChange={(e) => handleAddSubtractChange('weeks', null, parseInt(e.target.value) || 0)}
        className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Days</label>
      <input
        type="number"
        min="0"
        value={dateAddSubtract.days}
        onChange={(e) => handleAddSubtractChange('days', null, parseInt(e.target.value) || 0)}
        className="w-full p-2 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900"
      />
    </div>
  </div>


              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={calculateAddSubtract}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-200"
                >
                  Calculate Result Date
                </button>
                <button
                  onClick={clearAddSubtract}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Results */}
            {addSubtractResult && !addSubtractResult.error && (
              <div className="border-t border-gray-200 p-4 lg:p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Date Calculation Result
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="text-sm text-gray-600 mb-1">
                    <strong>Starting from:</strong> {addSubtractResult.startDateFormatted}
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Result:</strong> {addSubtractResult.resultFormatted}
                  </div>
                </div>
              </div>
            )}

            {addSubtractResult && addSubtractResult.error && (
              <div className="border-t border-gray-200 p-4 lg:p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {addSubtractResult.error}
                </div>
              </div>
            )}
          </div>

          

          {/* Understanding Your Date Timeline */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8">
            <div className="p-4 lg:p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Understanding Your Date Timeline
              </h2>
              <p className="text-gray-700 mb-4">
                Your Date Timeline represents the chronological progression from one point in time to another. 
                Think of it as the roadmap for tracking elapsed time, scheduling future events, and understanding 
                the relationship between different dates in your personal or professional planning.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Common Date Calculation Uses
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Event Planning</h4>
                  <p className="text-sm text-gray-600">Schedule meetings, deadlines, and important milestones with precision.</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Age & Duration</h4>
                  <p className="text-sm text-gray-600">Calculate exact ages, employment lengths, and project durations.</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Future Planning</h4>
                  <p className="text-sm text-gray-600">Determine future dates for contracts, renewals, and commitments.</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Date Calculation Methods
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-gray-900 pl-4">
                  <h4 className="font-semibold text-gray-800">Between Two Dates</h4>
                  <p className="text-gray-600 text-sm">
                    Calculate the exact time span between any two dates, useful for tracking project durations, 
                    ages, and time intervals.
                  </p>
                </div>
                <div className="border-l-4 border-gray-900 pl-4">
                  <h4 className="font-semibold text-gray-800">Add/Subtract Time</h4>
                  <p className="text-gray-600 text-sm">
                    Start with a base date and add or subtract specific time periods to find future or past dates, 
                    perfect for deadline calculations and scheduling.
                  </p>
                </div>
                <div className="border-l-4 border-gray-900 pl-4">
                  <h4 className="font-semibold text-gray-800">Business vs Calendar Days</h4>
                  <p className="text-gray-600 text-sm">
                    Choose between including all calendar days or only business days (excluding weekends and holidays) 
                    for accurate professional scheduling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Accuracy & Limitations Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 text-yellow-600 mr-3">⚠️</div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Accuracy & Limitations</h3>
                <p className="text-sm text-gray-600">
                  Date calculations are statistical estimates that work well for planning purposes but may not account for 
                  all regional variations in business days, holidays, or calendar systems. For critical applications, 
                  consider consulting official calendars and local regulations.
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

export default DateCalculator;