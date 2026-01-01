"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BrainCircuit, Wand2, Sparkles } from "lucide-react";

const STEPS = [
  { text: "题目生成中...", icon: BrainCircuit },
  { text: "正在适配您的难度...", icon: Wand2 },
  { text: "正在生成趣味问答...", icon: Sparkles },
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId") || "quiz_default";
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Cycle through steps
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1500); // 1.5s per step

    // Redirect after all steps
    const timeout = setTimeout(() => {
      router.push(`/challenge/quiz?quizId=${quizId}`);
    }, 1500 * STEPS.length + 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [router, quizId]);

  const CurrentIcon = STEPS[stepIndex].icon;

  return (
      <div className="z-10 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="flex flex-col items-center gap-6"
          >
            <div className="p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-2xl">
              <CurrentIcon className="w-16 h-16 text-yellow-300 animate-pulse" />
            </div>
            
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-pink-200">
              {STEPS[stepIndex].text}
            </h2>
          </motion.div>
        </AnimatePresence>

        <motion.div 
            className="mt-12 flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
             <Loader2 className="animate-spin text-white/50" />
        </motion.div>
      </div>
  );
}

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-950 text-white p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[100px] opacity-30" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600 rounded-full blur-[100px] opacity-30" />
      
      <Suspense fallback={<div className="text-white">Loading...</div>}>
         <LoadingContent />
      </Suspense>
    </div>
  );
}
