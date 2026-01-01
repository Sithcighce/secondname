"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LESSONS, LessonItem } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import StoryItem from "@/components/lesson/StorySlide";
import QuizItem from "@/components/lesson/QuizSlide";
import MatchingItem from "@/components/lesson/MatchingSlide";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizId = searchParams.get("quizId") || "lesson_default";
  
  const lesson = LESSONS[quizId] || LESSONS["lesson_default"];
  const items = lesson.items;

  // Calculate total scorable items (quiz + match)
  const totalScorable = items.filter(i => i.type === 'quiz' || i.type === 'match').length;

  const [visibleCount, setVisibleCount] = useState(1);
  const [score, setScore] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.slice(0, visibleCount);
  const progress = (visibleCount / items.length) * 100;

  useEffect(() => {
     // Scroll the new item into view, aligning its top with the viewport
     if (visibleCount > 0) {
        // Delay slightly to allow Framer Motion to mount the element
        setTimeout(() => {
            const lastIndex = visibleCount - 1;
            const element = document.getElementById(`lesson-item-${lastIndex}`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 100);
     }
  }, [visibleCount]);

  const handleScore = (isCorrect: boolean) => {
      if (isCorrect) {
          setScore(prev => prev + 1);
      }
  };

  const handleNext = () => {
    if (visibleCount < items.length) {
      setVisibleCount(prev => prev + 1);
    } else {
      router.push(`/challenge/result?score=${score}&total=${totalScorable}`);
    }
  };

  const handleExit = () => {
      router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black text-black dark:text-white max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800 sticky top-0 shadow-sm">
        <button onClick={handleExit} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
        </button>
        {/* Progress Bar */}
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timeline Content Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 scroll-smooth relative">
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800 -translate-x-1/2 z-0" />

        <div className="flex flex-col gap-12">
            <AnimatePresence mode="popLayout">
                {visibleItems.map((item: LessonItem, index: number) => {
                    const isLast = index === visibleItems.length - 1;
                    
                    return (
                        <div 
                            key={item.id} 
                            id={`lesson-item-${index}`}
                            className="w-full scroll-mt-24" // scroll-mt-24 ensures it doesn't go under the sticky header
                        >
                            {item.type === "story" && (
                                <StoryItem content={item.content} isLast={isLast} onNext={handleNext} />
                            )}
                            {item.type === "quiz" && (
                                <QuizItem content={item.content} isLast={isLast} onNext={handleNext} onScore={handleScore} />
                            )}
                            {item.type === "match" && (
                                <MatchingItem content={item.content} isLast={isLast} onNext={handleNext} onScore={handleScore} />
                            )}
                        </div>
                    );
                })}
            </AnimatePresence>
            {/* Extra space at bottom to allow comfortable scrolling for the last item */}
            <div className="h-32" />
        </div>
      </div>
    </div>
  );

}

export default function QuizPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Loading lesson...</div>}>
            <QuizContent />
        </Suspense>
    )
}