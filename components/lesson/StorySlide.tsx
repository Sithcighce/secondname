"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown } from "lucide-react";

interface StoryContent {
  english: string;
  chinese: string;
  audio?: string;
}

interface Props {
  content: StoryContent;
  isLast: boolean;
  onNext: () => void;
}

export default function StoryItem({ content, isLast, onNext }: Props) {
  const [revealed, setRevealed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // Stop any currently playing audio
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(content.english);
      utterance.lang = "en-US"; // Set to American English
      utterance.rate = 0.9;     // Slightly slower for learning
      
      // Update state when speaking starts and ends
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback for browsers without support
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  }, [content.english]);

  // Auto-play audio when this item first appears (if it is the last one added)
  useEffect(() => {
    if (isLast) {
      playAudio();
    }
  }, [isLast, playAudio]);

  const toggleReveal = () => {
    setRevealed(!revealed);
    if (!revealed) playAudio();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center w-full max-w-md mx-auto relative z-10"
    >
      {/* Connector Line (Top) - Optional visually, handled by parent usually, but we can add decor */}
      
      {/* Card */}
      <div 
        onClick={toggleReveal}
        className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden cursor-pointer group active:scale-[0.99] transition-transform"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
               {content.english}
             </h2>
             <button 
                onClick={(e) => { e.stopPropagation(); playAudio(); }}
                className={`p-3 rounded-full flex-shrink-0 transition-colors shadow-sm ${isPlaying ? "bg-blue-500 text-white" : "bg-gray-50 dark:bg-gray-700 text-blue-500"}`}
             >
                <Volume2 size={20} className={isPlaying ? "animate-pulse" : ""} />
             </button>
          </div>

          {/* Chinese Reveal */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-lg text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                    {content.chinese}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!revealed && (
             <div className="text-xs text-center text-gray-300 dark:text-gray-600 uppercase font-bold tracking-widest mt-2">
                Tap to translate
             </div>
          )}
        </div>
      </div>

      {/* Next Button (Only if last) */}
      {isLast && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 mb-12"
        >
           <button
             onClick={onNext}
             className="flex flex-col items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors group"
           >
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                  <ChevronDown size={24} className="animate-bounce" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Next</span>
           </button>
        </motion.div>
      )}
    </motion.div>
  );
}
