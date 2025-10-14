import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Plus, Trash2, Book, GraduationCap, TrendingUp,  } from 'lucide-react';

const GPACalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState([
    { course: '', credits: 0, grade: '' }
  ]);
  
  const [plannerData, setPlannerData] = useState({
    currentGPA: 0,
    targetGPA: 0,
    currentCredits: 0,
    additionalCredits: 0
  });
  
  const [calculatedGPA, setCalculatedGPA] = useState('0.00');
  const [calculatedRequiredGPA, setCalculatedRequiredGPA] = useState('0.00');
  const [calculationType, setCalculationType] = useState('semester');

  const gradePoints = {
    'A+': 4.3, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  const gradeOptions = Object.keys(gradePoints);

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    
    courses.forEach(course => {
      if (course.grade && course.credits > 0) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    setCalculatedGPA(gpa);
    return gpa;
  };

  const calculateRequiredGPA = () => {
    const { currentGPA, targetGPA, currentCredits, additionalCredits } = plannerData;
    
    const currentPoints = currentGPA * currentCredits;
    const targetPoints = targetGPA * (currentCredits + additionalCredits);
    const requiredPoints = targetPoints - currentPoints;
    
    const requiredGPA = additionalCredits > 0 ? (requiredPoints / additionalCredits).toFixed(2) : '0.00';
    setCalculatedRequiredGPA(requiredGPA);
    return requiredGPA;
  };

  const addCourse = () => {
    setCourses([...courses, { course: '', credits: 0, grade: '' }]);
  };

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const updateCourse = (index, field, value) => {
    const updated = [...courses];
    updated[index][field] = field === 'credits' ? parseInt(value) || 0 : value;
    setCourses(updated);
  };

  const resetCalculator = () => {
    setCourses([{ course: '', credits: 0, grade: '' }]);
    setCalculatedGPA('0.00');
  };

  const resetPlanner = () => {
    setPlannerData({
      currentGPA: 0,
      targetGPA: 0,
      currentCredits: 0,
      additionalCredits: 0
    });
    setCalculatedRequiredGPA('0.00');
  };

  const updatePlannerData = (field, value) => {
    setPlannerData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const getGradeInterpretation = (gpa) => {
    const numGPA = parseFloat(gpa);
    if (numGPA >= 3.7) return { text: 'Excellent', color: 'text-green-600' };
    if (numGPA >= 3.3) return { text: 'Very Good', color: 'text-blue-600' };
    if (numGPA >= 3.0) return { text: 'Good', color: 'text-indigo-600' };
    if (numGPA >= 2.7) return { text: 'Satisfactory', color: 'text-yellow-600' };
    if (numGPA >= 2.0) return { text: 'Below Average', color: 'text-orange-600' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  const totalCredits = courses.reduce((sum, course) => sum + (course.credits || 0), 0);
  const interpretation = getGradeInterpretation(calculatedGPA);

  return (
     <>
     <Head>
        <title>GPA Calculator | Free Online Grade Point Average Tool
</title>
        <meta
          name="description"
          content="Use our free GPA Calculator to quickly compute your grade point average. Easy, accurate, and perfect for students to track academic performance online.

  "
        />
        <meta name="keywords" content="GPA Calculator, Online GPA Calculator, Free GPA Calculator, Grade Point Average Calculator, College GPA Calculator, University GPA Calculator, Academic GPA Calculator, GPA Calculation Tool, Student GPA Calculator, GPA Score Calculator 
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
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">📚</span>
              <span className="text-gray-900 font-semibold">GPA Calculator</span>
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
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-6 pt-16 lg:pt-6">
          {/* Title */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-8 h-8 text-gray-900" />
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">GPA Calculator</h2>
            </div>
            <p className="text-gray-600 text-sm lg:text-base">
              Calculate your Grade Point Average accurately to understand your current academic standing based on your course grades and credit hours.
            </p>
          </div>

          {/* Main Calculator Card */}
         <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-2">Calculate Based On</label>
      <select 
        value={calculationType}
        onChange={(e) => setCalculationType(e.target.value)}
        className="border border-gray-900 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none text-gray-900"
      >
        <option value="semester">Semester GPA</option>
        <option value="cumulative">Cumulative GPA</option>
        <option value="quarter">Quarter GPA</option>
      </select>
    </div>
  </div>

  {/* Course Input Section */}
  <div className="space-y-4 mb-6">
    {courses.map((course, index) => (
      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">Course Name</label>
          <input
            type="text"
            value={course.course}
            onChange={(e) => updateCourse(index, 'course', e.target.value)}
            className="w-full px-3 py-2 border border-gray-900 rounded text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none text-gray-900"
            placeholder="Enter course"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">Credit Hours</label>
          <input
            type="number"
            value={course.credits || ''}
            onChange={(e) => updateCourse(index, 'credits', e.target.value)}
            className="w-full px-3 py-2 border border-gray-900 rounded text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none text-gray-900"
            placeholder="0"
            min="0"
            max="6"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">Letter Grade</label>
          <select
            value={course.grade}
            onChange={(e) => updateCourse(index, 'grade', e.target.value)}
            className="w-full px-3 py-2 border border-gray-900 rounded text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none text-gray-900"
          >
            <option value="">Select Grade</option>
            {gradeOptions.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-900 mb-1">Grade Points</label>
          <div className="px-3 py-2 bg-gray-100 border border-gray-900 rounded text-sm text-gray-900">
            {course.grade && course.credits ? 
              (gradePoints[course.grade] * course.credits).toFixed(1) : '0.0'}
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => removeCourse(index)}
            className="text-red-600 hover:text-red-800 p-2 rounded disabled:opacity-50"
            disabled={courses.length === 1}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))}
  </div>



            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={calculateGPA}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Calculate GPA
              </button>
              <button
                onClick={addCourse}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm transition-colors"
              >
                + Add Course
              </button>
              <button
                onClick={resetCalculator}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Result Display */}
           <div className="grid md:grid-cols-2 gap-6">
  <div className="bg-gray-100 border border-gray-900 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Your GPA</h3>
    <div className="text-4xl font-bold text-gray-900 mb-1">{calculatedGPA}</div>
    <div className={`text-sm font-medium ${interpretation.color}`}>
      {interpretation.text}
    </div>
  </div>
  <div className="bg-gray-50 border border-gray-900 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span className="text-gray-900">Total Credits:</span>
        <span className="font-medium text-gray-900">{totalCredits}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-900">Courses:</span>
        <span className="font-medium text-gray-900">{courses.filter(c => c.grade && c.credits > 0).length}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-900">Scale:</span>
        <span className="font-medium text-gray-900">4.0 Scale</span>
      </div>
    </div>
  </div>
  </div>
  </div>



          {/* Academic Planner */}
         <div className="bg-white rounded-lg shadow-md border border-gray-900 p-4 lg:p-6 mb-6">
  <h3 className="text-xl font-bold text-gray-900 mb-4">Academic Goal Planner</h3>
  <div className="grid md:grid-cols-2 gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">Current GPA</label>
      <input
        type="number"
        step="0.01"
        min="0"
        max="4.3"
        value={plannerData.currentGPA || ''}
        onChange={(e) => updatePlannerData('currentGPA', e.target.value)}
        className="w-full px-3 text-gray-900 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">Target GPA</label>
      <input
        type="number"
        step="0.01"
        min="0"
        max="4.3"
        value={plannerData.targetGPA || ''}
        onChange={(e) => updatePlannerData('targetGPA', e.target.value)}
        className="w-full  text-gray-900 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">Current Credits</label>
      <input
        type="number"
        min="0"
        value={plannerData.currentCredits || ''}
        onChange={(e) => updatePlannerData('currentCredits', e.target.value)}
        className="w-full text-gray-900 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-1">Additional Credits</label>
      <input
        type="number"
        min="0"
        value={plannerData.additionalCredits || ''}
        onChange={(e) => updatePlannerData('additionalCredits', e.target.value)}
        className="w-full text-gray-900 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none"
      />
    </div>
  </div>


            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={calculateRequiredGPA}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Calculate Required GPA
              </button>
              <button
                onClick={resetPlanner}
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded text-sm transition-colors"
              >
                Reset Planner
              </button>
            </div>
            
            {calculatedRequiredGPA !== '0.00' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800">Required Future GPA: {calculatedRequiredGPA}</h4>
                <p className="text-sm text-green-700 mt-1">
                  You need an average of {calculatedRequiredGPA} in your next {plannerData.additionalCredits} credits to reach your target GPA of {plannerData.targetGPA}.
                </p>
                {parseFloat(calculatedRequiredGPA) > 4.3 && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
                    <strong>Warning:</strong> Required GPA exceeds maximum possible (4.3). Consider adjusting your target or taking more credits.
                  </div>
                )}
                {parseFloat(calculatedRequiredGPA) > 4.0 && parseFloat(calculatedRequiredGPA) <= 4.3 && (
                  <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
                    <strong>Challenge:</strong> This requires mostly A+ grades. Consider a more achievable target.
                  </div>
                )}
                {parseFloat(calculatedRequiredGPA) < 0 && (
                  <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded text-blue-800 text-sm">
                    <strong>Great News:</strong> Your current GPA already exceeds your target! You can maintain any passing grade.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Grade Scale Reference */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 text-lg">Grade Scale Reference</h4>
            <div className="grid grid-cols-2 text-gray-900 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              {Object.entries(gradePoints).map(([grade, points]) => (
                <div key={grade} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium text-gray-900">{grade}</span>
                  <span className="text-gray-900">{points}</span>
                </div>
              ))}
            </div>
          </div>

          {/* GPA Quick Tips */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">GPA Quick Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Track your GPA regularly to monitor academic progress and identify areas for improvement</li>
              <li>• Focus on courses with higher credit hours as they have more impact on your overall GPA</li>
              <li>• Set realistic academic goals and use the planner to see what grades you need</li>
              <li>• Remember that consistent effort across all courses is key to maintaining a strong GPA</li>
              <li>• Seek help early if you're struggling in a course - it's easier to improve before falling behind</li>
            </ul>
          </div>

          {/* Understanding GPA */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Understanding Your GPA</h3>
            <div className="space-y-4 text-gray-700 text-sm lg:text-base">
              <p>
                Grade Point Average (GPA) is a standardized way of measuring academic achievement. It's calculated by dividing the total grade points earned by the total credit hours attempted.
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">GPA Ranges</h4>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>3.7-4.3:</strong> Excellent (A range)</li>
                  <li>• <strong>3.0-3.6:</strong> Good to Very Good (B range)</li>
                  <li>• <strong>2.0-2.9:</strong> Satisfactory (C range)</li>
                  <li>• <strong>Below 2.0:</strong> Needs Improvement</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Why GPA Matters</h4>
                <p>
                  Your GPA can affect scholarship eligibility, graduate school admissions, honor roll status, and even job opportunities. Maintaining a strong GPA opens doors for your future academic and career goals.
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

export default GPACalculator;