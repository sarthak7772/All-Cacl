import Head from "next/head";
import React, { useState, useEffect } from "react";
import Header from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Calculator, Home } from "lucide-react";

const LoanCalculator = () => {
  const [calculatorType, setCalculatorType] = useState("amortized");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Amortized Loan State
  const [loanAmount, setLoanAmount] = useState(100000);
  const [loanTermYears, setLoanTermYears] = useState(10);
  const [loanTermMonths, setLoanTermMonths] = useState(0);
  const [interestRate, setInterestRate] = useState(6);
  const [compoundFrequency, setCompoundFrequency] = useState("monthly");
  const [paybackFrequency, setPaybackFrequency] = useState("monthly");
  const [currency, setCurrency] = useState("USD");

  // Deferred Payment Loan State
  const [deferredLoanAmount, setDeferredLoanAmount] = useState(100000);
  const [deferredTermYears, setDeferredTermYears] = useState(10);
  const [deferredTermMonths, setDeferredTermMonths] = useState(0);
  const [deferredInterestRate, setDeferredInterestRate] = useState(6);
  const [deferredCompound, setDeferredCompound] = useState("annually");

  // Bond Calculator State
  const [predeterminedAmount, setPredeterminedAmount] = useState(100000);
  const [bondTermYears, setBondTermYears] = useState(10);
  const [bondTermMonths, setBondTermMonths] = useState(0);
  const [bondInterestRate, setBondInterestRate] = useState(6);
  const [bondCompound, setBondCompound] = useState("annually");

  // Results State
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amountDueAtMaturity, setAmountDueAtMaturity] = useState(0);
  const [amountReceived, setAmountReceived] = useState(0);

  // Amortization Table State
  const [showAmortTable, setShowAmortTable] = useState(false);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  const financialTools = [
    { emoji: "🏠", name: "Mortgage Calculator", href: "/Financial/mortgage-calculator" },
    { emoji: "💵", name: "Loan Calculator", href: "/Financial/loan-calculator" },
    { emoji: "🚗", name: "Auto Loan Calculator", href: "/Financial/auto-loan-calculator" },
    { emoji: "📊", name: "Interest Calculator", href: "/Financial/interest-calculator" },
    { emoji: "💳", name: "Payment Calculator", href: "/Financial/payment-calculator" },
    { emoji: "🐷", name: "Retirement Calculator", href: "/Financial/retirement-calculator" },
    { emoji: "📈", name: "Amortization Calculator", href: "/Financial/amortization-calculator" },
    { emoji: "📉", name: "Investment Calculator", href: "/Financial/investment-calculator" },
    { emoji: '📆', name: 'Inflation Calculator', href: '/Financial/inflation-calculator' },
    { emoji: '💼', name: 'Finance Calculator', href: '/Financial/finance-calculator' },
    { emoji: '🧾', name: 'Income Tax Calculator', href: '/Financial/income-tax-calculator' },
    { emoji: '💲', name: 'Compound Interest Calculator', href: '/Financial/compound-interest-calculator' },
    { emoji: '👔', name: 'Salary Calculator', href: '/Financial/salary-calculator' },
    { emoji: '📉', name: 'Interest Rate Calculator', href: '/Financial/interest-rate-calculator' },
    { emoji: '🧾', name: 'Sales Tax Calculator', href: '/Financial/sales-tax-calculator' },
    { emoji: '🧾', name: 'Sales Tax Calculator', href: '/Financial/sales-tax-calculator' },
  ];
   
 

const compoundOptions = [
  { value: "monthly", label: "Monthly (APR)", frequency: 12 },
  { value: "quarterly", label: "Quarterly", frequency: 4 },
  { value: "semiannually", label: "Semi-annually", frequency: 2 },
  { value: "annually", label: "Annually", frequency: 1 },
];


  const paybackOptions = [
    { value: "monthly", label: "Every Month" },
    { value: "quarterly", label: "Every Quarter" },
    { value: "semiannually", label: "Every Six Months" },
    { value: "annually", label: "Every Year" },
  ];

  useEffect(() => {
    async function detectCurrency() {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const geoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const geoData = await geoRes.json();
            const countryCode = geoData.address?.country_code?.toUpperCase();

            if (!countryCode) {
              setCurrency("USD");
              return;
            }

            const countryRes = await fetch(
              `https://restcountries.com/v3.1/alpha/${countryCode}`
            );
            const countryData = await countryRes.json();
            const currencies = countryData[0]?.currencies;
            const currencyCode = currencies ? Object.keys(currencies)[0] : "USD";
            setCurrency(currencyCode);
          } catch (error) {
            setCurrency("USD");
          }
        },
        () => setCurrency("USD")
      );
    }

    detectCurrency();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const generateAmortizationSchedule = (principal, payment, rate, numPayments) => {
    const schedule = [];
    let balance = principal;

    for (let i = 1; i <= numPayments; i++) {
      const interestPayment = balance * rate;
      const principalPayment = payment - interestPayment;
      balance -= principalPayment;

      if (i === numPayments && balance < 0) balance = 0;

      schedule.push({
        payment: i,
        paymentAmount: payment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    setAmortizationSchedule(schedule);
  };

  const calculateAmortizedLoan = () => {
    const principal = loanAmount;
    const compoundFreq = compoundOptions.find((opt) => opt.value === compoundFrequency)?.frequency || 12;
    const paybackFreqMap = { monthly: 12, quarterly: 4, semiannually: 2, annually: 1 };
    const paybackFreq = paybackFreqMap[paybackFrequency] || 12;

    const ratePerCompound = interestRate / 100 / compoundFreq;
    const compoundsPerPayment = compoundFreq / paybackFreq;
    const effectiveRate = Math.pow(1 + ratePerCompound, compoundsPerPayment) - 1;

    const totalPaymentsCount = (loanTermYears * 12 + loanTermMonths) / (12 / paybackFreq);

    if (effectiveRate === 0) {
      const payment = principal / totalPaymentsCount;
      setMonthlyPayment(payment);
      setTotalPayments(payment * totalPaymentsCount);
      setTotalInterest(0);
      generateAmortizationSchedule(principal, payment, 0, totalPaymentsCount);
      return;
    }

    const payment =
      (principal * (effectiveRate * Math.pow(1 + effectiveRate, totalPaymentsCount))) /
      (Math.pow(1 + effectiveRate, totalPaymentsCount) - 1);

    setMonthlyPayment(payment);
    setTotalPayments(payment * totalPaymentsCount);
    setTotalInterest(payment * totalPaymentsCount - principal);
    generateAmortizationSchedule(principal, payment, effectiveRate, totalPaymentsCount);
  };

  const calculateDeferredLoan = () => {
    const principal = deferredLoanAmount;
    const totalYears = deferredTermYears + deferredTermMonths / 12;
    const rate = deferredInterestRate / 100;
    const compoundFreq = compoundOptions.find((opt) => opt.value === deferredCompound)?.frequency || 1;

    const amount = principal * Math.pow(1 + rate / compoundFreq, compoundFreq * totalYears);
    const interest = amount - principal;

    setAmountDueAtMaturity(amount);
    setTotalInterest(interest);
  };

  const calculateBond = () => {
    const futureValue = predeterminedAmount;
    const totalYears = bondTermYears + bondTermMonths / 12;
    const rate = bondInterestRate / 100;
    const compoundFreq = compoundOptions.find((opt) => opt.value === bondCompound)?.frequency || 1;

    const presentValue = futureValue / Math.pow(1 + rate / compoundFreq, compoundFreq * totalYears);
    const interest = futureValue - presentValue;

    setAmountReceived(presentValue);
    setTotalInterest(interest);
  };

  const clearForm = () => {
    if (calculatorType === "amortized") {
      setLoanAmount(0);
      setLoanTermYears(0);
      setLoanTermMonths(0);
      setInterestRate(0);
      setMonthlyPayment(0);
      setTotalPayments(0);
      setTotalInterest(0);
      setShowAmortTable(false);
      setAmortizationSchedule([]);
    } else if (calculatorType === "deferred") {
      setDeferredLoanAmount(0);
      setDeferredTermYears(0);
      setDeferredTermMonths(0);
      setDeferredInterestRate(0);
      setAmountDueAtMaturity(0);
      setTotalInterest(0);
    } else if (calculatorType === "bond") {
      setPredeterminedAmount(0);
      setBondTermYears(0);
      setBondTermMonths(0);
      setBondInterestRate(0);
      setAmountReceived(0);
      setTotalInterest(0);
    }
  };

  const calculate = () => {
    if (calculatorType === "amortized") calculateAmortizedLoan();
    else if (calculatorType === "deferred") calculateDeferredLoan();
    else if (calculatorType === "bond") calculateBond();
  };

  const PieChart = ({ principalPercent, interestPercent }) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const principalLength = (principalPercent / 100) * circumference;
    const interestLength = (interestPercent / 100) * circumference;

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="10" />
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#2563eb" strokeWidth="10"
            strokeDasharray={`${principalLength} ${circumference}`} strokeDashoffset="0" />
          <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#84cc16" strokeWidth="10"
            strokeDasharray={`${interestLength} ${circumference}`} strokeDashoffset={-principalLength} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-bold text-blue-600">{Math.round(principalPercent)}%</div>
            <div className="text-xs font-bold text-lime-500">{Math.round(interestPercent)}%</div>
          </div>
        </div>
        <div className="mt-2 flex justify-center space-x-4 text-xs">
          <div className="flex items-center"><div className="w-3 h-3 bg-blue-600 rounded mr-1"></div><span>Principal</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-lime-500 rounded mr-1"></div><span>Interest</span></div>
        </div>
      </div>
    );
  };

  const renderAmortizedCalculator = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 ">
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <div className="space-y-5">
          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Loan Amount</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Loan Term</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={loanTermYears}
                onChange={(e) => setLoanTermYears(Number(e.target.value))}
                className="w-24 p-2 text-gray-900 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-900">years</span>
              <input
                type="number"
                value={loanTermMonths}
                onChange={(e) => setLoanTermMonths(Number(e.target.value))}
                className="w-24 p-2 text-gray-900 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                max="11"
              />
              <span className="text-sm text-gray-900">months</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full p-2 text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              step="0.1"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Compound Frequency</label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value)}
              className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {compoundOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Payment Frequency</label>
            <select
              value={paybackFrequency}
              onChange={(e) => setPaybackFrequency(e.target.value)}
              className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {paybackOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={calculate}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded font-medium hover:bg-green-700 transition-colors"
            >
              Calculate
            </button>
            <button
              onClick={clearForm}
              className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg">
        <h3 className="text-base md:text-lg font-bold mb-6">Results</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Payment {paybackFrequency === "monthly" ? "Every Month" : paybackFrequency === "quarterly" ? "Every Quarter" : paybackFrequency === "semiannually" ? "Every Six Months" : "Every Year"}</span>
            <span className="font-bold text-lg">{formatCurrency(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Payments</span>
            <span className="font-bold">{formatCurrency(totalPayments)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Interest</span>
            <span className="font-bold">{formatCurrency(totalInterest)}</span>
          </div>
        </div>
        <div className="mt-6">
          <PieChart
            principalPercent={totalPayments > 0 ? (loanAmount / totalPayments) * 100 : 50}
            interestPercent={totalPayments > 0 ? (totalInterest / totalPayments) * 100 : 50}
          />
        </div>
        <div className="mt-4 text-center">
          <button
            className="text-white underline hover:no-underline transition-colors"
            onClick={() => setShowAmortTable(!showAmortTable)}
          >
            {showAmortTable ? "Hide" : "View"} Amortization Table
          </button>
        </div>
        {showAmortTable && amortizationSchedule.length > 0 && (
          <div className="mt-4 bg-white text-gray-800 rounded p-4 max-h-96 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-right">Payment</th>
                  <th className="p-2 text-right">Principal</th>
                  <th className="p-2 text-right">Interest</th>
                  <th className="p-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {amortizationSchedule.map((row) => (
                  <tr key={row.payment} className="border-b border-gray-200">
                    <td className="p-2">{row.payment}</td>
                    <td className="p-2 text-right">{formatCurrency(row.paymentAmount)}</td>
                    <td className="p-2 text-right">{formatCurrency(row.principal)}</td>
                    <td className="p-2 text-right">{formatCurrency(row.interest)}</td>
                    <td className="p-2 text-right">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderDeferredCalculator = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <div className="space-y-5">
          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Loan Amount</label>
            <input
              type="number"
              value={deferredLoanAmount}
              onChange={(e) => setDeferredLoanAmount(Number(e.target.value))}
              className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Loan Term</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={deferredTermYears}
                onChange={(e) => setDeferredTermYears(Number(e.target.value))}
                className="w-24 p-2 text-gray-900 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-900">years</span>
              <input
                type="number"
                value={deferredTermMonths}
                onChange={(e) => setDeferredTermMonths(Number(e.target.value))}
                className="w-24 p-2 text-gray-900 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                max="11"
              />
              <span className="text-sm text-gray-900">months</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Interest Rate (%)</label>
            <input
              type="number"
              value={deferredInterestRate}
              onChange={(e) => setDeferredInterestRate(Number(e.target.value))}
              className="w-full p-2 text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              step="0.1"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Compound Frequency</label>
            <select
              value={deferredCompound}
              onChange={(e) => setDeferredCompound(e.target.value)}
              className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {compoundOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={calculate}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded font-medium hover:bg-green-700 transition-colors"
            >
              Calculate
            </button>
            <button
              onClick={clearForm}
              className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg">
        <h3 className="text-base md:text-lg font-bold mb-6">Results</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Amount Due at Maturity</span>
            <span className="font-bold text-lg">{formatCurrency(amountDueAtMaturity)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Interest</span>
            <span className="font-bold">{formatCurrency(totalInterest)}</span>
          </div>
        </div>
        <div className="mt-6">
          <PieChart
            principalPercent={amountDueAtMaturity > 0 ? (deferredLoanAmount / amountDueAtMaturity) * 100 : 50}
            interestPercent={amountDueAtMaturity > 0 ? (totalInterest / amountDueAtMaturity) * 100 : 50}
          />
        </div>
      </div>
    </div>
  );

  const renderBondCalculator = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
        <div className="space-y-5">
          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Predetermined Due Amount</label>
            <input
              type="number"
              value={predeterminedAmount}
              onChange={(e) => setPredeterminedAmount(Number(e.target.value))}
              className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Loan Term</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={bondTermYears}
                onChange={(e) => setBondTermYears(Number(e.target.value))}
                className="w-24 p-2 text-gray-900 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-900">years</span>
              <input
                type="number"
                value={bondTermMonths}
                onChange={(e) => setBondTermMonths(Number(e.target.value))}
                className="w-24 p-2 text-gray-900 border border-gray-300 rounded text-center focus:ring-2 focus:ring-red-500 focus:border-transparent"
                max="11"
              />
              <span className="text-sm text-gray-900">months</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Interest Rate (%)</label>
            <input
              type="number"
              value={bondInterestRate}
              onChange={(e) => setBondInterestRate(Number(e.target.value))}
              className="w-full p-2 text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
              step="0.1"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 text-sm mb-2">Compound Frequency</label>
            <select
              value={bondCompound}
              onChange={(e) => setBondCompound(e.target.value)}
              className="w-full text-gray-900 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              {compoundOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <button
              onClick={calculate}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded font-medium hover:bg-green-700 transition-colors"
            >
              Calculate
            </button>
            <button
              onClick={clearForm}
              className="px-6 py-3 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg">
        <h3 className="text-base md:text-lg font-bold mb-6">Results</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Amount Received</span>
            <span className="font-bold text-lg">{formatCurrency(amountReceived.toFixed(2))}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Interest</span>
            <span className="font-bold">{formatCurrency(totalInterest.toFixed(2))}</span>
          </div>
        </div>
        <div className="mt-6">
          <PieChart
            principalPercent={predeterminedAmount > 0 ? (amountReceived / predeterminedAmount) * 100 : 50}
            interestPercent={predeterminedAmount > 0 ? (totalInterest / predeterminedAmount) * 100 : 50}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Loan Calculator | Free Online Loan Payment Calculator</title>
        <meta name="description" content="Use our free Loan Calculator to quickly estimate monthly payments, interest rates, and total repayment." />
        <meta name="keywords" content="Loan Calculator, Personal Loan Calculator, Loan Payment Calculator" />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <Header />

        <div className="flex mt-14">
          <div className={`fixed top-14 left-0 h-screen w-64 bg-white shadow-lg overflow-y-auto border-r border-gray-200 z-40 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
            <div className="bg-gray-900 text-white p-3">
              <h3 className="font-bold">Financial Tools</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2 text-sm">
                {financialTools.map((tool, index) => (
                  <a
                    key={index}
                    href={tool.href}
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors"
                  >
                    <span>{tool.emoji}</span>
                    <span>{tool.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:ml-64 p-4 md:p-6 pb-20 -mt-15">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="bg-gray-900 text-white p-4 md:p-6 rounded-t-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="w-6 h-6 md:w-8 md:h-8" />
                    <h1 className="text-xl md:text-2xl font-bold">Loan Calculator</h1>
                  </div>
                  <p className="text-red-100 text-xs md:text-sm mb-4">
                    A loan is a contract between a borrower and a lender in which the borrower receives an amount of money that they are obligated to pay back in the future.
                  </p>
                  <ul className="list-disc list-inside text-xs md:text-sm text-red-100 space-y-2">
                    <li><strong>Amortized Loan:</strong> Fixed payments paid periodically until loan maturity</li>
                    <li><strong>Deferred Payment Loan:</strong> Single lump sum paid at loan maturity</li>
                    <li><strong>Bond:</strong> Predetermined lump sum paid at loan maturity</li>
                  </ul>
                </div>

                <div className="p-4 md:p-6 border-b">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <button
                      onClick={() => setCalculatorType("amortized")}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded font-medium transition-colors text-sm md:text-base ${
                        calculatorType === "amortized"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Amortized Loan
                    </button>
                    <button
                      onClick={() => setCalculatorType("deferred")}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded font-medium transition-colors text-sm md:text-base ${
                        calculatorType === "deferred"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Deferred Payment
                    </button>
                    <button
                      onClick={() => setCalculatorType("bond")}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded font-medium transition-colors text-sm md:text-base ${
                        calculatorType === "bond"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Bond
                    </button>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  {calculatorType === "amortized" && (
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Amortized Loan</h2>
                      <p className="text-gray-700 text-xs md:text-sm mb-6">Fixed periodic payments until loan maturity</p>
                      {renderAmortizedCalculator()}
                    </div>
                  )}

                  {calculatorType === "deferred" && (
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Deferred Payment Loan</h2>
                      <p className="text-gray-700 text-xs md:text-sm mb-6">Single lump sum paid at the end</p>
                      {renderDeferredCalculator()}
                    </div>
                  )}

                  {calculatorType === "bond" && (
                    <div>
                      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Bond Calculator</h2>
                      <p className="text-gray-700 text-xs md:text-sm mb-6">Predetermined amount at loan maturity</p>
                      {renderBondCalculator()}
                    </div>
                  )}

                  <div className="mt-6 md:mt-8 bg-gray-900 p-4 md:p-6 rounded-lg">
                    <h3 className="text-base md:text-lg font-semibold text-white mb-4">Loan Information</h3>
                    <ul className="space-y-2 text-xs md:text-sm text-gray-300">
                      <li>• Interest rate is the percentage of a loan paid by borrowers to lenders</li>
                      <li>• Loan term affects both monthly payments and total interest paid</li>
                      <li>• Compound frequency determines how often interest is calculated</li>
                      <li>• Secured loans typically offer lower interest rates than unsecured loans</li>
                    </ul>
                  </div>

                  <div className="mt-6 bg-gray-900 text-white p-4 md:p-6 rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm md:text-base">Accuracy & Limitations</h3>
                    <p className="text-xs md:text-sm text-red-100">
                      Loan calculations are based on standard mathematical
                      formulas. Actual loan terms may include additional fees,
                      insurance requirements, or other conditions that affect
                      the total cost of borrowing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Understanding Different Loan Types</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Secured vs Unsecured Loans</h3>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Secured Loans</h4>
                        <p className="text-xs md:text-sm text-gray-900 mb-3">Borrower puts up an asset as collateral.</p>
                        <ul className="text-xs text-gray-900 space-y-1">
                          <li>• Lower interest rates</li>
                          <li>• Higher borrowing limits</li>
                          <li>• Risk of asset seizure if defaulted</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Unsecured Loans</h4>
                        <p className="text-xs md:text-sm text-gray-900 mb-3">No collateral involved.</p>
                        <ul className="text-xs text-gray-900 space-y-1">
                          <li>• Higher interest rates</li>
                          <li>• Lower borrowing limits</li>
                          <li>• No collateral at risk</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">Key Loan Terms</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-xs md:text-sm text-gray-900">
                      <div className="space-y-2">
                        <p><strong>Interest Rate:</strong> The percentage charged on the loan</p>
                        <p><strong>Principal:</strong> The original loan amount borrowed</p>
                      </div>
                      <div className="space-y-2 text-gray-900">
                        <p><strong>Term:</strong> The length of time to repay the loan</p>
                        <p><strong>Amortization:</strong> Process of paying off debt over time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h3 className="text-base md:text-lg text-gray-900 font-semibold mb-4">
                  Using Loan Calculators Effectively
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center bg-green-50 rounded-lg p-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl md:text-2xl">💰</span>
                    </div>
                    <h4 className="font-semibold text-green-700 text-sm md:text-base">
                      Budget Planning
                    </h4>
                    <p className="text-xs text-gray-600 mt-2">
                      Determine affordable monthly payments before applying for
                      loans.
                    </p>
                  </div>

                  <div className="text-center bg-blue-50 rounded-lg p-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl md:text-2xl">📊</span>
                    </div>
                    <h4 className="font-semibold text-blue-700 text-sm md:text-base">
                      Loan Comparison
                    </h4>
                    <p className="text-xs text-gray-600 mt-2">
                      Compare different loan offers and terms to find the best
                      option.
                    </p>
                  </div>

                  <div className="text-center bg-purple-50 rounded-lg p-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl md:text-2xl">📈</span>
                    </div>
                    <h4 className="font-semibold text-purple-700 text-sm md:text-base">
                      Payment Strategy
                    </h4>
                    <p className="text-xs text-gray-600 mt-2">
                      Plan extra payments to reduce total interest and payoff
                      time.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-lg mr-2">⚠️</span>
                  <div>
                    <p className="text-xs md:text-sm text-yellow-800">
                      <strong>Important:</strong> Loan calculations provide
                      estimates based on standard formulas. Actual loan terms
                      may include additional fees, insurance, or conditions.
                      Always review loan documents carefully before signing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  Tips for Smart Borrowing
                </h2>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-xs md:text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Before You Borrow
                    </h4>
                    <ul className="space-y-2">
                      <li>• Check your credit score and report for errors</li>
                      <li>
                        • Calculate how much you can afford to pay monthly
                      </li>
                      <li>• Compare offers from multiple lenders</li>
                      <li>• Understand all fees and terms involved</li>
                      <li>
                        • Consider the total cost of the loan, not just monthly
                        payments
                      </li>
                      <li>
                        • Read all loan documents thoroughly before signing
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Managing Your Loan
                    </h4>
                    <ul className="space-y-2">
                      <li>• Make payments on time to avoid late fees</li>
                      <li>
                        • Consider making extra principal payments when possible
                      </li>
                      <li>• Keep track of your loan balance and progress</li>
                      <li>• Refinance if better rates become available</li>
                      <li>
                        • Set up automatic payments to avoid missed payments
                      </li>
                      <li>
                        • Contact your lender immediately if facing payment
                        difficulties
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm md:text-base">
                    Debt-to-Income Ratio
                  </h4>
                  <p className="text-xs md:text-sm text-blue-700">
                    Lenders typically prefer a debt-to-income ratio below 36%.
                    This means your total monthly debt payments (including the
                    new loan) should not exceed 36% of your gross monthly
                    income. Calculate this before applying to understand your
                    borrowing capacity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default LoanCalculator;
