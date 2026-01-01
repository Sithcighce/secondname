"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { VIDEOS } from "@/lib/data";
import VideoItem from "@/components/VideoItem";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Create an "infinite" list by repeating the data - use useMemo to avoid recreating
  const INFINITE_VIDEOS = useMemo(() => 
    Array.from({ length: 50 }).flatMap((_, repeatIndex) => 
      VIDEOS.map((video, videoIndex) => ({
        ...video,
        uniqueIndex: repeatIndex * VIDEOS.length + videoIndex
      }))
    ), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = entry.target.getAttribute("data-index");
            if (index) setActiveIndex(parseInt(index, 10));
          }
        });
      },
      {
        threshold: 0.6, 
      }
    );

    const container = containerRef.current;
    if (container) {
      Array.from(container.children).forEach((child) => {
        observer.observe(child);
      });
    }

    return () => {
      if (container) {
        Array.from(container.children).forEach((child) => {
          observer.unobserve(child);
        });
      }
    };
  }, []); // Empty dependency - observer setup only once

  const handleStartChallenge = () => {
    const currentVideo = INFINITE_VIDEOS[activeIndex];
    const quizId = currentVideo?.quizId || "quiz_default";
    router.push(`/challenge/loading?quizId=${quizId}`);
  };

  return (
    <main className="relative w-full h-full bg-black">
      {/* Scroll Container */}
      <div 
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
      >
        {INFINITE_VIDEOS.map((video) => (
          <div 
            key={video.uniqueIndex} 
            data-index={video.uniqueIndex} 
            className="w-full h-full snap-start"
          >
            <VideoItem data={video} isActive={activeIndex === video.uniqueIndex} />
          </div>
        ))}
      </div>
    </main>
  );
}