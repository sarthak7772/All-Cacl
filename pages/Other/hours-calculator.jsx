import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Clock, Menu, X } from 'lucide-react';

const HoursCalculator = () => {
  const [timeCalc, setTimeCalc] = useState({
    startTime: '09:00',
    startPeriod: 'AM',
    endTime: '17:00',
    endPeriod: 'PM',
    result: null
  });

  const [dateCalc, setDateCalc] = useState({
    startDate: { month: 'Oct', day: '8', year: '2025' },
    startTime: '09:00',
    startPeriod: 'AM',
    endDate: { month: 'Oct', day: '9', year: '2025' },
    endTime: '17:00',
    endPeriod: 'PM',
    result: null
  });

  const [activeTab, setActiveTab] = useState('time-calc');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
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
    for (let i = currentYear + 10; i >= currentYear - 50; i--) {
      years.push(i);
    }
    return years;
  };

  const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(num => parseInt(num));
    return { hours: hours || 0, minutes: minutes || 0 };
  };

  const timeToMinutes = (timeString, period) => {
    const { hours, minutes } = parseTime(timeString);
    let totalHours = hours;
    
    if (period === 'PM' && hours !== 12) {
      totalHours += 12;
    } else if (period === 'AM' && hours === 12) {
      totalHours = 0;
    }
    
    return totalHours * 60 + minutes;
  };

  const minutesToHoursMinutes = (totalMinutes) => {
    const hours = Math.floor(Math.abs(totalMinutes) / 60);
    const minutes = Math.abs(totalMinutes) % 60;
    const isNegative = totalMinutes < 0;
    
    return {
      hours,
      minutes,
      isNegative,
      formatted: `${isNegative ? '-' : ''}${hours}:${minutes.toString().padStart(2, '0')}`
    };
  };

  const calculateTimeDifference = () => {
    try {
      const startMinutes = timeToMinutes(timeCalc.startTime, timeCalc.startPeriod);
      const endMinutes = timeToMinutes(timeCalc.endTime, timeCalc.endPeriod);
      
      let diffMinutes = endMinutes - startMinutes;
      
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60;
      }
      
      const result = minutesToHoursMinutes(diffMinutes);
      const totalHours = (diffMinutes / 60).toFixed(2);
      const totalDays = (diffMinutes / (24 * 60)).toFixed(2);
      
      setTimeCalc(prev => ({
        ...prev,
        result: {
          hours: result.hours,
          minutes: result.minutes,
          totalHours: parseFloat(totalHours),
          totalDays: parseFloat(totalDays),
          totalMinutes: diffMinutes,
          formatted: result.formatted,
          startFormatted: `${timeCalc.startTime} ${timeCalc.startPeriod}`,
          endFormatted: `${timeCalc.endTime} ${timeCalc.endPeriod}`
        }
      }));
    } catch (error) {
      setTimeCalc(prev => ({
        ...prev,
        result: { error: 'Please enter valid times.' }
      }));
    }
  };

  const calculateDateTimeDifference = () => {
    try {
      const startDate = new Date(
        parseInt(dateCalc.startDate.year),
        months.indexOf(dateCalc.startDate.month),
        parseInt(dateCalc.startDate.day)
      );
      
      const endDate = new Date(
        parseInt(dateCalc.endDate.year),
        months.indexOf(dateCalc.endDate.month),
        parseInt(dateCalc.endDate.day)
      );
      
      const startMinutes = timeToMinutes(dateCalc.startTime, dateCalc.startPeriod);
      const endMinutes = timeToMinutes(dateCalc.endTime, dateCalc.endPeriod);
      
      const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
      const totalMinutes = daysDiff * 24 * 60 + (endMinutes - startMinutes);
      
      if (totalMinutes < 0) {
        setDateCalc(prev => ({
          ...prev,
          result: { error: 'End date/time must be after start date/time.' }
        }));
        return;
      }
      
      const result = minutesToHoursMinutes(totalMinutes);
      const totalHours = (totalMinutes / 60).toFixed(2);
      const totalDays = (totalMinutes / (24 * 60)).toFixed(2);
      
      setDateCalc(prev => ({
        ...prev,
        result: {
          hours: result.hours,
          minutes: result.minutes,
          totalHours: parseFloat(totalHours),
          totalDays: parseFloat(totalDays),
          totalMinutes: totalMinutes,
          formatted: result.formatted,
          startFormatted: startDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) + ` at ${dateCalc.startTime} ${dateCalc.startPeriod}`,
          endFormatted: endDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }) + ` at ${dateCalc.endTime} ${dateCalc.endPeriod}`
        }
      }));
    } catch (error) {
      setDateCalc(prev => ({
        ...prev,
        result: { error: 'Please enter valid dates and times.' }
      }));
    }
  };

  const resetForm = () => {
    if (activeTab === 'time-calc') {
      setTimeCalc({
        startTime: '09:00',
        startPeriod: 'AM',
        endTime: '17:00',
        endPeriod: 'PM',
        result: null
      });
    } else {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      setDateCalc({
        startDate: { 
          month: months[today.getMonth()], 
          day: today.getDate().toString(), 
          year: today.getFullYear().toString() 
        },
        startTime: '09:00',
        startPeriod: 'AM',
        endDate: { 
          month: months[tomorrow.getMonth()], 
          day: tomorrow.getDate().toString(), 
          year: tomorrow.getFullYear().toString() 
        },
        endTime: '17:00',
        endPeriod: 'PM',
        result: null
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'time-calc') {
      calculateTimeDifference();
    }
  }, [timeCalc.startTime, timeCalc.startPeriod, timeCalc.endTime, timeCalc.endPeriod]);

  useEffect(() => {
    if (activeTab === 'date-calc') {
      calculateDateTimeDifference();
    }
  }, [dateCalc.startDate, dateCalc.startTime, dateCalc.startPeriod, dateCalc.endDate, dateCalc.endTime, dateCalc.endPeriod]);

  return (


    <>
     <Head>
        <title>Hours Calculator | Free Online Time Calculation Tool



</title>
        <meta
          name="description"
          content="Use our free Hours Calculator to quickly add, subtract, and convert hours. Accurate, fast, and easy — the perfect tool for time and work calculations online.

  
  "
        />
        <meta name="keywords" content=" Hours Calculator, Online Hours Calculator, Free Hours Calculator, Time Hours Calculator, Work Hours Calculator, Hour Conversion Calculator, Hours Addition Calculator, Hours Subtraction Calculator, Time Duration Calculator, Easy Hours Calculator

" />
     
      </Head>
    
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header/>
            
        <div className="flex flex-1 max-w-7xl mx-auto w-full">  
    

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
        <main className="flex-1 bg-white p-4 lg:p-8 overflow-y-auto lg:ml-46">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Hours Calculator</h1>
          
          <p className="text-gray-600 mb-6 lg:mb-8 leading-relaxed text-sm lg:text-base">
            Calculate time duration between two times or dates. Perfect for tracking work hours, project timelines, 
            meeting durations, or any time-based calculations you need.
          </p>

          {/* Calculator Form */}
          <div className="bg-gray-50 p-4 lg:p-6 rounded-lg mb-6 lg:mb-8 shadow">
            <div className="bg-gray-900 text-white p-3 rounded-t-lg -mx-4 lg:-mx-6 -mt-4 lg:-mt-6 mb-6">
              <h2 className="font-bold flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Result
              </h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculate Based On
              </label>
              <select 
                value={activeTab}
                onChange={(e) => {
                  setActiveTab(e.target.value);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
              >
                <option value="time-calc">Time Duration (Same Day)</option>
                <option value="date-calc">Date Range (Multiple Days)</option>
              </select>
            </div>

            {activeTab === 'time-calc' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={timeCalc.startTime}
                        onChange={(e) => setTimeCalc(prev => ({ ...prev, startTime: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      <select
                        value={timeCalc.startPeriod}
                        onChange={(e) => setTimeCalc(prev => ({ ...prev, startPeriod: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        value={timeCalc.endTime}
                        onChange={(e) => setTimeCalc(prev => ({ ...prev, endTime: e.target.value }))}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      />
                      <select
                        value={timeCalc.endPeriod}
                        onChange={(e) => setTimeCalc(prev => ({ ...prev, endPeriod: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Start Date & Time
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <select
                      value={dateCalc.startDate.month}
                      onChange={(e) => setDateCalc(prev => ({
                        ...prev,
                        startDate: { ...prev.startDate, month: e.target.value }
                      }))}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm lg:text-base"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={dateCalc.startDate.day}
                      onChange={(e) => setDateCalc(prev => ({
                        ...prev,
                        startDate: { ...prev.startDate, day: e.target.value }
                      }))}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm lg:text-base"
                    >
                      {generateDayOptions(dateCalc.startDate.month, dateCalc.startDate.year).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select
                      value={dateCalc.startDate.year}
                      onChange={(e) => setDateCalc(prev => ({
                        ...prev,
                        startDate: { ...prev.startDate, year: e.target.value }
                      }))}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm lg:text-base"
                    >
                      {generateYearOptions().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={dateCalc.startTime}
                      onChange={(e) => setDateCalc(prev => ({ ...prev, startTime: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <select
                      value={dateCalc.startPeriod}
                      onChange={(e) => setDateCalc(prev => ({ ...prev, startPeriod: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    End Date & Time
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <select
                      value={dateCalc.endDate.month}
                      onChange={(e) => setDateCalc(prev => ({
                        ...prev,
                        endDate: { ...prev.endDate, month: e.target.value }
                      }))}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm lg:text-base"
                    >
                      {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>
                    <select
                      value={dateCalc.endDate.day}
                      onChange={(e) => setDateCalc(prev => ({
                        ...prev,
                        endDate: { ...prev.endDate, day: e.target.value }
                      }))}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm lg:text-base"
                    >
                      {generateDayOptions(dateCalc.endDate.month, dateCalc.endDate.year).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <select
                      value={dateCalc.endDate.year}
                      onChange={(e) => setDateCalc(prev => ({
                        ...prev,
                        endDate: { ...prev.endDate, year: e.target.value }
                      }))}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm lg:text-base"
                    >
                      {generateYearOptions().map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="time"
                      value={dateCalc.endTime}
                      onChange={(e) => setDateCalc(prev => ({ ...prev, endTime: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    />
                    <select
                      value={dateCalc.endPeriod}
                      onChange={(e) => setDateCalc(prev => ({ ...prev, endPeriod: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={activeTab === 'time-calc' ? calculateTimeDifference : calculateDateTimeDifference}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors duration-200"
              >
                Calculate Hours
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
          {((activeTab === 'time-calc' && timeCalc.result && timeCalc.result.error) || 
            (activeTab === 'date-calc' && dateCalc.result && dateCalc.result.error)) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 lg:mb-8">
              {activeTab === 'time-calc' ? timeCalc.result.error : dateCalc.result.error}
            </div>
          )}

          {/* Results */}
          {((activeTab === 'time-calc' && timeCalc.result && !timeCalc.result.error) || 
            (activeTab === 'date-calc' && dateCalc.result && !dateCalc.result.error)) && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4">Time Duration Result</h3>
              
              {activeTab === 'time-calc' ? (
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {timeCalc.result.hours}h {timeCalc.result.minutes}m
                  </div>
                  <div className="text-gray-600 text-sm mb-4">
                    From {timeCalc.result.startFormatted} to {timeCalc.result.endFormatted}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-xl font-bold text-blue-600">{timeCalc.result.totalHours}</div>
                      <div className="text-xs text-gray-600">Total Hours</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-xl font-bold text-green-600">{timeCalc.result.totalMinutes}</div>
                      <div className="text-xs text-gray-600">Total Minutes</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-xl font-bold text-purple-600">{timeCalc.result.totalDays}</div>
                      <div className="text-xs text-gray-600">Total Days</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {dateCalc.result.totalHours} hours
                  </div>
                  <div className="text-gray-600 text-sm mb-4">
                    {dateCalc.result.totalDays} days total
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <div className="mb-2">
                      <strong>From:</strong> {dateCalc.result.startFormatted}
                    </div>
                    <div>
                      <strong>To:</strong> {dateCalc.result.endFormatted}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Tips */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Time Calculation Quick Tips</h3>
            <ul className="space-y-2 text-gray-700 text-sm lg:text-base">
              <li>• Use time duration for calculating work shifts, meeting lengths, or daily schedules</li>
              <li>• Date range calculations are perfect for project timelines and multi-day events</li>
              <li>• Remember to account for breaks and non-working hours in professional settings</li>
              <li>• The calculator automatically handles time crossing midnight (same day calculations)</li>
            </ul>
          </div>

          {/* Understanding Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Understanding Time Calculations</h3>
            
            <p className="text-gray-700 mb-4 text-sm lg:text-base">
              Time duration calculations help you determine the exact amount of time between two points. 
              This is essential for work hour tracking, project management, event planning, and scheduling.
            </p>

            <p className="text-gray-700 mb-4 text-sm lg:text-base">
              When calculating time within a single day, the calculator handles AM/PM conversions and 
              accounts for times that cross midnight. For multi-day calculations, both date and time 
              components are considered for maximum accuracy.
            </p>

            <p className="text-gray-700 text-sm lg:text-base">
              These calculations are useful for billing hours, tracking productivity, planning schedules, 
              and understanding time commitments for various activities.
            </p>
          </div>

          {/* Common Use Cases */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-6">Common Use Cases</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-3">💼</div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Work Hours</h4>
                <p className="text-xs lg:text-sm text-gray-600">Track your daily, weekly, or monthly work hours for payroll and productivity.</p>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Project Planning</h4>
                <p className="text-xs lg:text-sm text-gray-600">Calculate project timelines and delivery schedules accurately.</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-3">📅</div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">Event Duration</h4>
                <p className="text-xs lg:text-sm text-gray-600">Determine event lengths for meetings, conferences, and appointments.</p>
              </div>
            </div>
          </div>

          {/* Time Facts */}
          <div className="bg-gray-900 text-white p-4 lg:p-6 rounded-lg mb-6 lg:mb-8 shadow">
            <h3 className="text-base lg:text-lg font-bold mb-3">Interesting Time Facts</h3>
            <ul className="text-xs lg:text-sm space-y-2 opacity-90">
              <li>• An 8-hour workday equals 480 minutes or 28,800 seconds</li>
              <li>• A standard work week (40 hours) is approximately 2,400 minutes</li>
              <li>• The average person works about 90,000 hours in their lifetime</li>
              <li>• Time zones can affect calculations - always consider local time differences</li>
            </ul>
          </div>

          {/* Calculation Examples */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 shadow">
            <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-6">Common Work Schedule Examples</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">Standard Work Shifts</h4>
                <ul className="text-xs lg:text-sm text-gray-700 space-y-2">
                  <li>• 9:00 AM - 5:00 PM: 8 hours (standard)</li>
                  <li>• 8:00 AM - 4:00 PM: 8 hours (early shift)</li>
                  <li>• 10:00 AM - 6:00 PM: 8 hours (late shift)</li>
                  <li>• 7:00 AM - 3:00 PM: 8 hours (morning shift)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm lg:text-base">Part-Time & Flexible</h4>
                <ul className="text-xs lg:text-sm text-gray-700 space-y-2">
                  <li>• 9:00 AM - 1:00 PM: 4 hours (half day)</li>
                  <li>• 2:00 PM - 6:00 PM: 4 hours (afternoon)</li>
                  <li>• 6:00 PM - 10:00 PM: 4 hours (evening)</li>
                  <li>• 10:00 PM - 6:00 AM: 8 hours (night shift)</li>
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

export default HoursCalculator;