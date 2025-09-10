import React, { createContext, useContext, useState, ReactNode } from 'react';
import { sendComplaintEmail, getRecipientEmail } from '../services/emailService';
import { shouldEscalate, getEscalationStatus } from '../services/escalationService';

export interface Complaint {
  id: string;
  wardId: string;
  category: string;
  text: string;
  audioURL?: string;
  language: string;
  timestamp: string;
  status: 'submitted' | 'in-progress' | 'escalated' | 'resolved';
  escalationLevel: number;
  lastResponseTime?: string;
  emailSent: boolean;
  escalationTime?: string;
  priority: 'normal' | 'urgent' | 'critical';
}

interface ComplaintContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
  updateComplaintStatus: (id: string, status: string) => void;
  checkEscalations: () => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const useComplaintContext = () => {
  const context = useContext(ComplaintContext);
  if (!context) {
    throw new Error('useComplaintContext must be used within a ComplaintProvider');
  }
  return context;
};

interface ComplaintProviderProps {
  children: ReactNode;
}

export const ComplaintProvider: React.FC<ComplaintProviderProps> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      wardId: 'icu-1',
      category: 'beds',
      text: 'There are 2 patients sharing one bed in ICU Ward 1. This is creating discomfort and privacy issues.',
      language: 'english',
      timestamp: '2024-01-15T10:30:00Z',
      status: 'in-progress',
      escalationLevel: 1,
      emailSent: true,
      priority: 'normal'
    },
    {
      id: '2',
      wardId: 'general-1',
      category: 'water',
      text: 'No water supply in the washroom for the past 3 hours. Patients are facing hygiene issues.',
      language: 'english',
      timestamp: '2024-01-15T09:15:00Z',
      status: 'escalated',
      escalationLevel: 2,
      emailSent: true,
      priority: 'urgent'
    },
    {
      id: '3',
      wardId: 'icu-2',
      category: 'staff',
      text: 'There is no nursing staff available for immediate assistance. Emergency bell is not working.',
      language: 'english',
      timestamp: '2024-01-15T08:45:00Z',
      status: 'resolved',
      escalationLevel: 1,
      emailSent: true,
      lastResponseTime: '2024-01-15T10:00:00Z',
      priority: 'normal'
    }
  ]);

  const addComplaint = async (complaint: Complaint) => {
    // Add escalation timing and priority
    const escalationStatus = getEscalationStatus(complaint.timestamp);
    const enhancedComplaint = {
      ...complaint,
      escalationTime: escalationStatus.escalationTime.toISOString(),
      priority: escalationStatus.priority,
      emailSent: false
    };
    
    setComplaints(prev => [complaint, ...prev]);
    
    // Send initial email notification
    const recipient = getRecipientEmail(complaint.escalationLevel);
    const emailSent = await sendComplaintEmail({
      to_email: recipient.email,
      to_name: recipient.name,
      complaint_id: complaint.id,
      ward_id: complaint.wardId,
      category: complaint.category,
      complaint_text: complaint.text,
      escalation_level: complaint.escalationLevel,
      timestamp: complaint.timestamp,
      priority: escalationStatus.priority
    });
    
    // Update email sent status
    if (emailSent) {
      setComplaints(prev => 
        prev.map(c => 
          c.id === complaint.id 
            ? { ...c, emailSent: true }
            : c
        )
      );
    }
  };

  const updateComplaintStatus = (id: string, status: string) => {
    const now = new Date().toISOString();
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id 
          ? { 
              ...complaint, 
              status: status as any,
              lastResponseTime: status !== 'submitted' ? now : complaint.lastResponseTime
            }
          : complaint
      )
    );
  };

  const checkEscalations = async () => {
    const now = new Date();
    
    for (const complaint of complaints) {
      if (complaint.status === 'resolved') continue;
      
      const escalationStatus = getEscalationStatus(
        complaint.timestamp, 
        complaint.lastResponseTime
      );
      
      if (escalationStatus.shouldEscalate && complaint.escalationLevel < 3) {
        const newEscalationLevel = complaint.escalationLevel + 1;
        const recipient = getRecipientEmail(newEscalationLevel);
        
        // Send escalation email
        const emailSent = await sendComplaintEmail({
          to_email: recipient.email,
          to_name: recipient.name,
          complaint_id: complaint.id,
          ward_id: complaint.wardId,
          category: complaint.category,
          complaint_text: complaint.text,
          escalation_level: newEscalationLevel,
          timestamp: complaint.timestamp,
          priority: 'critical'
        });
        
        if (emailSent) {
          setComplaints(prev => 
            prev.map(c => 
              c.id === complaint.id 
                ? { 
                    ...c, 
                    escalationLevel: newEscalationLevel,
                    status: 'escalated' as any,
                    priority: 'critical' as any
                  }
                : c
            )
          );
        }
      }
    }
  };
  return (
    <ComplaintContext.Provider value={{ 
      complaints, 
      addComplaint, 
      updateComplaintStatus, 
      checkEscalations 
    }}>
      {children}
    </ComplaintContext.Provider>
  );
};