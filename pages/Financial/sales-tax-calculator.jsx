 import Head from "next/head";
 import React, { useState } from 'react';
 import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Calculator, } from 'lucide-react';

const SalesTaxCalculator = () => {
  const [beforeTaxPrice, setBeforeTaxPrice] = useState(100);
  const [salesTaxRate, setSalesTaxRate] = useState(6.5);
  const [afterTaxPrice, setAfterTaxPrice] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    { emoji: '🧾', name: 'Sales Tax Calculator', href: '/Financial/sales-tax-calculator' },
  ];
  

  const calculateSalesTax = () => {
    if (beforeTaxPrice && salesTaxRate) {
      const taxAmount = (beforeTaxPrice * salesTaxRate) / 100;
      const finalPrice = beforeTaxPrice + taxAmount;
      setAfterTaxPrice(finalPrice.toFixed(2));
    } else if (afterTaxPrice && salesTaxRate) {
      const price = parseFloat(afterTaxPrice) / (1 + salesTaxRate / 100);
      setBeforeTaxPrice(parseFloat(price.toFixed(2)));
    } else if (beforeTaxPrice && afterTaxPrice) {
      const rate = ((parseFloat(afterTaxPrice) - beforeTaxPrice) / beforeTaxPrice) * 100;
      setSalesTaxRate(parseFloat(rate.toFixed(3)));
    }
  };

  const clearForm = () => {
    setBeforeTaxPrice(0);
    setSalesTaxRate(0);
    setAfterTaxPrice('');
  };

  return (
    <>
     <Head>
        <title>Sales Tax Calculator | Free Online Tax Calculation Tool



</title>
        <meta
          name="description"
          content="
  Use our free Sales Tax Calculator to quickly calculate sales tax and total costs. Accurate, easy, and fast — your best online sales tax calculator tool.
  "
        />
        <meta name="keywords" content="Sales Tax Calculator, Online Sales Tax Calculator, Free Sales Tax Calculator, Tax Calculator, Sales Tax Estimator, Purchase Tax Calculator, Sales Tax Rate Calculator, State Sales Tax Calculator, Local Sales Tax Calculator, Quick Sales Tax Calculato
" />
     
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
                  className="text-gray-900 hover:bg-red-50 flex items-center gap-2 p-2 rounded transition-colors">
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
                <h1 className="text-xl md:text-2xl font-bold mb-2">Sales Tax Calculator 
</h1>
                <p className="text-red-100 text-xs md:text-sm">
                A Sales Tax Calculator is a tool that helps compute the sales tax amount on a product or service based on the price and applicable tax rate, providing the total cost including tax.
                </p>
              </div>

              {/* Calculator Section */}
              <div className="p-4 md:p-6">
                <div className="bg-gray-50 p-4 md:p-6 rounded-lg max-w-md">
                  <div className="space-y-4">
                    {/* Before Tax Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="sm:w-32 text-sm font-medium text-gray-900">Before Tax Price</label>
                      <div className="flex">
                        <span className="bg-white  text-gray-900 border border-gray-900 border-r-0 px-2 py-2 text-sm rounded-l">Before</span>
                        <input type="number" value={beforeTaxPrice}
                          onChange={(e) => setBeforeTaxPrice(parseFloat(e.target.value) || 0)}
                          className="w-full text-gray-900 sm:w-24 px-2 py-2 border border-gray-900 text-sm rounded-r"
                          step="0.01"/>
                      </div>
                    </div>

                    {/* Sales Tax Rate */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="sm:w-32 text-sm font-medium text-gray-900">Sales Tax Rate</label>
                      <div className="flex">
                        <input type="number" value={salesTaxRate}
                          onChange={(e) => setSalesTaxRate(parseFloat(e.target.value) || 0)}
                          className="w-20 text-gray-900 px-2 py-2 border border-gray-900 text-sm rounded-l"
                          step="0.001"/>
                        <span className="bg-white text-gray-900 border border-gray-900 border-l-0 px-2 py-2 text-sm rounded-r">%</span>
                      </div>
                    </div>

                    {/* After Tax Price */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="sm:w-32 text-sm font-medium text-gray-900">After Tax Price</label>
                      <div className="flex">
                        <span className="bg-white text-gray-900 border border-gray-900 border-r-0 px-2 py-2 text-sm rounded-l">After</span>
                        <input type="number" value={afterTaxPrice}
                          onChange={(e) => setAfterTaxPrice(e.target.value)}
                          className="w-full text-gray-900 sm:w-24 px-2 py-2 border border-gray-900 text-sm rounded-r"
                          step="0.01"/>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4">
                      <button onClick={calculateSalesTax}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 text-sm font-medium rounded transition-colors">
                        Calculate
                      </button>
                      <button onClick={clearForm}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 text-sm font-medium rounded transition-colors">
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* Tax Information */}
                <div className="mt-6 md:mt-8 bg-gray-50 p-4 md:p-6 rounded-lg">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Sales Tax Information</h3>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-700">
                    <li>• Sales tax is a consumption tax paid to government on the sale of goods and services.</li>
                    <li>• Vendors usually collect the sales tax from consumers at the time of purchase.</li>
                    <li>• Globally, sales tax may also be known as Value-Added Tax (VAT) or Goods and Services Tax (GST).</li>
                  </ul>
                </div>

                {/* Accuracy & Limitations */}
                <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">Accuracy & Limitations</h3>
                  <p className="text-xs md:text-sm text-red-100">
                    Tax calculations are estimates and may not account for all exemptions or local variations. Verify with local authorities for exact tax amounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Using Sales Tax Information */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h3 className="text-gray-900 font-semibold mb-6 text-base md:text-lg">Using Sales Tax Information for Financial Planning</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center bg-green-50 rounded-lg p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl md:text-2xl">🛒</span>
                  </div>
                  <h4 className="font-semibold text-green-700 text-sm md:text-base">Purchase Planning</h4>
                  <p className="text-xs text-gray-600 mt-2">
                    Calculate total costs including tax to better plan your purchases and budget accordingly.
                  </p>
                </div>

                <div className="text-center bg-blue-50 rounded-lg p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl md:text-2xl">📊</span>
                  </div>
                  <h4 className="font-semibold text-blue-700 text-sm md:text-base">Business Planning</h4>
                  <p className="text-xs text-gray-600 mt-2">
                    Understand tax obligations for your business and factor sales tax into pricing strategies.
                  </p>
                </div>

                <div className="text-center bg-purple-50 rounded-lg p-4">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl md:text-2xl">📋</span>
                  </div>
                  <h4 className="font-semibold text-purple-700 text-sm md:text-base">Tax Deductions</h4>
                  <p className="text-xs text-gray-600 mt-2">
                    Track sales tax payments for potential itemized deductions on your federal income tax.
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-yellow-600 text-lg mr-2">⚠️</span>
                  <div>
                    <p className="text-xs md:text-sm text-yellow-800">
                      <strong>Important:</strong> Sales tax calculations provide estimates based on general rates. Local variations, exemptions, 
                      and specific product categories may affect actual tax amounts. Always verify with local tax authorities.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What is Sales Tax */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">What is Sales Tax?</h2>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                Sales tax is a consumption tax charged by the government on goods and services, usually collected at the point of purchase. It is sometimes referred to as VAT or GST in other countries.
              </p>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                Sales tax may be added at checkout or included in the listed price depending on the country's pricing model.
              </p>
            </div>

            {/* GST & VAT */}
            <div className="mt-6 md:mt-8 bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Goods and Services Tax (GST) & Value-Added Tax (VAT)</h2>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed mb-4">
                GST is a unified indirect tax applied on goods and services, replacing multiple taxes to simplify the system. It is destination-based and allows businesses to claim input tax credit (ITC).
              </p>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                VAT is a consumption tax applied at each stage of production and distribution. Input tax credit ensures tax is only paid on the value added at each stage.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
    </>
  );
};

export default SalesTaxCalculator;