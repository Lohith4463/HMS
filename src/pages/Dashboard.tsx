import React from 'react';
import { useComplaintContext } from '../context/ComplaintContext';
import { Clock, CheckCircle, AlertCircle, TrendingUp, Users, MessageSquare, Mail, Timer } from 'lucide-react';
import { getEscalationStatus } from '../services/escalationService';

const Dashboard = () => {
  const { complaints, checkEscalations } = useComplaintContext();
  
  // Check for escalations on component mount
  React.useEffect(() => {
    checkEscalations();
    // Set up periodic escalation checks (every 5 minutes in production)
    const interval = setInterval(checkEscalations, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [checkEscalations]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'escalated': return 'bg-red-100 text-red-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'submitted').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complaint Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your complaints and system-wide healthcare improvements</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Complaints</h2>
        </div>
        
        {complaints.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {complaint.wardId.toUpperCase()}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600 capitalize">
                        {complaint.category.replace(/([A-Z])/g, ' $1')}
                      </span>
                      {complaint.emailSent && (
                        <>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3 text-green-600" />
                            <span className="text-xs text-green-600">Email sent</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <p className="text-gray-800 mb-3">{complaint.text}</p>
                    
                    {complaint.audioURL && (
                      <div className="mb-3">
                        <audio controls className="w-full max-w-md">
                          <source src={complaint.audioURL} type="audio/wav" />
                        </audio>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{new Date(complaint.timestamp).toLocaleDateString()}</span>
                      <span>Language: {complaint.language}</span>
                      <span>Level: {complaint.escalationLevel}</span>
                      {complaint.status !== 'resolved' && (
                        <>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-1">
                            <Timer className="h-3 w-3" />
                            <span className={`text-xs ${
                              getEscalationStatus(complaint.timestamp, complaint.lastResponseTime).priority === 'critical' 
                                ? 'text-red-600' 
                                : getEscalationStatus(complaint.timestamp, complaint.lastResponseTime).priority === 'urgent'
                                ? 'text-orange-600'
                                : 'text-gray-600'
                            }`}>
                              {getEscalationStatus(complaint.timestamp, complaint.lastResponseTime).timeRemaining}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {getStatusIcon(complaint.status)}
                        <span className="capitalize">{complaint.status}</span>
                      </span>
                      {complaint.priority !== 'normal' && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.priority === 'critical' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No complaints yet</h3>
            <p className="text-gray-600">Submit your first complaint by scanning a QR code in the hospital ward.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;