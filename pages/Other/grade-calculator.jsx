
import React, { useState } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Plus, Trash2, Award, Target } from 'lucide-react';

const GradeCalculator = () => {
  const [assignments, setAssignments] = useState([
    { name: 'Homework 1', grade: '90', weight: '5' },
    { name: 'Project', grade: 'B', weight: '20' },
    { name: 'Midterm exam', grade: '88', weight: '20' }
  ]);
  
  const [finalGradeGoal, setFinalGradeGoal] = useState('');
  const [remainingWeight, setRemainingWeight] = useState('');
  
  const [finalCalculatorData, setFinalCalculatorData] = useState({
    currentGrade: '88',
    desiredGrade: '85',
    finalWeight: '40'
  });
  
  const [activeTab, setActiveTab] = useState('weighted');
  const [calculatedResults, setCalculatedResults] = useState({
    currentGrade: null,
    requiredFinalGrade: null
  });

  const letterToNumber = {
    'A+': 97, 'A': 95, 'A-': 92,
    'B+': 89, 'B': 86, 'B-': 82,
    'C+': 79, 'C': 76, 'C-': 72,
    'D+': 69, 'D': 66, 'D-': 62,
    'F': 50
  };

  const numberToLetter = (num) => {
    if (num >= 97) return 'A+';
    if (num >= 93) return 'A';
    if (num >= 90) return 'A-';
    if (num >= 87) return 'B+';
    if (num >= 83) return 'B';
    if (num >= 80) return 'B-';
    if (num >= 77) return 'C+';
    if (num >= 73) return 'C';
    if (num >= 70) return 'C-';
    if (num >= 67) return 'D+';
    if (num >= 63) return 'D';
    if (num >= 60) return 'D-';
    return 'F';
  };

  const convertGradeToNumber = (grade) => {
    const numGrade = parseFloat(grade);
    if (!isNaN(numGrade)) return numGrade;
    return letterToNumber[grade.toUpperCase()] || 0;
  };

  const calculateWeightedGrade = () => {
    let totalPoints = 0;
    let totalWeight = 0;
    
    assignments.forEach(assignment => {
      if (assignment.grade && assignment.weight) {
        const gradeValue = convertGradeToNumber(assignment.grade);
        const weight = parseFloat(assignment.weight);
        
        if (gradeValue > 0 && weight > 0) {
          totalPoints += gradeValue * weight;
          totalWeight += weight;
        }
      }
    });
    
    const currentGrade = totalWeight > 0 ? (totalPoints / totalWeight).toFixed(2) : '0.00';
    setCalculatedResults(prev => ({ ...prev, currentGrade }));
    
    if (finalGradeGoal && remainingWeight) {
      calculateRequiredFinalGrade(currentGrade, totalWeight);
    }
  };

  const calculateRequiredFinalGrade = (currentGrade, currentWeight) => {
    if (!finalGradeGoal || !remainingWeight) return;
    
    let totalPoints = 0;
    let totalWeightCalc = 0;
    
    assignments.forEach(assignment => {
      if (assignment.grade && assignment.weight) {
        const gradeValue = convertGradeToNumber(assignment.grade);
        const weight = parseFloat(assignment.weight);
        
        if (gradeValue > 0 && weight > 0) {
          totalPoints += gradeValue * weight;
          totalWeightCalc += weight;
        }
      }
    });
    
    const goalGrade = convertGradeToNumber(finalGradeGoal);
    const finalWeight = parseFloat(remainingWeight);
    const totalWeight = totalWeightCalc + finalWeight;
    
    const requiredPoints = (goalGrade * totalWeight) - totalPoints;
    const requiredGrade = finalWeight > 0 ? (requiredPoints / finalWeight).toFixed(2) : '0.00';
    
    setCalculatedResults(prev => ({ ...prev, requiredFinalGrade: requiredGrade }));
  };

  const calculateFinalExamGrade = () => {
    const current = parseFloat(finalCalculatorData.currentGrade);
    const desired = parseFloat(finalCalculatorData.desiredGrade);
    const finalWeight = parseFloat(finalCalculatorData.finalWeight);
    
    if (!current || !desired || !finalWeight) {
      setCalculatedResults(prev => ({ ...prev, requiredFinalGrade: '0.00' }));
      return;
    }
    
    const currentWeight = 100 - finalWeight;
    const requiredPoints = (desired * 100) - (current * currentWeight);
    const requiredFinalGrade = requiredPoints / finalWeight;
    
    setCalculatedResults(prev => ({ ...prev, requiredFinalGrade: requiredFinalGrade.toFixed(2) }));
  };

  const addAssignment = () => {
    setAssignments([...assignments, { name: '', grade: '', weight: '' }]);
  };

  const removeAssignment = (index) => {
    if (assignments.length > 1) {
      setAssignments(assignments.filter((_, i) => i !== index));
    }
  };

  const updateAssignment = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const clearAll = () => {
    setAssignments([{ name: '', grade: '', weight: '' }]);
    setFinalGradeGoal('');
    setRemainingWeight('');
    setCalculatedResults({ currentGrade: null, requiredFinalGrade: null });
  };

  const clearFinalCalculator = () => {
    setFinalCalculatorData({
      currentGrade: '',
      desiredGrade: '',
      finalWeight: ''
    });
    setCalculatedResults({ currentGrade: null, requiredFinalGrade: null });
  };

  return (
    <>
      <Head>
        <title>Grade Calculator | Free Online Grade Calculation Tool</title>
        <meta
          name="description"
          content="Use our free Grade Calculator to easily compute your grades and GPA. Quick, accurate, and perfect for students to track academic performance online."
        />
        <meta name="keywords" content="Grade Calculator, Online Grade Calculator, Free Grade Calculator, GPA Grade Calculator, Student Grade Calculator, Academic Grade Calculator, Course Grade Calculator, Grade Percentage Calculator, Final Grade Calculator, Grade Calculation Tool." />
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
              <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">⏱️</span>
                <span className="text-gray-900 font-medium">Time Calculator</span>
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
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
                <span className="text-xl flex-shrink-0">✏️</span>
                <span className="text-gray-900 font-semibold">Grade Calculator</span>
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
        <main className="lg:ml-64 bg-white p-3 sm:p-4 lg:p-8 overflow-y-auto transition-all duration-300">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Grade Calculator</h1>
            
            <p className="text-gray-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed text-xs sm:text-sm lg:text-base">
              Calculate your course grade using weighted averages for assignments, projects, and exams. 
              Plan your academic goals and understand what grades you need to achieve your target.
            </p>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              <button
                onClick={() => setActiveTab('weighted')}
                className={`px-3 sm:px-4 py-2 font-medium rounded transition-colors text-xs sm:text-sm lg:text-base ${
                  activeTab === 'weighted'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Weighted Grade
              </button>
              <button
                onClick={() => setActiveTab('final')}
                className={`px-3 sm:px-4 py-2 font-medium rounded transition-colors text-xs sm:text-sm lg:text-base ${
                  activeTab === 'final'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Final Grade
              </button>
            </div>

            {activeTab === 'weighted' && (
              <div>
                {/* Calculator Form */}
                <div className="bg-gray-50 p-3 sm:p-4 lg:p-6 rounded-lg mb-4 sm:mb-6 lg:mb-8 shadow">
                  <div className="bg-gray-900 text-white p-2 sm:p-3 rounded-t-lg -mx-3 sm:-mx-4 lg:-mx-6 -mt-3 sm:-mt-4 lg:-mt-6 mb-4 sm:mb-6">
                    <h2 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                      <Calculator className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      Assignment Grades
                    </h2>
                  </div>

                  {/* Assignment Table */}
                  <div className="overflow-x-auto mb-4 sm:mb-6">
                    <table className="w-full border-collapse border border-gray-900 min-w-[500px]">
                      <thead>
                        <tr className="bg-gray-900 text-white">
                          <th className="border border-gray-900 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Assignment</th>
                          <th className="border border-gray-900 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Grade</th>
                          <th className="border border-gray-900 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Weight (%)</th>
                          <th className="border border-gray-900 px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assignments.map((assignment, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="border border-gray-900 p-1 sm:p-2">
                              <input
                                type="text"
                                value={assignment.name}
                                onChange={(e) => updateAssignment(index, 'name', e.target.value)}
                                className="w-full text-gray-900 px-1 sm:px-2 py-1 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs sm:text-sm"
                                placeholder="Assignment name"
                              />
                            </td>
                            <td className="border border-gray-900 p-1 sm:p-2">
                              <input
                                type="text"
                                value={assignment.grade}
                                onChange={(e) => updateAssignment(index, 'grade', e.target.value)}
                                className="w-full text-gray-900 px-1 sm:px-2 py-1 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs sm:text-sm"
                                placeholder="90 or B+"
                              />
                            </td>
                            <td className="border border-gray-900 p-1 sm:p-2">
                              <input
                                type="number"
                                value={assignment.weight}
                                onChange={(e) => updateAssignment(index, 'weight', e.target.value)}
                                className="w-full px-1 sm:px-2 text-gray-900 py-1 border border-gray-900 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 text-xs sm:text-sm"
                                min="0"
                                max="100"
                              />
                            </td>
                            <td className="border border-gray-900 p-1 sm:p-2 text-center">
                              <button
                                onClick={() => removeAssignment(index)}
                                className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                                disabled={assignments.length === 1}
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={addAssignment}
                    className="text-gray-900 mb-4 sm:mb-6 flex items-center px-3 sm:px-4 py-2 rounded-lg border border-dashed border-gray-300 hover:border-gray-900 transition-colors text-xs sm:text-sm"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Add Assignment
                  </button>

                  {/* Grade Goal */}
                  <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center text-xs sm:text-sm lg:text-base">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Grade Goal (Optional)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                          Target Grade
                        </label>
                        <input
                          type="text"
                          value={finalGradeGoal}
                          onChange={(e) => setFinalGradeGoal(e.target.value)}
                          className="w-full text-gray-900 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                          placeholder="85 or B+"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Remaining Weight (%)
                        </label>
                        <input
                          type="number"
                          value={remainingWeight}
                          onChange={(e) => setRemainingWeight(e.target.value)}
                          className="w-full text-gray-900 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={calculateWeightedGrade}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded transition-colors duration-200 text-sm sm:text-base"
                    >
                      Calculate Grade
                    </button>
                    <button
                      onClick={clearAll}
                      className="flex-1 sm:flex-none bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded transition-colors duration-200 text-sm sm:text-base"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Results */}
                {calculatedResults.currentGrade && (
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 lg:p-6">
                      <h3 className="font-bold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                        Current Grade
                      </h3>
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                        {calculatedResults.currentGrade}% ({numberToLetter(parseFloat(calculatedResults.currentGrade))})
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Based on {assignments.filter(a => a.grade && a.weight).length} assignments
                      </p>
                    </div>

                    {calculatedResults.requiredFinalGrade && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 lg:p-6">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                          <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                          Required Grade
                        </h3>
                        <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                          {calculatedResults.requiredFinalGrade}% ({numberToLetter(parseFloat(calculatedResults.requiredFinalGrade))})
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Needed on remaining tasks to achieve {finalGradeGoal}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'final' && (
              <div>
                <div className="bg-gray-50 p-3 sm:p-4 lg:p-6 rounded-lg mb-4 sm:mb-6 lg:mb-8 shadow">
                  <div className="bg-gray-900 text-white p-2 sm:p-3 rounded-t-lg -mx-3 sm:-mx-4 lg:-mx-6 -mt-3 sm:-mt-4 lg:-mt-6 mb-4 sm:mb-6">
                    <h2 className="font-bold flex items-center gap-2 text-sm sm:text-base">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      Final Exam Calculator
                    </h2>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                        Current Course Grade
                      </label>
                      <input
                        type="text"
                        value={finalCalculatorData.currentGrade}
                        onChange={(e) => setFinalCalculatorData(prev => ({...prev, currentGrade: e.target.value}))}
                        className="w-full text-gray-900 px-3 sm:px-4 py-2 sm:py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                        placeholder="88 or B+"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                        Desired Course Grade
                      </label>
                      <input
                        type="text"
                        value={finalCalculatorData.desiredGrade}
                        onChange={(e) => setFinalCalculatorData(prev => ({...prev, desiredGrade: e.target.value}))}
                        className="w-full px-3 text-gray-900 sm:px-4 py-2 sm:py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                        placeholder="85 or B"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-900 mb-2">
                        Final Exam Weight (%)
                      </label>
                      <input
                        type="number"
                        value={finalCalculatorData.finalWeight}
                        onChange={(e) => setFinalCalculatorData(prev => ({...prev, finalWeight: e.target.value}))}
                        className="w-full px-3 sm:px-4 text-gray-900 py-2 sm:py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                        min="0"
                        max="100"
                        placeholder="40"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={calculateFinalExamGrade}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded transition-colors duration-200 text-sm sm:text-base"
                    >
                      Calculate Final Grade
                    </button>
                    <button
                      onClick={clearFinalCalculator}
                      className="flex-1 sm:flex-none bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded transition-colors duration-200 text-sm sm:text-base"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Final Result */}
                {calculatedResults.requiredFinalGrade && activeTab === 'final' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 lg:p-6">
                    <h3 className="font-bold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                      Required Final Exam Grade
                    </h3>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">
                      {calculatedResults.requiredFinalGrade}% ({numberToLetter(parseFloat(calculatedResults.requiredFinalGrade))})
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      You need {calculatedResults.requiredFinalGrade}% on your final to achieve {finalCalculatorData.desiredGrade}%
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Tips */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Grade Calculation Tips</h3>
              <ul className="space-y-2 text-gray-700 text-xs sm:text-sm lg:text-base">
                <li>• Enter grades as numbers (0-100) or letter grades (A+, A, B+, etc.)</li>
                <li>• Weights should add up to 100% for accurate calculations</li>
                <li>• Focus more effort on high-weight assignments</li>
                <li>• Use the grade goal feature to plan ahead for your target grade</li>
              </ul>
            </div>

            {/* Grade Scale */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Grade Scale Reference</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-xs sm:text-sm min-w-[400px]">
                  <thead>
                    <tr className="bg-gray-900 text-white">
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">Letter</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">Percentage</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">GPA</th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['A+', '97-100%', '4.3', 'Exceptional'],
                      ['A', '93-96%', '4.0', 'Excellent'],
                      ['A-', '90-92%', '3.7', 'Very Good'],
                      ['B+', '87-89%', '3.3', 'Good'],
                      ['B', '83-86%', '3.0', 'Above Average'],
                      ['B-', '80-82%', '2.7', 'Satisfactory+'],
                      ['C+', '77-79%', '2.3', 'Satisfactory'],
                      ['C', '73-76%', '2.0', 'Average'],
                      ['C-', '70-72%', '1.7', 'Below Average'],
                      ['D+', '67-69%', '1.3', 'Poor'],
                      ['D', '63-66%', '1.0', 'Very Poor'],
                      ['F', '0-62%', '0.0', 'Failing']
                    ].map(([letter, percentage, gpa, description], index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="border border-gray-300 text-gray-900 px-2 sm:px-4 py-2 font-bold text-center">{letter}</td>
                        <td className="border border-gray-300 text-gray-900 px-2 sm:px-4 py-2 text-center">{percentage}</td>
                        <td className="border border-gray-300 text-gray-900 px-2 sm:px-4 py-2 text-center">{gpa}</td>
                        <td className="border border-gray-300 text-gray-900 px-2 sm:px-4 py-2">{description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Understanding Weighted Grades */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Understanding Weighted Grade Calculations</h3>
              
              <p className="text-gray-700 mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base">
                Weighted grading assigns different levels of importance to various assignments, exams, and 
                activities in a course. Unlike simple averages, weighted grades reflect the relative significance of each 
                component in determining your final course grade.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded mb-3 sm:mb-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">Weighted Grade Formula:</h4>
                <div className="bg-white p-2 sm:p-3 rounded font-mono text-gray-900 text-xs sm:text-sm text-center break-words">
                  Final Grade = (Grade₁ × Weight₁ + Grade₂ × Weight₂ + ...) ÷ Total Weight
                </div>
              </div>

              <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">Common Weighting Examples</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">Liberal Arts Course:</h5>
                  <ul className="text-xs sm:text-sm space-y-1 text-gray-700">
                    <li>• Participation: 10%</li>
                    <li>• Homework/Assignments: 20%</li>
                    <li>• Midterm Exam: 30%</li>
                    <li>• Final Project: 40%</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h5 className="font-semibold text-gray-800 mb-2 text-xs sm:text-sm">Science Course:</h5>
                  <ul className="text-xs sm:text-sm space-y-1 text-gray-700">
                    <li>• Laboratory Work: 25%</li>
                    <li>• Homework Sets: 15%</li>
                    <li>• Midterm Exams: 35%</li>
                    <li>• Final Exam: 25%</li>
                  </ul>
                </div>
              </div>

              <p className="text-gray-700 text-xs sm:text-sm lg:text-base">
                Understanding your course's weighting scheme helps you prioritize your efforts effectively. A high-weight 
                assignment deserves proportionally more attention and preparation time than lower-weight components.
              </p>
            </div>

            {/* Academic Success Strategies */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Academic Success Strategies</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">Study Planning Tips</h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
                    <li>• Create a study schedule and stick to it consistently</li>
                    <li>• Break large assignments into smaller, manageable tasks</li>
                    <li>• Use active learning techniques like summarizing and teaching</li>
                    <li>• Form study groups with classmates for collaborative learning</li>
                    <li>• Take regular breaks to maintain focus and retention</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-xs sm:text-sm lg:text-base">Grade Management</h4>
                  <ul className="space-y-1.5 sm:space-y-2 text-gray-700 text-xs sm:text-sm">
                    <li>• Keep track of all assignment due dates and weights</li>
                    <li>• Prioritize high-weight assignments and exams</li>
                    <li>• Communicate with instructors about grade concerns early</li>
                    <li>• Utilize office hours and tutoring resources</li>
                    <li>• Review and learn from graded assignments</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Using Grade Calculators for Planning */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">Using Grade Calculators for Academic Planning</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📊</div>
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">Progress Tracking</h4>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Monitor your academic progress throughout the semester and identify areas that need improvement.
                  </p>
                </div>

                <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎯</div>
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">Goal Setting</h4>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Set realistic academic goals and understand exactly what performance is needed on upcoming assignments.
                  </p>
                </div>

                <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">📅</div>
                  <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm lg:text-base">Strategic Planning</h4>
                  <p className="text-xs lg:text-sm text-gray-600">
                    Make informed decisions about time allocation and study priorities based on assignment weights.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded">
                <p className="text-xs sm:text-sm text-gray-700">
                  <strong>Pro Tip:</strong> Use grade calculators early in the semester to understand course requirements. 
                  Regularly update your calculations as you receive grades, and focus extra effort on high-weight assignments 
                  that significantly impact your final grade.
                </p>
              </div>
            </div>

            {/* Grading System History */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 lg:p-6 shadow mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-3 sm:mb-4">History of Academic Grading Systems</h3>
              
              <div className="space-y-3 sm:space-y-4 text-gray-700 text-xs sm:text-sm lg:text-base">
                <p>
                  <strong>Early American Grading (1785-1850s):</strong> In 1785, students at Yale were ranked using Latin terms: 
                  "optimi" (highest rank), "second optimi", "inferiore" (lower), and "pejores" (worse). William and Mary used 
                  a simple "No. 1" and "No. 2" system, while Harvard employed a numerical scale from 1-200 for most subjects.
                </p>
                
                <p>
                  <strong>Introduction of Letter Grades (1887):</strong> Mount Holyoke College became the first institution to use 
                  letter grades similar to today's system, implementing A, B, C, D, and E grades. However, their standards were 
                  much stricter, with anything below 75% considered failing (grade E).
                </p>
                
                <p>
                  <strong>Modern Grading Evolution:</strong> The current A-F system (dropping E to avoid confusion with "Excellent") 
                  became standardized throughout the 20th century. GPA calculations and plus/minus modifiers were later additions 
                  to provide more precise academic assessment.
                </p>

                <p>
                  <strong>Today's Grading Systems:</strong> Modern grading incorporates weighted averages, rubrics, and standardized 
                  testing to provide comprehensive student evaluation. Different institutions may use varying scales, but the basic 
                  letter grade system remains the most common standard in American education.
                </p>
              </div>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    </>
  );
};

export default GradeCalculator;