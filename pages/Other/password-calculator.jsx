import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/footer'
import { Copy, RefreshCw, Check, Shield, Lock, Eye, EyeOff,  } from 'lucide-react';

const PasswordGenerator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [settings, setSettings] = useState({
    length: 12,
    includeLowerCase: true,
    includeUpperCase: true,
    includeNumbers: true,
    includeSymbols: true,
    excludeAmbiguous: true,
    excludeBrackets: false,
    noRepeatedChars: false
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ level: 'Strong', entropy: 0 });
  const [showPassword, setShowPassword] = useState(true);

  const charSets = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~`',
    ambiguous: 'il1Lo0O',
    brackets: '<>()[]{}',
  };

  const calculateStrength = (pwd, options) => {
    let charPoolSize = 0;
    if (options.includeLowerCase) charPoolSize += 26;
    if (options.includeUpperCase) charPoolSize += 26;
    if (options.includeNumbers) charPoolSize += 10;
    if (options.includeSymbols) charPoolSize += 30;
    
    if (options.excludeAmbiguous) charPoolSize -= 7;
    if (options.excludeBrackets) charPoolSize -= 6;
    
    const entropy = pwd.length * Math.log2(charPoolSize);
    
    let level;
    if (entropy < 30) level = 'Very Weak';
    else if (entropy < 50) level = 'Weak';
    else if (entropy < 70) level = 'Fair';
    else if (entropy < 90) level = 'Strong';
    else level = 'Very Strong';
    
    return { level, entropy: Math.round(entropy * 10) / 10 };
  };

  const generatePassword = () => {
    let charset = '';
    let guaranteedChars = [];

    if (settings.includeLowerCase) {
      charset += charSets.lowercase;
      guaranteedChars.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
    }
    if (settings.includeUpperCase) {
      charset += charSets.uppercase;
      guaranteedChars.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
    }
    if (settings.includeNumbers) {
      charset += charSets.numbers;
      guaranteedChars.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
    }
    if (settings.includeSymbols) {
      charset += charSets.symbols;
      guaranteedChars.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);
    }

    if (settings.excludeAmbiguous) {
      charset = charset.split('').filter(char => !charSets.ambiguous.includes(char)).join('');
    }
    if (settings.excludeBrackets) {
      charset = charset.split('').filter(char => !charSets.brackets.includes(char)).join('');
    }

    if (charset.length === 0) {
      setPassword('Error: No character types selected');
      return;
    }

    let newPassword = '';
    
    guaranteedChars.forEach(char => {
      if (newPassword.length < settings.length) {
        newPassword += char;
      }
    });

    while (newPassword.length < settings.length) {
      const randomChar = charset[Math.floor(Math.random() * charset.length)];
      
      if (settings.noRepeatedChars && newPassword.includes(randomChar)) {
        continue;
      }
      
      newPassword += randomChar;
    }

    newPassword = newPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(newPassword);
    setStrength(calculateStrength(newPassword, settings));
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
    }
  };

  const clearPassword = () => {
    setPassword('');
    setStrength({ level: 'Strong', entropy: 0 });
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const getStrengthColor = (level) => {
    switch (level) {
      case 'Very Weak': return 'bg-red-600';
      case 'Weak': return 'bg-red-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Strong': return 'bg-green-500';
      case 'Very Strong': return 'bg-green-600';
      default: return 'bg-gray-400';
    }
  };

  const getStrengthWidth = (level) => {
    switch (level) {
      case 'Very Weak': return '20%';
      case 'Weak': return '40%';
      case 'Fair': return '60%';
      case 'Strong': return '80%';
      case 'Very Strong': return '100%';
      default: return '0%';
    }
  };

  return (
    <>
     <Head>
        <title>Password Generator | Free Strong Password Tool

          </title>

        <meta
          name="description"
          content="Use our free Password Generator to create secure, random passwords instantly. Easy, safe, and reliable — the best online tool for password creation.


  "
        />
        <meta name="keywords" content="Password Generator, Online Password Generator, Free Password Generator, Secure Password Generator, Strong Password Generator, Random Password Generator, Password Creation Tool, Safe Password Generator, Password Generator Online, Easy Password Generator

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
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🔒</span>
              <span className="text-gray-900 font-semibold">Password Generator</span>
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
      <div className="lg:ml-34 transition-all duration-300">
        <div className="max-w-5xl mx-auto px-4 lg:px-6 py-4 lg:py-8 pt-16 lg:pt-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Random Password Generator
            </h1>
          </div>
          <p className="text-gray-600 text-sm lg:text-base mb-8">
            Generate secure, strong passwords for optimal security. Create unique passwords with customizable 
            complexity to protect your accounts and sensitive information.
          </p>

          {/* Main Generator */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden mb-8">
            <div className="p-4 lg:p-6 bg-gray-900">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Lock className="w-6 h-6 mr-2" />
                Password Generator
              </h2>
            </div>

            <div className="p-4 lg:p-8">
              {/* Password Display */}
              <div className="mb-8">
                <label className="block text-lg font-semibold text-gray-800 mb-3">Generated Password</label>
                <div className="relative">
                  <div className="bg-gray-50 border-2 border-gray-900 rounded-lg p-4  text-gray-900 font-mono text-base lg:text-lg break-all min-h-[60px] flex items-center pr-12">
                    {showPassword ? (password || 'Click Generate to create password') : '••••••••••••••••'}
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {/* Password Strength */}
                {password && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Password Strength:</span>
                      <span className={`text-sm font-bold ${
                        strength.level === 'Very Strong' ? 'text-green-600' :
                        strength.level === 'Strong' ? 'text-green-500' :
                        strength.level === 'Fair' ? 'text-yellow-500' :
                        strength.level === 'Weak' ? 'text-red-500' : 'text-red-600'
                      }`}>
                        {strength.level}
                      </span>
                    </div>
                    <div className="w-full  bg-gray-900 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${getStrengthColor(strength.level)}`}
                        style={{ width: getStrengthWidth(strength.level) }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Password Entropy: {strength.entropy} bits
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={generatePassword}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Generate Password
                  </button>
                  <button
                    onClick={copyPassword}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy Password'}
                  </button>
                  <button
                    onClick={clearPassword}
                    className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Settings Panel */}
              <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Password Settings</h3>
                
                {/* Password Length */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Password Length: {settings.length} characters
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="4"
                      max="64"
                      value={settings.length}
                      onChange={(e) => handleSettingChange('length', parseInt(e.target.value))}
                      className="flex-1 accent-gray-900"
                    />
                    <input
                      type="number"
                      min="4"
                      max="64"
                      value={settings.length}
                      onChange={(e) => handleSettingChange('length', Math.max(4, Math.min(64, parseInt(e.target.value) || 4)))}
                      className="w-20 px-3 text-gray-900 py-2 border border-gray-900 rounded focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Character Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includeLowerCase}
                      onChange={(e) => handleSettingChange('includeLowerCase', e.target.checked)}
                      className="w-4 h-4 accent-gray-900 rounded"
                    />
                    <span className="text-gray-700 text-sm">Include Lowercase (a-z)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includeUpperCase}
                      onChange={(e) => handleSettingChange('includeUpperCase', e.target.checked)}
                      className="w-4 h-4 accent-gray-900 rounded"
                    />
                    <span className="text-gray-700 text-sm">Include Uppercase (A-Z)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includeNumbers}
                      onChange={(e) => handleSettingChange('includeNumbers', e.target.checked)}
                      className="w-4 h-4 accent-gray-900 rounded"
                    />
                    <span className="text-gray-700 text-sm">Include Numbers (0-9)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includeSymbols}
                      onChange={(e) => handleSettingChange('includeSymbols', e.target.checked)}
                      className="w-4 h-4 accent-gray-900 rounded"
                    />
                    <span className="text-gray-700 text-sm">Include Symbols (!@#$%^&*)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.excludeAmbiguous}
                      onChange={(e) => handleSettingChange('excludeAmbiguous', e.target.checked)}
                      className="w-4 h-4 accent-gray-900 rounded"
                    />
                    <span className="text-gray-700 text-sm">Exclude Ambiguous (il1L|o0O)</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.excludeBrackets}
                      onChange={(e) => handleSettingChange('excludeBrackets', e.target.checked)}
                      className="w-4 h-4 accent-gray-900 rounded"
                    />
                    <span className="text-gray-700 text-sm">Exclude Brackets (&lt;&gt;()[]{})</span>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer md:col-span-2">
                    <input
                      type="checkbox"
                      checked={settings.noRepeatedChars}
                      onChange={(e) => handleSettingChange('noRepeatedChars', e.target.checked)}
                      className="w-4 h-4 accent-gray-900 rounded"
                    />
                    <span className="text-gray-700 text-sm">No Repeated Characters</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Security Tips */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Password Security Tips</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Strong Security</h4>
                <p className="text-sm text-gray-600">Use unique passwords with mixed characters for maximum protection.</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Regular Updates</h4>
                <p className="text-sm text-gray-600">Change passwords regularly and never reuse across accounts.</p>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-6 h-6 text-yellow-600" />
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Safe Storage</h4>
                <p className="text-sm text-gray-600">Use password managers and enable two-factor authentication.</p>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6">
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">Password Best Practices</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Creating Strong Passwords</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Use at least 12 characters for optimal security
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Include a mix of uppercase, lowercase, numbers, and symbols
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Avoid personal information like names, birthdays, or addresses
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Don't use common words or predictable patterns
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Password Management</h4>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Use a unique password for each account
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Consider using a reputable password manager
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Enable two-factor authentication when available
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-gray-900 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Update passwords immediately if a breach is suspected
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 text-yellow-600 mr-3">⚠️</div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">Important Security Notice</h5>
                    <p className="text-sm text-gray-600">
                      Password generation occurs entirely in your browser for maximum security. 
                      No passwords are transmitted or stored on our servers.
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

export default PasswordGenerator;