"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, CheckCircle2, ChevronDown } from "lucide-react";

interface QuizContent {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface Props {
  content: QuizContent;
  isLast: boolean;
  onNext: () => void;
  onScore: (isCorrect: boolean) => void;
}

export default function QuizItem({ content, isLast, onNext, onScore }: Props) {
  const [showExplanation, setShowExplanation] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [shuffledOptions] = useState<string[]>(() => {
    const options = [...content.options];
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  });
  const [hasChecked, setHasChecked] = useState(false);

  const handleCheck = () => {
      setShowExplanation(true);
      if (!hasChecked) {
          setHasChecked(true);
          const isCorrect = selected === content.correctAnswer;
          onScore(isCorrect);
      }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-md mx-auto relative z-10"
    >
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col gap-6">
         <div className="flex items-center gap-2 text-indigo-500 font-bold uppercase text-xs tracking-wider">
            <HelpCircle size={16} />
            Quick Quiz
         </div>
         <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {content.question}
         </h3>

        <div className="flex flex-col gap-3">
            {shuffledOptions.map((opt: string, idx: number) => {
                const isSelected = selected === opt;
                const isCorrect = opt === content.correctAnswer;
                
                let style = "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-300";
                
                if (showExplanation) {
                    if (isCorrect) style = "bg-green-100 dark:bg-green-900/30 border-green-500 ring-1 ring-green-500";
                    else if (isSelected) style = "bg-red-50 dark:bg-red-900/20 border-red-200 opacity-50";
                    else style = "opacity-50 bg-gray-50 dark:bg-gray-900 border-transparent";
                } else if (isSelected) {
                     style = "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500";
                }

                return (
                    <button
                        key={idx}
                        disabled={showExplanation}
                        onClick={() => setSelected(opt)}
                        className={`p-4 rounded-2xl border-2 text-left font-medium transition-all ${style}`}
                    >
                        {opt}
                    </button>
                )
            })}
        </div>

        {!showExplanation ? (
             <button 
                onClick={handleCheck}
                disabled={!selected}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg mt-2 transition-all"
             >
                CHECK ANSWER
             </button>
        ) : (
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900"
            >
                <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                    <CheckCircle2 size={18} />
                    Explanation
                </div>
                <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    {content.explanation}
                </p>
            </motion.div>
        )}
      </div>

       {/* Next Button (Only if last and explanation shown) */}
       {isLast && showExplanation && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 mb-12"
        >
           <button
             onClick={onNext}
             className="flex flex-col items-center gap-2 text-indigo-500 hover:text-indigo-600 transition-colors group"
           >
              <div className="w-12 h-12 bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                  <ChevronDown size={24} className="animate-bounce" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Next</span>
           </button>
        </motion.div>
      )}
    </motion.div>
  );
}
