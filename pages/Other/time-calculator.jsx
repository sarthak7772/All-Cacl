import React, { useState } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calendar, Clock } from 'lucide-react';

const TimeCalculator = () => {
  // Basic Time Addition/Subtraction state
  const [basicCalc, setBasicCalc] = useState({
    time1: { days: '', hours: '', minutes: '', seconds: '' },
    time2: { days: '', hours: '', minutes: '', seconds: '' },
    operation: 'add',
    result: { days: 0, hours: 0, minutes: 0, seconds: 0 }
  });

  // Add/Subtract Time from Date state
  const [dateTimeCalc, setDateTimeCalc] = useState({
    startDate: { month: 'Sep', day: '21', year: '2025' },
    startTime: { hour: '6', minute: '16', second: '18', period: 'PM' },
    operation: 'add',
    timeToAdd: { days: 0, hours: 0, minutes: 0, seconds: 0 },
    result: null
  });

  // Expression Calculator state
  const [expressionCalc, setExpressionCalc] = useState({
    expression: '1d 2h 3m 4s + 4h 5s - 2030s + 28h',
    result: null
  });

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
    for (let i = currentYear + 50; i >= currentYear - 100; i--) {
      years.push(i);
    }
    return years;
  };

  const normalizeTime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / (24 * 3600));
    totalSeconds %= (24 * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return { days, hours, minutes, seconds };
  };

  const timeToSeconds = (timeObj) => {
    return (parseInt(timeObj.days) || 0) * 24 * 3600 +
           (parseInt(timeObj.hours) || 0) * 3600 +
           (parseInt(timeObj.minutes) || 0) * 60 +
           (parseInt(timeObj.seconds) || 0);
  };

  const calculateBasicTime = () => {
    const time1Seconds = timeToSeconds(basicCalc.time1);
    const time2Seconds = timeToSeconds(basicCalc.time2);
    
    let resultSeconds;
    if (basicCalc.operation === 'add') {
      resultSeconds = time1Seconds + time2Seconds;
    } else {
      resultSeconds = time1Seconds - time2Seconds;
    }
    
    if (resultSeconds < 0) {
      resultSeconds = Math.abs(resultSeconds);
    }
    
    const result = normalizeTime(resultSeconds);
    setBasicCalc(prev => ({ ...prev, result }));
  };

  const calculateDateTimeAddition = () => {
    try {
      const monthIndex = months.indexOf(dateTimeCalc.startDate.month);
      let hour = parseInt(dateTimeCalc.startTime.hour);
      
      if (dateTimeCalc.startTime.period === 'PM' && hour !== 12) {
        hour += 12;
      } else if (dateTimeCalc.startTime.period === 'AM' && hour === 12) {
        hour = 0;
      }
      
      const startDateTime = new Date(
        parseInt(dateTimeCalc.startDate.year),
        monthIndex,
        parseInt(dateTimeCalc.startDate.day),
        hour,
        parseInt(dateTimeCalc.startTime.minute),
        parseInt(dateTimeCalc.startTime.second)
      );
      
      const secondsToAdd = timeToSeconds(dateTimeCalc.timeToAdd);
      const multiplier = dateTimeCalc.operation === 'add' ? 1 : -1;
      
      const resultDateTime = new Date(startDateTime.getTime() + (secondsToAdd * 1000 * multiplier));
      
      setDateTimeCalc(prev => ({
        ...prev,
        result: {
          dateFormatted: resultDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          timeFormatted: resultDateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }),
          fullFormatted: resultDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) + ' at ' + resultDateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          })
        }
      }));
    } catch (error) {
      setDateTimeCalc(prev => ({
        ...prev,
        result: { error: 'Please enter valid date and time values.' }
      }));
    }
  };

  const parseTimeExpression = (expression) => {
    try {
      let expr = expression.replace(/\s+/g, '').toLowerCase();
      const parts = expr.split(/([+-])/).filter(part => part !== '');
      
      let totalSeconds = 0;
      let currentSign = 1;
      
      for (let part of parts) {
        if (part === '+') {
          currentSign = 1;
        } else if (part === '-') {
          currentSign = -1;
        } else {
          let partSeconds = 0;
          
          const dMatch = part.match(/(\d+)d/);
          if (dMatch) partSeconds += parseInt(dMatch[1]) * 24 * 3600;
          
          const hMatch = part.match(/(\d+)h/);
          if (hMatch) partSeconds += parseInt(hMatch[1]) * 3600;
          
          const mMatch = part.match(/(\d+)m/);
          if (mMatch) partSeconds += parseInt(mMatch[1]) * 60;
          
          const sMatch = part.match(/(\d+)s/);
          if (sMatch) partSeconds += parseInt(sMatch[1]);
          
          totalSeconds += partSeconds * currentSign;
        }
      }
      
      if (totalSeconds < 0) {
        totalSeconds = Math.abs(totalSeconds);
      }
      
      return normalizeTime(totalSeconds);
    } catch (error) {
      return { error: 'Invalid expression format' };
    }
  };

  const calculateExpression = () => {
    const result = parseTimeExpression(expressionCalc.expression);
    setExpressionCalc(prev => ({ ...prev, result }));
  };

  const clearBasicCalc = () => {
    setBasicCalc({
      time1: { days: '', hours: '', minutes: '', seconds: '' },
      time2: { days: '', hours: '', minutes: '', seconds: '' },
      operation: 'add',
      result: { days: 0, hours: 0, minutes: 0, seconds: 0 }
    });
  };

  const clearDateTimeCalc = () => {
    const now = new Date();
    const monthName = months[now.getMonth()];
    const day = now.getDate().toString();
    const year = now.getFullYear().toString();
    
    let hour = now.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    
    setDateTimeCalc({
      startDate: { month: monthName, day, year },
      startTime: {
        hour: hour.toString(),
        minute: now.getMinutes().toString().padStart(2, '0'),
        second: now.getSeconds().toString().padStart(2, '0'),
        period
      },
      operation: 'add',
      timeToAdd: { days: 0, hours: 0, minutes: 0, seconds: 0 },
      result: null
    });
  };

  const clearExpression = () => {
    setExpressionCalc({
      expression: '',
      result: null
    });
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    const monthName = months[now.getMonth()];
    const day = now.getDate().toString();
    const year = now.getFullYear().toString();
    
    let hour = now.getHours();
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    
    setDateTimeCalc(prev => ({
      ...prev,
      startDate: { month: monthName, day, year },
      startTime: {
        hour: hour.toString(),
        minute: now.getMinutes().toString().padStart(2, '0'),
        second: now.getSeconds().toString().padStart(2, '0'),
        period
      }
    }));
  };

  return (
    <>
      <Head>
        <title>Time Calculator | Free Online Time Calculation Tool</title>
        <meta
          name="description"
          content="Use our free Time Calculator to add or subtract time, find differences, and convert units. Quick, accurate, and easy-to-use tool for everyday needs."
        />
        <meta name="keywords" content="Time Calculator, Online Time Calculator, Free Time Calculator, Time Difference Calculator, Hours and Minutes Calculator, Time Addition Calculator, Time Subtraction Calculator, Time Conversion Calculator, Time Duration Calculator, Easy Time Calculator" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
    
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header */}
        <Header/>

        {/* Sidebar */}
        <div className="hidden lg:block fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40">
          <div className="bg-gray-900 text-white p-4 font-bold text-lg sticky top-0 z-10">
            Other Calculator Tools
          </div>
          <div className="p-0">
            <a href="/Other/age-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">⏰</span>
                <span className="text-gray-900 font-medium">Age Calculator</span>
              </div>
            </a>
            <a href="/Other/date-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">📆</span>
                <span className="text-gray-900 font-medium">Date Calculator</span>
              </div>
            </a>
            <a href="/Other/time-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">⏱️</span>
                <span className="text-gray-900 font-semibold">Time Calculator</span>
              </div>
            </a>
            <a href="/Other/hours-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">🕐</span>
                <span className="text-gray-900 font-medium">Hours Calculator</span>
              </div>
            </a>
            <a href="/Other/gpa-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">📚</span>
                <span className="text-gray-900 font-medium">GPA Calculator</span>
              </div>
            </a>
            <a href="/Other/grade-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">✏️</span>
                <span className="text-gray-900 font-medium">Grade Calculator</span>
              </div>
            </a>
            <a href="/Other/concrete-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">🏗️</span>
                <span className="text-gray-900 font-medium">Concrete Calculator</span>
              </div>
            </a>
            <a href="/Other/subnet-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">🌐</span>
                <span className="text-gray-900 font-medium">Subnet Calculator</span>
              </div>
            </a>
            <a href="/Other/password-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">🔒</span>
                <span className="text-gray-900 font-medium">Password Generator</span>
              </div>
            </a>
            <a href="/Other/conversion-calculator" className="block">
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors">
                <span className="text-xl flex-shrink-0">🔄</span>
                <span className="text-gray-900 font-medium">Conversion Calculator</span>
              </div>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:ml-64 transition-all duration-300">
          <div className="max-w-6xl mx-auto p-3 sm:p-4 lg:p-8 pt-6 lg:pt-8">
            {/* Title */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900 flex-shrink-0" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Time Calculator</h1>
            </div>

            {/* Description */}
            <p className="mb-4 sm:mb-6 text-gray-700 text-sm sm:text-base">
              A Time Calculator is a tool that helps you quickly add or subtract time values, usually expressed in hours, minutes, and seconds. It is very useful for scheduling, time management, work tracking, or calculating the difference between two events.
            </p>

            {/* Basic Time Calculator */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Basic Time Calculator</h2>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className="text-center font-medium text-xs sm:text-sm lg:text-base text-gray-900">Day</div>
                <div className="text-center font-medium text-xs sm:text-sm lg:text-base text-gray-900">Hour</div>
                <div className="text-center font-medium text-xs sm:text-sm lg:text-base text-gray-900">Minute</div>
                <div className="text-center font-medium text-xs sm:text-sm lg:text-base text-gray-900">Second</div>
              </div>

              {/* First Time Input */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                <input
                  type="number"
                  min="0"
                  value={basicCalc.time1.days}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time1: { ...prev.time1, days: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={basicCalc.time1.hours}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time1: { ...prev.time1, hours: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={basicCalc.time1.minutes}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time1: { ...prev.time1, minutes: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={basicCalc.time1.seconds}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time1: { ...prev.time1, seconds: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
              </div>

              {/* Operation Selection */}
              <div className="flex justify-center mb-3 sm:mb-4 text-gray-900 flex-wrap gap-2 sm:gap-4">
                <label className="flex items-center text-gray-900 text-sm sm:text-base">
                  <input
                    type="radio"
                    name="operation"
                    value="add"
                    checked={basicCalc.operation === 'add'}
                    onChange={(e) => setBasicCalc(prev => ({
                      ...prev,
                      operation: e.target.value
                    }))}
                    className="mr-2 accent-gray-900"
                  />
                  Add +
                </label>
                <label className="flex items-center text-gray-900 text-sm sm:text-base">
                  <input
                    type="radio"
                    name="operation"
                    value="subtract"
                    checked={basicCalc.operation === 'subtract'}
                    onChange={(e) => setBasicCalc(prev => ({
                      ...prev,
                      operation: e.target.value
                    }))}
                    className="mr-2 accent-gray-900"
                  />
                  Subtract –
                </label>
              </div>

              {/* Second Time Input */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                <input
                  type="number"
                  min="0"
                  value={basicCalc.time2.days}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time2: { ...prev.time2, days: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={basicCalc.time2.hours}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time2: { ...prev.time2, hours: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={basicCalc.time2.minutes}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time2: { ...prev.time2, minutes: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={basicCalc.time2.seconds}
                  onChange={(e) => setBasicCalc(prev => ({
                    ...prev,
                    time2: { ...prev.time2, seconds: e.target.value }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
              </div>

              {/* Equals Line */}
              <div className="text-center text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">=</div>

              {/* Result */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <input
                  type="text"
                  value={basicCalc.result.days}
                  readOnly
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 bg-gray-50 text-sm"
                />
                <input
                  type="text"
                  value={basicCalc.result.hours}
                  readOnly
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 bg-gray-50 text-sm"
                />
                <input
                  type="text"
                  value={basicCalc.result.minutes}
                  readOnly
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 bg-gray-50 text-sm"
                />
                <input
                  type="text"
                  value={basicCalc.result.seconds}
                  readOnly
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 bg-gray-50 text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={calculateBasicTime}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded text-sm sm:text-base"
                >
                  Calculate
                </button>
                <button
                  onClick={clearBasicCalc}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 sm:px-6 rounded text-sm sm:text-base"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Date & Time Calculator */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Date & Time Calculator</h2>
              <p className="text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                Add or subtract time from any given starting date and time. Enter values in days, hours, minutes, and seconds.
              </p>

              {/* Start Date */}
              <div className="mb-3 sm:mb-4">
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Start Date</label>
                <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  <select
                    value={dateTimeCalc.startDate.month}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      startDate: { ...prev.startDate, month: e.target.value }
                    }))}
                    className="p-1.5 sm:p-2 border border-gray-900 rounded text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <select
                    value={dateTimeCalc.startDate.day}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      startDate: { ...prev.startDate, day: e.target.value }
                    }))}
                    className="p-1.5 sm:p-2 border border-gray-900 rounded text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  >
                    {generateDayOptions(dateTimeCalc.startDate.month, dateTimeCalc.startDate.year).map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <select
                    value={dateTimeCalc.startDate.year}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      startDate: { ...prev.startDate, year: e.target.value }
                    }))}
                    className="p-1.5 sm:p-2 border border-gray-900 rounded text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  >
                    {generateYearOptions().map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Start Time */}
                <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">Start Time</label>
                <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-2">
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={dateTimeCalc.startTime.hour}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      startTime: { ...prev.startTime, hour: e.target.value }
                    }))}
                    placeholder="Hour"
                    className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={dateTimeCalc.startTime.minute}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      startTime: { ...prev.startTime, minute: e.target.value }
                    }))}
                    placeholder="Min"
                    className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={dateTimeCalc.startTime.second}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      startTime: { ...prev.startTime, second: e.target.value }
                    }))}
                    placeholder="Sec"
                    className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  />
                  <select
                    value={dateTimeCalc.startTime.period}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      startTime: { ...prev.startTime, period: e.target.value }
                    }))}
                    className="p-1.5 sm:p-2 border border-gray-900 rounded text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
                
              </div>

              {/* Operation Selection */}
              <div className="flex justify-center mb-3 sm:mb-4 text-gray-900 flex-wrap gap-2 sm:gap-4">
                <label className="flex items-center text-gray-900 text-sm sm:text-base">
                  <input
                    type="radio"
                    name="dateOperation"
                    value="add"
                    checked={dateTimeCalc.operation === 'add'}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      operation: e.target.value
                    }))}
                    className="mr-2 accent-gray-900"
                  />
                  Add +
                </label>
                <label className="flex items-center text-gray-900 text-sm sm:text-base">
                  <input
                    type="radio"
                    name="dateOperation"
                    value="subtract"
                    checked={dateTimeCalc.operation === 'subtract'}
                    onChange={(e) => setDateTimeCalc(prev => ({
                      ...prev,
                      operation: e.target.value
                    }))}
                    className="mr-2 accent-gray-900"
                  />
                  Subtract –
                </label>
              </div>

              {/* Time to Add/Subtract */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-2 text-gray-900">
                <div className="text-center text-xs sm:text-sm font-medium text-gray-900">Day</div>
                <div className="text-center text-xs sm:text-sm font-medium text-gray-900">Hour</div>
                <div className="text-center text-xs sm:text-sm font-medium text-gray-900">Minute</div>
                <div className="text-center text-xs sm:text-sm font-medium text-gray-900">Second</div>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                <input
                  type="number"
                  min="0"
                  value={dateTimeCalc.timeToAdd.days}
                  onChange={(e) => setDateTimeCalc(prev => ({
                    ...prev,
                    timeToAdd: { ...prev.timeToAdd, days: parseInt(e.target.value) || 0 }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={dateTimeCalc.timeToAdd.hours}
                  onChange={(e) => setDateTimeCalc(prev => ({
                    ...prev,
                    timeToAdd: { ...prev.timeToAdd, hours: parseInt(e.target.value) || 0 }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={dateTimeCalc.timeToAdd.minutes}
                  onChange={(e) => setDateTimeCalc(prev => ({
                    ...prev,
                    timeToAdd: { ...prev.timeToAdd, minutes: parseInt(e.target.value) || 0 }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={dateTimeCalc.timeToAdd.seconds}
                  onChange={(e) => setDateTimeCalc(prev => ({
                    ...prev,
                    timeToAdd: { ...prev.timeToAdd, seconds: parseInt(e.target.value) || 0 }
                  }))}
                  className="p-1.5 sm:p-2 border border-gray-900 rounded text-center text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none text-sm"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={calculateDateTimeAddition}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded text-sm sm:text-base"
                >
                  Calculate
                </button>
                <button
                  onClick={clearDateTimeCalc}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 sm:px-6 rounded text-sm sm:text-base"
                >
                  Clear
                </button>
              </div>

              {/* Date/Time Results */}
              {dateTimeCalc.result && !dateTimeCalc.result.error && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Result</h3>
                  <div className="text-sm sm:text-base text-gray-800 break-words">
                    {dateTimeCalc.result.fullFormatted}
                  </div>
                </div>
              )}

              {dateTimeCalc.result && dateTimeCalc.result.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mt-3 sm:mt-4 text-sm sm:text-base">
                  {dateTimeCalc.result.error}
                </div>
              )}
            </div>

            {/* Time Expression Calculator */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Time Expression Calculator</h2>
              <p className="text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                Enter multiple time values with units (d = days, h = hours, m = minutes, s = seconds) and use + or – to add or subtract them. Example: "1d 2h + 30m – 45s".
              </p>

              <textarea
                value={expressionCalc.expression}
                onChange={(e) => setExpressionCalc(prev => ({
                  ...prev,
                  expression: e.target.value
                }))}
                placeholder="1d 2h 3m 4s + 4h 5s - 2030s + 28h"
                className="w-full p-2 sm:p-3 border border-gray-900 rounded h-20 sm:h-24 resize-none text-gray-900 focus:ring-2 focus:ring-gray-900 focus:outline-none mb-3 sm:mb-4 text-sm sm:text-base"
              />

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
                <button
                  onClick={calculateExpression}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-4 sm:px-6 rounded text-sm sm:text-base"
                >
                  Calculate
                </button>
                <button
                  onClick={clearExpression}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 sm:px-6 rounded text-sm sm:text-base"
                >
                  Clear
                </button>
              </div>

              {/* Expression Results */}
              {expressionCalc.result && !expressionCalc.result.error && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Expression Result</h3>
                  <div className="text-lg sm:text-xl font-bold text-gray-900 break-words">
                    {expressionCalc.result.days} days, {expressionCalc.result.hours} hours, {expressionCalc.result.minutes} minutes, {expressionCalc.result.seconds} seconds
                  </div>
                </div>
              )}

              {expressionCalc.result && expressionCalc.result.error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mt-3 sm:mt-4 text-sm sm:text-base">
                  {expressionCalc.result.error}
                </div>
              )}
            </div>

            {/* Educational Content */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Early Timekeeping Devices</h2>
              <div className="space-y-3 sm:space-y-4 text-gray-700">
                <p className="text-sm sm:text-base">
                  Early timekeeping devices were the first tools humans developed to measure and track time before mechanical clocks were invented. They were based on natural phenomena like the movement of the sun, flow of water, or burning of materials.
                </p>
                
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Sundials</h3>
                  <p className="text-sm sm:text-base">
                    One of the oldest timekeeping devices. Worked by using the position of the sun's shadow cast by a stick (called a gnomon) on a flat marked surface. Accurate only during the daytime and depended on weather and season.
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Water Clocks (Clepsydra)</h3>
                  <p className="text-sm sm:text-base">
                    Used by ancient Egyptians, Greeks, and Chinese. Measured time by the steady flow of water from or into a container. Could be used day and night, but required regular monitoring and refilling.
                  </p>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Candle Clocks</h3>
                  <p className="text-sm sm:text-base">
                    Time measured by the rate at which a candle burned. Marks were made on the candle to indicate hours. Useful indoors but influenced by drafts or varying wax quality.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Time Calculations */}
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Common Time Calculations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">⏰</div>
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Work Hours</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Calculate total hours worked, overtime, and breaks for payroll and scheduling.</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">✈️</div>
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Travel Time</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Determine arrival times across different time zones and account for travel duration.</p>
                </div>
                
                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📅</div>
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">Project Planning</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Add up task durations and calculate project deadlines and milestones.</p>
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

export default TimeCalculator;