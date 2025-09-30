"use client";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import logo from "@/assets/images/logo/logo.png";

export interface LogoProps {
	// Sizing
	width?: number;
	height?: number;
	sizes?: string;

	// Behavior
	href?: string | null;
	priority?: boolean;
	unoptimized?: boolean;
	decoding?: ImageProps["decoding"];

	// Sources (light/dark variants)
	src?: ImageProps["src"];
	darkSrc?: ImageProps["src"];

	// Accessibility
	alt?: string;
	label?: string;

	// Styling
	className?: string;
	imgClassName?: string;
	linkClassName?: string;

	// Fallback brand text if image fails
	fallbackText?: string;

	// Slot support
	asChild?: boolean;
}

export default function Logo({
	width = 183,
	height = 57,
	sizes = "(max-width: 768px) 140px, (max-width: 1024px) 164px, 183px",
	href = "/",
	priority = true,
	unoptimized = false,
	decoding = "async",
	src = logo,
	darkSrc = "/assets/images/logo/logo-dark.png",
	alt = "Sellapy logo",
	label = "Sellapy",
	className = "",
	imgClassName = "object-contain",
	linkClassName = "",
	fallbackText = "Sellapy",
	asChild = false,
}: LogoProps) {
	const [failed, setFailed] = useState(false);

	const content = failed ? (
		<span
			className={cn(
				"inline-flex select-none items-center justify-center rounded-md border px-2.5 py-1.5 text-sm font-semibold",
				"bg-background text-foreground",
				"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
				className
			)}
			aria-label={label}
		>
			{fallbackText}
		</span>
	) : (
		<>
			<span className="sr-only">{label}</span>
			<span
				className={cn(
					"relative flex items-center justify-center",
					"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					className
				)}
			>
				{/* Light theme logo */}
				<Image
					src={src || "/placeholder.svg"}
					alt={alt}
					width={width}
					height={height}
					sizes={sizes}
					priority={priority}
					unoptimized={unoptimized}
					decoding={decoding}
					className={cn("block dark:hidden", imgClassName)}
					onError={() => {
						if (!darkSrc || darkSrc === src) setFailed(true);
					}}
				/>
				{/* Dark theme logo */}
				<Image
					src={darkSrc ?? src}
					alt={alt}
					width={width}
					height={height}
					sizes={sizes}
					priority={priority}
					unoptimized={unoptimized}
					decoding={decoding}
					className={cn("hidden dark:block", imgClassName)}
					onError={() => {
						if (!src || src === darkSrc) setFailed(true);
					}}
				/>
			</span>
		</>
	);

	// Wrapper: asChild -> Slot (no link), href -> Link, else div
	if (asChild) {
		return (
			<Slot
				className={cn("inline-flex items-center", linkClassName)}
				aria-label={label}
			>
				{content}
			</Slot>
		);
	}

	if (href) {
		return (
			<Link
				href={href}
				className={cn(
					"inline-flex items-center focus-visible:outline-none",
					linkClassName
				)}
				aria-label={label}
			>
				{content}
			</Link>
		);
	}

	return (
		<div
			className={cn("inline-flex items-center", linkClassName)}
			aria-label={label}
		>
			{content}
		</div>
	);
}
