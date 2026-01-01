"use client";

import { useState, useRef, useEffect } from "react";
import { VIDEOS } from "@/lib/data";
import VideoItem from "@/components/VideoItem";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

export default function Home() {
  const [activeId, setActiveId] = useState(VIDEOS[0].id);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Create an "infinite" list by repeating the data 50 times
  const INFINITE_VIDEOS = Array.from({ length: 50 }).flatMap(() => VIDEOS);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get the ID from the dataset
            const id = entry.target.getAttribute("data-id");
            if (id) setActiveId(id);
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
         // eslint-disable-next-line react-hooks/exhaustive-deps
        Array.from(container.children).forEach((child) => {
          observer.unobserve(child);
        });
      }
    };
  }, [INFINITE_VIDEOS]); // Add dependency

  const handleStartChallenge = () => {
    // Determine the current "logical" video ID (since activeId might come from a duplicate)
    // Actually, activeId is still the original ID (e.g., "1", "2"), so logic remains same!
    const currentVideo = VIDEOS.find(v => v.id === activeId);
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
        {INFINITE_VIDEOS.map((video, index) => (
          // Use index in key to ensure uniqueness for duplicates
          <div key={`${video.id}-${index}`} data-id={video.id} className="w-full h-full snap-start">
            {/* We pass a unique key prop to trigger re-mounts if needed, 
                but active state checks the shared 'id' */}
            <VideoItem data={video} isActive={activeId === video.id} />
          </div>
        ))}
      </div>
    </main>
  );
}