import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { checkPasswordStrength } from '@/lib/validation';

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ 
  password,
  className
}) => {
  const { strength, score, message } = checkPasswordStrength(password);
  
  // Don't show anything if password is empty
  if (!password) {
    return null;
  }
  
  // Calculate percentage for the progress bar
  const strengthPercentage = (score / 6) * 100;
  
  // Determine color based on strength
  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'bg-red-500';
      case 'mid':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      case 'fire':
        return 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Determine emoji based on strength
  const getStrengthEmoji = () => {
    switch (strength) {
      case 'weak':
        return '😬';
      case 'mid':
        return '😐';
      case 'strong':
        return '😊';
      case 'fire':
        return '🔥';
      default:
        return '';
    }
  };
  
  return (
    <div className={cn("mt-2", className)}>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center">
          <span className="text-xs font-medium mr-1">
            {strength.charAt(0).toUpperCase() + strength.slice(1)}
          </span>
          <span className="text-sm">{getStrengthEmoji()}</span>
        </div>
        <span className="text-xs text-gray-400">{score}/6</span>
      </div>
      
      <div className="h-1.5 w-full bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", getStrengthColor())}
          initial={{ width: 0 }}
          animate={{ width: `${strengthPercentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      
      {message && (
        <motion.p 
          className="text-xs mt-1 text-gray-300"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {message}
        </motion.p>
      )}
      
      {strength !== 'weak' && (
        <motion.div 
          className="flex flex-wrap gap-1 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <RequirementBadge met={/[a-z]/.test(password)}>a-z</RequirementBadge>
          <RequirementBadge met={/[A-Z]/.test(password)}>A-Z</RequirementBadge>
          <RequirementBadge met={/[0-9]/.test(password)}>0-9</RequirementBadge>
          <RequirementBadge met={/[^a-zA-Z0-9]/.test(password)}>!@#</RequirementBadge>
          <RequirementBadge met={password.length >= 8}>8+</RequirementBadge>
          <RequirementBadge met={password.length >= 12}>12+</RequirementBadge>
        </motion.div>
      )}
    </div>
  );
};

interface RequirementBadgeProps {
  children: React.ReactNode;
  met: boolean;
}

const RequirementBadge: React.FC<RequirementBadgeProps> = ({ children, met }) => {
  return (
    <span 
      className={cn(
        "text-xs px-1.5 py-0.5 rounded-md",
        met ? "bg-purple-900/50 text-purple-200" : "bg-gray-800 text-gray-400"
      )}
    >
      {children}
    </span>
  );
}; 