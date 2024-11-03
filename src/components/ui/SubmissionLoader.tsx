// components/ui/SubmissionLoader.tsx
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface LoaderProps {
  onComplete?: () => void;
}

export function SubmissionLoader({ onComplete }: LoaderProps) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(2), 2000);
    const timer2 = setTimeout(() => setStep(3), 4000);
    const timer3 = setTimeout(() => {
      setStep(4);
      if (onComplete) onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4"
      >
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <motion.div
              className="bg-indigo-600 h-2 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step >= 1 ? 1 : 0, y: 0 }}
            className="flex items-center space-x-4"
          >
            <div className={`rounded-full p-2 ${step > 1 ? 'bg-green-100' : 'bg-indigo-100'}`}>
              {step > 1 ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"
                />
              )}
            </div>
            <span className="text-lg">Compiling information...</span>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step >= 2 ? 1 : 0, y: 0 }}
            className="flex items-center space-x-4"
          >
            <div className={`rounded-full p-2 ${step > 2 ? 'bg-green-100' : 'bg-indigo-100'}`}>
              {step > 2 ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : step === 2 ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"
                />
              ) : null}
            </div>
            <span className="text-lg">Transporting to our analysts...</span>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: step >= 3 ? 1 : 0, y: 0 }}
            className="flex items-center space-x-4"
          >
            <div className={`rounded-full p-2 ${step > 3 ? 'bg-green-100' : 'bg-indigo-100'}`}>
              {step > 3 ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : step === 3 ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"
                />
              ) : null}
            </div>
            <span className="text-lg">Almost there...</span>
          </motion.div>

          {/* Completion Message */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-green-600 mb-2">
                Received by our analysts!
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We'll start processing your submission right away.
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}