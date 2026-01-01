"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";

interface Pair {
  id: string;
  left: string;
  right: string;
}

interface Content {
  pairs: Pair[];
}

interface Props {
  content: Content;
  isLast: boolean;
  onNext: () => void;
  onScore: (isCorrect: boolean) => void;
}

export default function MatchingItem({ content, isLast, onNext, onScore }: Props) {
  const [pairs] = useState<Pair[]>(content.pairs);
  const [shuffledRight, setShuffledRight] = useState<Pair[]>([]); // Random right side
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]); // Array of pair IDs
  const [hasScored, setHasChecked] = useState(false);

  useEffect(() => {
     // Shuffle logic for right column
     const rightItems = [...content.pairs];
     for (let i = rightItems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rightItems[i], rightItems[j]] = [rightItems[j], rightItems[i]];
     }
     setShuffledRight(rightItems);
  }, [content.pairs]);

  useEffect(() => {
     if (leftSelected && rightSelected) {
         // Find pair
         const pair = pairs.find((p) => p.left === leftSelected && p.right === rightSelected);
         
         if (pair) {
             // Match!
             const newMatched = [...matched, pair.id];
             setMatched(newMatched);
             setLeftSelected(null);
             setRightSelected(null);
             
             // Check if game complete
             if (newMatched.length === pairs.length && !hasScored) {
                setHasChecked(true);
                onScore(true); // Award points for completion
             }
         } else {
             // No match, clear after delay
             const timer = setTimeout(() => {
               setLeftSelected(null);
               setRightSelected(null);
             }, 500);
             return () => clearTimeout(timer);
         }
     }
  }, [leftSelected, rightSelected, pairs, matched, hasScored, onScore]);

  const isCompleted = matched.length === pairs.length;
  // Use shuffledRight if available, otherwise fallback to pairs (SSR safety)
  const rightDisplay = shuffledRight.length > 0 ? shuffledRight : pairs;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-md mx-auto relative z-10"
    >
      <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Match the words
        </h2>

        <div className="flex w-full gap-4 justify-between">
            {/* Left Column - Fixed Order */}
            <div className="flex flex-col gap-3 flex-1">
                {pairs.map((p) => {
                    const isMatched = matched.includes(p.id);
                    const isSelected = leftSelected === p.left;
                    
                    if (isMatched) return <div key={p.id} className="h-14 opacity-0" />; 

                    return (
                        <motion.button
                            key={p.left}
                            layout
                            onClick={() => setLeftSelected(p.left)}
                            animate={{ 
                                scale: isSelected ? 1.05 : 1,
                                backgroundColor: isSelected ? "#8b5cf6" : "#ffffff",
                                color: isSelected ? "#ffffff" : "#1f2937"
                            }}
                            className="h-14 rounded-xl shadow-sm border-2 border-purple-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-medium flex items-center justify-center text-xs"
                        >
                            {p.left}
                        </motion.button>
                    )
                })}
            </div>

            {/* Right Column - Randomized */}
            <div className="flex flex-col gap-3 flex-1">
                {rightDisplay.map((p) => {
                    const isMatched = matched.includes(p.id);
                    const isSelected = rightSelected === p.right;
                    
                    if (isMatched) return <div key={p.id} className="h-14 opacity-0" />;

                    return (
                        <motion.button
                            key={p.right}
                            layout
                            onClick={() => setRightSelected(p.right)}
                            animate={{ 
                                scale: isSelected ? 1.05 : 1,
                                backgroundColor: isSelected ? "#ec4899" : "#ffffff",
                                color: isSelected ? "#ffffff" : "#1f2937"
                            }}
                            className="h-14 rounded-xl shadow-sm border-2 border-pink-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white font-medium flex items-center justify-center text-xs"
                        >
                            {p.right}
                        </motion.button>
                    )
                })}
            </div>
        </div>

        {isCompleted && (
             <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-6 flex justify-center"
             >
                 <div className="bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold flex items-center gap-2 border border-green-200 text-sm">
                    <Check size={18} />
                    All Matched!
                 </div>
             </motion.div>
        )}
      </div>

       {/* Next Button (Only if last and completed) */}
       {isLast && isCompleted && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 mb-12"
        >
           <button
             onClick={onNext}
             className="flex flex-col items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors group"
           >
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                  <ChevronDown size={24} className="animate-bounce" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Finish</span>
           </button>
        </motion.div>
      )}
    </motion.div>
  );
}
