"use client";

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from './ui/animated-button';
import { X, ChevronRight, ChevronLeft, Eye, Info, ZapOff } from 'lucide-react';
import Cookies from 'js-cookie';

interface TourStep {
  target: string;
  title: string;
  content: string | ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export default function TourGuide() {
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<DOMRect | null>(null);
  const [highlight, setHighlight] = useState<DOMRect | null>(null);

  // Tour steps configuration
  const tourSteps: TourStep[] = [
    {
      target: 'nav',
      title: "Welcome to Neural Nexus! 🧠",
      content: (
        <div>
          <p className="mb-2">We're stoked to have you! This quick tour will show you around the sickest AI model marketplace.</p>
          <p className="text-sm text-purple-300">You can skip this tour anytime by clicking the X.</p>
        </div>
      ),
      position: 'bottom'
    },
    {
      target: '.search-bar',
      title: "Find Amazing Models 🔍",
      content: "Quickly search for any AI model you need. Type keywords, model types, or creator names to find exactly what you're looking for.",
      position: 'bottom'
    },
    {
      target: '.categories',
      title: "Browse Categories 🗂️",
      content: "Check out different model categories like Computer Vision, NLP, and more to narrow down your search.",
      position: 'bottom'
    },
    {
      target: '.model-card',
      title: "Explore AI Models 🚀",
      content: "These cards show you all the deets about each model - what it does, pricing, ratings and more. Click to see the full details!",
      position: 'right'
    },
    {
      target: '.upload-button',
      title: "Share Your Models 💎",
      content: "Got your own AI models? Share them with the world and start earning crypto. Click here to upload!",
      position: 'left'
    },
    {
      target: '.user-profile',
      title: "Your Neural Hub 👤",
      content: "Access your dashboard, profile settings, purchased models and more from this menu.",
      position: 'left'
    }
  ];

  useEffect(() => {
    // Check if the user has seen the tour before
    const hasSeenTour = Cookies.get('neural_nexus_tour_completed');
    
    if (!hasSeenTour) {
      // Wait for page to load fully
      const timer = setTimeout(() => {
        setShowTour(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!showTour) return;
    
    // Find the target element for the current tour step
    const findTargetElement = () => {
      const selector = tourSteps[currentStep].target;
      const element = document.querySelector(selector);
      
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetElement(rect);
        setHighlight(rect);
      } else {
        // If element not found, use a default position
        setTargetElement(null);
        setHighlight(null);
      }
    };
    
    findTargetElement();
    
    // Recalculate on window resize
    window.addEventListener('resize', findTargetElement);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', findTargetElement);
    };
  }, [showTour, currentStep, tourSteps]);

  const handleNextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = () => {
    setShowTour(false);
    // Set a cookie to remember that the user has completed the tour
    Cookies.set('neural_nexus_tour_completed', 'true', { expires: 365 }); // Expires in 1 year
  };

  // Calculate tooltip position based on the target element and preferred position
  const getTooltipPosition = () => {
    if (!targetElement) {
      return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
    
    const position = tourSteps[currentStep].position || 'bottom';
    const padding = 20; // Padding from the target element
    
    switch (position) {
      case 'top':
        return {
          bottom: `${window.innerHeight - targetElement.top + padding}px`,
          left: `${targetElement.left + targetElement.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'bottom':
        return {
          top: `${targetElement.bottom + padding}px`,
          left: `${targetElement.left + targetElement.width / 2}px`,
          transform: 'translateX(-50%)'
        };
      case 'left':
        return {
          top: `${targetElement.top + targetElement.height / 2}px`,
          right: `${window.innerWidth - targetElement.left + padding}px`,
          transform: 'translateY(-50%)'
        };
      case 'right':
        return {
          top: `${targetElement.top + targetElement.height / 2}px`,
          left: `${targetElement.right + padding}px`,
          transform: 'translateY(-50%)'
        };
      default:
        return {
          top: `${targetElement.bottom + padding}px`,
          left: `${targetElement.left + targetElement.width / 2}px`,
          transform: 'translateX(-50%)'
        };
    }
  };

  // Get arrow direction based on tooltip position
  const getArrowPosition = () => {
    if (!targetElement) return {};
    
    const position = tourSteps[currentStep].position || 'bottom';
    
    switch (position) {
      case 'top':
        return {
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%) rotate(180deg)',
          borderWidth: '8px 8px 0 8px',
          borderColor: 'rgb(124 58 237 / 0.8) transparent transparent transparent'
        };
      case 'bottom':
        return {
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 8px 8px 8px',
          borderColor: 'transparent transparent rgb(124 58 237 / 0.8) transparent'
        };
      case 'left':
        return {
          top: '50%',
          right: '-8px',
          transform: 'translateY(-50%) rotate(90deg)',
          borderWidth: '8px 8px 0 8px',
          borderColor: 'rgb(124 58 237 / 0.8) transparent transparent transparent'
        };
      case 'right':
        return {
          top: '50%',
          left: '-8px',
          transform: 'translateY(-50%) rotate(-90deg)',
          borderWidth: '8px 8px 0 8px',
          borderColor: 'rgb(124 58 237 / 0.8) transparent transparent transparent'
        };
      default:
        return {
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          borderWidth: '0 8px 8px 8px',
          borderColor: 'transparent transparent rgb(124 58 237 / 0.8) transparent'
        };
    }
  };

  if (!showTour) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Highlight area */}
      {highlight && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bg-transparent border-2 border-purple-500 z-10 pointer-events-none"
          style={{
            top: highlight.top - 4,
            left: highlight.left - 4,
            width: highlight.width + 8,
            height: highlight.height + 8,
            borderRadius: '8px'
          }}
        >
          <motion.div 
            className="absolute inset-0 bg-purple-500/20"
            animate={{ 
              boxShadow: ['0 0 10px 0 rgba(168, 85, 247, 0.3)', '0 0 20px 4px rgba(168, 85, 247, 0.5)', '0 0 10px 0 rgba(168, 85, 247, 0.3)']
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </motion.div>
      )}
      
      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
          className="absolute bg-purple-600/80 backdrop-blur-md p-6 rounded-xl max-w-md pointer-events-auto z-20 border border-purple-500/50 shadow-lg shadow-purple-700/20"
          style={getTooltipPosition()}
        >
          {/* Arrow */}
          <div 
            className="absolute w-0 h-0 border-solid"
            style={getArrowPosition()}
          />
          
          {/* Content */}
          <div className="relative">
            <button 
              onClick={skipTour} 
              className="absolute top-0 right-0 text-white/70 hover:text-white"
              aria-label="Close tour"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex items-center mb-3">
              <Info className="h-5 w-5 mr-2 text-purple-300" />
              <h3 className="text-xl font-bold text-white">{tourSteps[currentStep].title}</h3>
            </div>
            
            <div className="text-white/90 mb-6">
              {tourSteps[currentStep].content}
            </div>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                {tourSteps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full ${
                      idx === currentStep ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex space-x-2">
                {currentStep > 0 && (
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={handlePrevStep}
                  >
                    <span className="flex items-center">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </span>
                  </AnimatedButton>
                )}
                
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  onClick={handleNextStep}
                >
                  <span className="flex items-center">
                    {currentStep < tourSteps.length - 1 ? (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </>
                    ) : (
                      <>
                        Got it!
                      </>
                    )}
                  </span>
                </AnimatedButton>
                
                {currentStep < tourSteps.length - 1 && (
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={skipTour}
                  >
                    <span className="flex items-center text-sm opacity-70 hover:opacity-100">
                      <ZapOff className="h-3 w-3 mr-1" />
                      Skip
                    </span>
                  </AnimatedButton>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
} 