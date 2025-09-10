import emailjs from 'emailjs-com';

// Email configuration - In production, these would be environment variables
const EMAIL_CONFIG = {
  serviceId: 'your_service_id',
  templateId: 'your_template_id',
  userId: 'your_user_id'
};

export interface EmailData {
  to_email: string;
  to_name: string;
  complaint_id: string;
  ward_id: string;
  category: string;
  complaint_text: string;
  escalation_level: number;
  timestamp: string;
  priority: 'normal' | 'urgent' | 'critical';
}

export const sendComplaintEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // In a real implementation, you would configure EmailJS with your service
    console.log('Sending email notification:', emailData);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, we'll just log the email
    console.log(`📧 Email sent to ${emailData.to_email}:`);
    console.log(`Subject: Hospital Complaint #${emailData.complaint_id} - ${emailData.priority.toUpperCase()}`);
    console.log(`Ward: ${emailData.ward_id.toUpperCase()}`);
    console.log(`Category: ${emailData.category}`);
    console.log(`Escalation Level: ${emailData.escalation_level}`);
    
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const getRecipientEmail = (escalationLevel: number): { email: string; name: string } => {
  switch (escalationLevel) {
    case 1:
      return { email: 'admin@hospital.gov.in', name: 'Hospital Administrator' };
    case 2:
      return { email: 'superintendent@hospital.gov.in', name: 'Hospital Superintendent' };
    case 3:
      return { email: 'director@health.gov.in', name: 'Health Director' };
    default:
      return { email: 'admin@hospital.gov.in', name: 'Hospital Administrator' };
  }
};