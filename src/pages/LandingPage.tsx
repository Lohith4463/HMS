import React, { useState } from 'react';
import { QrCode, Scan, ArrowRight, Shield, Clock, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedWard, setSelectedWard] = useState('');

  const wards = [
    { id: 'icu-1', name: 'ICU Ward 1', floor: '2nd Floor' },
    { id: 'icu-2', name: 'ICU Ward 2', floor: '2nd Floor' },
    { id: 'general-1', name: 'General Ward 1', floor: '1st Floor' },
    { id: 'general-2', name: 'General Ward 2', floor: '1st Floor' },
    { id: 'emergency', name: 'Emergency Ward', floor: 'Ground Floor' },
    { id: 'pediatric', name: 'Pediatric Ward', floor: '3rd Floor' },
  ];

  const handleQRScan = () => {
    if (selectedWard) {
      navigate(`/complaint/${selectedWard}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <QrCode className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Transform Healthcare Quality
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Scan QR codes in hospital wards to report issues, track complaints, and improve patient care through AI-powered feedback management.
        </p>
      </div>

      {/* QR Simulation Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <div className="text-center mb-8">
          <Scan className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan Ward QR Code</h2>
          <p className="text-gray-600">Select a ward to simulate QR code scanning</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {wards.map((ward) => (
            <div
              key={ward.id}
              onClick={() => setSelectedWard(ward.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedWard === ward.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <QrCode className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ward.name}</h3>
                  <p className="text-sm text-gray-600">{ward.floor}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleQRScan}
            disabled={!selectedWard}
            className={`inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
              selectedWard
                ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Submit Complaint</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Chatbot</h3>
          <p className="text-gray-600">Multilingual chatbot with voice recording for easy complaint submission</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
          <p className="text-gray-600">Track complaint status with automatic escalation to department heads</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure System</h3>
          <p className="text-gray-600">Encrypted complaint storage with anonymous reporting options</p>
        </div>
      </div>

      {/* Hospital Problems Section */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-red-800 mb-6">Common Hospital Issues We Address</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-red-700">ICU Problems:</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Multiple patients per bed</li>
              <li>• Unclean bed sheets</li>
              <li>• Lack of privacy curtains</li>
              <li>• Insufficient staff support</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold text-red-700">General Ward Issues:</h3>
            <ul className="space-y-2 text-red-700">
              <li>• Broken beds and equipment</li>
              <li>• Non-functional fans</li>
              <li>• No water in washrooms</li>
              <li>• Poor complaint handling</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;