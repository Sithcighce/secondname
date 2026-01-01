"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown } from "lucide-react";
import ttsService from "@/lib/ttsService";

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
  const [isLoading, setIsLoading] = useState(false);
  const hasAutoPlayedRef = useRef(false);

  const playAudio = useCallback(async () => {
    if (isPlaying || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await ttsService.play(
        content.english,
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        () => {
          setIsPlaying(false);
          setIsLoading(false);
        }
      );
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error("TTS playback failed:", error);
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [content.english, isPlaying, isLoading]);

  // Auto-play audio ONLY ONCE when this item first appears
  useEffect(() => {
    if (isLast && !hasAutoPlayedRef.current) {
      hasAutoPlayedRef.current = true;
      playAudio();
    }
  }, [isLast]);

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
        className="w-full bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 relative overflow-hidden cursor-pointer group active:scale-[0.99] transition-transform"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
             <h2 className="text-xl font-bold text-gray-800 leading-relaxed">
               {content.english}
             </h2>
             <button 
                onClick={(e) => { e.stopPropagation(); playAudio(); }}
                disabled={isLoading}
                className={`p-3 rounded-full flex-shrink-0 transition-colors shadow-sm ${
                  isLoading 
                    ? "bg-gray-200 text-gray-400 cursor-wait" 
                    : isPlaying 
                    ? "bg-[#FCDC2A] text-white" 
                    : "bg-[#FFFDE7] text-[#F9A825] hover:bg-[#FFF9C4]"
                }`}
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
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-lg text-gray-600 font-medium leading-relaxed">
                    {content.chinese}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!revealed && (
             <div className="text-xs text-center text-gray-400 uppercase font-bold tracking-widest mt-2">
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
             className="flex flex-col items-center gap-2 text-[#88D66C] hover:text-[#76c45b] transition-colors group"
           >
              <div className="w-12 h-12 bg-[#88D66C] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#88D66C]/30 group-hover:scale-110 transition-transform">
                  <ChevronDown size={24} className="animate-bounce" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">Next</span>
           </button>
        </motion.div>
      )}
    </motion.div>
  );
}
