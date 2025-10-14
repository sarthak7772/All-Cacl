import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import { Calculator, Activity, Zap, Timer } from 'lucide-react';

const PaceCalculator = () => {
  const [calculationType, setCalculationType] = useState('pace');
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [pace, setPace] = useState('');
  const [paceSeconds, setPaceSeconds] = useState('');
  const [results, setResults] = useState(null);

  const calculatePace = () => {
    if (calculationType === 'pace') {
      const dist = parseFloat(distance);
      const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      
      if (!dist || dist <= 0) {
        alert('Please enter a valid distance');
        return;
      }
      
      if (!totalSeconds || totalSeconds <= 0) {
        alert('Please enter a valid time');
        return;
      }
      
      const paceInSeconds = totalSeconds / dist;
      const paceMin = Math.floor(paceInSeconds / 60);
      const paceSec = Math.floor(paceInSeconds % 60);
      
      const speedKmh = distanceUnit === 'km' ? (dist / (totalSeconds / 3600)).toFixed(2) : (dist * 1.60934 / (totalSeconds / 3600)).toFixed(2);
      const speedMph = distanceUnit === 'miles' ? (dist / (totalSeconds / 3600)).toFixed(2) : (dist * 0.621371 / (totalSeconds / 3600)).toFixed(2);
      
      const pacePerKm = distanceUnit === 'km' ? paceInSeconds : paceInSeconds / 1.60934;
      const pacePerMile = distanceUnit === 'miles' ? paceInSeconds : paceInSeconds / 0.621371;
      
      setResults({
        pace: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
        pacePerKm: `${Math.floor(pacePerKm / 60)}:${Math.floor(pacePerKm % 60).toString().padStart(2, '0')}`,
        pacePerMile: `${Math.floor(pacePerMile / 60)}:${Math.floor(pacePerMile % 60).toString().padStart(2, '0')}`,
        speedKmh,
        speedMph,
        totalTime: `${(hours || '0')}:${(minutes || '0').toString().padStart(2, '0')}:${(seconds || '0').toString().padStart(2, '0')}`,
        distance: `${dist} ${distanceUnit}`
      });
    } else if (calculationType === 'time') {
      const dist = parseFloat(distance);
      const paceMin = parseInt(pace) || 0;
      const paceSec = parseInt(paceSeconds) || 0;
      const totalPaceSeconds = paceMin * 60 + paceSec;
      
      if (!dist || dist <= 0) {
        alert('Please enter a valid distance');
        return;
      }
      
      if (!totalPaceSeconds || totalPaceSeconds <= 0) {
        alert('Please enter a valid pace');
        return;
      }
      
      const totalTimeSeconds = dist * totalPaceSeconds;
      const hrs = Math.floor(totalTimeSeconds / 3600);
      const mins = Math.floor((totalTimeSeconds % 3600) / 60);
      const secs = Math.floor(totalTimeSeconds % 60);
      
      const speedKmh = distanceUnit === 'km' ? (dist / (totalTimeSeconds / 3600)).toFixed(2) : (dist * 1.60934 / (totalTimeSeconds / 3600)).toFixed(2);
      const speedMph = distanceUnit === 'miles' ? (dist / (totalTimeSeconds / 3600)).toFixed(2) : (dist * 0.621371 / (totalTimeSeconds / 3600)).toFixed(2);
      
      setResults({
        pace: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
        totalTime: `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`,
        speedKmh,
        speedMph,
        distance: `${dist} ${distanceUnit}`
      });
    } else if (calculationType === 'distance') {
      const totalSeconds = (parseInt(hours) || 0) * 3600 + (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);
      const paceMin = parseInt(pace) || 0;
      const paceSec = parseInt(paceSeconds) || 0;
      const totalPaceSeconds = paceMin * 60 + paceSec;
      
      if (!totalSeconds || totalSeconds <= 0) {
        alert('Please enter a valid time');
        return;
      }
      
      if (!totalPaceSeconds || totalPaceSeconds <= 0) {
        alert('Please enter a valid pace');
        return;
      }
      
      const dist = (totalSeconds / totalPaceSeconds).toFixed(2);
      const speedKmh = distanceUnit === 'km' ? (parseFloat(dist) / (totalSeconds / 3600)).toFixed(2) : (parseFloat(dist) * 1.60934 / (totalSeconds / 3600)).toFixed(2);
      const speedMph = distanceUnit === 'miles' ? (parseFloat(dist) / (totalSeconds / 3600)).toFixed(2) : (parseFloat(dist) * 0.621371 / (totalSeconds / 3600)).toFixed(2);
      
      setResults({
        pace: `${paceMin}:${paceSec.toString().padStart(2, '0')}`,
        totalTime: `${(hours || '0')}:${(minutes || '0').toString().padStart(2, '0')}:${(seconds || '0').toString().padStart(2, '0')}`,
        distance: `${dist} ${distanceUnit}`,
        speedKmh,
        speedMph
      });
    }
  };

  const resetForm = () => {
    setDistance('');
    setHours('');
    setMinutes('');
    setSeconds('');
    setPace('');
    setPaceSeconds('');
    setResults(null);
  };

  return (
    <>
      <Head>
        <title>Pace Calculator | Free Online Running Pace Tool</title>
        <meta
          name="description"
          content="Use our free Pace Calculator to find your running speed, pace per kilometer, or mile. Fast, accurate, and easy-to-use tool for runners and athletes."
        />
        <meta name="keywords" content="Pace Calculator, Online Pace Calculator, Running Pace Calculator, Free Pace Calculator, Pace Per Kilometer Calculator, Pace Per Mile Calculator, Marathon Pace Calculator, Race Pace Calculator, Running Speed Calculator, Fitness Pace Calculator" />
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
                <a href="/Fitness/pace-calculator" className="text-gray-900 bg-gray-100 font-semibold flex items-center gap-2 p-2 rounded transition-colors">
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
          <div className="flex-1 lg:ml-64 px-4 py-6-mt-15">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Pace Calculator</h1>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                Calculate your running or walking pace, speed, time, or distance. Perfect for runners, joggers, and walkers planning their workouts and races.
              </p>

              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gray-900 text-white px-4 py-2 text-sm font-medium">
                  Pace Calculator
                </div>

                <div className="flex flex-col lg:flex-row">
                  {/* Input Section */}
                  <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-gray-900">
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">What do you want to calculate?</label>
                        <select
                          value={calculationType}
                          onChange={(e) => {
                            setCalculationType(e.target.value);
                            resetForm();
                          }}
                          className="w-full px-3 text-gray-900 py-2 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                        >
                          <option value="pace">Pace (from distance & time)</option>
                          <option value="time">Time (from distance & pace)</option>
                          <option value="distance">Distance (from time & pace)</option>
                        </select>
                      </div>

                      {calculationType !== 'distance' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Distance</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={distance}
                              onChange={(e) => setDistance(e.target.value)}
                              placeholder="Enter distance"
                              className="flex-1 px-3 text-gray-900 py-2 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <select
                              value={distanceUnit}
                              onChange={(e) => setDistanceUnit(e.target.value)}
                              className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            >
                              <option value="km">km</option>
                              <option value="miles">miles</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {calculationType !== 'time' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Time</label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={hours}
                              onChange={(e) => setHours(e.target.value)}
                              placeholder="Hours"
                              className="px-3 py-2  text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <input
                              type="number"
                              value={minutes}
                              onChange={(e) => setMinutes(e.target.value)}
                              placeholder="Minutes"
                              className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <input
                              type="number"
                              value={seconds}
                              onChange={(e) => setSeconds(e.target.value)}
                              placeholder="Seconds"
                              className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                      )}

                      {calculationType !== 'pace' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Pace (per {distanceUnit === 'km' ? 'km' : 'mile'})</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              value={pace}
                              onChange={(e) => setPace(e.target.value)}
                              placeholder="Minutes"
                              className="px-3 py-2  text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                            <input
                              type="number"
                              value={paceSeconds}
                              onChange={(e) => setPaceSeconds(e.target.value)}
                              placeholder="Seconds"
                              className="px-3 py-2 text-gray-900 border border-gray-900 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={calculatePace}
                          className="flex-1 bg-green-600 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Zap className="h-4 w-4" />
                          Calculate
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
                        <div className="space-y-3 text-sm">
                          {results.pace && calculationType === 'pace' && (
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                              <div className="text-gray-600 text-xs font-medium mb-1">Pace</div>
                              <div className="text-3xl font-bold text-gray-900">{results.pace}</div>
                              <div className="text-xs text-gray-500 mt-1">min/{distanceUnit === 'km' ? 'km' : 'mile'}</div>
                            </div>
                          )}

                          {results.pacePerKm && (
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-gray-600 text-xs font-medium mb-1">Pace per km</div>
                              <div className="font-semibold text-blue-600">{results.pacePerKm} min/km</div>
                            </div>
                          )}

                          {results.pacePerMile && (
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-gray-600 text-xs font-medium mb-1">Pace per mile</div>
                              <div className="font-semibold text-green-600">{results.pacePerMile} min/mile</div>
                            </div>
                          )}

                          {results.speedKmh && (
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-gray-600 text-xs font-medium mb-1">Speed (km/h)</div>
                              <div className="font-semibold text-orange-500">{results.speedKmh} km/h</div>
                            </div>
                          )}

                          {results.speedMph && (
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-gray-600 text-xs font-medium mb-1">Speed (mph)</div>
                              <div className="font-semibold text-purple-600">{results.speedMph} mph</div>
                            </div>
                          )}

                          {results.totalTime && (
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-gray-600 text-xs font-medium mb-1">Total Time</div>
                              <div className="font-semibold text-red-600">{results.totalTime}</div>
                            </div>
                          )}

                          {results.distance && (
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                              <div className="text-gray-600 text-xs font-medium mb-1">Distance</div>
                              <div className="font-semibold text-pink-600">{results.distance}</div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-gray-700 border border-blue-200">
                          <strong>Tip:</strong> Use this pace calculator to plan your training runs and track your progress over time.
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Timer className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Enter your values and click Calculate to see results</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Pace Calculator Tips
                </h3>
                <ul className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Track your pace to monitor training progress and set realistic goals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Use pace zones to optimize different types of training runs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Calculate race finish times based on your target pace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-500">•</span>
                    <span>Compare km and mile paces for international race planning</span>
                  </li>
                </ul>
              </div>

              {/* Common Race Distances */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Race Distances</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                    <div className="font-bold text-lg text-gray-900">5K</div>
                    <div className="text-gray-600">3.1 miles</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                    <div className="font-bold text-lg text-gray-900">10K</div>
                    <div className="text-gray-600">6.2 miles</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                    <div className="font-bold text-lg text-gray-900">Half Marathon</div>
                    <div className="text-gray-600 text-xs">21.1 km / 13.1 miles</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                    <div className="font-bold text-lg text-gray-900">Marathon</div>
                    <div className="text-gray-600 text-xs">42.2 km / 26.2 miles</div>
                  </div>
                </div>
              </div>

              {/* Understanding Running Pace */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Running Pace</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Your Running Pace represents the time it takes to cover a specific distance, typically measured in minutes per kilometer or minutes per mile. Think of it as your running speedometer - a critical metric for training, racing, and tracking your fitness progress over time.
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Pace</strong> is the inverse of speed. While speed tells you how fast you're moving (km/h or mph), pace tells you how long it takes to cover each unit of distance. This makes pace more intuitive for runners who want to maintain consistent effort over varying distances.
                </p>

                <p className="text-gray-700 leading-relaxed">
                  Understanding your <strong>running pace</strong> is crucial for effective training, race strategy, and preventing injury. It helps you determine appropriate training intensities, predict race finish times, and ensure you're not overtraining or undertraining during different workout types.
                </p>
              </div>

              {/* Pace Calculation Methods */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Pace Calculation Methods</h2>
                
                <div className="space-y-5">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Time-Distance Method (Most Common)</h3>
                    <div className="bg-gray-50 p-4 text-gray-800 rounded mb-2 text-sm">
                      <div><strong>Formula:</strong> Pace = Total Time ÷ Distance</div>
                      <div><strong>Example:</strong> 30 minutes for 5km = 6:00 min/km</div>
                    </div>
                    <p className="text-sm text-gray-800">
                      Most straightforward method. Divide your total running time by the distance covered to get your average pace per unit.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">GPS Watch Method</h3>
                    <div className="bg-gray-50 text-gray-800 p-4 rounded mb-2 text-sm">
                      <div><strong>Technology:</strong> Real-time GPS tracking</div>
                      <div><strong>Accuracy:</strong> Instant pace updates every few seconds</div>
                    </div>
                    <p className="text-sm text-gray-800">
                      Modern running watches provide real-time pace data, allowing you to adjust your speed during runs to maintain target pace zones.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Perceived Effort Method</h3>
                    <div className="bg-gray-50 p-4 text-gray-800 rounded mb-2 text-sm">
                      <strong>Based on: Heart rate zones, breathing rate, and subjective effort level</strong>
                    </div>
                    <p className="text-sm text-gray-800">
                      Experienced runners can estimate pace based on how hard they're working. Useful when GPS isn't available or for trails where pace varies significantly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Using Your Pace for Training */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Using Your Pace for Training</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-5 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-4xl mb-3">🏃</div>
                    <h3 className="font-semibold text-green-800 mb-2">Easy Runs</h3>
                    <p className="text-sm text-gray-700">
                      Run 60-90 seconds slower 
                      than race pace. Build 
                      aerobic base and promote 
                      recovery between hard workouts.
                    </p>
                  </div>

                  <div className="text-center p-5 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="font-semibold text-blue-800 mb-2">Tempo Runs</h3>
                    <p className="text-sm text-gray-700">
                      Run 20-30 seconds slower 
                      than 5K race pace. Improve 
                      lactate threshold and 
                      race endurance capacity.
                    </p>
                  </div>

                  <div className="text-center p-5 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-4xl mb-3">🎯</div>
                    <h3 className="font-semibold text-purple-800 mb-2">Interval Training</h3>
                    <p className="text-sm text-gray-700">
                      Run at or faster than 
                      5K race pace. Build speed, 
                      VO2 max, and running 
                      economy through intensity.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-sm text-gray-700">
                    <strong>Important:</strong> Pace varies based on terrain, weather, fatigue, and altitude. Always adjust target paces for conditions and listen to your body to prevent overtraining and injury.
                  </p>
                </div>
              </div>

              {/* Pace Zones Explained */}
              <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Training Pace Zones Explained</h2>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800">Zone 1: Recovery Pace</h3>
                      <span className="text-sm font-medium text-green-600">Very Easy</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Effort:</strong> 50-60% maximum heart rate | Conversational pace
                    </p>
                    <p className="text-sm text-gray-600">
                      Purpose: Active recovery, building aerobic base, maintaining fitness between hard sessions. Should feel effortless and sustainable for hours.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800">Zone 2: Easy/Aerobic Pace</h3>
                      <span className="text-sm font-medium text-blue-600">Comfortable</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Effort:</strong> 60-70% maximum heart rate | Can hold full conversation
                    </p>
                    <p className="text-sm text-gray-600">
                      Purpose: Building aerobic endurance, fat adaptation, and running economy. Most of your training should be in this zone for optimal development.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800">Zone 3: Tempo/Threshold Pace</h3>
                      <span className="text-sm font-medium text-orange-600">Moderate-Hard</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Effort:</strong> 70-80% maximum heart rate | Comfortably hard, short phrases
                    </p>
                    <p className="text-sm text-gray-600">
                      Purpose: Improving lactate threshold - the pace you can sustain for approximately 60 minutes. Key for half marathon and marathon performance.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800">Zone 4: VO2 Max Intervals</h3>
                      <span className="text-sm font-medium text-red-600">Hard</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Effort:</strong> 80-90% maximum heart rate | Few words only, breathing hard
                    </p>
                    <p className="text-sm text-gray-600">
                      Purpose: Improving maximum oxygen uptake and running economy. Typically 3-5 minute intervals with equal recovery. Critical for 5K-10K performance.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-800">Zone 5: Sprint/Anaerobic</h3>
                      <span className="text-sm font-medium text-purple-600">Maximum</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Effort:</strong> 90-100% maximum heart rate | Cannot speak, gasping
                    </p>
                    <p className="text-sm text-gray-600">
                      Purpose: Developing speed, power, and neuromuscular coordination. Short bursts (30-90 seconds) with long recovery. Use sparingly to avoid injury.
                    </p>
                  </div>
                </div>
              </div>

              {/* Factors That Affect Your Pace */}
              <div className="mt-6 mb-12 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Factors That Affect Your Running Pace</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Terrain and Elevation</h3>
                      <p className="text-sm text-gray-700">
                        Hills, trails, and uneven surfaces significantly slow pace compared to flat roads. Expect 10-30% slower paces on hilly terrain and technical trails.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Weather Conditions</h3>
                      <p className="text-sm text-gray-700">
                        Heat, humidity, wind, and cold all impact performance. Running in heat above 20°C (68°F) can slow pace by 20-30 seconds per mile for every 5°C increase.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Fatigue and Recovery</h3>
                      <p className="text-sm text-gray-700">
                        Accumulated training fatigue, lack of sleep, and inadequate recovery between sessions can significantly reduce your sustainable pace.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Altitude Effects</h3>
                      <p className="text-sm text-gray-700">
                        Running at elevation reduces oxygen availability. Expect 1-2% pace decrease per 1000 feet above sea level for unacclimated runners.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Nutrition and Hydration</h3>
                      <p className="text-sm text-gray-700">
                        Proper fueling and hydration maintain pace in longer runs. Dehydration of just 2% body weight can slow pace by 6-10%.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Running Experience</h3>
                      <p className="text-sm text-gray-700">
                        Running economy improves with training volume and years of experience. Experienced runners are more efficient at any given pace.
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

export default PaceCalculator;