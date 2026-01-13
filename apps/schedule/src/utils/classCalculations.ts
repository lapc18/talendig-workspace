import { differenceInMonths, startOfMonth, format, parseISO, getDay } from 'date-fns';
import type { Module, Instructor } from '@talendig/shared';

/**
 * Calculate the current module number based on cohort start date and today
 * If cohort started Nov 1, 2025 and today is Jan 12, 2026:
 * - Month 1: Nov 1 - Nov 30
 * - Month 2: Dec 1 - Dec 31
 * - Month 3: Jan 1 - Jan 31 (current)
 * Returns the month number (1-10)
 */
export const calculateCurrentModule = (cohortStartDate: string): number => {
  const start = startOfMonth(new Date(cohortStartDate));
  const today = startOfMonth(new Date());
  
  // Calculate the difference in months
  const monthsDiff = differenceInMonths(today, start) + 1;
  
  // Clamp between 1 and 10 (programs have 10 modules)
  return Math.max(1, Math.min(10, monthsDiff));
};

/**
 * Calculate time range from module hours and dates
 * Attempts to estimate time range based on module hours
 * Format: "9:00 AM - 12:00 PM" or similar
 */
export const calculateTimeRange = (module: Module): string => {
  if (!module.startDate || !module.endDate) {
    return 'TBD';
  }

  try {
    const startDate = parseISO(module.startDate);
    const endDate = parseISO(module.endDate);
    
    // If we have hours, estimate time range
    // Assume 4 hours per day as default, or calculate from total hours
    if (module.hours > 0) {
      // Estimate: if module has 24 hours over 4 weeks, that's ~6 hours/week
      // For a typical day, assume 3-4 hours
      const hoursPerDay = Math.ceil(module.hours / 20); // Assume ~20 working days
      const startHour = 9; // Default start time
      const endHour = startHour + Math.min(hoursPerDay, 6); // Cap at 6 hours
      
      // Create new date objects to avoid mutation
      const startTimeDate = new Date(startDate);
      startTimeDate.setHours(startHour, 0, 0, 0);
      const endTimeDate = new Date(startDate);
      endTimeDate.setHours(endHour, 0, 0, 0);
      
      const startTime = format(startTimeDate, 'h:mm a');
      const endTime = format(endTimeDate, 'h:mm a');
      
      return `${startTime} - ${endTime}`;
    }
    
    // Fallback: use default business hours
    return '9:00 AM - 12:00 PM';
  } catch (error) {
    console.error('Error calculating time range:', error);
    return 'TBD';
  }
};

/**
 * Format schedule from module
 * Returns formatted string like "Mon, Wed • 18:00 - 20:00"
 */
export const formatSchedule = (module: Module): string => {
  if (!module.startDate) {
    return 'TBD';
  }

  try {
    const startDate = parseISO(module.startDate);
    const dayOfWeek = getDay(startDate); // 0 = Sunday, 1 = Monday, etc.
    
    // Map day numbers to abbreviations
    const dayAbbr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayAbbr[dayOfWeek];
    
    // Generate a typical schedule pattern based on day
    // Common patterns: Mon/Wed, Tue/Thu, Fri only, Sat only
    let daysPattern = dayName;
    if (dayOfWeek === 1) { // Monday
      daysPattern = 'Mon, Wed';
    } else if (dayOfWeek === 2) { // Tuesday
      daysPattern = 'Tue, Thu';
    } else if (dayOfWeek === 5) { // Friday
      daysPattern = 'Fri';
    } else if (dayOfWeek === 6) { // Saturday
      daysPattern = 'Sat';
    }
    
    // Use time based on day of week pattern
    // Common patterns from the HTML example
    const timeMap: Record<number, string> = {
      1: '18:00 - 20:00', // Mon/Wed evening
      2: '09:00 - 11:00', // Tue/Thu morning
      5: '14:00 - 18:00', // Fri afternoon
      6: '10:00 - 14:00', // Sat morning
    };
    const timeStr = timeMap[dayOfWeek] || '09:00 - 12:00';
    
    return `${daysPattern} • ${timeStr}`;
  } catch (error) {
    console.error('Error formatting schedule:', error);
    return 'TBD';
  }
};

/**
 * Get instructor display name, handling "To be assigned" state
 */
export const getInstructorDisplayName = (instructor?: Instructor | null): string => {
  if (!instructor) {
    return 'To be assigned';
  }
  
  return instructor.fullName || 'To be assigned';
};

/**
 * Check if instructor is "To be assigned"
 */
export const isInstructorToBeAssigned = (instructor?: Instructor | null): boolean => {
  if (!instructor) {
    return true;
  }
  
  return instructor.fullName?.toLowerCase() === 'to be assigned' || !instructor.fullName;
};
