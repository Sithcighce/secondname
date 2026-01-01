"use client";

import { useRef, useEffect, useState } from "react";
import { VideoItem as VideoItemType } from "@/lib/data";
import { Heart, MessageCircle, Share2, Music2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

interface VideoItemProps {
  data: VideoItemType;
  isActive: boolean;
}

export default function VideoItem({ data, isActive }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      const video = videoRef.current;
      
      // Reset to beginning when appearing
      video.currentTime = 0;

      // 1. Try to play with sound
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsMuted(false);
          })
          .catch((error) => {
            console.log("Autoplay with sound prevented, switching to muted:", error);
            // 2. Fallback: Play muted
            video.muted = true;
            video.play()
              .then(() => {
                setIsPlaying(true);
                setIsMuted(true);
              })
              .catch((e) => console.error("Autoplay failed completely", e));
          });
      }
    } else {
      videoRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (videoRef.current) {
          videoRef.current.muted = !isMuted;
          setIsMuted(!isMuted);
      }
  }

  return (
    <div className="relative w-full h-full snap-start flex-shrink-0 bg-black overflow-hidden flex items-center justify-center">
      <video
        ref={videoRef}
        src={data.url}
        className={`w-full h-full ${data.layout === 'landscape' ? 'object-contain' : 'object-cover'}`}
        loop
        playsInline
        onClick={togglePlay}
        // muted attribute is managed by react state/ref
      />

      {/* Mute Indicator / Toggle */}
      {isMuted && isPlaying && (
          <button 
            onClick={toggleMute}
            className="absolute top-20 left-4 z-50 bg-black/40 backdrop-blur-md p-2 rounded-full text-white/80 border border-white/20 animate-pulse"
          >
              <VolumeX size={20} />
          </button>
      )}

      {/* Overlay UI */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent pt-20 pointer-events-none">
        <div className="flex flex-col gap-2 mb-4 pointer-events-auto">
          <h3 className="font-bold text-lg text-white shadow-black drop-shadow-md">{data.username}</h3>
          <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">
            {data.description}
          </p>
          <div className="flex items-center gap-2 text-white/80 text-xs mt-1">
             <Music2 size={14} className="animate-spin-slow" />
             <span>Original Sound - {data.username}</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar Actions */}
      <div className="absolute bottom-20 right-2 flex flex-col items-center gap-6 z-10">
        <ActionIcon icon={Heart} label={data.likes.toString()} color="white" />
        <ActionIcon icon={MessageCircle} label="452" color="white" />
        <ActionIcon icon={Share2} label="Share" color="white" />
        
        {/* Rotating Disc Animation (Music) */}
        <div className="w-10 h-10 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center overflow-hidden animate-spin-slow mt-4">
           <div className="w-6 h-6 rounded-full bg-cover bg-center" style={{backgroundImage: 'url(https://github.com/shadcn.png)'}}></div>
        </div>
      </div>
      
      {/* Play/Pause Indicator (Optional) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-sm">
             <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[20px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionIcon({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="p-2 bg-black/20 rounded-full backdrop-blur-[2px]">
        <Icon size={28} color={color} fill={color === "red" ? "red" : "transparent"} strokeWidth={1.5} />
      </div>
      <span className="text-xs font-medium text-white drop-shadow-md">{label}</span>
    </div>
  );
}
