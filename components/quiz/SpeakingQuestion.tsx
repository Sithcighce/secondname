"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

interface Props {
  content: any;
  onComplete: () => void;
}

export default function SpeakingQuestion({ content, onComplete }: Props) {
  const [status, setStatus] = useState<"idle" | "recording" | "success">("idle");

  const startRecording = () => {
    setStatus("recording");
    // Mock recording delay then success
    setTimeout(() => {
      setStatus("success");
    }, 3000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-between h-full py-6">
      <div className="w-full">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-8 text-left">
            Speak this sentence
        </h2>
        
        <div className="flex flex-col gap-4 items-center">
             <div className="p-6 border-2 border-dashed border-gray-300 rounded-2xl w-full text-center">
                <p className="text-2xl font-medium text-gray-700 dark:text-gray-200">
                    "{content.sentence}"
                </p>
             </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full gap-8">
        {/* Waveform Animation Mock */}
        {status === "recording" && (
           <div className="flex items-center gap-1 h-12">
              {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-blue-500 rounded-full"
                    animate={{ height: [10, 40, 10] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                  />
              ))}
           </div>
        )}

        {status === "idle" && (
            <button
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-blue-600 shadow-xl flex items-center justify-center hover:scale-105 transition-transform"
            >
                <Mic size={40} className="text-white" />
            </button>
        )}

        {status === "recording" && (
             <div className="text-blue-500 font-semibold animate-pulse">Listening...</div>
        )}

        {status === "success" && (
            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full"
            >
                <div className="w-full bg-green-100 dark:bg-green-900/30 p-6 rounded-2xl mb-4 text-center">
                    <h3 className="text-green-600 font-bold text-2xl">Excellent!</h3>
                </div>
                <button
                    onClick={onComplete}
                    className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1 transition-all"
                >
                    FINISH
                </button>
            </motion.div>
        )}
      </div>
    </div>
  );
}
