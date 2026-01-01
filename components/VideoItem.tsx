"use client";

import { useRef, useEffect, useState } from "react";
import { VideoItem as VideoItemType } from "@/lib/data";
import { Heart, MessageCircle, Share2, Music2, VolumeX, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface VideoItemProps {
  data: VideoItemType;
  isActive: boolean;
}

export default function VideoItem({ data, isActive }: VideoItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes);
  const hasPlayedRef = useRef(false);
  const router = useRouter();

  const handleStartChallenge = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling play/pause
    const quizId = data.quizId || "quiz_default";
    router.push(`/challenge/loading?quizId=${quizId}`);
  };

  const toggleLike = () => {
    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // 只在第一次激活时重置到开头
      if (!hasPlayedRef.current) {
        video.currentTime = 0;
        hasPlayedRef.current = true;
      }

      // 尝试播放
      const playVideo = async () => {
        try {
          video.muted = false;
          await video.play();
          setIsMuted(false);
        } catch (error) {
          // 降级为静音播放（浏览器自动播放策略）
          try {
            video.muted = true;
            setIsMuted(true);
            await video.play();
          } catch (e) {
            console.error("Video play failed:", e);
          }
        }
      };
      
      playVideo();
    } else {
      // 暂停视频
      video.pause();
      setIsPlaying(false);
      hasPlayedRef.current = false; // 重置，下次滑回来时从头播放
    }
  }, [isActive]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(e => console.error("Play failed:", e));
      }
    } else {
      video.pause();
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
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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

      {/* Start Lesson Button */}
      <div className="absolute top-12 right-4 z-50">
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleStartChallenge}
          className="flex flex-col items-center gap-1 group"
        >
          <div className="relative">
             <div className="absolute inset-0 bg-pink-500 rounded-full blur opacity-75 animate-pulse group-hover:opacity-100 transition-opacity"></div>
             <div className="relative w-12 h-12 bg-gradient-to-tr from-rose-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                <Sparkles className="text-white w-6 h-6 animate-pulse" />
             </div>
          </div>
          <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">Start Lesson</span>
        </motion.button>
      </div>

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
        <ActionIcon 
          icon={Heart} 
          label={likeCount.toString()} 
          color={isLiked ? "#ef4444" : "white"} 
          fill={isLiked ? "#ef4444" : "transparent"} 
          onClick={toggleLike}
        />
        <ActionIcon icon={MessageCircle} label="452" color="white" />
        <ActionIcon icon={Share2} label="Share" color="white" />
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

interface ActionIconProps {
  icon: React.ElementType;
  label: string;
  color: string;
  fill?: string;
  onClick?: () => void;
}

function ActionIcon({ icon: Icon, label, color, fill = "transparent", onClick }: ActionIconProps) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group cursor-pointer">
      <div className="p-2 bg-black/20 rounded-full backdrop-blur-[2px] transition-transform active:scale-90 group-hover:bg-black/30">
        <Icon size={28} color={color} fill={fill} strokeWidth={1.5} />
      </div>
      <span className="text-xs font-medium text-white drop-shadow-md">{label}</span>
    </button>
  );
}
