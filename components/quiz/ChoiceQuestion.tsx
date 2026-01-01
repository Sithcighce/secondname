"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  content: any;
  onComplete: () => void;
}

export default function ChoiceQuestion({ content, onComplete }: Props) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsChecked(true);
    // In a real app, we check correctness here.
    // For this demo, we assume the user is always right or just proceed.
  };

  return (
    <div className="w-full flex flex-col gap-6 h-full">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        {content.question}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {content.options.map((option: string) => {
          const isSelected = selectedOption === option;
          let containerClass = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800";
          
          if (isSelected) {
            containerClass = "border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500";
          }
          if (isChecked && isSelected) {
            // Mock Correct Answer style
             containerClass = "border-green-500 bg-green-50 dark:bg-green-900/20 ring-2 ring-green-500";
          }

          return (
            <motion.button
              key={option}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isChecked && setSelectedOption(option)}
              className={`p-6 rounded-xl border-2 text-left font-semibold text-lg transition-all ${containerClass}`}
              disabled={isChecked}
            >
              {option}
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto">
        {!isChecked ? (
             <button
             onClick={handleCheck}
             disabled={!selectedOption}
             className="w-full bg-green-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-400 text-white font-bold py-4 rounded-xl shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
           >
             CHECK
           </button>
        ) : (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 dark:bg-green-900/30 p-4 rounded-xl border-2 border-green-500 flex flex-col gap-4"
            >
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl">
                    <div className="bg-green-500 text-white rounded-full p-1">
                        <Check size={20} />
                    </div>
                    Correct!
                </div>
                <button
                    onClick={onComplete}
                    className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-md transition-all"
                >
                    CONTINUE
                </button>
            </motion.div>
        )}
       
      </div>
    </div>
  );
}
