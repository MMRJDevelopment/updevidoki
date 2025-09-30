/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import type React from "react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";
import { Button } from "../buttons/Button";

type SlideItem = {
	src: string;
	alt: string;
	className: string; // width/height classes
	align?: "top" | "bottom"; // vertical staggering
};

type Slide = {
	items: SlideItem[];
};

function BentoCard({ item }: { item: SlideItem }) {
	return (
		<div
			className={`bento-card relative overflow-hidden rounded-[18px] shadow-[0_6px_24px_rgba(0,0,0,0.08)] bg-white ${
				item.className
			} ${item.align === "bottom" ? "self-end" : "self-start"}`}
			aria-label={item.alt}
		>
			<Image
				src={item.src || "/placeholder.png"}
				alt={item.alt}
				width={item.className.includes("w-[320px]") ? 320 : 280} // example width mapping
				height={item.className.includes("h-[240px]") ? 240 : 280} // example height mapping
				className="absolute inset-0 h-full w-full object-cover select-none"
				draggable={false}
			/>
		</div>
	);
}

export default function MemorialSlider() {
	// Build slides: three slides with the same layout but varied images
	const slides: Slide[] = useMemo(
		() => [
			{
				items: [
					{
						src: "/placeholder.png?height=240&width=320",
						alt: "Family with grandparents by a Christmas tree",
						className: "w-[320px] h-[240px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=220&width=260",
						alt: "Elderly couple walking with grandchild outdoors",
						className: "w-[260px] h-[220px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=240&width=360",
						alt: "Family having tea at the kitchen table",
						className: "w-[360px] h-[240px]",
					},
					{
						src: "/placeholder.png?height=260&width=380",
						alt: "Family walking in a park during autumn",
						className: "w-[380px] h-[260px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=280&width=280",
						alt: "Father and daughter smiling",
						className: "w-[280px] h-[280px]",
						align: "bottom",
					},
					{
						src: "/placeholder.png?height=220&width=340",
						alt: "Multi-generation family celebrating in kitchen",
						className: "w-[340px] h-[220px]",
						align: "bottom",
					},
					{
						src: "/placeholder.png?height=220&width=280",
						alt: "Family group hug on a couch",
						className: "w-[280px] h-[220px]",
						align: "top",
					},
				],
			},
			{
				items: [
					{
						src: "/placeholder.png?height=240&width=320",
						alt: "Grandparents reading to kids",
						className: "w-[320px] h-[240px]",
						align: "bottom",
					},
					{
						src: "/placeholder.png?height=280&width=280",
						alt: "Family portrait in studio",
						className: "w-[280px] h-[280px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=240&width=360",
						alt: "Family dinner together",
						className: "w-[360px] h-[240px]",
					},
					{
						src: "/placeholder.png?height=220&width=260",
						alt: "Kids baking cookies with parents",
						className: "w-[260px] h-[220px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=220&width=340",
						alt: "Family pizza party at home",
						className: "w-[340px] h-[220px]",
						align: "bottom",
					},
					{
						src: "/placeholder.png?height=260&width=380",
						alt: "Family walk at sunset in park",
						className: "w-[380px] h-[260px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=220&width=280",
						alt: "Mother and son laughing candidly",
						className: "w-[280px] h-[220px]",
						align: "bottom",
					},
				],
			},
			{
				items: [
					{
						src: "/placeholder.png?height=240&width=360",
						alt: "Family watching a movie on the sofa",
						className: "w-[360px] h-[240px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=220&width=260",
						alt: "Grandma baking with grandson",
						className: "w-[260px] h-[220px]",
					},
					{
						src: "/placeholder.png?height=260&width=380",
						alt: "Extended family outdoor picnic",
						className: "w-[380px] h-[260px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=220&width=340",
						alt: "Family birthday cake at home",
						className: "w-[340px] h-[220px]",
						align: "bottom",
					},
					{
						src: "/placeholder.png?height=280&width=280",
						alt: "Parents hugging daughter",
						className: "w-[280px] h-[280px]",
						align: "bottom",
					},
					{
						src: "/placeholder.png?height=220&width=280",
						alt: "Kids playing in the living room",
						className: "w-[280px] h-[220px]",
						align: "top",
					},
					{
						src: "/placeholder.png?height=240&width=320",
						alt: "Family walking through autumn leaves",
						className: "w-[320px] h-[240px]",
					},
				],
			},
		],
		[]
	);

	// Build clones for infinite loop
	const actualCount = slides.length;
	const firstClone = slides[0];
	const lastClone = slides[actualCount - 1];
	const renderSlides: Slide[] = useMemo(
		() => [lastClone, ...slides, firstClone],
		[slides]
	);

	const containerRef = useRef<HTMLDivElement | null>(null);
	const trackRef = useRef<HTMLDivElement | null>(null);
	const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [index, setIndex] = useState(1); // start at first real slide (after head clone)
	const [width, setWidth] = useState(0);
	const [isHover, setIsHover] = useState(false);
	const [autoplay, setAutoplay] = useState(true);
	const [isDragging, setIsDragging] = useState(false);

	// Drag tracking
	const dragStartX = useRef(0);
	const baseX = useRef(0);
	const lastMoveTime = useRef(0);
	const lastMoveX = useRef(0);

	// Resize handler
	useEffect(() => {
		const measure = () => {
			if (!containerRef.current) return;
			setWidth(containerRef.current.clientWidth);
			// Reposition to current slide without anim
			if (trackRef.current) {
				gsap.set(trackRef.current, {
					x: -index * containerRef.current.clientWidth,
				});
			}
		};
		measure();
		const ro = new ResizeObserver(measure);
		if (containerRef.current) ro.observe(containerRef.current);
		return () => ro.disconnect();
	}, []);

	// Initial position
	useEffect(() => {
		if (!trackRef.current || !containerRef.current) return;
		gsap.set(trackRef.current, { x: -1 * containerRef.current.clientWidth });
		animateCards(1); // animate first real slide
	}, []);

	const goTo = useCallback(
		(target: number, opts?: { animate?: boolean; duration?: number }) => {
			if (!trackRef.current || !containerRef.current) return;
			const dur = opts?.duration ?? 0.6;
			const shouldAnimate = opts?.animate ?? true;
			const targetX = -target * containerRef.current.clientWidth;

			if (shouldAnimate) {
				gsap.to(trackRef.current, {
					x: targetX,
					duration: dur,
					ease: "power3.out",
					onComplete: () => {
						// Handle clones to keep infinite loop
						if (target === 0) {
							// moved to head clone -> jump to last real
							const realIndex = actualCount;
							gsap.set(trackRef.current, {
								x: -realIndex * containerRef.current!.clientWidth,
							});
							setIndex(realIndex);
							animateCards(realIndex);
							return;
						}
						if (target === actualCount + 1) {
							// moved to tail clone -> jump to first real
							const realIndex = 1;
							gsap.set(trackRef.current, {
								x: -realIndex * containerRef.current!.clientWidth,
							});
							setIndex(realIndex);
							animateCards(realIndex);
							return;
						}
						setIndex(target);
						animateCards(target);
					},
				});
			} else {
				gsap.set(trackRef.current, { x: targetX });
				setIndex(target);
				animateCards(target);
			}
		},
		[actualCount]
	);

	const next = useCallback(
		() => goTo(index + 1, { animate: true }),
		[goTo, index]
	);
	const prev = useCallback(
		() => goTo(index - 1, { animate: true }),
		[goTo, index]
	);

	// Autoplay
	useEffect(() => {
		if (!autoplay || isHover || isDragging) return;
		const id = setInterval(() => next(), 3800);
		return () => clearInterval(id);
	}, [autoplay, isHover, isDragging, next]);

	// Keyboard navigation
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight") next();
			if (e.key === "ArrowLeft") prev();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [next, prev]);

	// Hover pause
	const onEnter = () => setIsHover(true);
	const onLeave = () => setIsHover(false);

	// Drag handlers (pointer events)
	const onPointerDown = (e: React.PointerEvent) => {
		if (!trackRef.current) return;
		(e.target as HTMLElement).setPointerCapture?.(e.pointerId);
		setIsDragging(true);
		dragStartX.current = e.clientX;
		// read current x from GSAP matrix
		const m = gsap.getProperty(trackRef.current, "x") as number;
		baseX.current = m || 0;
		lastMoveTime.current = e.timeStamp;
		lastMoveX.current = e.clientX;
	};

	const onPointerMove = (e: React.PointerEvent) => {
		if (!isDragging || !trackRef.current) return;
		const dx = e.clientX - dragStartX.current;
		gsap.set(trackRef.current, { x: baseX.current + dx });
		lastMoveTime.current = e.timeStamp;
		lastMoveX.current = e.clientX;
	};

	const onPointerUp = (e: React.PointerEvent) => {
		if (!isDragging || !trackRef.current || !containerRef.current) return;
		setIsDragging(false);
		const dx = e.clientX - dragStartX.current;
		const dt = e.timeStamp - lastMoveTime.current;
		const vx = (e.clientX - lastMoveX.current) / Math.max(dt, 1); // px/ms

		const threshold = containerRef.current.clientWidth * 0.18;
		const fast = Math.abs(vx) > 0.6; // quick flick

		if (dx < -threshold || (fast && vx < 0)) {
			next();
		} else if (dx > threshold || (fast && vx > 0)) {
			prev();
		} else {
			// snap back to current index
			goTo(index, { animate: true, duration: 0.4 });
		}
	};

	// Card entrance animation for the current slide
	function animateCards(targetIndex: number) {
		const el = slideRefs.current[targetIndex];
		if (!el) return;
		const cards = el.querySelectorAll(".bento-card");
		gsap.fromTo(
			cards,
			{ opacity: 0, y: 24, scale: 0.96 },
			{
				opacity: 1,
				y: 0,
				scale: 1,
				duration: 0.7,
				ease: "power3.out",
				stagger: 0.06,
				overwrite: true,
			}
		);
	}

	// Dots (map actual slides)
	const goToDot = (dotIndex: number) => {
		// dotIndex in [0..actualCount-1] -> render index = dotIndex + 1
		const target = dotIndex + 1;
		goTo(target, { animate: true });
	};

	// Active dot index (map back to [0..actualCount-1])
	const activeDot = useMemo(() => {
		let real = index - 1;
		if (real < 0) real = actualCount - 1;
		if (real >= actualCount) real = 0;
		return real;
	}, [index, actualCount]);

	return (
		<section
			className="w-full h-screen"
			aria-roledescription="carousel"
			aria-label="Bento image slider"
		>
			<div
				ref={containerRef}
				className={`relative w-full overflow-hidden select-none ${
					isDragging ? "cursor-grabbing" : "cursor-default"
				}`}
				onMouseEnter={onEnter}
				onMouseLeave={onLeave}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUp}
				onPointerCancel={onPointerUp}
				onPointerLeave={(e) => {
					// If dragging and pointer leaves, finalize
					if (isDragging) onPointerUp(e as unknown as React.PointerEvent);
				}}
			>
				{/* Gradient edges to soften the cut off */}
				<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />

				{/* Track */}
				<div ref={trackRef} className="flex touch-pan-y">
					{renderSlides.map((slide, i) => (
						<div
							key={`slide-${i}`}
							ref={(el) => {
								slideRefs.current[i] = el;
							}}
							className="shrink-0 px-4 sm:px-6 lg:px-8"
							style={{ width: width || "100%" }}
							role={i === index ? "group" : undefined}
							aria-roledescription="slide"
						>
							{/* Slide content: bento row that mirrors the reference design */}
							<div className="mx-auto flex max-w-[1200px] items-start justify-center gap-6 sm:gap-8 lg:gap-10">
								{/* Responsive: on small screens stack more compact */}
								<div className="grid grid-cols-2 gap-4 sm:hidden">
									{slide.items.map((it, idx) => (
										<div key={idx} className="flex">
											<BentoCard
												item={{
													...it,
													className: "w-full h-[160px]",
													align: idx % 2 === 0 ? "top" : "bottom",
												}}
											/>
										</div>
									))}
								</div>

								{/* Desktop/tablet layout */}
								<div className="hidden sm:flex flex items-start gap-6 sm:gap-8 lg:gap-10 h-[440px]">
									{slide.items.map((item, idx) => (
										<BentoCard key={idx} item={item} />
									))}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Controls */}
				<div className="absolute inset-y-0 left-0 z-20 flex items-center pl-2 sm:pl-4">
					<Button
						variant="secondary"
						size="icon"
						aria-label="Previous slide"
						onClick={prev}
						className="rounded-full shadow-md"
					>
						<ChevronLeft className="h-5 w-5" />
					</Button>
				</div>
				<div className="absolute inset-y-0 right-0 z-20 flex items-center pr-2 sm:pr-4">
					<Button
						variant="secondary"
						size="icon"
						aria-label="Next slide"
						onClick={next}
						className="rounded-full shadow-md"
					>
						<ChevronRight className="h-5 w-5" />
					</Button>
				</div>

				{/* Dots and autoplay control */}
				<div className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 transform">
					<div className="flex items-center gap-3 rounded-full bg-white/80 backdrop-blur px-2 py-1 shadow">
						<button
							aria-label={autoplay ? "Pause autoplay" : "Resume autoplay"}
							onClick={() => setAutoplay((p) => !p)}
							className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
						>
							{autoplay ? (
								<Pause className="h-4 w-4" />
							) : (
								<Play className="h-4 w-4" />
							)}
						</button>
						<div className="flex items-center gap-2 px-1">
							{slides.map((_, d) => {
								const isActive = activeDot === d;
								return (
									<button
										key={d}
										onClick={() => goToDot(d)}
										aria-label={`Go to slide ${d + 1}`}
										aria-current={isActive ? "true" : "false"}
										className={`h-2.5 rounded-full transition-all ${
											isActive
												? "w-6 bg-gray-800"
												: "w-2.5 bg-gray-400/70 hover:bg-gray-600"
										}`}
									/>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
