"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Pause, Play, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/buttons/Button";

type HeroVideoProps = {
  src?: string;
  heading?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export default function HeroVideo({
  src = "/Family_memories_ver04.mp4",
  heading = "A New Way to\nRemember Loved Ones",
  subtitle = "Celebrate and preserve memories to share with family and friends.",
  ctaHref = "#order",
  ctaLabel = "Order Your Memory Square",
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onPlay = () => {
      setIsPlaying(true);
      setHasEnded(false);
    };
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true; // extra guard: autoplay policies require muted
    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        const onInteract = async () => {
          try {
            await v.play();
          } catch {}
          window.removeEventListener("click", onInteract);
          window.removeEventListener("touchstart", onInteract);
        };
        window.addEventListener("click", onInteract, { once: true });
        window.addEventListener("touchstart", onInteract, { once: true });
      }
    };
    tryPlay();
  }, []);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      await v.play();
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const replay = async () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    setHasEnded(false);
    await v.play();
  };

  const [line1, line2] = heading.split("\n");

  return (
    <section className="relative w-full lg:h-[80vh]  overflow-hidden">
      {/* Background video - muted + playsInline ensure autoplay across browsers */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-[50vh] lg:h-full w-full object-cover"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label="Background video"
      >
        {"Your browser does not support the HTML5 video tag."}
      </video>

      {/* Foreground banner content (classes for GSAP) */}
      <div className="relative z-10 h-[50vh] lg:h-full container mx-auto px-6 flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h1 className="text-white text-center font-[Outfit] md:text-4xl sm:text-3xl text-3xl lg:text-[56px] font-bold leading-[120%]">
            {line1}
            {line2}
          </h1>

          <p className="subtitle mt-4 text-white/85 text-base sm:text-lg">
            {subtitle}
          </p>

          <div className="content mt-6 flex items-center justify-center">
            <Button
              asChild
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-5 text-sm sm:text-base"
            >
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Small on-video controls */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 hidden lg:block">
        <Button
          variant="secondary"
          size="icon"
          className="pointer-events-auto bg-white/80 hover:bg-white rounded-full"
          onClick={togglePlay}
          aria-label={
            isPlaying ? "Pause background video" : "Play background video"
          }
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="pointer-events-auto bg-white/80 hover:bg-white rounded-full"
          onClick={toggleMute}
          aria-label={
            isMuted ? "Unmute background video" : "Mute background video"
          }
        >
          {isMuted ? (
            <VolumeX className="h-5 w-5" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
        </Button>
        {hasEnded && (
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto bg-white/80 hover:bg-white rounded-full"
            onClick={replay}
            aria-label="Replay video"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Center play overlay when paused/ended */}
      {(!isPlaying || hasEnded) && (
        <button
          type="button"
          onClick={hasEnded ? replay : togglePlay}
          aria-label={hasEnded ? "Replay video" : "Play video"}
          className="absolute inset-0 z-10 grid place-items-center text-white/90"
        >
          <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/25 backdrop-blur ring-1 ring-white/40 hover:bg-white/35 transition">
            <Play className="h-8 w-8 fill-white text-white" />
          </span>
          <span className="sr-only">{hasEnded ? "Replay" : "Play"}</span>
        </button>
      )}
    </section>
  );
}
