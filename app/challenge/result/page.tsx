"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, RotateCcw } from "lucide-react";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showButton, setShowButton] = useState(false);

  const score = parseInt(searchParams.get("score") || "0", 10);
  const total = parseInt(searchParams.get("total") || "1", 10);
  const percentage = (score / total) * 100;

  let stars = 0;
  if (percentage >= 80) stars = 3;
  else if (percentage >= 50) stars = 2;
  else if (percentage > 0) stars = 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2500); // Button appears after stars animation
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden relative">
        {/* Background rays */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 animate-[spin_20s_linear_infinite]">
             <div className="w-[200vw] h-[200vw] bg-[conic-gradient(from_0deg,transparent_0_20deg,white_20deg_40deg,transparent_40deg_60deg,white_60deg_80deg,transparent_80deg_100deg,white_100deg_120deg,transparent_120deg_140deg,white_140deg_160deg,transparent_160deg_180deg,white_180deg_200deg,transparent_200deg_220deg,white_220deg_240deg,transparent_240deg_260deg,white_260deg_280deg,transparent_280deg_300deg,white_300deg_320deg,transparent_320deg_340deg,white_340deg_360deg)]"></div>
        </div>

      <div className="z-10 flex flex-col items-center">
        <h1 className="text-4xl font-black text-[#F9A825] mb-2 drop-shadow-sm tracking-wider">
            {stars === 3 ? "PERFECT!" : stars >= 1 ? "GOOD JOB!" : "KEEP TRYING!"}
        </h1>
        
        <p className="text-gray-700 text-lg mb-10 font-medium">
            Score: {score} / {total}
        </p>

        <div className="flex gap-4 mb-16 h-24">
          {[0, 1, 2].map((i) => {
            const isActive = i < stars;
            return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ 
                      delay: i * 0.5 + 0.5, 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 10 
                  }}
                >
                  <div className="relative">
                     <Star 
                        size={80} 
                        className={`drop-shadow-xl transition-colors duration-500 ${isActive ? "text-[#FCDC2A] fill-[#FCDC2A]" : "text-gray-300 fill-gray-200"}`}
                        strokeWidth={1}
                     />
                     {isActive && (
                        <motion.div 
                            initial={{ scale: 1, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ delay: i * 0.5 + 0.8, duration: 0.5 }}
                            className="absolute inset-0 bg-yellow-200 rounded-full blur-xl"
                        />
                     )}
                  </div>
                </motion.div>
            );
          })}
        </div>

        <div className="h-16">
            {showButton && (
                <motion.button
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push("/")}
                    className="bg-[#88D66C] text-white font-bold text-xl py-4 px-12 rounded-full shadow-xl flex items-center gap-2 hover:bg-[#76c45b] transition-colors"
                >
                    <RotateCcw size={24} />
                    Back to Feed
                </motion.button>
            )}
        </div>
      </div>
    </div>
  );
}

export default function ResultPage() {
    return (
        <Suspense fallback={<div className="text-white text-center p-10">Loading results...</div>}>
            <ResultContent />
        </Suspense>
    )
}
