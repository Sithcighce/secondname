"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, CheckCircle2 } from "lucide-react";
import ttsService from "@/lib/ttsService";

interface Props {
  content: any;
  onComplete: () => void;
}

export default function ListeningQuestion({ content, onComplete }: Props) {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const playAudio = async (id: number, text: string) => {
    if (playingId || isLoading) return;
    
    setIsLoading(true);
    setPlayingId(id);

    try {
      await ttsService.play(
        text,
        () => {
          setPlayingId(null);
          setIsLoading(false);
        },
        () => {
          setPlayingId(null);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("TTS playback failed:", error);
      setPlayingId(null);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Listen to the sentences
      </h2>
      
      <div className="flex flex-col gap-4">
        {content.sentences.map((item: any) => {
          const isPlaying = playingId === item.id;
          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playAudio(item.id, item.text)}
              className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                isPlaying
                  ? "border-[#FCDC2A] bg-[#FFFDE7]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className={`p-3 rounded-full ${isPlaying ? "bg-[#FCDC2A] text-white" : "bg-gray-100 text-gray-400"}`}>
                <Volume2 size={24} className={isPlaying ? "animate-pulse" : ""} />
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-700">{item.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onComplete}
        className="mt-8 w-full bg-[#88D66C] hover:bg-[#76c45b] text-white font-bold py-4 rounded-xl shadow-lg border-b-4 border-[#68a652] active:border-b-0 active:translate-y-1 transition-all"
      >
        CONTINUE
      </button>
    </div>
  );
}
