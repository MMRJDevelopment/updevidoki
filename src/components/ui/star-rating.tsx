"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type StarRatingProps = {
	value?: number; // e.g. 4.5 or 5.5 (we'll cap the stars at 5 for display)
	max?: number;
	className?: string;
};

export function StarRating({ value = 5, max = 5, className }: StarRatingProps) {
	const filled = Math.max(0, Math.min(max, Math.floor(value)));
	const stars = Array.from({ length: max });

	return (
		<div
			className={cn("flex items-center gap-2", className)}
			aria-label={`Rating: ${value} out of ${max}`}
		>
			<div className="flex items-center gap-1" aria-hidden="true">
				{stars.map((_, i) => {
					const isFilled = i < filled;
					return (
						<Star
							key={i}
							className={cn(
								"h-5 w-5",
								isFilled
									? "fill-yellow-400 stroke-yellow-400"
									: "fill-transparent stroke-muted-foreground/40"
							)}
						/>
					);
				})}
			</div>
			<span className="text-[#494949] font-Outfit text-sm sm:text-base font-normal leading-[140%]">
				{value.toFixed(1)}
			</span>
		</div>
	);
}
