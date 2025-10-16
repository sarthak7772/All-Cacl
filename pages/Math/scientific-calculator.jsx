import Link from "next/link";
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator } from 'lucide-react';

import React, { useState, useEffect } from "react";

const ScientificCalculator = () => {
  const [currentInput, setCurrentInput] = useState("0");
  const [memory, setMemory] = useState(0);
  const [lastAnswer, setLastAnswer] = useState(0);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [angleMode, setAngleMode] = useState("deg");

  const updateDisplay = (value) => setCurrentInput(value);

  const insertValue = (value) => {
    if (shouldResetDisplay || currentInput === "0") {
      setCurrentInput(value === "." ? "0." : value);
      setShouldResetDisplay(false);
    } else {
      setCurrentInput((prev) => prev + value);
    }
  };

  const clearAll = () => setCurrentInput("0");
  const clearEntry = () =>
    setCurrentInput((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));

  const calculate = () => {
    try {
      let expression = currentInput
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/−/g, "-")
        .replace(/π/g, Math.PI)
        .replace(/e/g, Math.E)
        .replace(/EXP/g, "*10^");

      const result = eval(expression);
      setLastAnswer(result);
      setCurrentInput(result.toString());
      setShouldResetDisplay(true);
    } catch {
      setCurrentInput("Error");
      setShouldResetDisplay(true);
    }
  };

  const trigFunction = (func) => {
    try {
      let value = parseFloat(currentInput);
      if (angleMode === "deg" && ["sin", "cos", "tan"].includes(func)) {
        value = (value * Math.PI) / 180;
      }
      let result;
      switch (func) {
        case "sin":
          result = Math.sin(value);
          break;
        case "cos":
          result = Math.cos(value);
          break;
        case "tan":
          result = Math.tan(value);
          break;
        case "asin":
          result = Math.asin(value);
          break;
        case "acos":
          result = Math.acos(value);
          break;
        case "atan":
          result = Math.atan(value);
          break;
      }
      if (angleMode === "deg" && ["asin", "acos", "atan"].includes(func)) {
        result = (result * 180) / Math.PI;
      }
      setCurrentInput(result.toString());
      setShouldResetDisplay(true);
    } catch {
      setCurrentInput("Error");
      setShouldResetDisplay(true);
    }
  };

  const mathFunction = (func) => {
    try {
      let value = parseFloat(currentInput);
      let result;
      switch (func) {
        case "ln":
          result = Math.log(value);
          break;
        case "log":
          result = Math.log10(value);
          break;
      }
      setCurrentInput(result.toString());
      setShouldResetDisplay(true);
    } catch {
      setCurrentInput("Error");
      setShouldResetDisplay(true);
    }
  };

  const power = (base, exp) => {
    try {
      let value = parseFloat(currentInput);
      let result;
      switch (true) {
        case base === "x" && exp === "2":
          result = Math.pow(value, 2);
          break;
        case base === "x" && exp === "3":
          result = Math.pow(value, 3);
          break;
        case base === "e" && exp === "x":
          result = Math.exp(value);
          break;
        case base === "10" && exp === "x":
          result = Math.pow(10, value);
          break;
        case base === "x" && exp === "y":
          result = Math.pow(value, 2);
          break;
      }
      setCurrentInput(result.toString());
      setShouldResetDisplay(true);
    } catch {
      setCurrentInput("Error");
      setShouldResetDisplay(true);
    }
  };

  const root = (index) => {
    try {
      let num = parseFloat(currentInput);
      let result;
      if (index === "2") result = Math.sqrt(num);
      else if (index === "3") result = Math.cbrt(num);
      else result = Math.sqrt(num);
      setCurrentInput(result.toString());
      setShouldResetDisplay(true);
    } catch {
      setCurrentInput("Error");
      setShouldResetDisplay(true);
    }
  };

  const fraction = () => {
    try {
      let value = parseFloat(currentInput);
      if (value === 0) setCurrentInput("Cannot divide by zero");
      else setCurrentInput((1 / value).toString());
      setShouldResetDisplay(true);
    } catch {
      setCurrentInput("Error");
      setShouldResetDisplay(true);
    }
  };

  const percent = () => {
    let value = parseFloat(currentInput);
    setCurrentInput((value / 100).toString());
    setShouldResetDisplay(true);
  };

  const factorial = () => {
    try {
      let value = parseInt(currentInput);
      if (value < 0) setCurrentInput("Error");
      else if (value === 0 || value === 1) setCurrentInput("1");
      else {
        let result = 1;
        for (let i = 2; i <= value; i++) result *= i;
        setCurrentInput(result.toString());
      }
      setShouldResetDisplay(true);
    } catch {
      setCurrentInput("Error");
      setShouldResetDisplay(true);
    }
  };

  const plusMinus = () => {
    setCurrentInput((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
  };

  const random = () => {
    setCurrentInput(Math.random().toString());
    setShouldResetDisplay(true);
  };

  const memoryAdd = () => setMemory((prev) => prev + parseFloat(currentInput) || 0);
  const memorySubtract = () => setMemory((prev) => prev - parseFloat(currentInput) || 0);
  const memoryRecall = () => setCurrentInput(memory.toString());
  const getAnswer = () => setCurrentInput(lastAnswer.toString());

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if ("0123456789.".includes(key)) insertValue(key);
      else if (key === "+" || key === "-" || key === "*" || key === "/")
        insertValue(key === "*" ? "×" : key === "/" ? "÷" : key);
      else if (key === "Enter" || key === "=") calculate();
      else if (key === "Escape") clearAll();
      else if (key === "Backspace") clearEntry();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentInput, shouldResetDisplay]);

  const buttons = [
    { label: "sin", onClick: () => trigFunction("sin"), style: "function" },
    { label: "cos", onClick: () => trigFunction("cos"), style: "function" },
    { label: "tan", onClick: () => trigFunction("tan"), style: "function" },
    { label: "π", onClick: () => insertValue("π"), style: "constant" },
    { label: "e", onClick: () => insertValue("e"), style: "constant" },

    { label: "sin⁻¹", onClick: () => trigFunction("asin"), style: "function" },
    { label: "cos⁻¹", onClick: () => trigFunction("acos"), style: "function" },
    { label: "tan⁻¹", onClick: () => trigFunction("atan"), style: "function" },
    { label: "xʸ", onClick: () => power("x", "y"), style: "function" },
    { label: "10ˣ", onClick: () => power("10", "x"), style: "function" },

    { label: "x³", onClick: () => power("x", "3"), style: "function" },
    { label: "x²", onClick: () => power("x", "2"), style: "function" },
    { label: "eˣ", onClick: () => power("e", "x"), style: "function" },
    { label: "ʸ√x", onClick: () => root("y"), style: "function" },
    { label: "³√x", onClick: () => root("3"), style: "function" },

    { label: "√x", onClick: () => root("2"), style: "function" },
    { label: "ln", onClick: () => mathFunction("ln"), style: "function" },
    { label: "log", onClick: () => mathFunction("log"), style: "function" },
    { label: "(", onClick: () => insertValue("("), style: "operator" },
    { label: ")", onClick: () => insertValue(")"), style: "operator" },

    { label: "1/x", onClick: fraction, style: "function" },
    { label: "%", onClick: percent, style: "function" },
    { label: "n!", onClick: factorial, style: "function" },
    { label: "Back", onClick: clearEntry, style: "control" },
    { label: "Ans", onClick: getAnswer, style: "control" },

    { label: "7", onClick: () => insertValue("7"), style: "number" },
    { label: "8", onClick: () => insertValue("8"), style: "number" },
    { label: "9", onClick: () => insertValue("9"), style: "number" },
    { label: "+", onClick: () => insertValue("+"), style: "operator" },
    { label: "M+", onClick: memoryAdd, style: "memory" },

    { label: "4", onClick: () => insertValue("4"), style: "number" },
    { label: "5", onClick: () => insertValue("5"), style: "number" },
    { label: "6", onClick: () => insertValue("6"), style: "number" },
    { label: "−", onClick: () => insertValue("−"), style: "operator" },
    { label: "M-", onClick: memorySubtract, style: "memory" },

    { label: "1", onClick: () => insertValue("1"), style: "number" },
    { label: "2", onClick: () => insertValue("2"), style: "number" },
    { label: "3", onClick: () => insertValue("3"), style: "number" },
    { label: "×", onClick: () => insertValue("×"), style: "operator" },
    { label: "MR", onClick: memoryRecall, style: "memory" },

    { label: "0", onClick: () => insertValue("0"), style: "number" },
    { label: ".", onClick: () => insertValue("."), style: "number" },
    { label: "EXP", onClick: () => insertValue("EXP"), style: "function" },
    { label: "÷", onClick: () => insertValue("÷"), style: "operator" },
    { label: "AC", onClick: clearAll, style: "control" },

    { label: "±", onClick: plusMinus, style: "function" },
    { label: "RND", onClick: random, style: "function" },
    { label: "=", onClick: calculate, style: "equals", span: "col-span-3" },
  ];

  const getButtonStyle = (style) => {
    const baseStyle = "w-full h-9 xs:h-10 sm:h-11 md:h-12 lg:h-13 rounded-lg sm:rounded-lg font-semibold text-xs xs:text-sm sm:text-sm md:text-base transition-all duration-200 active:scale-95 shadow-sm hover:shadow-md";
    
    switch (style) {
      case "number":
        return `${baseStyle} bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50`;
      case "operator":
        return `${baseStyle} bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600`;
      case "function":
        return `${baseStyle} bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:from-gray-800 hover:to-gray-700`;
      case "control":
        return `${baseStyle} bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700`;
      case "memory":
        return `${baseStyle} bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700`;
      case "constant":
        return `${baseStyle} bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700`;
      case "equals":
        return `${baseStyle} bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700`;
      default:
        return `${baseStyle} bg-gray-200 text-gray-800 hover:bg-gray-300`;
    }
  };

  return (
    <>
      <Head>
        <title>Scientific Calculator | Free Online Math Calculator</title>
        <meta
          name="description"
          content="Use our free Scientific Calculator for accurate math, algebra, and trigonometry calculations. Quick, easy, and perfect for students and professionals."
        />
        <meta name="keywords" content="Scientific Calculator, Online Scientific Calculator, Free Scientific Calculator, Advanced Calculator, Math Scientific Calculator, Algebra Calculator, Trigonometry Calculator, Scientific Math Tool, Free Online Calculator, Calculator for Students" />
      </Head>

      <div className="min-h-screen bg-gray-100 font-sans flex flex-col">
        <Header />
        
        <main className="flex-1 w-full px-2 xs:px-3 sm:px-4 md:px-6 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-4 xs:mb-6 sm:mb-8">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 xs:mb-2">
                Scientific Calculator
              </h1>
              <p className="text-xs xs:text-sm sm:text-base text-gray-600">
                Advanced mathematical calculations made simple
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 xs:gap-4 sm:gap-6">
              {/* Main Calculator */}
              <div className="flex-1 bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl p-2 xs:p-3 sm:p-4 md:p-6">
                {/* Display */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-3 xs:p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-lg md:rounded-xl mb-3 xs:mb-4 sm:mb-5 md:mb-6 shadow-inner">
                  <div className="text-right">
                    <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-mono tracking-wider min-h-[28px] xs:min-h-[32px] sm:min-h-[36px] md:min-h-[44px] break-all word-break">
                      {currentInput}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-300 mt-1.5 xs:mt-2 sm:mt-3">
                      Memory: {memory.toFixed(2)} | Last: {lastAnswer.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Angle Mode Toggle */}
                <div className="mb-3 xs:mb-4 sm:mb-5 flex justify-center">
                  <div className="bg-gray-100 rounded-full p-1 flex gap-1">
                    <button
                      className={`px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                        angleMode === "deg" 
                          ? "bg-gray-900 text-white shadow-md" 
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setAngleMode("deg")}
                    >
                      Degrees
                    </button>
                    <button
                      className={`px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                        angleMode === "rad" 
                          ? "bg-gray-900 text-white shadow-md" 
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setAngleMode("rad")}
                    >
                      Radians
                    </button>
                  </div>
                </div>

                {/* Button Grid */}
                <div className="grid grid-cols-5 gap-1 xs:gap-1.5 sm:gap-2">
                  {buttons.map((btn, idx) => {
                    const isEqualsButton = btn.style === "equals";
                    return (
                      <button
                        key={idx}
                        className={`${getButtonStyle(btn.style)} ${
                          isEqualsButton ? "col-span-3" : ""
                        }`}
                        onClick={btn.onClick}
                      >
                        {btn.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80">
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl p-3 xs:p-4 sm:p-5 md:p-6 text-white h-fit">
                  <h4 className="font-bold mb-2 xs:mb-3 sm:mb-4 text-sm xs:text-base sm:text-lg">Quick Tips</h4>
                  <ul className="text-xs xs:text-xs sm:text-sm space-y-1.5 xs:space-y-2 opacity-90">
                    <li>• Keyboard shortcuts available</li>
                    <li>• Switch Deg/Rad mode</li>
                    <li>• Memory: M+, M-, MR</li>
                    <li>• Press 'Ans' for last result</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ScientificCalculator;