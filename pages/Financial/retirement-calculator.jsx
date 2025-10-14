import Head from "next/head";
import React, { useState } from 'react';
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, Clock, DollarSign, PiggyBank, Target } from 'lucide-react';

const RetirementCalculator = () => {
  const [activeTab, setActiveTab] = useState('need');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Tab 1: How much do you need to retire?
  const [currentAge, setCurrentAge] = useState(45);
  const [retirementAge, setRetirementAge] = useState(67);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentIncome, setCurrentIncome] = useState(70000);
  const [incomeNeeded, setIncomeNeeded] = useState(75);
  const [investmentReturn, setInvestmentReturn] = useState(6);
  const [inflationRate, setInflationRate] = useState(3);
  const [currentSavings, setCurrentSavings] = useState(30000);

  // Tab 2: How can you save for retirement?
  const [saveCurrentAge, setSaveCurrentAge] = useState(45);
  const [saveRetirementAge, setSaveRetirementAge] = useState(67);
  const [amountNeeded, setAmountNeeded] = useState(600000);
  const [saveCurrentSavings, setSaveCurrentSavings] = useState(30000);
  const [saveInvestmentReturn, setSaveInvestmentReturn] = useState(6);

  // Tab 3: How much can you withdraw?
  const [withdrawCurrentAge, setWithdrawCurrentAge] = useState(45);
  const [withdrawRetirementAge, setWithdrawRetirementAge] = useState(67);
  const [withdrawLifeExpectancy, setWithdrawLifeExpectancy] = useState(85);
  const [withdrawSavings, setWithdrawSavings] = useState(30000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [withdrawInvestmentReturn, setWithdrawInvestmentReturn] = useState(6);
  const [withdrawInflationRate, setWithdrawInflationRate] = useState(3);

  // Tab 4: How long can your money last?
  const [totalAmount, setTotalAmount] = useState(600000);
  const [monthlyWithdraw, setMonthlyWithdraw] = useState(5000);
  const [lastInvestmentReturn, setLastInvestmentReturn] = useState(6);

  const [results, setResults] = useState({});

  const financialTools = [
    { emoji: '🏠', name: 'Mortgage Calculator', href: '/Financial/mortgage-calculator' },
    { emoji: '💵', name: 'Loan Calculator', href: '/Financial/loan-calculator' },
    { emoji: '🚗', name: 'Auto Loan Calculator', href: '/Financial/auto-loan-calculator' },
    { emoji: '📊', name: 'Interest Calculator', href: '/Financial/interest-calculator' },
    { emoji: '💳', name: 'Payment Calculator', href: '/Financial/payment-calculator' },
    { emoji: '🐷', name: 'Retirement Calculator', href: '/Financial/retirement-calculator' },
    { emoji: '📈', name: 'Amortization Calculator', href: '/Financial/amortization-calculator' },
    { emoji: '📉', name: 'Investment Calculator', href: '/Financial/investment-calculator' },
    { emoji: '📆', name: 'Inflation Calculator', href: '/Financial/inflation-calculator' },
    { emoji: '💼', name: 'Finance Calculator', href: '/Financial/finance-calculator' },
    { emoji: '🧾', name: 'Income Tax Calculator', href: '/Financial/income-tax-calculator' },
    { emoji: '💲', name: 'Compound Interest Calculator', href: '/Financial/compound-interest-calculator' },
    { emoji: '👔', name: 'Salary Calculator', href: '/Financial/salary-calculator' },
    { emoji: '📉', name: 'Interest Rate Calculator', href: '/Financial/interest-rate-calculator' },
    { emoji: '🧾', name: 'Sales Tax Calculator', href: '/Financial/sales-tax-calculator' },
  ];

  const formatCurrency = (amount) => {
    if (!isFinite(amount) || isNaN(amount)) return '$0';
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateRetirementNeed = () => {
    const yearsToRetirement = retirementAge - currentAge;
    const yearsInRetirement = lifeExpectancy - retirementAge;
    const realReturn = (investmentReturn - inflationRate) / 100;
    
    if (yearsToRetirement <= 0 || yearsInRetirement <= 0) {
      setResults({ totalNeeded: 0, additionalNeeded: 0, monthlySavingsRequired: 0, futureIncomeNeeded: 0 });
      return;
    }

    const futureIncomeNeeded = currentIncome * (incomeNeeded / 100) * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    let totalNeeded = 0;
    if (realReturn !== 0) {
      totalNeeded = futureIncomeNeeded * ((1 - Math.pow(1 + realReturn, -yearsInRetirement)) / realReturn);
    } else {
      totalNeeded = futureIncomeNeeded * yearsInRetirement;
    }
    
    const futureCurrentSavings = currentSavings * Math.pow(1 + investmentReturn / 100, yearsToRetirement);
    const additionalNeeded = Math.max(0, totalNeeded - futureCurrentSavings);
    
    const monthlyRate = investmentReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    let monthlySavingsRequired = 0;
    
    if (monthlyRate !== 0 && additionalNeeded > 0) {
      monthlySavingsRequired = additionalNeeded / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate));
    } else if (additionalNeeded > 0) {
      monthlySavingsRequired = additionalNeeded / months;
    }

    setResults({ totalNeeded, additionalNeeded, monthlySavingsRequired, futureIncomeNeeded });
  };

  const calculateSavingsPlan = () => {
    const yearsToRetirement = saveRetirementAge - saveCurrentAge;
    if (yearsToRetirement <= 0) {
      setResults({ monthlyPayment: 0, futureCurrentSavings: 0, additionalNeeded: 0 });
      return;
    }

    const monthlyReturn = saveInvestmentReturn / 100 / 12;
    const months = yearsToRetirement * 12;
    const futureCurrentSavings = saveCurrentSavings * Math.pow(1 + saveInvestmentReturn / 100, yearsToRetirement);
    const additionalNeeded = Math.max(0, amountNeeded - futureCurrentSavings);
    
    let monthlyPayment = 0;
    if (monthlyReturn !== 0 && additionalNeeded > 0) {
      monthlyPayment = additionalNeeded / (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn));
    } else if (additionalNeeded > 0) {
      monthlyPayment = additionalNeeded / months;
    }

    setResults({ monthlyPayment, futureCurrentSavings, additionalNeeded });
  };

  const calculateWithdrawAmount = () => {
    const yearsToRetirement = withdrawRetirementAge - withdrawCurrentAge;
    const yearsInRetirement = withdrawLifeExpectancy - withdrawRetirementAge;
    
    if (yearsToRetirement <= 0 || yearsInRetirement <= 0) {
      setResults({ futureValue: 0, monthlyWithdrawal: 0 });
      return;
    }

    const realReturn = (withdrawInvestmentReturn - withdrawInflationRate) / 100;
    let futureValue = withdrawSavings * Math.pow(1 + withdrawInvestmentReturn / 100, yearsToRetirement);
    
    if (monthlyContribution > 0) {
      const monthlyReturn = withdrawInvestmentReturn / 100 / 12;
      const months = yearsToRetirement * 12;
      if (monthlyReturn !== 0) {
        const monthlyFV = monthlyContribution * (((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn));
        futureValue += monthlyFV;
      } else {
        futureValue += monthlyContribution * months;
      }
    }
    
    let monthlyWithdrawal = 0;
    const monthlyRealReturn = realReturn / 12;
    const retirementMonths = yearsInRetirement * 12;
    
    if (monthlyRealReturn !== 0) {
      monthlyWithdrawal = (futureValue * monthlyRealReturn) / (1 - Math.pow(1 + monthlyRealReturn, -retirementMonths));
    } else {
      monthlyWithdrawal = futureValue / retirementMonths;
    }

    setResults({ futureValue, monthlyWithdrawal });
  };

  const calculateMoneyDuration = () => {
    if (monthlyWithdraw <= 0 || totalAmount <= 0) {
      setResults({ months: 0 });
      return;
    }

    const monthlyReturn = lastInvestmentReturn / 100 / 12;
    
    if (monthlyReturn === 0) {
      setResults({ months: totalAmount / monthlyWithdraw });
      return;
    }
    
    if (monthlyWithdraw <= totalAmount * monthlyReturn) {
      setResults({ months: Infinity });
      return;
    }
    
    const months = -Math.log(1 - (totalAmount * monthlyReturn) / monthlyWithdraw) / Math.log(1 + monthlyReturn);
    setResults({ months: isFinite(months) && months > 0 ? months : 0 });
  };

  const clearForm = () => {
    switch (activeTab) {
      case 'need':
        setCurrentAge(0);
        setRetirementAge(0);
        setLifeExpectancy(0);
        setCurrentIncome(0);
        setIncomeNeeded(0);
        setInvestmentReturn(0);
        setInflationRate(0);
        setCurrentSavings(0);
        break;
      case 'save':
        setSaveCurrentAge(0);
        setSaveRetirementAge(0);
        setAmountNeeded(0);
        setSaveCurrentSavings(0);
        setSaveInvestmentReturn(0);
        break;
      case 'withdraw':
        setWithdrawCurrentAge(0);
        setWithdrawRetirementAge(0);
        setWithdrawLifeExpectancy(0);
        setWithdrawSavings(0);
        setMonthlyContribution(0);
        setWithdrawInvestmentReturn(0);
        setWithdrawInflationRate(0);
        break;
      case 'duration':
        setTotalAmount(0);
        setMonthlyWithdraw(0);
        setLastInvestmentReturn(0);
        break;
    }
    setResults({});
  };

  return (
    <>
      <Head>
        <title>Retirement Calculator | Free Retirement Planning Tool</title>
        <meta
          name="description"
          content="Use our free Retirement Calculator to estimate your savings, monthly income, and future goals. Plan your retirement smartly with accurate results today."
        />
        <meta name="keywords" content="Retirement Calculator, Online Retirement Calculator, Retirement Planning Calculator, Pension Calculator, Retirement Savings Calculator, Retirement Income Calculator, Future Value Calculator, Retirement Fund Calculator, Free Retirement Calculator, Retirement Estimator." />
      </Head>
      
      <div className="min-h-screen bg-gray-100">
        <Header/>

        <div className="flex mt-14">
          {/* Sidebar */}
          <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
            <div className="bg-gray-900 text-white p-3">
              <h3 className="font-bold">Financial Tools</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                {financialTools.map((tool, index) => (
                  <a key={index} href={tool.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-2 p-2 rounded transition-colors ${
                      tool.name === 'Retirement Calculator' 
                        ? 'bg-gray-200 text-gray-900 font-semibold' 
                        : 'text-gray-900 hover:bg-gray-100'
                    }`}>
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
              <div className="bg-white rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="bg-gray-900 text-white p-4 md:p-6 rounded-t-lg">
                  <h1 className="text-xl md:text-2xl font-bold mb-2">Retirement Calculator</h1>
                  <p className="text-gray-100 text-xs md:text-sm">
                    A Retirement Calculator is a tool that helps estimate the amount of savings needed and the future retirement corpus based on current age, retirement age, income, expenses, and expected returns.
                  </p>
                </div>

                {/* Tab Navigation */}
                <div className="p-4 md:p-6 border-b">
                  <div className="flex flex-wrap gap-2">
                    <button className={`px-3 md:px-4 py-2 rounded font-medium text-xs md:text-sm transition-colors ${activeTab === 'need' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={() => setActiveTab('need')}>
                      How much do you need?
                    </button>
                    <button className={`px-3 md:px-4 py-2 rounded font-medium text-xs md:text-sm transition-colors ${activeTab === 'save' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={() => setActiveTab('save')}>
                      How to save?
                    </button>
                    <button className={`px-3 md:px-4 py-2 rounded font-medium text-xs md:text-sm transition-colors ${activeTab === 'withdraw' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={() => setActiveTab('withdraw')}>
                      How much withdraw?
                    </button>
                    <button className={`px-3 md:px-4 py-2 rounded font-medium text-xs md:text-sm transition-colors ${activeTab === 'duration' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                      onClick={() => setActiveTab('duration')}>
                      How long lasts?
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 md:p-6">
                  {activeTab === 'need' && (
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">How Much Do You Need to Retire?</h2>
                        <p className="text-gray-700 text-xs md:text-sm">
                          Calculate how much you need to save for retirement based on your current situation and retirement goals.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-gray-50 p-4 md:p-6 rounded-lg space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Your current age</label>
                            <input type="number" value={currentAge}
                              onChange={(e) => setCurrentAge(Number(e.target.value) || 0)}
                              className="w-full text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900"
                              min="18" max="100"/>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Your planned retirement age</label>
                            <input type="number" value={retirementAge}
                              onChange={(e) => setRetirementAge(Number(e.target.value) || 0)}
                              className="w-full text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900"
                              min="50" max="100"/>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Your life expectancy</label>
                            <input type="number" value={lifeExpectancy}
                              onChange={(e) => setLifeExpectancy(Number(e.target.value) || 0)}
                              className="w-full text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900"
                              min="60" max="120"/>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Your current pre-tax income</label>
                            <div className="flex items-center gap-2">
                              <input type="number" value={currentIncome}
                                onChange={(e) => setCurrentIncome(Number(e.target.value) || 0)}
                                className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900"
                                min="0"/>
                              <span className="text-xs Your text-gray-900">/year</span>
                            </div>
                          </div>

                          <div className="bg-gray-900 text-white px-4 py-2 rounded-t-lg mt-6">
                            <h3 className="font-semibold text-sm">Assumptions</h3>
                          </div>
                          <div className="border border-gray-300 border-t-0 p-4 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-xs">Income needed after retirement</label>
                              <div className="flex items-center gap-2">
                                <input type="number" value={incomeNeeded}
                                  onChange={(e) => setIncomeNeeded(Number(e.target.value) || 0)}
                                  className="w-20 text-gray-900 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                                  min="0" max="150"/>
                                <span className="text-xs text-gray-900">% of current</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-xs">Average investment return</label>
                              <div className="flex items-center gap-2">
                                <input type="number" step="0.1" value={investmentReturn}
                                  onChange={(e) => setInvestmentReturn(Number(e.target.value) || 0)}
                                  className="w-20 text-gray-900 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                                  min="0" max="20"/>
                                <span className="text-xs text-gray-900">%/year</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-xs">Inflation rate</label>
                              <div className="flex items-center gap-2">
                                <input type="number" step="0.1" value={inflationRate}
                                  onChange={(e) => setInflationRate(Number(e.target.value) || 0)}
                                  className="w-20 text-gray-900 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                                  min="0" max="15"/>
                                <span className="text-xs text-gray-900">%/year</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-xs">Your current retirement savings</label>
                              <div className="flex items-center gap-2">
                                <input type="number" value={currentSavings}
                                  onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                                  className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 text-sm"
                                  min="0"/>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            <button onClick={calculateRetirementNeed}
                              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded font-medium transition-colors text-sm">
                              Calculate
                            </button>
                            <button onClick={clearForm}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded font-medium transition-colors text-sm">
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Results Panel */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl shadow-lg border border-blue-200">
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 rounded-full flex items-center justify-center">
                              <Target className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-gray-900">Retirement Analysis</h3>
                          </div>
                          {results.totalNeeded !== undefined ? (
                            <div className="space-y-4">
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                  <span className="font-medium text-gray-700 text-xs md:text-sm">Monthly savings required:</span>
                                  <span className="font-bold text-blue-600 text-base md:text-lg">{formatCurrency(results.monthlySavingsRequired || 0)}</span>
                                </div>
                              </div>
                              <div className="mt-6 bg-white p-3 md:p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2 text-xs md:text-sm">
                                  <Clock className="w-4 h-4" />
                                  <span>Timeline Summary</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                                  <div>Years to retirement: <span className="font-semibold">{Math.max(0, retirementAge - currentAge)}</span></div>
                                  <div>Years in retirement: <span className="font-semibold">{Math.max(0, lifeExpectancy - retirementAge)}</span></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Calculator className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 text-xs md:text-sm">Click "Calculate" to see your retirement analysis</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'save' && (
                    <div className="space-y-6 md:space-y-8">
                      <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full mb-4">
                          <PiggyBank className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-green-700 mb-2">How Can You Save for Retirement?</h2>
                        <p className="text-gray-600 text-xs md:text-sm max-w-2xl mx-auto">
                          This calculation presents potential savings plans based on desired savings at retirement.
                        </p>
                      </div>

                      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl shadow-sm">
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-sm">Your age now</label>
                              <input type="number" value={saveCurrentAge}
                                onChange={(e) => setSaveCurrentAge(Number(e.target.value) || 0)}
                                className="w-full text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-green-500"
                                min="18" max="100"/>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-sm">Your planned retirement age</label>
                              <input type="number" value={saveRetirementAge}
                                onChange={(e) => setSaveRetirementAge(Number(e.target.value) || 0)}
                                className="w-full text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-green-500"
                                min="50" max="100"/>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-sm">Amount needed at retirement</label>
                              <div className="flex items-center gap-2">
                                <input type="number" value={amountNeeded}
                                  onChange={(e) => setAmountNeeded(Number(e.target.value) || 0)}
                                  className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-green-500"
                                  min="0"/>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-sm">Your retirement savings now</label>
                              <div className="flex items-center gap-2">
                                <input type="number" value={saveCurrentSavings}
                                  onChange={(e) => setSaveCurrentSavings(Number(e.target.value) || 0)}
                                  className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-green-500"
                                  min="0"/>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <label className="font-medium text-gray-700 text-sm">Average investment return</label>
                              <div className="flex items-center gap-2">
                                <input type="number" step="0.1" value={saveInvestmentReturn}
                                  onChange={(e) => setSaveInvestmentReturn(Number(e.target.value) || 0)}
                                  className="w-20  text-gray-900 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-green-500"
                                  min="0" max="20"/>
                                <span className="text-xs text-gray-900">%/year</span>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-6">
                              <button onClick={calculateSavingsPlan}
                                className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg text-sm flex items-center justify-center space-x-2">
                                <Calculator className="w-4 h-4" />
                                <span>Calculate</span>
                              </button>
                              <button onClick={clearForm}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg text-sm">
                                Clear
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl shadow-lg border border-green-200">
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-full flex items-center justify-center">
                              <PiggyBank className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-green-800">Savings Plan</h3>
                          </div>
                          {results.monthlyPayment !== undefined ? (
                            <div className="space-y-4">
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                  <span className="font-medium text-gray-700 text-xs md:text-sm">Monthly payment needed:</span>
                                  <span className="font-bold text-green-600 text-base md:text-lg">{formatCurrency(results.monthlyPayment || 0)}</span>
                                </div>
                              </div>
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                  <span className="font-medium text-gray-700 text-xs md:text-sm">Future value of savings:</span>
                                  <span className="font-bold text-blue-600 text-base md:text-lg">{formatCurrency(results.futureCurrentSavings || 0)}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <PiggyBank className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 text-xs md:text-sm">Click "Calculate" to see your savings plan</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'withdraw' && (
                    <div className="space-y-6 md:space-y-8">
                      <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full mb-4">
                          <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-2">How Much Can You Withdraw?</h2>
                        <p className="text-gray-600 text-xs md:text-sm max-w-2xl mx-auto">
                          Calculate your potential monthly withdrawal amount based on your savings and contributions.
                        </p>
                      </div>

                      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl shadow-sm space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Current age</label>
                            <input type="number" value={withdrawCurrentAge}
                              onChange={(e) => setWithdrawCurrentAge(Number(e.target.value) || 0)}
                              className="w-full text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                              min="18" max="100"/>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Retirement age</label>
                            <input type="number" value={withdrawRetirementAge}
                              onChange={(e) => setWithdrawRetirementAge(Number(e.target.value) || 0)}
                              className="w-full  text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                              min="50" max="100"/>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Life expectancy</label>
                            <input type="number" value={withdrawLifeExpectancy}
                              onChange={(e) => setWithdrawLifeExpectancy(Number(e.target.value) || 0)}
                              className="w-full text-gray-900 sm:w-24 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                              min="60" max="120"/>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Current savings</label>
                            <div className="flex items-center gap-2">
                              <input type="number" value={withdrawSavings}
                                onChange={(e) => setWithdrawSavings(Number(e.target.value) || 0)}
                                className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="0"/>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Monthly contribution</label>
                            <div className="flex items-center gap-2">
                              <input type="number" value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Number(e.target.value) || 0)}
                                className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="0"/>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Investment return</label>
                            <div className="flex items-center gap-2">
                              <input type="number" step="0.1" value={withdrawInvestmentReturn}
                                onChange={(e) => setWithdrawInvestmentReturn(Number(e.target.value) || 0)}
                                className="w-20  text-gray-900 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="0" max="20"/>
                              <span className="text-xs text-gray-900">%/year</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Inflation rate</label>
                            <div className="flex items-center gap-2">
                              <input type="number" step="0.1" value={withdrawInflationRate}
                                onChange={(e) => setWithdrawInflationRate(Number(e.target.value) || 0)}
                                className="w-20  text-gray-900 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500"
                                min="0" max="15"/>
                              <span className="text-xs text-gray-900 ">%/year</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            <button onClick={calculateWithdrawAmount}
                              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg text-sm flex items-center justify-center space-x-2">
                              <Calculator className="w-4 h-4" />
                              <span>Calculate</span>
                            </button>
                            <button onClick={clearForm}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg text-sm">
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl shadow-lg border border-blue-200">
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center">
                             
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-blue-800">Withdrawal Analysis</h3>
                          </div>
                          {results.futureValue !== undefined ? (
                            <div className="space-y-4">
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                  <span className="font-medium text-gray-700 text-xs md:text-sm">Total at retirement:</span>
                                  <span className="font-bold text-blue-600 text-base md:text-lg">{formatCurrency(results.futureValue || 0)}</span>
                                </div>
                              </div>
                              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                  <span className="font-medium text-gray-700 text-xs md:text-sm">Monthly withdrawal:</span>
                                  <span className="font-bold text-green-600 text-base md:text-lg">{formatCurrency(results.monthlyWithdrawal || 0)}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <DollarSign className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 text-xs md:text-sm">Click "Calculate" to see results</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'duration' && (
                    <div className="space-y-6 md:space-y-8">
                      <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full mb-4">
                          <Clock className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-2">How Long Can Your Money Last?</h2>
                        <p className="text-gray-600 text-xs md:text-sm max-w-2xl mx-auto">
                          Calculate how long your retirement savings will last.
                        </p>
                      </div>

                      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-xl shadow-sm space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Total amount saved</label>
                            <div className="flex items-center gap-2">
                              <input type="number" value={totalAmount}
                                onChange={(e) => setTotalAmount(Number(e.target.value) || 0)}
                                className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500"
                                min="0"/>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Monthly withdrawal</label>
                            <div className="flex items-center gap-2">
                              <input type="number" value={monthlyWithdraw}
                                onChange={(e) => setMonthlyWithdraw(Number(e.target.value) || 0)}
                                className="w-full text-gray-900 sm:w-32 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500"
                                min="0"/>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <label className="font-medium text-gray-700 text-sm">Investment return</label>
                            <div className="flex items-center gap-2">
                              <input type="number" step="0.1" value={lastInvestmentReturn}
                                onChange={(e) => setLastInvestmentReturn(Number(e.target.value) || 0)}
                                className="w-20  text-gray-900 px-3 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500"
                                min="0" max="20"/>
                              <span className="text-xs text-gray-900">%/year</span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 mt-6">
                            <button onClick={calculateMoneyDuration}
                              className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg text-sm flex items-center justify-center space-x-2">
                              <Calculator className="w-4 h-4" />
                              <span>Calculate</span>
                            </button>
                            <button onClick={clearForm}
                              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg text-sm">
                              Clear
                            </button>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-xl shadow-lg border border-purple-200">
                          <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-full flex items-center justify-center">
                              <Clock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <h3 className="text-base md:text-xl font-bold text-purple-800">Duration Analysis</h3>
                          </div>
                          {results.months !== undefined ? (
                            <div className="space-y-4">
                              {results.months === Infinity ? (
                                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border-l-4 border-green-500 text-center">
                                  <div className="text-3xl md:text-4xl mb-2">∞</div>
                                  <div className="font-bold text-green-600 text-base md:text-lg">Money lasts indefinitely!</div>
                                  <p className="text-xs md:text-sm text-gray-600 mt-2">Returns exceed withdrawals</p>
                                </div>
                              ) : (
                                <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                                  <div className="text-center">
                                    <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2">
                                      {Math.floor(results.months / 12)} years, {Math.round(results.months % 12)} months
                                    </div>
                                    <div className="text-gray-600 text-xs md:text-sm">Total: {Math.round(results.months)} months</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Clock className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-500 text-xs md:text-sm">Click "Calculate" to see results</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
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

export default RetirementCalculator;