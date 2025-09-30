/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useRef, useEffect, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

// Container variants optimized for Tailwind CSS v4
const containerVariants = cva(
	[
		"w-full mx-auto transition-all duration-300",
		// Tailwind v4 responsive padding with modern syntax
		"px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12",
	],
	{
		variants: {
			size: {
				// Tailwind v4 container sizes with CSS Grid support
				xs: "max-w-20rem", // 320px
				sm: "max-w-24rem", // 384px
				md: "max-w-28rem", // 448px
				lg: "max-w-32rem", // 512px
				xl: "max-w-36rem", // 576px
				"2xl": "max-w-42rem", // 672px
				"3xl": "max-w-48rem", // 768px
				"4xl": "max-w-56rem", // 896px
				"5xl": "max-w-64rem", // 1024px
				"6xl": "max-w-72rem", // 1152px
				"7xl": "max-w-80rem", // 1280px
				"8xl": "max-w-90rem", // 1440px
				"9xl": "max-w-96rem", // 1536px
				// Screen-based containers (Tailwind v4 breakpoints)
				"screen-sm": "max-w-[40rem]", // 640px
				"screen-md": "max-w-[48rem]", // 768px
				"screen-lg": "max-w-[64rem]", // 1024px
				"screen-xl": "max-w-[80rem]", // 1280px
				"screen-2xl": "max-w-[96rem]", // 1536px
				"screen-ultra": "max-w-[120rem]", // 1920px (4K support)
				full: "max-w-full",
				none: "max-w-none",
				// CSS Container Query units (Tailwind v4 feature)
				"container-sm": "max-w-[20cqw]",
				"container-md": "max-w-[40cqw]",
				"container-lg": "max-w-[60cqw]",
				"container-xl": "max-w-[80cqw]",
				"container-full": "max-w-[100cqw]",
			},
			padding: {
				none: "p-0",
				xs: "p-1",
				sm: "p-2",
				md: "p-4",
				lg: "p-6",
				xl: "p-8",
				"2xl": "p-10",
				"3xl": "p-12",
				"4xl": "p-16",
				"5xl": "p-20",
				// Tailwind v4 logical padding
				inline: "px-4",
				block: "py-4",
				responsive: "p-4 md:p-6 lg:p-8 xl:p-10",
			},
			spacing: {
				none: "",
				xs: "space-y-1",
				sm: "space-y-2",
				md: "space-y-4",
				lg: "space-y-6",
				xl: "space-y-8",
				"2xl": "space-y-12",
				"3xl": "space-y-16",
				// Tailwind v4 gap utilities
				"gap-sm": "flex flex-col gap-2",
				"gap-md": "flex flex-col gap-4",
				"gap-lg": "flex flex-col gap-6",
				"gap-xl": "flex flex-col gap-8",
			},
			variant: {
				default: "",
				centered: "flex flex-col items-center",
				grid: "grid place-items-center",
				stack: "flex flex-col",
				cluster: "flex flex-wrap gap-4",
				// Tailwind v4 subgrid support
				subgrid: "grid grid-cols-subgrid grid-rows-subgrid",
			},
			// Tailwind v4 container queries
			queries: {
				none: "",
				sm: "@container/sm",
				md: "@container/md",
				lg: "@container/lg",
				xl: "@container/xl",
				responsive: "@container",
			},
		},
		defaultVariants: {
			size: "screen-2xl",
			spacing: "none",
			variant: "default",
			queries: "none",
		},
	}
);

// GSAP Animation Configuration Types
export interface GSAPAnimationConfig {
	from?: gsap.TweenVars;
	to?: gsap.TweenVars;
	scrollTrigger?: ScrollTrigger.Vars;
	timeline?: {
		delay?: number;
		stagger?: number | gsap.StaggerVars;
		repeat?: number;
		yoyo?: boolean;
	};
	trigger?: "load" | "scroll" | "hover" | "click" | "intersection";
	onComplete?: () => void;
	onStart?: () => void;
}

// Enhanced TypeScript interface with GSAP support
export interface ContainerProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, "className">,
		VariantProps<typeof containerVariants> {
	/**
	 * Component to render as
	 * @default "div"
	 */
	as?: React.ElementType;

	/**
	 * Enable GSAP animations
	 * @default false
	 */
	animate?: boolean;

	/**
	 * GSAP animation configuration
	 */
	gsapConfig?: GSAPAnimationConfig;

	/**
	 * Additional CSS classes (Tailwind v4 compatible)
	 */
	className?: string;

	/**
	 * Child components
	 */
	children?: React.ReactNode;

	/**
	 * Enable CSS Container Queries (Tailwind v4 native support)
	 * @default false
	 */
	containerQuery?: boolean;

	/**
	 * Container query name for scoped queries
	 */
	containerName?: string;

	/**
	 * Enable CSS Subgrid (Tailwind v4 feature)
	 * @default false
	 */
	subgrid?: boolean;

	/**
	 * CSS Custom Properties for dynamic theming
	 */
	cssVars?: Record<string, string | number>;

	/**
	 * Modern layout mode (flexbox, grid, subgrid)
	 */
	layout?: "flex" | "grid" | "subgrid" | "auto";

	/**
	 * Responsive behavior configuration
	 */
	responsive?: {
		breakpoints?: string[];
		behavior?: "fluid" | "stepped" | "adaptive";
	};

	/**
	 * GSAP ScrollTrigger options
	 */
	scrollTrigger?: boolean;

	/**
	 * Animation trigger type
	 */
	animationTrigger?: "load" | "scroll" | "hover" | "intersection";
}

// Advanced Container Component with GSAP integration
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
	(
		{
			className,
			size,
			padding,
			spacing,
			variant,
			queries,
			as: Component = "div",
			animate = false,
			gsapConfig = {},
			containerQuery = false,
			containerName,
			subgrid = false,
			cssVars = {},
			layout = "auto",
			responsive,
			scrollTrigger = false,
			animationTrigger = "load",
			children,
			style,
			...props
		},
		ref
	) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const timelineRef = useRef<gsap.core.Timeline | null>(null);

		// Combine refs
		React.useImperativeHandle(ref, () => containerRef.current!);

		// Build dynamic CSS custom properties
		const customProperties = React.useMemo(() => {
			const vars: Record<string, string | number> = {};

			// Convert cssVars to CSS custom properties
			Object.entries(cssVars).forEach(([key, value]) => {
				vars[`--${key}`] = value;
			});

			return { ...vars, ...style };
		}, [cssVars, style]);

		// Build container classes with Tailwind v4 features
		const containerClasses = cn(
			containerVariants({ size, padding, spacing, variant, queries }),
			// Container queries
			containerQuery && "@container",
			containerName && `@container/${containerName}`,
			// Subgrid support
			subgrid && "grid grid-cols-subgrid grid-rows-subgrid",
			// Layout modes
			layout === "flex" && "flex",
			layout === "grid" && "grid",
			layout === "subgrid" && "grid grid-cols-subgrid",
			// Responsive behavior
			responsive?.behavior === "fluid" && "w-full min-w-0",
			responsive?.behavior === "stepped" && "transition-all duration-300",
			responsive?.behavior === "adaptive" && "container-adaptive",
			className
		);

		// GSAP Animation Setup
		useLayoutEffect(() => {
			if (!animate || !containerRef.current) return;

			const element = containerRef.current;
			const ctx = gsap.context(() => {
				// Create timeline if specified
				if (gsapConfig.timeline) {
					timelineRef.current = gsap.timeline({
						delay: gsapConfig.timeline.delay || 0,
						repeat: gsapConfig.timeline.repeat || 0,
						yoyo: gsapConfig.timeline.yoyo || false,
						onComplete: gsapConfig.onComplete,
						onStart: gsapConfig.onStart,
					});
				}

				// Handle different animation triggers
				switch (animationTrigger) {
					case "load":
						if (timelineRef.current) {
							if (gsapConfig.from) {
								timelineRef.current.fromTo(
									element,
									gsapConfig.from,
									gsapConfig.to || {}
								);
							} else {
								timelineRef.current.to(element, gsapConfig.to || {});
							}
						} else {
							if (gsapConfig.from) {
								gsap.fromTo(element, gsapConfig.from, gsapConfig.to || {});
							} else {
								gsap.to(element, gsapConfig.to || {});
							}
						}
						break;

					case "scroll":
						if (gsapConfig.scrollTrigger) {
							gsap.fromTo(element, gsapConfig.from || { opacity: 0, y: 50 }, {
								...gsapConfig.to,
								scrollTrigger: {
									trigger: element,
									start: "top 80%",
									end: "bottom 20%",
									toggleActions: "play none none reverse",
									...gsapConfig.scrollTrigger,
								},
							});
						}
						break;

					case "intersection":
						// Intersection Observer with GSAP
						const observer = new IntersectionObserver(
							(entries) => {
								entries.forEach((entry) => {
									if (entry.isIntersecting) {
										if (gsapConfig.from) {
											gsap.fromTo(
												element,
												gsapConfig.from,
												gsapConfig.to || {}
											);
										} else {
											gsap.to(element, gsapConfig.to || {});
										}
									}
								});
							},
							{ threshold: 0.1 }
						);
						observer.observe(element);

						return () => observer.disconnect();
				}

				// Handle staggered animations for children
				if (gsapConfig.timeline?.stagger) {
					const children = element.children;
					if (timelineRef.current) {
						timelineRef.current.fromTo(
							children,
							gsapConfig.from || { opacity: 0, y: 30 },
							{
								...gsapConfig.to,
								stagger: gsapConfig.timeline.stagger,
							}
						);
					}
				}
			}, element);

			return () => {
				ctx.revert();
				if (timelineRef.current) {
					timelineRef.current.kill();
				}
			};
		}, [animate, gsapConfig, animationTrigger]);

		// Handle hover animations
		useEffect(() => {
			if (animationTrigger === "hover" && containerRef.current) {
				const element = containerRef.current;

				const handleMouseEnter = () => {
					gsap.to(element, gsapConfig.to || { scale: 1.02, duration: 0.3 });
				};

				const handleMouseLeave = () => {
					gsap.to(element, { scale: 1, duration: 0.3 });
				};

				element.addEventListener("mouseenter", handleMouseEnter);
				element.addEventListener("mouseleave", handleMouseLeave);

				return () => {
					element.removeEventListener("mouseenter", handleMouseEnter);
					element.removeEventListener("mouseleave", handleMouseLeave);
				};
			}
		}, [animationTrigger, gsapConfig]);

		return (
			<Component
				ref={containerRef}
				className={containerClasses}
				style={customProperties}
				{...props}
			>
				{children}
			</Component>
		);
	}
);

Container.displayName = "Container";

// GSAP-specific container variants
export const AnimatedContainer = React.forwardRef<
	HTMLDivElement,
	ContainerProps
>((props, ref) => (
	<Container
		{...props}
		ref={ref}
		animate={true}
		gsapConfig={{
			from: { opacity: 0, y: 50 },
			to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
			...props.gsapConfig,
		}}
	/>
));
AnimatedContainer.displayName = "AnimatedContainer";

export const ScrollContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
	(props, ref) => (
		<Container
			{...props}
			ref={ref}
			animate={true}
			animationTrigger="scroll"
			gsapConfig={{
				from: { opacity: 0, y: 100 },
				to: { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
				scrollTrigger: {
					trigger: "self",
					start: "top 80%",
					end: "bottom 20%",
					toggleActions: "play none none reverse",
				},
				...props.gsapConfig,
			}}
		/>
	)
);
ScrollContainer.displayName = "ScrollContainer";

export const StaggerContainer = React.forwardRef<
	HTMLDivElement,
	ContainerProps
>((props, ref) => (
	<Container
		{...props}
		ref={ref}
		animate={true}
		gsapConfig={{
			from: { opacity: 0, y: 30 },
			to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
			timeline: {
				stagger: 0.1,
				delay: 0.2,
			},
			...props.gsapConfig,
		}}
	/>
));
StaggerContainer.displayName = "StaggerContainer";

export const HoverContainer = React.forwardRef<HTMLDivElement, ContainerProps>(
	(props, ref) => (
		<Container
			{...props}
			ref={ref}
			animate={true}
			animationTrigger="hover"
			gsapConfig={{
				to: { scale: 1.05, duration: 0.3, ease: "power2.out" },
				...props.gsapConfig,
			}}
			className={cn("cursor-pointer", props.className)}
		/>
	)
);
HoverContainer.displayName = "HoverContainer";

// GSAP utility hooks
export const useGSAPAnimation = (
	trigger: React.RefObject<HTMLElement>,
	config: GSAPAnimationConfig
) => {
	useLayoutEffect(() => {
		if (!trigger.current) return;

		const ctx = gsap.context(() => {
			if (config.from) {
				gsap.fromTo(trigger.current, config.from, config.to || {});
			} else {
				gsap.to(trigger.current, config.to || {});
			}
		}, trigger.current);

		return () => ctx.revert();
	}, [trigger, config]);
};

export const useGSAPTimeline = () => {
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	useLayoutEffect(() => {
		timelineRef.current = gsap.timeline();
		return () => {
			if (timelineRef.current) {
				timelineRef.current.kill();
			}
		};
	}, []);

	return timelineRef.current;
};

export const useScrollTrigger = (
	trigger: React.RefObject<HTMLElement>,
	config: ScrollTrigger.Vars
) => {
	useLayoutEffect(() => {
		if (!trigger.current) return;

		const scrollTrigger = ScrollTrigger.create({
			trigger: trigger.current,
			...config,
		});

		return () => scrollTrigger.kill();
	}, [trigger, config]);
};

// Export types and utilities
export type ContainerSize = NonNullable<ContainerProps["size"]>;
export type ContainerPadding = NonNullable<ContainerProps["padding"]>;
export type ContainerSpacing = NonNullable<ContainerProps["spacing"]>;
export type ContainerVariant = NonNullable<ContainerProps["variant"]>;
export type ContainerQueries = NonNullable<ContainerProps["queries"]>;

export { containerVariants };

// GSAP animation presets
export const gsapPresets = {
	fadeIn: {
		from: { opacity: 0 },
		to: { opacity: 1, duration: 0.6, ease: "power2.out" },
	},
	slideUp: {
		from: { opacity: 0, y: 50 },
		to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
	},
	slideDown: {
		from: { opacity: 0, y: -50 },
		to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
	},
	scaleIn: {
		from: { opacity: 0, scale: 0.8 },
		to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
	},
	staggerChildren: {
		from: { opacity: 0, y: 30 },
		to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
		timeline: { stagger: 0.1 },
	},
	parallax: {
		scrollTrigger: {
			start: "top bottom",
			end: "bottom top",
			scrub: 1,
		},
		to: { y: -100 },
	},
	morphing: {
		from: { borderRadius: "0%", rotation: 0 },
		to: {
			borderRadius: "50%",
			rotation: 360,
			duration: 2,
			ease: "elastic.out(1, 0.3)",
			repeat: -1,
			yoyo: true,
		},
	},
} as const;