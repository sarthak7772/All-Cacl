import React, { useState } from 'react';
import Head from "next/head";
import Header from '../../components/Navbar'
import Footer from '../../components/Footer'
import { Network, Calculator, Globe, Wifi, Shield, Info,  } from 'lucide-react';

const IPSubnetCalculator = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [networkClass, setNetworkClass] = useState('Any');
  const [subnet, setSubnet] = useState('255.255.255.252 /30');
  const [ipAddress, setIpAddress] = useState('192.168.1.1');
  const [ipv6PrefixLength, setIpv6PrefixLength] = useState('64');
  const [ipv6Address, setIpv6Address] = useState('2001:db8:85a3::8a2e:370:7334');
  const [ipv4Results, setIpv4Results] = useState(null);
  const [ipv6Results, setIpv6Results] = useState(null);

  const subnetOptions = [
    '255.255.255.255 /32', '255.255.255.254 /31', '255.255.255.252 /30',
    '255.255.255.248 /29', '255.255.255.240 /28', '255.255.255.224 /27',
    '255.255.255.192 /26', '255.255.255.128 /25', '255.255.255.0 /24',
    '255.255.254.0 /23', '255.255.252.0 /22', '255.255.248.0 /21',
    '255.255.240.0 /20', '255.255.224.0 /19', '255.255.192.0 /18',
    '255.255.128.0 /17', '255.255.0.0 /16', '255.254.0.0 /15',
    '255.252.0.0 /14', '255.248.0.0 /13', '255.240.0.0 /12',
    '255.224.0.0 /11', '255.192.0.0 /10', '255.128.0.0 /9',
    '255.0.0.0 /8', '254.0.0.0 /7', '252.0.0.0 /6',
    '248.0.0.0 /5', '240.0.0.0 /4', '224.0.0.0 /3',
    '192.0.0.0 /2', '128.0.0.0 /1', '0.0.0.0 /0'
  ];

  const prefixLengthOptions = Array.from({ length: 129 }, (_, i) => i.toString());

  const parseIPv4 = (ip) => {
    const parts = ip.split('.').map(part => parseInt(part, 10));
    if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255)) {
      return null;
    }
    return parts;
  };

  const parseSubnetMask = (mask) => {
    const cidr = parseInt(mask.split('/')[1], 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return null;
    
    const maskBits = Array(32).fill(0);
    for (let i = 0; i < cidr; i++) {
      maskBits[i] = 1;
    }
    
    const maskOctets = [];
    for (let i = 0; i < 4; i++) {
      const octetBits = maskBits.slice(i * 8, (i + 1) * 8);
      const octetValue = parseInt(octetBits.join(''), 2);
      maskOctets.push(octetValue);
    }
    
    return { octets: maskOctets, cidr };
  };

  const calculateIPv4Subnet = () => {
    const ip = parseIPv4(ipAddress);
    const mask = parseSubnetMask(subnet);
    
    if (!ip || !mask) {
      alert('Invalid IP address or subnet mask');
      return;
    }

    const networkAddress = ip.map((octet, i) => octet & mask.octets[i]);
    const wildcardMask = mask.octets.map(octet => 255 - octet);
    const broadcastAddress = networkAddress.map((octet, i) => octet | wildcardMask[i]);
    
    const firstHost = [...networkAddress];
    firstHost[3] += 1;
    
    const lastHost = [...broadcastAddress];
    lastHost[3] -= 1;
    
    const hostBits = 32 - mask.cidr;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = totalHosts - 2;
    
    const firstOctet = ip[0];
    let ipClass = 'Unknown';
    if (firstOctet >= 1 && firstOctet <= 126) ipClass = 'A';
    else if (firstOctet >= 128 && firstOctet <= 191) ipClass = 'B';
    else if (firstOctet >= 192 && firstOctet <= 223) ipClass = 'C';
    else if (firstOctet >= 224 && firstOctet <= 239) ipClass = 'D (Multicast)';
    else if (firstOctet >= 240 && firstOctet <= 255) ipClass = 'E (Reserved)';

    setIpv4Results({
      ipAddress: ip.join('.'),
      subnetMask: mask.octets.join('.'),
      cidr: mask.cidr,
      networkAddress: networkAddress.join('.'),
      broadcastAddress: broadcastAddress.join('.'),
      firstHost: firstHost.join('.'),
      lastHost: lastHost.join('.'),
      totalHosts,
      usableHosts,
      ipClass
    });
  };

  const calculateIPv6Subnet = () => {
    const prefixLength = parseInt(ipv6PrefixLength, 10);
    
    if (isNaN(prefixLength) || prefixLength < 0 || prefixLength > 128) {
      alert('Invalid prefix length');
      return;
    }

    let expandedAddress = ipv6Address;
    
    if (expandedAddress.includes('::')) {
      const parts = expandedAddress.split('::');
      const leftParts = parts[0] ? parts[0].split(':') : [];
      const rightParts = parts[1] ? parts[1].split(':') : [];
      const missingParts = 8 - leftParts.length - rightParts.length;
      
      expandedAddress = [
        ...leftParts,
        ...Array(missingParts).fill('0'),
        ...rightParts
      ].map(part => part.padStart(4, '0')).join(':');
    }

    const networkBits = prefixLength;
    const hostBits = 128 - prefixLength;
    const totalAddresses = hostBits <= 64 ? Math.pow(2, hostBits) : 'Very large number';

    setIpv6Results({
      ipAddress: ipv6Address,
      expandedAddress,
      prefixLength,
      networkBits,
      hostBits,
      totalAddresses
    });
  };

  const clearIPv4 = () => {
    setNetworkClass('Any');
    setSubnet('255.255.255.252 /30');
    setIpAddress('192.168.1.1');
    setIpv4Results(null);
  };

  const clearIPv6 = () => {
    setIpv6PrefixLength('64');
    setIpv6Address('2001:db8:85a3::8a2e:370:7334');
    setIpv6Results(null);
  };

  return (
    <>
     <Head>
        <title>Subnet Calculator | Free Online Network Tool

          </title>

        <meta
          name="description"
          content="Use our free Subnet Calculator to quickly determine subnet masks, IP ranges, and network details. Fast, accurate, and essential for IT professionals.


  "
        />
        <meta name="keywords" content="Subnet Calculator, Online Subnet Calculator, Free Subnet Calculator, IP Subnet Calculator, Network Subnet Calculator, CIDR Subnet Calculator, Subnet Mask Calculator, IP Range Calculator, Network Calculation Tool, Subnetting Calculator.
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
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-200 cursor-pointer border-b border-gray-200 transition-colors">
              <span className="text-xl">🌐</span>
              <span className="text-gray-900 font-semibold">Subnet Calculator</span>
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
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4 lg:py-8 pt-16 lg:pt-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <Network className="w-8 h-8 text-gray-900" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">IP Subnet Calculator</h1>
          </div>
          
          <p className="text-gray-700 mb-8 leading-relaxed text-sm lg:text-base">
            Calculate comprehensive subnet information for IPv4 and IPv6 networks including network addresses, 
            usable host ranges, subnet masks, and CIDR notation for network planning and administration.
          </p>

          {/* IPv4 Subnet Calculator */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden mb-8">
            <div className="p-4 lg:p-6 bg-gray-900">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 flex items-center">
                <Globe className="w-6 h-6 mr-3" />
                IPv4 Subnet Calculator
              </h2>
              <p className="text-gray-300 text-sm">
                Calculate network parameters and host ranges for IPv4 addresses with CIDR notation.
              </p>
            </div>

            <div className="p-4 lg:p-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-full sm:w-32 text-sm font-medium text-gray-700">Network Class:</label>
                  <div className="flex flex-wrap gap-4">
                    {['Any', 'A', 'B', 'C'].map((cls) => (
                      <label key={cls} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="networkClass"
                          value={cls}
                          checked={networkClass === cls}
                          onChange={(e) => setNetworkClass(e.target.value)}
                          className="mr-2 w-4 h-4 accent-gray-900"
                        />
                        <span className="text-gray-700 font-medium">{cls}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-full sm:w-32 text-sm font-medium text-gray-900">Subnet Mask:</label>
                  <select
                    value={subnet}
                    onChange={(e) => setSubnet(e.target.value)}
                    className="flex-1 text-gray-900 px-4 py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {subnetOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-full sm:w-32 text-sm font-medium text-gray-900">IP Address:</label>
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="flex-1 px-4 py-3 text-gray-900 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="e.g., 192.168.1.1"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={calculateIPv4Subnet}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center text-lg font-semibold"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate IPv4
                </button>
                <button
                  onClick={clearIPv4}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* IPv4 Results */}
            {ipv4Results && (
              <div className="bg-gray-50 p-4 lg:p-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Network className="w-6 h-6 mr-3" />
                  IPv4 Subnet Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-3">
                    <p className="text-gray-700"><strong>IP Address:</strong> <span className="font-mono text-lg text-gray-900">{ipv4Results.ipAddress}</span></p>
                    <p className="text-gray-700"><strong>Subnet Mask:</strong> <span className="font-mono text-lg text-gray-900">{ipv4Results.subnetMask}</span></p>
                    <p className="text-gray-700"><strong>CIDR Notation:</strong> <span className="font-mono text-lg text-gray-900">/{ipv4Results.cidr}</span></p>
                    <p className="text-gray-700"><strong>IP Class:</strong> <span className="font-mono text-lg text-gray-900">{ipv4Results.ipClass}</span></p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-gray-700"><strong>Network Address:</strong> <span className="font-mono text-lg text-gray-900">{ipv4Results.networkAddress}</span></p>
                    <p className="text-gray-700"><strong>Broadcast Address:</strong> <span className="font-mono text-lg text-gray-900">{ipv4Results.broadcastAddress}</span></p>
                    <p className="text-gray-700"><strong>First Host:</strong> <span className="font-mono text-lg text-gray-900">{ipv4Results.firstHost}</span></p>
                    <p className="text-gray-700"><strong>Last Host:</strong> <span className="font-mono text-lg text-gray-900">{ipv4Results.lastHost}</span></p>
                  </div>
                </div>
                <div className="mt-6 grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700"><strong>Total Hosts:</strong> <span className="text-2xl font-bold text-gray-900">{ipv4Results.totalHosts.toLocaleString()}</span></p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700"><strong>Usable Hosts:</strong> <span className="text-2xl font-bold text-gray-900">{ipv4Results.usableHosts.toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* IPv6 Subnet Calculator */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden mb-8">
            <div className="p-4 lg:p-6 bg-gray-900">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-2 flex items-center">
                <Wifi className="w-6 h-6 mr-3" />
                IPv6 Subnet Calculator
              </h2>
              <p className="text-gray-300 text-sm">
                Advanced IPv6 subnet calculations with prefix length support and address expansion.
              </p>
            </div>

            <div className="p-4 lg:p-8">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-full sm:w-32 text-sm font-medium text-gray-900">Prefix Length:</label>
                  <select
                    value={ipv6PrefixLength}
                    onChange={(e) => setIpv6PrefixLength(e.target.value)}
                    className="w-full text-gray-900 sm:w-40 px-4 py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                  >
                    {prefixLengthOptions.map((length) => (
                      <option key={length} value={length}>/{length}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <label className="w-full sm:w-32 text-sm font-medium text-gray-900">IPv6 Address:</label>
                  <input
                    type="text"
                    value={ipv6Address}
                    onChange={(e) => setIpv6Address(e.target.value)}
                    className="flex-1 px-4 text-gray-900 py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="e.g., 2001:db8:85a3::8a2e:370:7334"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={calculateIPv6Subnet}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors flex items-center justify-center text-lg font-semibold"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate IPv6
                </button>
                <button
                  onClick={clearIPv6}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors text-lg font-semibold"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* IPv6 Results */}
            {ipv6Results && (
              <div className="bg-purple-50 p-4 lg:p-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Wifi className="w-6 h-6 mr-3" />
                  IPv6 Subnet Information
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-700"><strong>IPv6 Address:</strong> <span className="font-mono text-base lg:text-lg break-all text-gray-900">{ipv6Results.ipAddress}</span></p>
                  <p className="text-gray-700"><strong>Expanded Address:</strong> <span className="font-mono text-base lg:text-lg break-all text-gray-900">{ipv6Results.expandedAddress}</span></p>
                  <div className="grid md:grid-cols-3 gap-4 lg:gap-6 mt-6">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700"><strong>Prefix Length:</strong> <span className="text-xl font-bold text-gray-900">/{ipv6Results.prefixLength}</span></p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700"><strong>Network Bits:</strong> <span className="text-xl font-bold text-gray-900">{ipv6Results.networkBits}</span></p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-700"><strong>Host Bits:</strong> <span className="text-xl font-bold text-gray-900">{ipv6Results.hostBits}</span></p>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 mt-4">
                    <p className="text-gray-700"><strong>Total Addresses:</strong> <span className="text-xl lg:text-2xl font-bold text-gray-900">
                      {typeof ipv6Results.totalAddresses === 'number' ? ipv6Results.totalAddresses.toLocaleString() : ipv6Results.totalAddresses}
                    </span></p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Network Security & Best Practices */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mb-8">
            <h3 className="text-xl lg:text-2xl font-bold mb-6 flex items-center text-gray-900">
              <Shield className="w-6 h-6 mr-3" />
              Network Security & Best Practices
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Subnet Security Guidelines</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Use proper VLAN segmentation to isolate network traffic</li>
                  <li>• Implement firewall rules between subnets</li>
                  <li>• Monitor inter-subnet communication patterns</li>
                  <li>• Use private IP ranges for internal networks</li>
                  <li>• Document network topology and IP allocations</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">VLSM Planning Tips</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Start with the largest subnet requirements first</li>
                  <li>• Leave room for future network growth</li>
                  <li>• Use consistent addressing schemes</li>
                  <li>• Consider geographic or departmental groupings</li>
                  <li>• Plan for management and guest networks</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Understanding IP Subnetting */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6">
            <h3 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">Understanding IP Subnetting</h3>
            
            <div className="space-y-6 text-gray-700">
              <p className="text-sm lg:text-base">
                <strong>Subnetting</strong> is a fundamental networking concept that involves dividing a larger network into smaller, 
                more manageable subnetworks for efficient IP address management, network security, and performance optimization.
              </p>

              <div className="bg-gray-100 border-l-4 border-gray-900 p-4 rounded">
                <div className="flex items-center mb-3">
                  <Info className="w-6 h-6 mr-3 text-gray-900" />
                  <span className="font-semibold text-gray-800">Key Concepts:</span>
                </div>
                <ul className="space-y-2 text-sm">
                  <li><strong>Network Address:</strong> The first address in a subnet, used to identify the network itself</li>
                  <li><strong>Broadcast Address:</strong> The last address in a subnet, used for broadcast communications</li>
                  <li><strong>Host Range:</strong> The usable IP addresses between network and broadcast addresses</li>
                  <li><strong>Subnet Mask:</strong> Defines which portion of an IP address represents the network vs. host</li>
                </ul>
              </div>

              <h4 className="text-lg font-semibold text-gray-800">CIDR Notation Explained</h4>
              <p className="text-sm lg:text-base">
                <strong>Classless Inter-Domain Routing (CIDR)</strong> notation is the modern standard for expressing 
                subnet masks using a slash followed by the number of network bits (e.g., /24 instead of 255.255.255.0).
              </p>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h5 className="font-semibold text-gray-800 mb-3">Common CIDR Examples:</h5>
                <div className="space-y-2 font-mono text-sm">
                  <p>/8 = 255.0.0.0 (Class A) - 16,777,214 hosts</p>
                  <p>/16 = 255.255.0.0 (Class B) - 65,534 hosts</p>
                  <p>/24 = 255.255.255.0 (Class C) - 254 hosts</p>
                  <p>/30 = 255.255.255.252 (Point-to-point) - 2 hosts</p>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mt-6">
                <p className="text-sm text-gray-800">
                  <strong>Pro Tip:</strong> Always plan subnets with future growth in mind. 
                  It's easier to allocate larger subnets initially than to renumber later.
                </p>
              </div>
            </div>
          </div>

          {/* IPv4 vs IPv6 Comparison */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mt-8">
            <h3 className="text-xl lg:text-2xl font-bold mb-6 text-gray-900">IPv4 vs IPv6 Addressing</h3>
            
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-4">
                <h4 className="text-lg lg:text-xl font-semibold text-green-700">IPv4 Characteristics</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 32-bit address space (4.3 billion addresses)</li>
                  <li>• Dotted decimal notation (192.168.1.1)</li>
                  <li>• Class-based addressing (A, B, C, D, E)</li>
                  <li>• NAT required for private networks</li>
                  <li>• Mature protocol with universal support</li>
                  <li>• Address exhaustion is a concern</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg lg:text-xl font-semibold text-blue-700">IPv6 Advantages</h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• 128-bit address space (340 undecillion addresses)</li>
                  <li>• Hexadecimal notation (2001:db8::1)</li>
                  <li>• Hierarchical addressing structure</li>
                  <li>• Built-in security features (IPSec)</li>
                  <li>• Simplified header format for faster routing</li>
                  <li>• No address exhaustion concerns</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-start">
                <Info className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Migration Considerations:</h4>
                  <p className="text-sm text-gray-700">
                    While IPv6 adoption continues to grow, dual-stack implementations remain common. Network administrators 
                    should plan for IPv6 transition while maintaining IPv4 compatibility during the migration period.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subnet Reference Table */}
          <div className="bg-white rounded-lg shadow-md border overflow-hidden mt-8">
            <div className="p-4 lg:p-6 bg-gray-900">
              <h3 className="text-xl lg:text-2xl font-bold text-white">IPv4 Subnet Reference Table</h3>
              <p className="text-gray-300 mt-2 text-sm">Complete CIDR notation reference with host calculations</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-semibold text-gray-700 text-sm">CIDR</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-semibold text-gray-700 text-sm">Subnet Mask</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-semibold text-gray-700 text-sm">Usable Hosts</th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left font-semibold text-gray-700 text-sm">Network Class</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { prefix: '/8', mask: '255.0.0.0', hosts: '16,777,214', class: 'Class A' },
                    { prefix: '/16', mask: '255.255.0.0', hosts: '65,534', class: 'Class B' },
                    { prefix: '/24', mask: '255.255.255.0', hosts: '254', class: 'Class C' },
                    { prefix: '/25', mask: '255.255.255.128', hosts: '126' },
                    { prefix: '/26', mask: '255.255.255.192', hosts: '62' },
                    { prefix: '/27', mask: '255.255.255.224', hosts: '30' },
                    { prefix: '/28', mask: '255.255.255.240', hosts: '14' },
                    { prefix: '/29', mask: '255.255.255.248', hosts: '6' },
                    { prefix: '/30', mask: '255.255.255.252', hosts: '2' },
                    { prefix: '/31', mask: '255.255.255.254', hosts: '0' },
                    { prefix: '/32', mask: '255.255.255.255', hosts: '0' }
                  ].map((row, index) => (
                    <tr key={row.prefix} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 lg:px-6 py-3 border-b border-gray-100 font-mono text-sm text-gray-900 font-semibold">
                        {row.prefix}
                      </td>
                      <td className="px-4 lg:px-6 py-3 border-b border-gray-100 font-mono text-sm text-gray-700">
                        {row.mask}
                      </td>
                      <td className="px-4 lg:px-6 py-3 border-b border-gray-100 font-mono text-sm text-gray-700">
                        {row.hosts}
                      </td>
                      <td className="px-4 lg:px-6 py-3 border-b border-gray-100">
                        {row.class && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-900 text-white">
                            {row.class}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Private IP Ranges */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mt-8">
            <h3 className="text-xl lg:text-2xl font-bold mb-6 text-gray-900">Private IP Address Ranges</h3>
            
            <p className="text-gray-700 mb-6 text-sm lg:text-base">
              Private IP addresses are reserved for use within private networks and are not routable on the public Internet. 
              These ranges are defined by RFC 1918 and are commonly used for internal networks.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Class A Private Range</h4>
                <p className="font-mono text-lg text-gray-900 mb-2">10.0.0.0/8</p>
                <p className="text-sm text-gray-600">Range: 10.0.0.0 - 10.255.255.255</p>
                <p className="text-sm text-gray-600 mt-1">Hosts: 16,777,216</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">Class B Private Range</h4>
                <p className="font-mono text-lg text-gray-900 mb-2">172.16.0.0/12</p>
                <p className="text-sm text-gray-600">Range: 172.16.0.0 - 172.31.255.255</p>
                <p className="text-sm text-gray-600 mt-1">Hosts: 1,048,576</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-3">Class C Private Range</h4>
                <p className="font-mono text-lg text-gray-900 mb-2">192.168.0.0/16</p>
                <p className="text-sm text-gray-600">Range: 192.168.0.0 - 192.168.255.255</p>
                <p className="text-sm text-gray-600 mt-1">Hosts: 65,536</p>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800 mb-3">Common Private Network Uses:</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Home Networks:</strong> Typically use 192.168.x.x range</li>
                <li>• <strong>Small Businesses:</strong> Often use 192.168.x.x or 10.x.x.x ranges</li>
                <li>• <strong>Large Enterprises:</strong> Commonly use 10.x.x.x for scalability</li>
                <li>• <strong>Service Providers:</strong> May use 172.16.x.x for customer networks</li>
              </ul>
            </div>
          </div>

          {/* Common Subnetting Scenarios */}
          <div className="bg-white rounded-lg shadow-md border p-4 lg:p-6 mt-8">
            <h3 className="text-xl lg:text-2xl font-bold mb-6 text-gray-900">Common Subnetting Scenarios</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-gray-900 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">Point-to-Point Links (/30)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Used for router-to-router connections where only 2 hosts are needed.
                </p>
                <div className="bg-gray-50 p-3 text-gray-800 rounded font-mono text-sm">
                  Network: 192.168.1.0/30<br/>
                  Usable IPs: 192.168.1.1 - 192.168.1.2<br/>
                  Total Hosts: 2
                </div>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">Small Office Network (/28)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Suitable for small departments or branch offices with up to 14 devices.
                </p>
                <div className="bg-blue-50 p-3 text-gray-800 rounded font-mono text-sm">
                  Network: 192.168.1.0/28<br/>
                  Usable IPs: 192.168.1.1 - 192.168.1.14<br/>
                  Total Hosts: 14
                </div>
              </div>

              <div className="border-l-4 border-green-600 pl-4">
                <h4 className="font-semibold text-gray-800 mb-2 text-lg">Standard LAN (/24)</h4>
                <p className="text-sm text-gray-700 mb-2">
                  Traditional Class C network, perfect for most office environments.
                </p>
                <div className="bg-green-50 p-3 rounded font-mono text-sm text-gray-800">
                  Network: 192.168.1.0/24<br/>
                  Usable IPs: 192.168.1.1 - 192.168.1.254<br/>
                  Total Hosts: 254
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

export default IPSubnetCalculator;