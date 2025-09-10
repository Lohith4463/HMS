import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, Globe, Volume2 } from 'lucide-react';
import { useComplaintContext } from '../context/ComplaintContext';
import { getEscalationStatus } from '../services/escalationService';

const ComplaintForm = () => {
  const { wardId } = useParams();
  const navigate = useNavigate();
  const { addComplaint } = useComplaintContext();
  
  const [language, setLanguage] = useState('english');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [textComplaint, setTextComplaint] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [step, setStep] = useState(1);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const languages = {
    english: 'English',
    telugu: 'తెలుగు',
    hindi: 'हिंदी'
  };

  const categories = {
    english: {
      beds: 'Beds & Bedding Issues',
      fans: 'Fans & Ventilation',
      water: 'Water & Sanitation',
      staff: 'Staff & Support',
      cleanliness: 'Cleanliness & Hygiene',
      equipment: 'Medical Equipment',
      privacy: 'Privacy & Security',
      other: 'Other Issues'
    },
    telugu: {
      beds: 'పడకలు & బెడ్డింగ్ సమస్యలు',
      fans: 'ఫ్యాన్లు & వెంటిలేషన్',
      water: 'నీరు & పరిశుభ్రత',
      staff: 'సిబ్బంది & మద్దతు',
      cleanliness: 'శుభ్రత & పరిశుభ్రత',
      equipment: 'వైద్య పరికరాలు',
      privacy: 'గోప్యత & భద్రత',
      other: 'ఇతర సమస్యలు'
    },
    hindi: {
      beds: 'बिस्तर और बिस्तर के मुद्दे',
      fans: 'पंखे और वेंटिलेशन',
      water: 'पानी और स्वच्छता',
      staff: 'कर्मचारी और सहायता',
      cleanliness: 'सफाई और स्वच्छता',
      equipment: 'चिकित्सा उपकरण',
      privacy: 'गोपनीयता और सुरक्षा',
      other: 'अन्य मुद्दे'
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const escalationStatus = getEscalationStatus(new Date().toISOString());
    
    const complaint = {
      id: Date.now().toString(),
      wardId: wardId || '',
      category: selectedCategory,
      text: textComplaint,
      audioURL: audioURL,
      language: language,
      timestamp: new Date().toISOString(),
      status: 'submitted',
      escalationLevel: 1,
      emailSent: false,
      priority: escalationStatus.priority
    };

    addComplaint(complaint);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 px-8 py-6 text-white">
          <h1 className="text-2xl font-bold">Submit Complaint - {wardId?.toUpperCase()}</h1>
          <p className="text-blue-100 mt-1">We're here to help improve your healthcare experience</p>
        </div>

        <div className="p-8">
          {/* Language Selection */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Globe className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-gray-900">Select Language / भाषा चुनें / భాష ఎంచుకోండి</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(languages).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setLanguage(key)}
                  className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                    language === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Issue Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(categories[language as keyof typeof categories]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedCategory === key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-medium text-sm">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Complaint Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Complaint
              </label>
              <textarea
                value={textComplaint}
                onChange={(e) => setTextComplaint(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={6}
                placeholder="Please describe the issue in detail..."
                required
              />
            </div>

            {/* Voice Recording */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-900">Voice Recording (Optional)</h3>
                {audioURL && (
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Recording saved</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="h-5 w-5" />
                      <span>Stop Recording</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      <span>Start Recording</span>
                    </>
                  )}
                </button>

                {audioURL && (
                  <audio controls className="flex-1">
                    <source src={audioURL} type="audio/wav" />
                    Your browser does not support audio playback.
                  </audio>
                )}
              </div>

              {isRecording && (
                <div className="mt-4 flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-red-600">Recording in progress...</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedCategory || !textComplaint}
                className={`inline-flex items-center space-x-2 px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory && textComplaint
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-5 w-5" />
                <span>Submit Complaint</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;