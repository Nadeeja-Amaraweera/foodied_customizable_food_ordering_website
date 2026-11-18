import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';

/* ─── Burger Preparation Configuration ─── */
const TOTAL_FRAMES = 250; // 250 frames in public/food-frames/ (frame_0001.webp - frame_0250.webp)
const MAX_CONCURRENT_REQUESTS = 3;

const getFrameUrl = (index: number): string => {
  const frameNum = String(index + 1).padStart(4, '0');
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return `${cleanBase}food-frames/frame_${frameNum}.webp`;
};

/* ─── 8 Cinematic Food Preparation Stages ─── */
export interface StageInfo {
  id: number;
  numberStr: string;
  title: string;
  description: string;
  startFrame: number;
  endFrame: number;
}

export const STAGES: StageInfo[] = [
  {
    id: 1,
    numberStr: '01',
    title: 'Fresh Ingredients',
    description: 'Every great meal begins with carefully selected fresh ingredients.',
    startFrame: 0,
    endFrame: 30,
  },
  {
    id: 2,
    numberStr: '02',
    title: 'Preparing the Patty',
    description: 'The foundation of an unforgettable burger starts with the perfect preparation.',
    startFrame: 31,
    endFrame: 65,
  },
  {
    id: 3,
    numberStr: '03',
    title: 'Perfectly Cooked',
    description: 'Cooked with care to bring out rich flavour and texture.',
    startFrame: 66,
    endFrame: 98,
  },
  {
    id: 4,
    numberStr: '04',
    title: 'Toasted Buns',
    description: 'Golden, warm and perfectly toasted buns create the perfect base.',
    startFrame: 99,
    endFrame: 130,
  },
  {
    id: 5,
    numberStr: '05',
    title: 'Fresh Toppings',
    description: 'Fresh ingredients bring colour, texture and balance to every bite.',
    startFrame: 131,
    endFrame: 162,
  },
  {
    id: 6,
    numberStr: '06',
    title: 'Cheese & Sauce',
    description: 'A delicious combination of creamy sauces and rich flavours.',
    startFrame: 163,
    endFrame: 192,
  },
  {
    id: 7,
    numberStr: '07',
    title: 'Burger Assembly',
    description: 'Every layer comes together to create something special.',
    startFrame: 193,
    endFrame: 222,
  },
  {
    id: 8,
    numberStr: '08',
    title: 'The Final Presentation',
    description: 'From fresh ingredients to a perfect plate — made to satisfy.',
    startFrame: 223,
    endFrame: 249,
  },
];

/* ─── Keyframe Animations & Responsive Viewport Styles ─── */
const CSS = `
@keyframes stageFadeIn {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes floatHint {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes spinRing {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.exp-spin { animation: spinRing 1.2s linear infinite; }

/* Responsive viewport containers */
.exp-root {
  width: 100%;
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  margin: 0;
  padding: 0;
  background: #0c0a09;
  position: relative;
  overflow-x: clip;
}

.exp-sticky-viewport {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  height: 100svh;
  height: 100dvh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0c0a09;
}

.exp-canvas {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

@media (prefers-reduced-motion: reduce) {
  .exp-spin {
    animation: none !important;
  }
}
`;

/* ─── Full-Screen Responsive Scroll-Controlled Canvas Animation ─── */
function BurgerScrollExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  // Initial loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Active stage state
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [showStageOverlay, setShowStageOverlay] = useState(false);
  const activeStageIdxRef = useRef(0);

  // Frame Cache and State Tracking
  const imageCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const loadingSet = useRef<Set<number>>(new Set());
  const failedSet = useRef<Set<number>>(new Set());
  const activeRequests = useRef(0);

  // Track currently requested and currently displayed frames
  const targetFrameRef = useRef(0);
  const displayedFrameRef = useRef(-1);
  const scrollDirectionRef = useRef<1 | -1>(1);
  const lastScrollYRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Core Canvas Drawing: Renders target frame with full-viewport object-fit: cover scaling */
  const renderTargetOrClosest = useCallback((targetIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Direct match in cache
    let imgToDraw = imageCache.current.get(targetIdx);
    let frameToDrawIdx = targetIdx;

    // 2. If target is not loaded yet, find the closest available loaded frame
    if (!imgToDraw) {
      let closestDist = Infinity;
      let closestIdx = -1;

      for (const idx of imageCache.current.keys()) {
        const dist = Math.abs(idx - targetIdx);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      }

      if (closestIdx !== -1) {
        if (displayedFrameRef.current >= 0) {
          const currentDist = Math.abs(displayedFrameRef.current - targetIdx);
          if (closestDist < currentDist) {
            imgToDraw = imageCache.current.get(closestIdx);
            frameToDrawIdx = closestIdx;
          } else {
            imgToDraw = imageCache.current.get(displayedFrameRef.current);
            frameToDrawIdx = displayedFrameRef.current;
          }
        } else {
          imgToDraw = imageCache.current.get(closestIdx);
          frameToDrawIdx = closestIdx;
        }
      }
    }

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      return;
    }

    // Skip redundant redraw if already showing this exact frame
    if (displayedFrameRef.current === frameToDrawIdx) {
      return;
    }

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = imgToDraw.naturalWidth;
    const ih = imgToDraw.naturalHeight;

    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(0, 0, cw, ch);

    // object-fit: cover scaling — fills 100% of viewport in normal window mode without black bars
    const scale = Math.max(cw / iw, ch / ih);
    const drawWidth = iw * scale;
    const drawHeight = ih * scale;
    const drawX = (cw - drawWidth) / 2;
    const drawY = (ch - drawHeight) / 2;

    ctx.drawImage(imgToDraw, drawX, drawY, drawWidth, drawHeight);
    displayedFrameRef.current = frameToDrawIdx;
  }, []);

  /* Progressive Frame Queue: Loads batches maintaining max 3 concurrent requests */
  const pumpQueue = useCallback(() => {
    if (activeRequests.current >= MAX_CONCURRENT_REQUESTS) return;
    if (imageCache.current.size + failedSet.current.size >= TOTAL_FRAMES) return;

    const currentTarget = targetFrameRef.current;
    const direction = scrollDirectionRef.current;

    // Build priority list:
    // 1. Current target frame
    // 2. Ahead in direction of scrolling
    // 3. Behind in opposite direction
    const priorityList: number[] = [];

    if (currentTarget >= 0 && currentTarget < TOTAL_FRAMES) {
      priorityList.push(currentTarget);
    }

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const ahead = currentTarget + i * direction;
      if (ahead >= 0 && ahead < TOTAL_FRAMES) {
        priorityList.push(ahead);
      }
    }

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const behind = currentTarget - i * direction;
      if (behind >= 0 && behind < TOTAL_FRAMES) {
        priorityList.push(behind);
      }
    }

    // Dispatch requests up to max concurrency
    for (const idx of priorityList) {
      if (activeRequests.current >= MAX_CONCURRENT_REQUESTS) break;

      if (
        imageCache.current.has(idx) ||
        loadingSet.current.has(idx) ||
        failedSet.current.has(idx)
      ) {
        continue;
      }

      loadingSet.current.add(idx);
      activeRequests.current += 1;

      const img = new Image();
      const frameUrl = getFrameUrl(idx);
      img.src = frameUrl;

      const onImageReady = () => {
        loadingSet.current.delete(idx);
        activeRequests.current = Math.max(0, activeRequests.current - 1);
        imageCache.current.set(idx, img);

        if (idx === 0 || imageCache.current.size >= 1) {
          setIsInitialLoading(false);
        }

        renderTargetOrClosest(targetFrameRef.current);
        pumpQueue();
      };

      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(onImageReady).catch(onImageReady);
        } else {
          onImageReady();
        }
      };

      img.onerror = () => {
        console.warn(`[FoodExperience] Error loading frame ${idx} from ${frameUrl}`);
        loadingSet.current.delete(idx);
        failedSet.current.add(idx);
        activeRequests.current = Math.max(0, activeRequests.current - 1);

        if (idx === 0 && imageCache.current.size === 0) {
          setIsInitialLoading(false);
        }

        pumpQueue();
      };
    }
  }, [renderTargetOrClosest]);

  /* Handle Canvas Resizing (HiDPI support, full available viewport matching) */
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const width = parent ? parent.clientWidth : window.innerWidth;
    const height = parent ? parent.clientHeight : window.innerHeight;
    if (width === 0 || height === 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    displayedFrameRef.current = -1;
    renderTargetOrClosest(targetFrameRef.current);
  }, [renderTargetOrClosest]);

  /* Initial setup on mount: starts loading initial frames & sets up canvas */
  useEffect(() => {
    targetFrameRef.current = 0;
    pumpQueue();
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [pumpQueue, handleResize]);

  /* Smooth scroll to begin the experience */
  const handleExploreClick = () => {
    if (containerRef.current) {
      const sectionScrollableDist = containerRef.current.offsetHeight - window.innerHeight;
      const targetY = containerRef.current.offsetTop + sectionScrollableDist * 0.08;
      window.scrollTo({
        top: Math.max(400, targetY),
        behavior: 'smooth',
      });
    }
  };

  /* Scroll Listener using requestAnimationFrame */
  useEffect(() => {
    if (prefersReduced) return;

    const onScroll = () => {
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        const container = containerRef.current;
        if (!container) return;

        const currentY = window.scrollY;
        scrollDirectionRef.current = currentY >= lastScrollYRef.current ? 1 : -1;
        lastScrollYRef.current = currentY;

        const rect = container.getBoundingClientRect();
        const sectionScrollableDist = container.offsetHeight - window.innerHeight;

        if (sectionScrollableDist <= 0) return;

        // Calculate scroll progress from 0.0 to 1.0
        const scrolledIntoSection = -rect.top;
        const rawProgress = scrolledIntoSection / sectionScrollableDist;
        const scrollProgress = Math.max(0, Math.min(1, rawProgress));

        // Logical mapping: frameIndex = Math.round(scrollProgress * (totalFrames - 1))
        const frameIndex = Math.max(
          0,
          Math.min(TOTAL_FRAMES - 1, Math.round(scrollProgress * (TOTAL_FRAMES - 1)))
        );

        targetFrameRef.current = frameIndex;

        // Hero Overlay: smoothly fades out as scroll starts
        if (heroOverlayRef.current) {
          const heroOpacity = Math.max(0, 1 - scrollProgress * 16);
          heroOverlayRef.current.style.opacity = String(heroOpacity);
          heroOverlayRef.current.style.transform = `translateY(-${(1 - heroOpacity) * 40}px)`;
          heroOverlayRef.current.style.pointerEvents = heroOpacity > 0.1 ? 'auto' : 'none';
          heroOverlayRef.current.style.visibility = heroOpacity > 0.001 ? 'visible' : 'hidden';
        }

        // Stage Overlay: emerges right as hero fades out
        const isPastHero = scrollProgress >= 0.035;
        setShowStageOverlay(isPastHero);

        const stageIdx = STAGES.findIndex(
          (s) => frameIndex >= s.startFrame && frameIndex <= s.endFrame
        );
        if (stageIdx !== -1 && stageIdx !== activeStageIdxRef.current) {
          activeStageIdxRef.current = stageIdx;
          setActiveStageIdx(stageIdx);
        }

        // Render frame to canvas
        renderTargetOrClosest(frameIndex);

        // Keep queue prioritizing frames around current target
        pumpQueue();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [prefersReduced, renderTargetOrClosest, pumpQueue]);

  /* Fallback for users requesting reduced motion */
  if (prefersReduced) {
    return (
      <section
        style={{
          background: '#0c0a09',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <img
          src={getFrameUrl(TOTAL_FRAMES - 1)}
          alt="Completed Fresh Burger"
          style={{
            width: '100%',
            maxWidth: 1400,
            borderRadius: 16,
            aspectRatio: '16/9',
            objectFit: 'cover',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
          }}
        />
      </section>
    );
  }

  const currentStage = STAGES[activeStageIdx] || STAGES[0];

  return (
    <div
      ref={containerRef}
      style={{
        height: '900vh', // Generous, immersive scroll length for all 250 frames
        position: 'relative',
        background: '#0c0a09',
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      {/* Sticky Full-Screen Animation Viewport — Automatically fills available browser window */}
      <div className="exp-sticky-viewport">
        {/* Initial Loading Spinner */}
        {isInitialLoading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 35,
              background: '#0c0a09',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              className="exp-spin"
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                border: '3px solid rgba(139, 195, 74, 0.2)',
                borderTopColor: '#8BC34A',
              }}
            />
          </div>
        )}

        {/* HTML Canvas for Full-Screen Frame-by-Frame Burger Preparation */}
        <canvas ref={canvasRef} className="exp-canvas" />

        {/* Subtle Vignette Gradient around Edges to enhance text legibility */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
            background:
              'radial-gradient(circle at center, transparent 40%, rgba(12, 10, 9, 0.45) 85%, rgba(12, 10, 9, 0.8) 100%)',
          }}
        />

        {/* ── Cinematic Hero Content Overlay (Over opening frames, fades with scroll) ── */}
        <div
          ref={heroOverlayRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 25,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '0 clamp(16px, 4vw, 32px)',
            pointerEvents: 'auto',
          }}
        >
          <p
            style={{
              color: '#8BC34A',
              fontSize: 'clamp(0.72rem, 1.4vw, 0.88rem)',
              fontWeight: 800,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: 18,
              textShadow: '0 2px 10px rgba(0,0,0,0.85)',
            }}
          >
            Foodied &nbsp;·&nbsp; The Experience
          </p>
          <h1
            style={{
              color: '#FFFFFF',
              fontSize: 'clamp(2.2rem, 7vw, 5.5rem)',
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: '0 0 22px',
              textShadow: '0 4px 28px rgba(0,0,0,0.95)',
            }}
          >
            A JOURNEY OF<br />
            <span style={{ color: '#8BC34A' }}>FLAVOUR</span>
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.92)',
              fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 36px',
              textShadow: '0 2px 14px rgba(0,0,0,0.9)',
            }}
          >
            From the finest fresh ingredients to the perfect plate — experience the art of food
          </p>
          <button
            onClick={handleExploreClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: 'clamp(14px, 2vh, 18px) clamp(32px, 4vw, 44px)',
              borderRadius: 999,
              background: '#FFFFFF',
              color: '#1a1a1a',
              fontWeight: 800,
              fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
              letterSpacing: '0.04em',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              transition:
                'transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1.05)';
              btn.style.background = '#8BC34A';
              btn.style.color = '#FFFFFF';
              btn.style.boxShadow = '0 12px 36px rgba(139,195,74,0.4)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1)';
              btn.style.background = '#FFFFFF';
              btn.style.color = '#1a1a1a';
              btn.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';
            }}
          >
            Explore the Experience
          </button>

          {/* Smooth Scroll Cue */}
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(20px, 4vh, 36px)',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
              textShadow: '0 2px 8px rgba(0,0,0,0.85)',
              animation: 'floatHint 2.4s ease-in-out infinite',
            }}
            aria-hidden="true"
          >
            <span>Scroll to explore</span>
            <span style={{ fontSize: 18 }}>↓</span>
          </div>
        </div>

        {/* ── Cinematic Stage Overlay (Bottom-Left on desktop, responsive on mobile) ── */}
        <div
          style={{
            position: 'absolute',
            bottom: 'clamp(20px, 5vh, 60px)',
            left: 'clamp(16px, 4vw, 64px)',
            right: 'clamp(16px, 4vw, auto)',
            zIndex: 25,
            maxWidth: 'clamp(290px, calc(100vw - 32px), 560px)',
            pointerEvents: 'none',
            opacity: showStageOverlay ? 1 : 0,
            transform: showStageOverlay ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {showStageOverlay && (
            <div
              key={currentStage.id}
              style={{
                background: 'rgba(12, 10, 9, 0.75)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 20,
                padding: 'clamp(16px, 2.5vw, 24px) clamp(18px, 3vw, 28px)',
                boxShadow: '0 20px 45px rgba(0, 0, 0, 0.65)',
                animation: 'stageFadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#8BC34A',
                    boxShadow: '0 0 10px #8BC34A',
                  }}
                />
                <span
                  style={{
                    color: '#8BC34A',
                    fontSize: 'clamp(0.72rem, 1.2vw, 0.82rem)',
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                  }}
                >
                  STAGE {currentStage.numberStr}
                </span>
              </div>
              <h3
                style={{
                  color: '#FFFFFF',
                  fontSize: 'clamp(1.25rem, 2.5vw, 1.95rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  margin: '0 0 8px',
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                }}
              >
                {currentStage.title}
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.86)',
                  fontSize: 'clamp(0.82rem, 1.3vw, 0.98rem)',
                  lineHeight: 1.55,
                  margin: 0,
                  fontWeight: 400,
                  textShadow: '0 1px 6px rgba(0,0,0,0.8)',
                }}
              >
                {currentStage.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Food Experience Page ─── */
export function FoodExperiencePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartTotalCount } = useCart();

  return (
    <div className="exp-root">
      {/* Inject Keyframes & Responsive Viewport CSS */}
      <style>{CSS}</style>

      {/* ── Transparent Navigation Bar ── */}
      <Header
        cartTotalCount={cartTotalCount}
        currentUser={user}
        onCartOpen={() => navigate('/cart')}
        onLogout={logout}
        onAuthNavigate={() => navigate('/login')}
        transparent={true}
      />

      {/* ── Full-Screen Responsive Burger Preparation Journey (250 WebP Frames, 8 Stages) ── */}
      <BurgerScrollExperience />

      {/* ── Section 3: Final CTA Section (Preserved & Visually Consistent) ── */}
      <section
        style={{
          background: '#0c0a09',
          padding: 'clamp(80px, 12vw, 140px) 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Subtle radial lime glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70vw',
            height: '70vw',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,195,74,0.14) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 640, margin: '0 auto' }}>
          <p
            style={{
              color: '#8BC34A',
              fontSize: 'clamp(0.75rem, 1.3vw, 0.85rem)',
              fontWeight: 800,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            Culinary Craftsmanship
          </p>
          <h2
            style={{
              color: '#FAFDF7',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              margin: '0 0 20px',
              letterSpacing: '-0.02em',
            }}
          >
            Made to Make You Hungry
          </h2>
          <p
            style={{
              color: 'rgba(250,253,247,0.75)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              fontWeight: 400,
              lineHeight: 1.65,
              margin: '0 0 40px',
            }}
          >
            Explore our carefully crafted menu and order your perfect meal
          </p>
          <button
            onClick={() => navigate('/menu')}
            style={{
              padding: '18px 48px',
              borderRadius: 999,
              background: '#8BC34A',
              color: '#fff',
              fontWeight: 800,
              fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 35px rgba(139,195,74,0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1.05)';
              btn.style.background = '#7CB342';
              btn.style.boxShadow = '0 14px 44px rgba(139,195,74,0.45)';
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.transform = 'scale(1)';
              btn.style.background = '#8BC34A';
              btn.style.boxShadow = '0 10px 35px rgba(139,195,74,0.35)';
            }}
          >
            Explore Our Menu
          </button>
        </div>
      </section>
    </div>
  );
}

export default FoodExperiencePage;
