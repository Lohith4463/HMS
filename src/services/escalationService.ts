import { format, addHours, isAfter, isBefore, parseISO } from 'date-fns';

export interface EscalationConfig {
  businessHoursStart: number; // 9 AM
  businessHoursEnd: number;   // 9 PM (21:00)
  businessHoursEscalation: number; // 12 hours
  afterHoursEscalation: number;    // 12-24 hours
}

const DEFAULT_CONFIG: EscalationConfig = {
  businessHoursStart: 9,
  businessHoursEnd: 21,
  businessHoursEscalation: 12,
  afterHoursEscalation: 24
};

export const calculateEscalationTime = (
  submissionTime: string,
  config: EscalationConfig = DEFAULT_CONFIG
): Date => {
  const submissionDate = parseISO(submissionTime);
  const submissionHour = submissionDate.getHours();
  
  // Check if submitted during business hours (9 AM - 9 PM)
  const isDuringBusinessHours = submissionHour >= config.businessHoursStart && 
                                submissionHour < config.businessHoursEnd;
  
  if (isDuringBusinessHours) {
    // Business hours: escalate after 12 hours
    return addHours(submissionDate, config.businessHoursEscalation);
  } else {
    // After hours: escalate after 12-24 hours (we'll use 24 for consistency)
    return addHours(submissionDate, config.afterHoursEscalation);
  }
};

export const shouldEscalate = (
  submissionTime: string,
  lastResponseTime?: string,
  config: EscalationConfig = DEFAULT_CONFIG
): boolean => {
  const now = new Date();
  const escalationTime = calculateEscalationTime(submissionTime, config);
  
  // If no response received and escalation time has passed
  if (!lastResponseTime && isAfter(now, escalationTime)) {
    return true;
  }
  
  return false;
};

export const getEscalationStatus = (
  submissionTime: string,
  lastResponseTime?: string,
  config: EscalationConfig = DEFAULT_CONFIG
): {
  shouldEscalate: boolean;
  timeRemaining: string;
  escalationTime: Date;
  priority: 'normal' | 'urgent' | 'critical';
} => {
  const now = new Date();
  const escalationTime = calculateEscalationTime(submissionTime, config);
  const shouldEscalateNow = shouldEscalate(submissionTime, lastResponseTime, config);
  
  // Calculate time remaining
  const timeRemainingMs = escalationTime.getTime() - now.getTime();
  const hoursRemaining = Math.max(0, Math.floor(timeRemainingMs / (1000 * 60 * 60)));
  const minutesRemaining = Math.max(0, Math.floor((timeRemainingMs % (1000 * 60 * 60)) / (1000 * 60)));
  
  let timeRemaining = '';
  if (shouldEscalateNow) {
    timeRemaining = 'Escalation due';
  } else if (hoursRemaining > 0) {
    timeRemaining = `${hoursRemaining}h ${minutesRemaining}m remaining`;
  } else if (minutesRemaining > 0) {
    timeRemaining = `${minutesRemaining}m remaining`;
  } else {
    timeRemaining = 'Escalating soon';
  }
  
  // Determine priority based on time remaining
  let priority: 'normal' | 'urgent' | 'critical' = 'normal';
  if (shouldEscalateNow) {
    priority = 'critical';
  } else if (hoursRemaining <= 2) {
    priority = 'urgent';
  }
  
  return {
    shouldEscalate: shouldEscalateNow,
    timeRemaining,
    escalationTime,
    priority
  };
};