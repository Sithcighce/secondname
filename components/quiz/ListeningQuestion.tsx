"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, CheckCircle2 } from "lucide-react";

interface Props {
  content: any;
  onComplete: () => void;
}

export default function ListeningQuestion({ content, onComplete }: Props) {
  const [playingId, setPlayingId] = useState<number | null>(null);

  const playAudio = (id: number) => {
    if (playingId) return; // Prevent multiple plays
    setPlayingId(id);
    // Mock play duration
    setTimeout(() => {
      setPlayingId(null);
    }, 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        Listen to the sentences
      </h2>
      
      <div className="flex flex-col gap-4">
        {content.sentences.map((item: any) => {
          const isPlaying = playingId === item.id;
          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playAudio(item.id)}
              className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                isPlaying
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}
            >
              <div className={`p-3 rounded-full ${isPlaying ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-700"}`}>
                <Volume2 size={24} className={isPlaying ? "animate-pulse" : ""} />
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{item.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onComplete}
        className="mt-8 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 transition-all"
      >
        CONTINUE
      </button>
    </div>
  );
}
