import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from "motion/react";
import { User, Mail, Phone, MapPin, Briefcase, PenTool, Cpu, TrendingUp, ArrowDown, ExternalLink, Play, Image as ImageIcon, FileText, X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface ProjectMedia {
  type: 'image' | 'vertical-image' | 'square-image' | 'video' | 'external_video';
  text: string;
  src: string;
  link?: string;
  thumbnail?: string;
  id?: string;
}

interface EditorialItem {
  url: string;
  title: string;
  thumbnail: string;
}

interface Project {
  id: string;
  title: string;
  strategy?: string;
  images?: ProjectMedia[];
  url?: string;
}

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const getAcceleratedUrl = (url: string) => {
  if (!url || !url.includes('github.com')) return url;

  // 将 github.com/用户名/仓库名/raw/分支名/ 
  // 转换为 cdn.jsdelivr.net/gh/用户名/仓库名@分支名/
  return url
    .replace('github.com', 'cdn.jsdelivr.net/gh')
    .replace('/raw/', '@'); 
};

const PhotoStack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fixed order: 1,2 are Square (Life); 3,4 are Vertical (Work)
  const cards = [
    { id: 1, type: 'square', text: 'Life', rotate: -2, src: getAcceleratedUrl('/images/images0.1.jpg') },
    { id: 2, type: 'square', text: 'Life', rotate: 1.5, src: getAcceleratedUrl('/images/images0.2.jpg') },
    { id: 3, type: 'vertical', text: 'Work', rotate: -1, src: getAcceleratedUrl('/images/images0.3.jpg') },
    { id: 4, type: 'vertical', text: 'Work', rotate: 2.5, src: getAcceleratedUrl('/images/images0.4.jpg') },
  ];

  const handleFlip = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Wait for animation to complete before updating the index
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % 4);
      setIsAnimating(false);
    }, 350); // Matches the duration of the exit animation
  };

  return (
    <div className="relative w-full max-w-[320px] aspect-[5/7] mx-auto">
      {cards.map((card, index) => {
        const isActive = index === currentIndex;
        const isSquare = card.type === 'square';
        
        // Calculate Z-Index dynamically
        // The active card is always on top (z=10) during interaction
        // Others are stacked based on their distance from the current index
        const offset = (index - currentIndex + 4) % 4;
        const zIndex = isActive ? 10 : (4 - offset);

        return (
          <motion.div
            key={card.id}
            className={`absolute inset-0 m-auto bg-[#fefdfb] border-[2px] border-[#1d5685] flex flex-col items-center justify-center shadow-md cursor-pointer
              ${isSquare ? 'h-auto aspect-square w-full rounded-[255px_15px_225px_15px/15px_225px_15px_255px]' : 'h-full w-full rounded-[15px_225px_15px_255px/255px_15px_225px_15px]'}
            `}
            style={{ 
              zIndex,
            }}
            animate={isActive && isAnimating ? { 
              x: 200, 
              opacity: 0, 
              rotate: 15,
              scale: 1.05
            } : { 
              x: 0, 
              opacity: 1, 
              rotate: card.rotate,
              scale: 1
            }}
            transition={{ 
              duration: isActive && isAnimating ? 0.35 : 0, // Instant reset when moving to bottom
              ease: "easeInOut" 
            }}
            whileHover={isActive && !isAnimating ? { scale: 1.02 } : {}}
            onClick={isActive ? handleFlip : undefined}
          >
            {card.src ? (
              <img src={card.src} alt={card.text} className="w-full h-full object-cover p-2 rounded-[inherit]" />
            ) : (
              <>
                <User size={isSquare ? 48 : 64} className="text-[#1d5685]/30 mb-2" />
                <span className="font-hand text-2xl text-[#1d5685]/50 font-bold tracking-widest">{card.text}</span>
              </>
            )}
            
            {/* Tape decoration for the active card */}
            {isActive && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#55d4d1]/30 transform -rotate-2 backdrop-blur-[1px] border-l border-r border-[#55d4d1]/50 shadow-sm pointer-events-none"></div>
            )}
          </motion.div>
        );
      })}
      
      {/* Hint Text */}
      <div className="absolute -bottom-10 left-0 right-0 text-center">
        <span className="font-sans text-[#1d5685]/40 text-sm tracking-widest animate-pulse">
          ( Click to flip )
        </span>
      </div>
    </div>
  );
};

interface SectionProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = "" }) => (
  <section id={id} className={`py-20 px-6 max-w-6xl mx-auto ${className}`}>
    {title && (
      <FadeIn>
        <div className="text-center mb-12">
          <h2 className="section-title">{title}</h2>
        </div>
      </FadeIn>
    )}
    {children}
  </section>
);

interface ImagePlaceholderProps {
  text: string;
  className?: string;
  icon?: any;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ text, className = "", icon: Icon = ImageIcon }) => (
  <div className={`doodle-image bg-[#fefdfb] flex flex-col items-center justify-center text-[#1d5685]/50 p-4 aspect-video ${className}`}>
    <Icon size={32} className="mb-2 opacity-50" />
    <span className="font-hand text-xl text-center">{text}</span>
  </div>
);

const VerticalImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ text, className = "", icon: Icon = ImageIcon }) => (
  <div className={`doodle-image bg-[#fefdfb] flex flex-col items-center justify-center text-[#1d5685]/50 p-4 aspect-[3/4] ${className}`}>
    <Icon size={32} className="mb-2 opacity-50" />
    <span className="font-hand text-xl text-center">{text}</span>
  </div>
);

const BowSticker = ({ color, darkColor, strokeColor, className = "" }: { color: string, darkColor: string, strokeColor: string, className?: string }) => (
  <svg width="160" height="160" viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.08))' }}>
    {/* White Sticker Border */}
    <g stroke="white" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" fill="white">
      <path d="M 90 95 C 60 40, 10 60, 25 105 C 40 130, 70 115, 90 105" />
      <path d="M 110 95 C 140 40, 190 60, 175 105 C 160 130, 130 115, 110 105" />
      <path d="M 90 110 C 70 140, 50 170, 65 190 L 75 180 L 85 195 C 95 160, 90 130, 100 115" />
      <path d="M 110 110 C 130 140, 150 170, 135 190 L 125 180 L 115 195 C 105 160, 110 130, 100 115" />
      <ellipse cx="100" cy="100" rx="15" ry="18" />
    </g>

    {/* Actual Bow */}
    <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Left Tail Back (Darker) */}
      <path d="M 90 110 C 85 130, 80 150, 95 170 L 85 180 L 75 165 C 80 140, 85 120, 100 115 Z" fill={darkColor} />
      {/* Right Tail Back (Darker) */}
      <path d="M 110 110 C 115 130, 120 150, 105 170 L 115 180 L 125 165 C 120 140, 115 120, 100 115 Z" fill={darkColor} />

      {/* Left Tail Front */}
      <path d="M 90 110 C 70 140, 50 170, 65 190 L 75 180 L 85 195 C 95 160, 90 130, 100 115 Z" fill={color} />
      {/* Right Tail Front */}
      <path d="M 110 110 C 130 140, 150 170, 135 190 L 125 180 L 115 195 C 105 160, 110 130, 100 115 Z" fill={color} />

      {/* Back loops (darker) */}
      <path d="M 90 95 C 70 65, 40 65, 30 80 C 45 90, 70 100, 90 105 Z" fill={darkColor} />
      <path d="M 110 95 C 130 65, 160 65, 170 80 C 155 90, 130 100, 110 105 Z" fill={darkColor} />

      {/* Front loops */}
      <path d="M 90 95 C 60 40, 10 60, 25 105 C 40 130, 70 115, 90 105 Z" fill={color} />
      <path d="M 110 95 C 140 40, 190 60, 175 105 C 160 130, 130 115, 110 105 Z" fill={color} />

      {/* Crease lines on front loops */}
      <path d="M 85 100 C 65 95, 45 90, 35 85" fill="none" />
      <path d="M 115 100 C 135 95, 155 90, 165 85" fill="none" />

      {/* Knot */}
      <ellipse cx="100" cy="100" rx="14" ry="18" fill={color} />
      {/* Knot creases */}
      <path d="M 95 85 C 93 95, 95 105, 98 115" fill="none" />
      <path d="M 105 85 C 107 95, 105 105, 102 115" fill="none" />
    </g>
  </svg>
);

const BowStickerSmooth = ({ color = "#FFF5C3", darkColor = "#FFD659", strokeColor = "#D4A373", className = "" }: { color?: string, darkColor?: string, strokeColor?: string, className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.12))' }}>
    {/* White Sticker Border */}
    <g stroke="white" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="white">
      <path d="M 100 95 C 60 40, 20 70, 40 110 C 60 140, 90 110, 100 100" />
      <path d="M 100 95 C 140 40, 180 70, 160 110 C 140 140, 110 110, 100 100" />
      <path d="M 90 105 C 70 140, 50 170, 60 190 C 70 195, 80 180, 95 120" />
      <path d="M 110 105 C 130 140, 150 170, 140 190 C 130 195, 120 180, 105 120" />
      <circle cx="100" cy="100" r="16" />
    </g>

    {/* Actual Bow */}
    <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Back loops (darker) */}
      <path d="M 100 95 C 70 60, 40 65, 30 85 C 45 95, 75 105, 100 100 Z" fill={darkColor} />
      <path d="M 100 95 C 130 60, 160 65, 170 85 C 155 95, 125 105, 100 100 Z" fill={darkColor} />

      {/* Left tail */}
      <path d="M 90 105 C 70 140, 50 170, 60 190 C 70 195, 80 180, 95 120 Z" fill={color} />
      {/* Right tail */}
      <path d="M 110 105 C 130 140, 150 170, 140 190 C 130 195, 120 180, 105 120 Z" fill={color} />
      
      {/* Left loop */}
      <path d="M 100 95 C 60 40, 20 70, 40 110 C 60 140, 90 110, 100 100 Z" fill={color} />
      {/* Left loop inner crease */}
      <path d="M 45 105 C 60 100, 75 95, 90 95" fill="none" stroke={strokeColor} strokeWidth="3" />
      
      {/* Right loop */}
      <path d="M 100 95 C 140 40, 180 70, 160 110 C 140 140, 110 110, 100 100 Z" fill={color} />
      {/* Right loop inner crease */}
      <path d="M 155 105 C 140 100, 125 95, 110 95" fill="none" stroke={strokeColor} strokeWidth="3" />

      {/* Knot */}
      <circle cx="100" cy="100" r="14" fill={color} />
      {/* Knot creases */}
      <path d="M 95 92 C 95 100, 95 108, 95 108" fill="none" stroke={strokeColor} strokeWidth="2" />
      <path d="M 105 92 C 105 100, 105 108, 105 108" fill="none" stroke={strokeColor} strokeWidth="2" />
    </g>
  </svg>
);

const BowStickerSmall = ({ color, darkColor, strokeColor, className = "" }: { color: string, darkColor: string, strokeColor: string, className?: string }) => (
  <svg width="120" height="120" viewBox="0 0 200 200" className={className} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.08))' }}>
    {/* White Sticker Border */}
    <g stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="white">
      <path d="M 90 95 C 65 50, 20 70, 35 105 C 50 125, 75 115, 90 105" />
      <path d="M 110 95 C 135 50, 180 70, 165 105 C 150 125, 125 115, 110 105" />
      <path d="M 90 110 C 75 135, 60 160, 70 180 L 80 170 L 90 185 C 95 155, 95 130, 100 115" />
      <path d="M 110 110 C 125 135, 140 160, 130 180 L 120 170 L 110 185 C 105 155, 105 130, 100 115" />
      <ellipse cx="100" cy="100" rx="12" ry="15" />
    </g>

    {/* Actual Bow */}
    <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Back loops (darker) */}
      <path d="M 90 95 C 75 70, 50 70, 40 85 C 55 95, 75 100, 90 105 Z" fill={darkColor} />
      <path d="M 110 95 C 125 70, 150 70, 160 85 C 145 95, 125 100, 110 105 Z" fill={darkColor} />

      {/* Left Tail Front */}
      <path d="M 90 110 C 75 135, 60 160, 70 180 L 80 170 L 90 185 C 95 155, 95 130, 100 115 Z" fill={color} />
      {/* Right Tail Front */}
      <path d="M 110 110 C 125 135, 140 160, 130 180 L 120 170 L 110 185 C 105 155, 105 130, 100 115 Z" fill={color} />

      {/* Front loops */}
      <path d="M 90 95 C 65 50, 20 70, 35 105 C 50 125, 75 115, 90 105 Z" fill={color} />
      <path d="M 110 95 C 135 50, 180 70, 165 105 C 150 125, 125 115, 110 105 Z" fill={color} />

      {/* Crease lines on front loops */}
      <path d="M 85 100 C 65 95, 50 90, 45 85" fill="none" />
      <path d="M 115 100 C 135 95, 150 90, 155 85" fill="none" />

      {/* Knot */}
      <ellipse cx="100" cy="100" rx="12" ry="15" fill={color} />
      {/* Knot creases */}
      <path d="M 96 88 C 94 95, 96 105, 98 112" fill="none" />
      <path d="M 104 88 C 106 95, 104 105, 102 112" fill="none" />
    </g>
  </svg>
);

const BowStickerThin = ({ color, darkColor, strokeColor, className = "" }: { color: string, darkColor: string, strokeColor: string, className?: string }) => (
  <svg width="140" height="160" viewBox="0 0 200 220" className={className} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.08))' }}>
    {/* White Sticker Border */}
    <g stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="white">
      <path d="M 95 95 C 60 70, 30 90, 45 115 C 60 130, 80 115, 95 105" />
      <path d="M 105 95 C 140 70, 170 90, 155 115 C 140 130, 120 115, 105 105" />
      <path d="M 95 110 C 85 150, 80 180, 85 200 L 95 190 L 105 200 C 100 180, 95 150, 105 110" />
      <path d="M 105 110 C 115 150, 120 180, 115 200 L 105 190 L 95 200 C 100 180, 105 150, 95 110" />
      <ellipse cx="100" cy="100" rx="10" ry="12" />
    </g>
    {/* Actual Bow */}
    <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Back loops */}
      <path d="M 95 95 C 75 80, 50 85, 45 100 C 55 105, 75 105, 95 105 Z" fill={darkColor} />
      <path d="M 105 95 C 125 80, 150 85, 155 100 C 145 105, 125 105, 105 105 Z" fill={darkColor} />
      {/* Tails */}
      <path d="M 95 110 C 85 150, 80 180, 85 200 L 95 190 L 105 200 C 100 180, 95 150, 105 110 Z" fill={color} />
      <path d="M 105 110 C 115 150, 120 180, 115 200 L 105 190 L 95 200 C 100 180, 105 150, 95 110 Z" fill={color} />
      {/* Front loops */}
      <path d="M 95 95 C 60 70, 30 90, 45 115 C 60 130, 80 115, 95 105 Z" fill={color} />
      <path d="M 105 95 C 140 70, 170 90, 155 115 C 140 130, 120 115, 105 105 Z" fill={color} />
      {/* Knot */}
      <ellipse cx="100" cy="100" rx="10" ry="12" fill={color} />
    </g>
  </svg>
);

const BowStickerWide = ({ color, darkColor, strokeColor, className = "" }: { color: string, darkColor: string, strokeColor: string, className?: string }) => (
  <svg width="180" height="140" viewBox="0 0 220 180" className={className} style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.08))' }}>
    {/* White Sticker Border */}
    <g stroke="white" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="white">
      <path d="M 100 85 C 50 30, 10 70, 30 110 C 50 140, 80 110, 100 95" />
      <path d="M 120 85 C 170 30, 210 70, 190 110 C 170 140, 140 110, 120 95" />
      <path d="M 100 100 C 70 130, 40 160, 50 170 L 70 160 L 90 170 C 95 140, 100 120, 110 105" />
      <path d="M 120 100 C 150 130, 180 160, 170 170 L 150 160 L 130 170 C 125 140, 120 120, 110 105" />
      <ellipse cx="110" cy="90" rx="18" ry="22" />
    </g>
    {/* Actual Bow */}
    <g stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
      {/* Tails Back */}
      <path d="M 100 100 C 85 120, 70 140, 90 170 L 70 160 L 50 170 C 60 140, 80 120, 110 105 Z" fill={darkColor} />
      <path d="M 120 100 C 135 120, 150 140, 130 170 L 150 160 L 170 170 C 160 140, 140 120, 110 105 Z" fill={darkColor} />
      {/* Tails Front */}
      <path d="M 100 100 C 70 130, 40 160, 50 170 L 70 160 L 90 170 C 95 140, 100 120, 110 105 Z" fill={color} />
      <path d="M 120 100 C 150 130, 180 160, 170 170 L 150 160 L 130 170 C 125 140, 120 120, 110 105 Z" fill={color} />
      {/* Back loops */}
      <path d="M 100 85 C 70 50, 40 60, 35 80 C 55 95, 80 100, 100 95 Z" fill={darkColor} />
      <path d="M 120 85 C 150 50, 180 60, 185 80 C 165 95, 140 100, 120 95 Z" fill={darkColor} />
      {/* Front loops */}
      <path d="M 100 85 C 50 30, 10 70, 30 110 C 50 140, 80 110, 100 95 Z" fill={color} />
      <path d="M 120 85 C 170 30, 210 70, 190 110 C 170 140, 140 110, 120 95 Z" fill={color} />
      {/* Knot */}
      <ellipse cx="110" cy="90" rx="18" ry="22" fill={color} />
      {/* Knot creases */}
      <path d="M 102 75 C 100 90, 102 105, 106 110" fill="none" />
      <path d="M 118 75 C 120 90, 118 105, 114 110" fill="none" />
    </g>
  </svg>
);

const HandDrawnTitle = ({ text, theme }: { text: string, theme: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Re-trigger animation by changing key when hovered
  const [animKey, setAnimKey] = useState(0);

  return (
    <div 
      className="flex justify-center mb-16 relative cursor-default"
      onMouseEnter={() => {
        setIsHovered(true);
        setAnimKey(prev => prev + 1);
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        @keyframes redraw {
          0% { stroke-dashoffset: 600; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      <div className="relative inline-block px-10 py-3 md:px-12 md:py-4">
        {/* SVG Hand-drawn Circle */}
        <svg 
          className="absolute inset-0 w-[120%] h-[140%] -left-[10%] -top-[20%] pointer-events-none overflow-visible" 
          viewBox="0 0 200 80" 
          preserveAspectRatio="none"
        >
          {/* Main Loop */}
          <path 
            key={animKey}
            d="M 30,40 C 20,10 180,5 180,40 C 180,75 15,70 25,35 C 35,5 160,10 170,45" 
            fill="none" 
            stroke={theme.main} 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            style={{
              strokeDasharray: 600,
              strokeDashoffset: 0,
              animation: animKey > 0 ? 'redraw 0.8s ease-out forwards' : 'none'
            }}
          />
          {/* Little Star/Dot */}
          <path 
            d="M 185,15 L 188,22 L 195,22 L 190,27 L 192,34 L 185,30 L 178,34 L 180,27 L 175,22 L 182,22 Z" 
            fill={theme.main} 
            className={`transform origin-center opacity-80 transition-transform duration-500 ${isHovered ? 'rotate-45 scale-110' : 'rotate-12 scale-100'}`} 
          />
          <circle cx="15" cy="65" r="2.5" fill={theme.main} className={`transition-transform duration-500 ${isHovered ? 'scale-150' : 'scale-100'}`} />
          <circle cx="185" cy="60" r="1.5" fill={theme.main} />
        </svg>
        <h3 
          className={`font-bold text-3xl md:text-4xl relative z-10 tracking-[0.15em] font-sans transform transition-transform duration-300 ${isHovered ? 'rotate-1' : '-rotate-2'}`}
          style={{ color: '#1d5685' }}
        >
          {text}
        </h3>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onClick, theme }: { project: any, onClick: () => void, theme: { main: string, dark: string, stroke: string, text: string } }) => (
  <div 
    className="border-[1.5px] border-[#1d5685] rounded-[2%_98%_3%_97%/98%_2%_97%_3%] p-5 md:p-6 cursor-pointer group relative transition-all duration-300 transform -rotate-1 hover:-translate-y-[5px] hover:rotate-0 shadow-[4px_4px_0px_rgba(0,0,0,0.04)] hover:shadow-[8px_8px_0px_rgba(32,195,206,0.15)] flex flex-col h-full font-sans mt-4"
    onClick={onClick}
    style={{ backgroundColor: theme.main }}
  >
    {/* Polaroid style cover - Inner Image Placeholder */}
    <div 
      className="aspect-video border-[1.5px] border-[#1d5685] rounded-[1%_99%_2%_98%/98%_1%_98%_2%] mb-5 md:mb-6 flex items-center justify-center overflow-hidden relative transition-all duration-300 transform rotate-1 group-hover:rotate-0 bg-white/60 flex-shrink-0" 
    >
      {project.images && project.images.length > 0 && project.images[0].src ? (
        <img 
          src={project.images[0].src} 
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <ImageIcon size={40} className="text-[#1d5685]/30 group-hover:scale-110 group-hover:text-[#20C3CE]/60 transition-all duration-500" />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-[#20C3CE]/5 transition-colors flex items-center justify-center">
        <span className="opacity-0 group-hover:opacity-100 bg-white border-[1.5px] border-[#20C3CE] text-[#20C3CE] px-6 py-2 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-[2px_2px_0px_rgba(32,195,206,0.15)] tracking-widest">
          查看详情
        </span>
      </div>
    </div>

    {/* Title Box */}
    <div className="flex-grow flex items-center justify-center px-2">
      <h4 
        className="font-bold text-base md:text-lg leading-[1.6] tracking-[0.05em] transition-colors text-center"
        style={{ color: theme.text }}
      >
        {project.title}
      </h4>
    </div>
  </div>
);

const PhoneMockupCard = ({ item, theme }: { item: EditorialItem, theme: any }) => (
  <a 
    href={item.url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="block group relative transition-all duration-300 transform rotate-1 hover:-translate-y-[5px] hover:rotate-0 font-sans"
  >
    {/* Phone Frame */}
    <div 
      className="border-[1.5px] border-[#1d5685] rounded-[5%_95%_4%_96%/96%_4%_95%_5%] p-2 shadow-[4px_4px_0px_rgba(0,0,0,0.04)] group-hover:shadow-[8px_8px_0px_rgba(32,195,206,0.15)] relative overflow-hidden h-[400px] flex flex-col"
      style={{ backgroundColor: theme.main }}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/60 border-b-[1.5px] border-x-[1.5px] border-[#1d5685] rounded-b-[12px_10px_14px_12px] z-20"></div>
      
      {/* Screen Content */}
      <div className="bg-white/60 flex-grow rounded-[4%_96%_5%_95%/95%_5%_96%_4%] border-[1.5px] border-[#1d5685] overflow-hidden relative flex flex-col items-center justify-center transition-colors">
        
        {/* Thumbnail Image */}
        {item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <FileText size={48} className="text-[#1d5685]/20 mb-4 group-hover:scale-110 group-hover:text-[#20C3CE]/50 transition-all duration-500 transform rotate-2" />
        )}

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-white/30 group-hover:bg-white/10 transition-colors z-0"></div>

        {/* Drawer Handle */}
        <div className="absolute top-8 w-12 h-1.5 bg-[#1d5685]/40 rounded-full transform -rotate-1 z-10"></div>
        
        {/* Hover Overlay */}
        <div className="absolute bottom-8 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-end justify-center z-20">
          <span className="bg-white border-[1.5px] border-[#20C3CE] text-[#20C3CE] px-5 py-2.5 rounded-[255px_15px_225px_15px/15px_225px_15px_255px] text-sm font-bold flex items-center gap-2 shadow-[2px_2px_0px_rgba(32,195,206,0.15)] tracking-widest">
            点击阅读 <ExternalLink size={16} />
          </span>
        </div>
      </div>
    </div>
  </a>
);

const rawProjectsData = {
  events: [
    {
      id: "event-1",
      title: "黄小西 T次方音乐与艺术节——「给你点颜色看看」全链路传播",
      strategy: "打破常规 Lineup宣发布告，紧扣音乐节slogan和举办地“多彩贵州”的文旅特色，以“色彩”为核心创意，打造「艺人色彩问答创意发博-变色id创意视频-现场一笔成画接龙挑战」传播链路。",
      images: [
        { 
          type: 'image', 
          text: '图 1', 
          src: '/images/images15.jpg' 
        },
        { 
          type: 'image', 
          text: '图 2', 
          src: '/images/images17.jpg' 
        },
        { 
          type: 'image', 
          text: '图 3', 
          src: '/images/images16.jpg' 
        },
        { 
          type: 'external_video', 
          text: '视频', 
          src: '',
          link: 'https://video.weibo.com/show?fid=1034:5166907297562637',
          thumbnail: '/images/cover1.jpg'
        },
        { 
          type: 'image', 
          text: '图 4', 
          src: '/images/images18.jpg' 
        },
        { 
          type: 'image', 
          text: '图 5', 
          src: '/images/images19.jpg' 
        },
        { 
          type: 'image', 
          text: '图 6', 
          src: '/images/images20.jpg' 
        }
      ]
    },
    {
      id: "event-2",
      title: "黄小西 T次方音乐与艺术节——乐迷深度参与计划",
      strategy: "线上开设共享文档许愿池，收集粉丝心愿，线下转化为 VJ 视频内容，实现「线上互动-线下执行-线上二次回流」的传播闭环。",
      images: [
        { 
          type: 'image', 
          text: '图 1', 
          src: '/images/images21.jpg' 
        },
        { 
          type: 'image', 
          text: '图 2', 
          src: '/images/images22.jpg' 
        }
      ]
    },
    {
      id: "event-3",
      title: "唐宫奇案之青雾风鸣——「唐风搭配图鉴」系列营销",
      strategy: "利用“路透热点”进行官方前置介入，以高审美海报联合非官方路透，提前锁定“剧集服化道品质”口碑。",
      images: [
        { 
          type: 'vertical-image', 
          text: '图 1', 
          src: '/images/images23.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 2', 
          src: '/images/images24.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 3', 
          src: '/images/images25.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 4', 
          src: '/images/images26.jpg' 
        }
      ]
    }
  ],
  images: [
    {
      id: "img-1",
      title: "音乐节新媒体图策划",
      images: [
        { 
          type: 'vertical-image', 
          text: '图 1', 
          src: '/images/images9.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 2', 
          src: '/images/images10.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 3', 
          src: '/images/images11.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 4', 
          src: '/images/images12.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 5', 
          src: '/images/images13.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 6', 
          src: '/images/images14.jpg' 
        }
      ]
    },
    {
      id: "img-2",
      title: "电影新媒体图策划",
      images: [
        { 
          type: 'vertical-image', 
          text: '图 1', 
          src: '/images/images1.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 2', 
          src: '/images/images2.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 3', 
          src: '/images/images3.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 4', 
          src: '/images/images4.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 5', 
          src: '/images/images5.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 6', 
          src: '/images/images6.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 7', 
          src: '/images/images7.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '图 8', 
          src: '/images/images8.jpg' 
        }
      ]
    }
  ],
  copywriting: [
    {
      id: "copy-1",
      title: "音乐节新媒体文案创作",
      images: [
        { 
          type: 'square-image', 
          text: '1', 
          src: '/images/images27.jpg' 
        },
        { 
          type: 'square-image', 
          text: '2', 
          src: '/images/images28.jpg' 
        },
        { 
          type: 'square-image', 
          text: '3', 
          src: '/images/images29.jpg' 
        },
        { 
          type: 'square-image', 
          text: '4', 
          src: '/images/images30.jpg' 
        },
        { 
          type: 'square-image', 
          text: '5', 
          src: '/images/images31.jpg' 
        },
        { 
          type: 'square-image', 
          text: '6', 
          src: '/images/images32.jpg' 
        },
        { 
          type: 'square-image', 
          text: '7', 
          src: '/images/images33.jpg' 
        },
        { 
          type: 'square-image', 
          text: '8', 
          src: '/images/images34.jpg' 
        },
        { 
          type: 'square-image', 
          text: '9', 
          src: '/images/images35.jpg' 
        },
        { 
          type: 'square-image', 
          text: '10', 
          src: '/images/images36.jpg' 
        },
        { 
          type: 'square-image', 
          text: '11', 
          src: '/images/images37.jpg' 
        },
        { 
          type: 'square-image', 
          text: '12', 
          src: '/images/images38.jpg' 
        },
        { 
          type: 'square-image', 
          text: '13', 
          src: '/images/images39.jpg' 
        },
        { 
          type: 'square-image', 
          text: '14', 
          src: '/images/images40.jpg' 
        },
        { 
          type: 'square-image', 
          text: '15', 
          src: '/images/images41.jpg' 
        },
        { 
          type: 'square-image', 
          text: '16', 
          src: '/images/images42.jpg' 
        }
      ]
    },
    {
      id: "copy-2",
      title: "电影新媒体文案创作",
      images: [
        { 
          type: 'square-image', 
          text: '1', 
          src: '/images/images43.jpg' 
        },
        { 
          type: 'square-image', 
          text: '2', 
          src: '/images/images44.jpg' 
        },
        { 
          type: 'square-image', 
          text: '3', 
          src: '/images/images45.jpg' 
        },
        { 
          type: 'square-image', 
          text: '4', 
          src: '/images/images46.jpg' 
        },
        { 
          type: 'square-image', 
          text: '5', 
          src: '/images/images47.jpg' 
        },
        { 
          type: 'square-image', 
          text: '6', 
          src: '/images/images48.jpg' 
        },
        { 
          type: 'square-image', 
          text: '7', 
          src: '/images/images49.jpg' 
        }
      ]
    },
    {
      id: "copy-3",
      title: "新闻稿撰写",
      images: [
        { 
          type: 'vertical-image', 
          text: '长图 1', 
          src: '/images/images50.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '长图 2', 
          src: '/images/images51.jpg' 
        },
        { 
          type: 'vertical-image', 
          text: '长图 3', 
          src: '/images/images52.jpg' 
        }
      ]
    }
  ],
  editorial: [
    { 
      url: "https://mp.weixin.qq.com/s/oxLNy9P5KKvhRYORR7zLXQ", 
      title: "排版作品 1", 
      thumbnail: "/images/images53.jpg" 
    },
    { 
      url: "https://mp.weixin.qq.com/s/z1XNZFSI3Acu21ucGH_-Iw", 
      title: "排版作品 2", 
      thumbnail: "/images/images54.jpg" 
    },
    { 
      url: "https://mp.weixin.qq.com/s/z_OnqEdtW0kBgzTx85Nzow", 
      title: "排版作品 3", 
      thumbnail: "/images/images55.jpg" 
    }
  ],
  videos: [
    {
      id: "video-1",
      type: 'external_video',
      text: '点击观看',
      src: '',
      link: 'http://xhslink.com/o/9djP0I3w08m',
      thumbnail: '/images/cover2.jpg'
    },
    {
      id: "video-2",
      type: 'external_video',
      text: '点击观看',
      src: '',
      link: 'http://xhslink.com/o/14k7X18yLys',
      thumbnail: '/images/cover3.jpg'
    },
    {
      id: "video-3",
      type: 'external_video',
      text: '点击观看',
      src: '',
      link: 'http://xhslink.com/o/1gDwe0fHbrz',
      thumbnail: '/images/cover4.jpg'
    },
    {
      id: "video-4",
      type: 'external_video',
      text: '点击观看',
      src: '',
      link: 'http://xhslink.com/o/27riSwQK9Xh',
      thumbnail: '/images/cover5.jpg'
    }
  ]
};

const traverseAndTransform = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(traverseAndTransform);
  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string' && (key === 'src' || key === 'thumbnail')) {
        newObj[key] = getAcceleratedUrl(obj[key]);
      } else {
        newObj[key] = traverseAndTransform(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

const projectsData = traverseAndTransform(rawProjectsData);

const THEMES = {
  pink: { main: '#FFC1CC', dark: '#e6aeb8', stroke: '#a37a82', text: '#8A6A6F' },
  green: { main: '#B5E4CA', dark: '#a3cdb6', stroke: '#739181', text: '#6A8A77' },
  purple: { main: '#E0BBE4', dark: '#cda8d1', stroke: '#8a6b8e', text: '#7A6A8A' },
  yellow: { main: '#FFF5C3', dark: '#e6ddb0', stroke: '#a39c7c', text: '#8A7D5A' },
  cyan: { main: '#20C3CE', dark: '#1aa3ad', stroke: '#15838b', text: '#5A8A8C' },
};

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioPath = "/audio/The Pancakes - 人人开开心心.mp3";

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-1">
      <audio
        ref={audioRef}
        src={audioPath}
        loop
        preload="auto"
      />
      <motion.button
        onClick={togglePlay}
        whileTap={{ scale: 0.9 }}
        className={`w-10 h-10 md:w-12 md:h-12 border-[2px] md:border-[2.5px] border-[#1d5685] flex items-center justify-center bg-[#fefdfb] shadow-[3px_3px_0px_#55d4d1] transition-all duration-300 ${isPlaying ? 'opacity-100' : 'opacity-70 grayscale-[30%]'}`}
        style={{
          borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px'
        }}
      >
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ duration: 4, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
          className="flex items-center justify-center w-full h-full relative"
        >
          {/* Hand-drawn Music Note SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d5685" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
            <path d="M9 18V5l12-2v13"></path>
            <circle cx="6" cy="18" r="3"></circle>
            <circle cx="18" cy="16" r="3"></circle>
          </svg>
          
          {/* Slash for paused state */}
          {!isPlaying && (
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 24 24" fill="none" stroke="#1d5685" strokeWidth="2.5" strokeLinecap="round">
              <line x1="4" y1="4" x2="20" y2="20"></line>
            </svg>
          )}
        </motion.div>
      </motion.button>
      <span className="font-hand text-[#1d5685] text-xs font-bold tracking-wider bg-[#fefdfb]/80 px-1.5 py-0.5 rounded-md">
        Music
      </span>
    </div>
  );
};

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const [lightboxMedia, setLightboxMedia] = useState<any | null>(null);
  const [scale, setScale] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const zoomIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startZoom = (direction: 'in' | 'out') => {
    // Immediate step
    if (direction === 'in') {
      if (scale === 1 && scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setScale(s => Math.min(s + 0.1, 10));
    } else {
      setScale(s => Math.max(s - 0.1, 1));
    }

    // Continuous zoom
    zoomIntervalRef.current = setInterval(() => {
      setScale(s => {
        if (direction === 'in') return Math.min(s + 0.05, 10);
        return Math.max(s - 0.05, 1);
      });
    }, 50);
  };

  const stopZoom = () => {
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current);
      zoomIntervalRef.current = null;
    }
  };

  const handleResetZoom = () => setScale(1);

  useEffect(() => {
    return () => stopZoom();
  }, []);

  useEffect(() => {
    if (lightboxMedia) {
      setScale(1);
    }
  }, [lightboxMedia]);

  // Image Navigation Logic
  const filteredImages = activeProject?.images?.filter((img: any) => 
    img.type === 'image' || img.type === 'vertical-image' || img.type === 'square-image'
  ) || [];

  const currentImageIndex = filteredImages.findIndex((img: any) => img === lightboxMedia);
  const showNav = activeProject && filteredImages.length > 1 && currentImageIndex !== -1;

  const goToNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (showNav && currentImageIndex < filteredImages.length - 1) {
      setLightboxMedia(filteredImages[currentImageIndex + 1]);
      setScale(1);
    }
  };

  const goToPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (showNav && currentImageIndex > 0) {
      setLightboxMedia(filteredImages[currentImageIndex - 1]);
      setScale(1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxMedia) return;
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') setLightboxMedia(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxMedia, activeProject, filteredImages, currentImageIndex]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (activeProject || lightboxMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeProject, lightboxMedia]);

  const bows = [
    // Top Left Corner
    { Type: BowStickerWide, color: '#ffb3c6', darkColor: '#ff8fa3', stroke: '#5c4b51', top: '2%', left: '2%', rot: -25, delay: 0.1, parallax: 1.2, zIndex: 10 },
    { Type: BowStickerSmall, color: '#ffea99', darkColor: '#ffd166', stroke: '#5c4b51', top: '12%', left: '10%', rot: 15, delay: 0.3, parallax: 1.5, zIndex: 12 },
    { Type: BowStickerThin, color: '#b7e4c7', darkColor: '#95d5b2', stroke: '#5c4b51', top: '5%', left: '18%', rot: -5, delay: 0.5, parallax: 0.8, zIndex: 8 },
    { Type: BowSticker, color: '#cdb4db', darkColor: '#bca0dc', stroke: '#5c4b51', top: '20%', left: '4%', rot: 35, delay: 0.2, parallax: 1.1, zIndex: 11 },
    
    // Top Edge (Spread out)
    { Type: BowStickerSmall, color: '#ffb3c6', darkColor: '#ff8fa3', stroke: '#5c4b51', top: '3%', left: '32%', rot: -15, delay: 0.4, parallax: 1.4, zIndex: 9 },
    { Type: BowStickerWide, color: '#b7e4c7', darkColor: '#95d5b2', stroke: '#5c4b51', top: '8%', left: '45%', rot: 10, delay: 0.6, parallax: 0.9, zIndex: 13 },
    { Type: BowStickerThin, color: '#ffea99', darkColor: '#ffd166', stroke: '#5c4b51', top: '2%', right: '38%', rot: -30, delay: 0.7, parallax: 1.3, zIndex: 15 },
    { Type: BowSticker, color: '#cdb4db', darkColor: '#bca0dc', stroke: '#5c4b51', top: '10%', right: '25%', rot: 20, delay: 0.9, parallax: 1.0, zIndex: 14 },

    // Top Right Corner
    { Type: BowStickerWide, color: '#ffb3c6', darkColor: '#ff8fa3', stroke: '#5c4b51', top: '5%', right: '5%', rot: 25, delay: 0.8, parallax: 1.2, zIndex: 16 },
    { Type: BowStickerSmall, color: '#ffea99', darkColor: '#ffd166', stroke: '#5c4b51', top: '15%', right: '12%', rot: -20, delay: 1.0, parallax: 1.6, zIndex: 17 },
    { Type: BowStickerThin, color: '#b7e4c7', darkColor: '#95d5b2', stroke: '#5c4b51', top: '8%', right: '20%', rot: 15, delay: 1.1, parallax: 0.9, zIndex: 18 },
    { Type: BowSticker, color: '#cdb4db', darkColor: '#bca0dc', stroke: '#5c4b51', top: '25%', right: '4%', rot: -35, delay: 1.3, parallax: 1.4, zIndex: 19 },

    // Middle Left Edge (Far out)
    { Type: BowStickerSmall, color: '#ffea99', darkColor: '#ffd166', stroke: '#5c4b51', top: '35%', left: '3%', rot: -15, delay: 1.5, parallax: 1.1, zIndex: 20 },
    { Type: BowStickerWide, color: '#b7e4c7', darkColor: '#95d5b2', stroke: '#5c4b51', top: '50%', left: '8%', rot: 25, delay: 1.2, parallax: 1.3, zIndex: 21 },
    { Type: BowStickerThin, color: '#ffb3c6', darkColor: '#ff8fa3', stroke: '#5c4b51', top: '65%', left: '4%', rot: -10, delay: 1.4, parallax: 1.0, zIndex: 22 },

    // Middle Right Edge (Far out)
    { Type: BowSticker, color: '#cdb4db', darkColor: '#bca0dc', stroke: '#5c4b51', top: '40%', right: '5%', rot: 15, delay: 1.6, parallax: 1.5, zIndex: 23 },
    { Type: BowStickerSmall, color: '#ffea99', darkColor: '#ffd166', stroke: '#5c4b51', top: '55%', right: '10%', rot: -25, delay: 1.7, parallax: 0.8, zIndex: 24 },
    { Type: BowStickerWide, color: '#b7e4c7', darkColor: '#95d5b2', stroke: '#5c4b51', top: '70%', right: '6%', rot: 20, delay: 1.8, parallax: 1.7, zIndex: 25 },

    // Bottom Left Corner
    { Type: BowStickerThin, color: '#ffb3c6', darkColor: '#ff8fa3', stroke: '#5c4b51', bottom: '5%', left: '5%', rot: -20, delay: 1.9, parallax: 1.2, zIndex: 26 },
    { Type: BowStickerSmall, color: '#cdb4db', darkColor: '#bca0dc', stroke: '#5c4b51', bottom: '15%', left: '12%', rot: 30, delay: 2.0, parallax: 1.5, zIndex: 28 },
    { Type: BowSticker, color: '#ffea99', darkColor: '#ffd166', stroke: '#5c4b51', bottom: '8%', left: '22%', rot: -10, delay: 2.1, parallax: 0.9, zIndex: 27 },

    // Bottom Edge (Spread out)
    { Type: BowStickerWide, color: '#b7e4c7', darkColor: '#95d5b2', stroke: '#5c4b51', bottom: '4%', left: '35%', rot: 15, delay: 2.2, parallax: 1.4, zIndex: 29 },
    { Type: BowStickerThin, color: '#ffb3c6', darkColor: '#ff8fa3', stroke: '#5c4b51', bottom: '10%', right: '40%', rot: -25, delay: 2.3, parallax: 1.1, zIndex: 30 },
    { Type: BowStickerSmall, color: '#cdb4db', darkColor: '#bca0dc', stroke: '#5c4b51', bottom: '5%', right: '28%', rot: 20, delay: 2.4, parallax: 1.3, zIndex: 31 },

    // Bottom Right Corner
    { Type: BowSticker, color: '#ffea99', darkColor: '#ffd166', stroke: '#5c4b51', bottom: '8%', right: '5%', rot: -15, delay: 2.5, parallax: 1.6, zIndex: 32 },
    { Type: BowStickerWide, color: '#b7e4c7', darkColor: '#95d5b2', stroke: '#5c4b51', bottom: '18%', right: '14%', rot: 25, delay: 2.6, parallax: 1.0, zIndex: 33 },
    { Type: BowStickerThin, color: '#ffb3c6', darkColor: '#ff8fa3', stroke: '#5c4b51', bottom: '12%', right: '22%', rot: -5, delay: 2.7, parallax: 1.5, zIndex: 34 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden selection:bg-[#55d4d1] selection:text-[#1d5685]">
      {/* Section 1: 封面 */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">
        {/* Decorative Elements */}
        {bows.map((bow, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: bow.delay, type: "spring", bounce: 0.4 }}
            className="absolute"
            style={{ top: bow.top, bottom: bow.bottom, left: bow.left, right: bow.right, zIndex: bow.zIndex }}
          >
            <motion.div
              animate={{ 
                x: mousePos.x * bow.parallax, 
                y: mousePos.y * bow.parallax,
                rotate: bow.rot
              }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
              <bow.Type color={bow.color} darkColor={bow.darkColor} strokeColor={bow.stroke} />
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative z-50 flex flex-col items-center justify-center gap-8 w-full max-w-[90%]"
        >
          {/* Torn Paper Title Container */}
          <div className="relative group max-w-full">
            {/* Shadow Block */}
            <div className="absolute top-3 left-3 w-full h-full bg-[#1d5685] rounded-[2%_98%_3%_97%/98%_2%_97%_3%] transform rotate-2 transition-transform group-hover:rotate-3 group-hover:translate-x-1 group-hover:translate-y-1 shaky-stroke"></div>
            
            {/* Main Block */}
            <div className="relative bg-[#55d4d1] px-6 py-6 md:px-16 md:py-10 rounded-[98%_2%_97%_3%/2%_98%_3%_97%] transform -rotate-1 border-4 border-[#1d5685] transition-transform group-hover:-rotate-2 shaky-stroke">
              <h1 className="font-hand text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-[#fefdfb] tracking-[0.1em] md:tracking-[0.15em] drop-shadow-[3px_3px_0px_#1d5685] text-center break-words">
                PORTFOLIO
              </h1>
            </div>
          </div>

          <div className="relative z-10">
             <p className="text-lg sm:text-xl md:text-2xl font-sans text-[#1d5685] tracking-widest font-bold bg-[#fefdfb] px-6 py-3 border-4 border-[#1d5685] rounded-[255px_15px_225px_15px/15px_225px_15px_255px] transform rotate-2 shaky-stroke shadow-[4px_4px_0px_rgba(29,86,133,0.2)] text-center">
              张朦月 / ZHANG MENGYUE
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          className="absolute bottom-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown size={32} className="text-[#1d5685] shaky-stroke" />
        </motion.div>
      </section>

      {/* Section 2: 个人简介 */}
      <Section id="about" title="ABOUT ME">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center justify-center">
          <FadeIn className="w-full lg:w-[35%] max-w-sm">
            <PhotoStack />
          </FadeIn>
          
          <FadeIn delay={0.2} className="w-full lg:w-[60%]">
            <div className="bg-[#fefdfb] border-[1.5px] border-[#1d5685] rounded-[2%_98%_3%_97%/98%_2%_97%_3%] p-10 md:p-14 relative shadow-[6px_6px_0px_rgba(29,86,133,0.08)] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_rgba(85,212,209,0.3)]">
              {/* Tape Bow Stickers */}
              <div className="absolute -top-10 -right-10 w-28 h-28 z-20 transform rotate-[15deg] drop-shadow-sm pointer-events-none">
                <BowStickerSmooth className="w-full h-full" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-28 h-28 z-20 transform -rotate-[15deg] drop-shadow-sm pointer-events-none">
                <BowStickerSmooth className="w-full h-full" />
              </div>
              
              <div className="mb-12 text-center lg:text-left">
                <h3 className="text-3xl md:text-4xl font-bold text-[#1d5685] tracking-widest mb-4">
                  张朦月<span className="mx-4 text-2xl font-normal opacity-70">|</span>26岁<span className="mx-4 text-2xl font-normal opacity-70">|</span>重庆人
                </h3>
                <p className="text-base md:text-lg text-[#1d5685]/70 tracking-widest font-medium">
                  13251106224 <span className="mx-3 opacity-50">|</span> zhangmengyue830@163.com
                </p>
              </div>
              
              {/* Hand-drawn divider */}
              <div className="relative w-full h-4 mb-12 opacity-40">
                <svg className="absolute w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0,5 Q25,2 50,6 T100,4" stroke="#1d5685" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
                </svg>
              </div>
              
              <div>
                <p className="text-lg md:text-xl text-[#1d5685] leading-[1.8] text-justify font-medium tracking-wide">
                  广播电视专业硕士背景，深耕文娱新媒体赛道，拥有敏锐的青年文化洞察力，擅长以“内容+数据”双驱动模式，通过强交互玩法，构建高转化传播闭环。既是精通视频图像编辑工具与AI的内容产出者，也是会讲故事的造浪者。
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* Section 3: 能力总结 */}
      <Section id="skills" title="SKILLS">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 max-w-5xl mx-auto">
          {[
            {
              icon: Briefcase,
              title: "全周期宣发与策划",
              desc: "深谙音乐节、剧集及电影的全链路宣发逻辑，擅长通过创意事件实现流量爆发传播。",
              bgColor: "bg-[#ffe8ec]",
              rotation: "-rotate-1",
              bowPos: "-top-6 -left-6",
              bowRotation: "-rotate-12",
              bowProps: { color: "#d8b4e2", darkColor: "#b886c8", strokeColor: "#8a5a9e" } // Purple bow
            },
            {
              icon: PenTool,
              title: "多模态内容创作",
              desc: "精通PR、剪映、可画、秀米等视听编辑工具，能独立完成高质量视频剪辑、新媒体图策划及深度文案产出。",
              bgColor: "bg-[#e6f4ea]",
              rotation: "rotate-[1.5deg]",
              bowPos: "-top-6 -right-6",
              bowRotation: "rotate-12",
              bowProps: { color: "#ffc1cc", darkColor: "#ff99aa", strokeColor: "#d87080" } // Pink bow
            },
            {
              icon: Cpu,
              title: "工业化 AI 生产力",
              desc: "擅长利用 AI 工具进行内容生产流重组，实现物料的高效规模化产出，提升团队内容产能。",
              bgColor: "bg-[#f3e8ff]",
              rotation: "rotate-1",
              bowPos: "-bottom-6 -right-6",
              bowRotation: "-rotate-[15deg]",
              bowProps: { color: "#fff5c3", darkColor: "#ffd659", strokeColor: "#d4a373" } // Yellow bow
            },
            {
              icon: TrendingUp,
              title: "差异化账号运营",
              desc: "具备万级粉丝账号矩阵运营经验，熟练操作投放系统，通过数据回盘持续迭代内容策略。",
              bgColor: "bg-[#fff8d6]",
              rotation: "-rotate-[1.5deg]",
              bowPos: "-bottom-6 -left-6",
              bowRotation: "rotate-[15deg]",
              bowProps: { color: "#b5e4ca", darkColor: "#82c9a0", strokeColor: "#5a9e7a" } // Green bow
            }
          ].map((skill, index) => (
            <FadeIn key={index} delay={index * 0.1}>
              <div 
                className={`relative p-8 md:p-10 h-full flex flex-col ${skill.bgColor} border-[1.5px] border-[#1d5685] rounded-[2%_98%_3%_97%/98%_2%_97%_3%] ${skill.rotation} transition-all duration-300 hover:scale-[1.03] hover:rotate-0 hover:z-10 hover:shadow-[8px_8px_0px_rgba(29,86,133,0.15)]`}
              >
                {/* Bow Sticker */}
                <div className={`absolute ${skill.bowPos} w-20 h-20 z-20 transform ${skill.bowRotation} drop-shadow-sm pointer-events-none`}>
                  <BowStickerSmooth className="w-full h-full" {...skill.bowProps} />
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/60 flex items-center justify-center border-[1.5px] border-[#1d5685] transform -rotate-3 shadow-[2px_2px_0px_rgba(29,86,133,0.1)]">
                    <skill.icon size={24} className="text-[#1d5685]" />
                  </div>
                  <h3 className="font-bold text-xl md:text-2xl text-[#1d5685] tracking-wide">{skill.title}</h3>
                </div>
                <p className="text-[#1d5685]/80 text-base md:text-lg leading-[1.7] flex-grow text-justify font-medium">
                  {skill.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Section 4: 项目成果 */}
      <Section id="projects" title="PROJECTS">
        
        {/* 第一板块：创意事件策划 */}
        <div className="mb-24">
          <FadeIn>
            <HandDrawnTitle text="创意事件策划" theme={THEMES.pink} />
          </FadeIn>
          
          <div className="flex flex-col md:flex-row gap-8">
            {projectsData.events.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.1} className="flex-1">
                <ProjectCard project={project} onClick={() => setActiveProject({ ...project, theme: THEMES.pink })} theme={THEMES.pink} />
              </FadeIn>
            ))}
          </div>
        </div>

        {/* 第二板块：新媒体图策划 */}
        <div className="mb-24">
          <FadeIn>
            <HandDrawnTitle text="新媒体图策划" theme={THEMES.green} />
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projectsData.images.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.1}>
                <ProjectCard project={project} onClick={() => setActiveProject({ ...project, theme: THEMES.green })} theme={THEMES.green} />
              </FadeIn>
            ))}
          </div>
        </div>

        {/* 第三板块：文案创作 */}
        <div className="mb-24">
          <FadeIn>
            <HandDrawnTitle text="文案创作" theme={THEMES.purple} />
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectsData.copywriting.map((project, index) => (
              <FadeIn key={project.id} delay={index * 0.1}>
                <ProjectCard project={project} onClick={() => setActiveProject({ ...project, theme: THEMES.purple })} theme={THEMES.purple} />
              </FadeIn>
            ))}
          </div>
        </div>

        {/* 第四板块：编辑排版 */}
        <div className="mb-24">
          <FadeIn>
            <HandDrawnTitle text="编辑排版" theme={THEMES.cyan} />
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {projectsData.editorial.map((item, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <PhoneMockupCard item={item} theme={THEMES.cyan} />
              </FadeIn>
            ))}
          </div>
        </div>

        {/* 第五板块：视频剪辑 */}
        <div>
          <FadeIn>
             <HandDrawnTitle text="视频剪辑" theme={THEMES.yellow} />
          </FadeIn>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 px-4 md:px-12">
            {projectsData.videos.map((video, i) => {
              // Random-ish rotation and margin for "messy" look
              const rotation = i % 2 === 0 ? '-rotate-1' : 'rotate-1';
              const marginTop = i === 1 ? 'md:mt-8' : i === 2 ? 'md:-mt-4' : 'mt-0';
              
              return (
                <FadeIn key={video.id} delay={i * 0.1}>
                  <div 
                    onClick={() => window.open(video.link, '_blank')}
                    className={`border-[1.5px] border-[#1d5685] rounded-[2%_98%_3%_97%/98%_2%_97%_3%] p-3 md:p-4 font-sans flex flex-col h-full group cursor-pointer transition-all duration-300 transform ${rotation} hover:-translate-y-[5px] hover:rotate-0 shadow-[4px_4px_0px_rgba(0,0,0,0.04)] hover:shadow-[8px_8px_0px_rgba(32,195,206,0.15)] ${marginTop}`}
                    style={{ backgroundColor: THEMES.yellow.main }}
                  >
                    <div className="bg-gray-900 border-[1.5px] border-[#1d5685] rounded-[1%_99%_2%_98%/98%_1%_98%_2%] flex flex-col items-center justify-center text-white/50 aspect-[9/16] relative overflow-hidden transform rotate-1 group-hover:rotate-0 transition-all duration-300">
                      {video.type === 'external_video' && video.thumbnail ? (
                        <img 
                          src={video.thumbnail}
                          alt={video.text}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <video 
                          src={video.src}
                          className="absolute inset-0 w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                        />
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform z-10 border-[1.5px] border-white/50">
                        <Play size={32} className="text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Section 5: 结尾 */}
      <section className="pt-12 pb-36 md:pt-20 md:pb-48 lg:pt-24 lg:pb-60 px-4 relative overflow-hidden">
        <FadeIn>
          <div className="max-w-[90vw] mx-auto text-center">
            
            {/* Title with Bows */}
            <div className="relative inline-block mb-12 md:mb-16 lg:mb-24">
              <h2 className="section-title mb-0 !text-4xl md:!text-6xl lg:!text-7xl !px-8 !py-4 md:!px-10 md:!py-5 lg:!px-14 lg:!py-7">CONTACT ME!</h2>
              
              {/* Cherry Pink Bow - Top Left Outer */}
              <motion.div 
                initial={{ y: -60, opacity: 0, rotate: -20 }}
                whileInView={{ y: 0, opacity: 1, rotate: -20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85, rotate: -35 }}
                viewport={{ amount: 0.1, once: false }}
                transition={{ type: "spring", bounce: 0.35, duration: 1.2, delay: 0.1 }}
                className="absolute -top-4 -left-4 md:-top-8 md:-left-12 lg:-top-10 lg:-left-16 w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 z-[999] drop-shadow-md cursor-pointer"
              >
                <BowStickerSmooth color={THEMES.pink.main} darkColor={THEMES.pink.dark} strokeColor={THEMES.pink.stroke} className="w-full h-full" />
              </motion.div>

              {/* Lemon Yellow Bow - Top Right Outer */}
              <motion.div 
                initial={{ y: -60, opacity: 0, rotate: 25 }}
                whileInView={{ y: 0, opacity: 1, rotate: 25 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85, rotate: 40 }}
                viewport={{ amount: 0.1, once: false }}
                transition={{ type: "spring", bounce: 0.35, duration: 1.2, delay: 0.3 }}
                className="absolute -top-3 -right-4 md:-top-6 md:-right-10 lg:-top-8 lg:-right-14 w-14 h-14 md:w-20 md:h-20 lg:w-28 lg:h-28 z-[999] drop-shadow-md cursor-pointer"
              >
                <BowStickerSmooth color={THEMES.yellow.main} darkColor={THEMES.yellow.dark} strokeColor={THEMES.yellow.stroke} className="w-full h-full" />
              </motion.div>
            </div>
            
            <div className="flex flex-col lg:flex-row justify-center items-center gap-8 md:gap-10 lg:gap-16">
              {/* Phone Box */}
              <div className="relative">
                {/* Light Purple Bow - Bottom Left Outer */}
                <motion.div 
                  initial={{ y: -40, opacity: 0, rotate: -15 }}
                  whileInView={{ y: 0, opacity: 1, rotate: -15 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85, rotate: -30 }}
                  viewport={{ amount: 0.1, once: false }}
                  transition={{ type: "spring", bounce: 0.35, duration: 1.2, delay: 0.5 }}
                  className="absolute -bottom-3 -left-3 md:-bottom-6 md:-left-10 lg:-bottom-8 lg:-left-12 w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 z-[999] drop-shadow-md cursor-pointer"
                >
                  <BowStickerSmooth color={THEMES.purple.main} darkColor={THEMES.purple.dark} strokeColor={THEMES.purple.stroke} className="w-full h-full" />
                </motion.div>
                <a href="tel:13251106224" className="doodle-button px-8 py-4 md:px-12 md:py-6 lg:px-14 lg:py-7 flex items-center gap-4 md:gap-5 lg:gap-6 text-xl md:text-2xl lg:text-3xl font-bold hover:text-[#55d4d1] bg-white relative z-10">
                  <Phone size={24} className="text-[#55d4d1] w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
                  <span className="mt-1">13251106224</span>
                </a>
              </div>
              
              {/* Email Box */}
              <div className="relative">
                {/* Mint Green Bow - Bottom Right Outer */}
                <motion.div 
                  initial={{ y: -40, opacity: 0, rotate: 20 }}
                  whileInView={{ y: 0, opacity: 1, rotate: 20 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85, rotate: 35 }}
                  viewport={{ amount: 0.1, once: false }}
                  transition={{ type: "spring", bounce: 0.35, duration: 1.2, delay: 0.7 }}
                  className="absolute -bottom-3 -right-3 md:-bottom-6 md:-right-10 lg:-bottom-8 lg:-right-12 w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 z-[999] drop-shadow-md cursor-pointer"
                >
                  <BowStickerSmooth color={THEMES.green.main} darkColor={THEMES.green.dark} strokeColor={THEMES.green.stroke} className="w-full h-full" />
                </motion.div>
                <a href="mailto:zhangmengyue830@163.com" className="doodle-button px-5 py-4 md:px-12 md:py-6 lg:px-14 lg:py-7 flex items-center gap-3 md:gap-5 lg:gap-6 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold hover:text-[#55d4d1] bg-white relative z-10 whitespace-nowrap w-fit max-w-[95vw]">
                  <Mail size={24} className="text-[#55d4d1] w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 flex-shrink-0" />
                  <span className="mt-1">zhangmengyue830@163.com</span>
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
      {/* Project Modal */}
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 font-sans">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1d5685]/40 backdrop-blur-sm"
              onClick={() => setActiveProject(null)}
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl max-h-[90vh] bg-[#fefdfb] border-[2px] border-[#1d5685] rounded-[2%_98%_3%_97%/98%_2%_97%_3%] shadow-[12px_12px_0px_rgba(29,86,133,0.2)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div 
                className="flex items-center justify-between p-6 border-b-[1.5px] border-dashed border-[#1d5685]/30 z-10 transition-colors duration-300"
                style={{ backgroundColor: activeProject.theme?.main || '#fefdfb' }}
              >
                <h3 className="font-bold text-2xl text-[#1d5685] pr-8">{activeProject.title}</h3>
                <button 
                  onClick={() => setActiveProject(null)}
                  className="w-10 h-10 rounded-full bg-white/50 hover:bg-white/80 border-[1.5px] border-[#1d5685] flex items-center justify-center text-[#1d5685] transition-colors flex-shrink-0"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-grow">
                {activeProject.strategy && (
                  <div className="mb-8 bg-[#fff8d6] border-[1.5px] border-[#1d5685] p-6 md:p-8 rounded-lg transform -rotate-1 shadow-[4px_4px_0px_rgba(29,86,133,0.1)] w-full">
                    <div className="flex flex-col items-start mb-4">
                      <h4 className="font-bold text-[#1d5685] text-xl flex items-center gap-2">
                        <PenTool size={20} /> 策略思路
                      </h4>
                      <div className="w-24 border-b-[2px] border-[#1d5685]/30 border-dashed mt-1 transform -rotate-1"></div>
                    </div>
                    <p className="text-[#1d5685]/80 leading-[1.8] font-medium text-left">
                      {activeProject.strategy}
                    </p>
                  </div>
                )}

                <div className={`grid gap-4 ${
                  activeProject.id === 'event-1' ? 'grid-cols-3' : 
                  activeProject.id === 'event-3' ? 'grid-cols-2' : 
                  'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
                }`}>
                  {activeProject.images?.map((img: any, idx: number) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        if (img.type === 'external_video' && img.link) {
                          window.open(img.link, '_blank');
                        } else {
                          setLightboxMedia(img);
                        }
                      }}
                      className={`
                        border-[1.5px] border-[#1d5685] rounded-lg overflow-hidden bg-[#f3e8ff]/20 flex items-center justify-center cursor-pointer hover:shadow-[4px_4px_0px_rgba(29,86,133,0.15)] hover:-translate-y-1 transition-all duration-300
                        ${img.type === 'vertical-image' ? 'aspect-[3/4]' : ''}
                        ${img.type === 'square-image' ? 'aspect-square' : ''}
                        ${img.type === 'image' ? 'aspect-video' : ''}
                        ${(img.type === 'video' || img.type === 'external_video') ? 'aspect-[9/16]' : ''}
                        ${(img.type === 'video' || img.type === 'external_video') && activeProject.id === 'event-1' ? 'col-span-3 w-[60%] mx-auto bg-gray-900' : ''}
                        ${(img.type === 'video' || img.type === 'external_video') && activeProject.id !== 'event-1' ? 'col-span-1 bg-gray-900' : ''}
                      `}
                    >
                      {img.type === 'video' || img.type === 'external_video' ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/50 relative group cursor-pointer">
                          {img.type === 'external_video' && img.thumbnail ? (
                            <img 
                              src={img.thumbnail}
                              alt={img.text}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              src={img.src}
                              className="absolute inset-0 w-full h-full object-cover"
                              muted
                              loop
                              playsInline
                            />
                          )}
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                          
                          {img.type === 'external_video' ? (
                            <div className="z-10 flex flex-col items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform border-[1.5px] border-white/50 relative">
                                <Play size={32} className="text-white ml-1" />
                                <div className="absolute -bottom-1 -right-1 bg-[#ff2442] text-white rounded-full p-1.5 shadow-sm border border-white/20">
                                  <ExternalLink size={12} />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform z-10 border-[1.5px] border-white/50">
                              <Play size={32} className="text-white ml-1" />
                            </div>
                          )}
                          
                          <span className="absolute bottom-4 left-4 font-bold text-xl z-10 text-white drop-shadow-md">{img.text}</span>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-[#1d5685]/40 p-4 relative group">
                          <img 
                            src={img.src} 
                            alt={img.text} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                          {/* Fallback icon if image fails to load or just as decoration if needed, but user asked for img tag priority */}
                          {/* <ImageIcon size={32} className="mb-2 opacity-50 group-hover:scale-110 transition-transform" /> */}
                          {/* <span className="font-bold text-lg text-center">{img.text}</span> */}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxMedia && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8 font-sans">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setLightboxMedia(null)}
            />
            
            {/* Lightbox Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none"
            >
              <button 
                onClick={() => setLightboxMedia(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 border-[1.5px] border-white/30 flex items-center justify-center text-white transition-colors z-[60] pointer-events-auto backdrop-blur-md"
              >
                <X size={24} />
              </button>

              {/* Navigation Arrows */}
              {showNav && (
                <>
                  {currentImageIndex > 0 && (
                    <button 
                      onClick={goToPrev}
                      className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-[60] pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronLeft size={32} />
                    </button>
                  )}
                  {currentImageIndex < filteredImages.length - 1 && (
                    <button 
                      onClick={goToNext}
                      className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all z-[60] pointer-events-auto backdrop-blur-md"
                    >
                      <ChevronRight size={32} />
                    </button>
                  )}
                </>
              )}

              <div 
                ref={scrollContainerRef}
                className={`
                  flex-1 w-full h-full relative pointer-events-auto flex justify-center py-20
                  ${scale > 1 ? 'overflow-auto items-start' : 'overflow-hidden items-center'}
                `}
              >
                <div className={`
                  flex items-center justify-center p-4 pb-24 w-full h-full
                  ${lightboxMedia.type === 'video' || lightboxMedia.type === 'external_video' ? 'aspect-[9/16] max-w-sm bg-gray-900 rounded-lg overflow-hidden border border-white/20 shadow-2xl flex-none h-[80vh] p-0 pb-0' : ''}
                `}>
                  {lightboxMedia.type === 'video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/50 relative">
                      <video 
                        src={lightboxMedia.src}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay
                      />
                    </div>
                  ) : lightboxMedia.type === 'external_video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/50 relative">
                      {lightboxMedia.thumbnail && (
                        <img 
                          src={lightboxMedia.thumbnail}
                          alt={lightboxMedia.text}
                          className="w-full h-full object-cover opacity-60"
                        />
                      )}
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 p-6">
                        <h3 className="text-2xl font-bold text-white tracking-widest drop-shadow-md text-center">{lightboxMedia.text}</h3>
                        
                        {lightboxMedia.link && (
                          <motion.a
                            href={lightboxMedia.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#ff2442] text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                          >
                            <span>跳转至小红书查看全文</span>
                            <ExternalLink size={18} />
                          </motion.a>
                        )}
                      </div>
                    </div>
                  ) : (
                      <img 
                        src={lightboxMedia.src} 
                        alt={lightboxMedia.text} 
                        className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-sm"
                        style={{ 
                          transform: `scale(${scale})`, 
                          transition: 'transform 0.1s ease-out', 
                          transformOrigin: 'top center' 
                        }}
                      />
                  )}
                </div>
              </div>

              {/* Zoom Controls (Fixed at bottom center) */}
              {(lightboxMedia.type === 'image' || lightboxMedia.type === 'vertical-image' || lightboxMedia.type === 'square-image') && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex gap-4 pointer-events-auto">
                  <button 
                    onMouseDown={() => startZoom('out')}
                    onMouseUp={stopZoom}
                    onMouseLeave={stopZoom}
                    onTouchStart={() => startZoom('out')}
                    onTouchEnd={stopZoom}
                    className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/20 select-none"
                  >
                    <ZoomOut size={20} />
                  </button>
                  <button 
                    onClick={handleResetZoom} 
                    className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/20"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button 
                    onMouseDown={() => startZoom('in')}
                    onMouseUp={stopZoom}
                    onMouseLeave={stopZoom}
                    onTouchStart={() => startZoom('in')}
                    onTouchEnd={stopZoom}
                    className="bg-black/40 hover:bg-black/60 text-white p-3 rounded-full backdrop-blur-md transition-colors cursor-pointer border border-white/20 select-none"
                  >
                    <ZoomIn size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Music Player */}
      <AudioPlayer />
    </div>
  );
}
