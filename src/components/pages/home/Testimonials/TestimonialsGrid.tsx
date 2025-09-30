"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/buttons/Button";
import { TestimonialCard } from "@/components/ui/card/TestimonialsCard.tsx/TestimonialsCard";
import { Testimonial } from "@/types/testimonial";

type TestimonialsGridProps = {
	items?: Testimonial[];
	initialVisible?: number;
	className?: string;
	onToggle?: (showAll: boolean) => void;
};

export function TestimonialsGrid({
	items = [],
	initialVisible = 6,
	className,
	onToggle,
}: TestimonialsGridProps) {
	const [showAll, setShowAll] = useState(false);

	const visibleItems = useMemo(() => {
		if (showAll) return items;
		return items.slice(0, initialVisible);
	}, [items, initialVisible, showAll]);

	const hasMore = items.length > initialVisible;

	function handleToggle() {
		const next = !showAll;
		setShowAll(next);
		onToggle?.(next);
	}

	return (
		<section className={cn("w-full lg:mt-16 sm:mt-8 mt-4", className)}>
			<div
				className={cn(
					"grid gap-4 sm:gap-6",
					"grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
				)}
			>
				{visibleItems.map((t) => (
					<TestimonialCard
						key={t.id}
						name={t.name}
						avatarSrc={t.avatar}
						timeAgo={t.timeAgo}
						content={t.content}
						rating={t.rating}
						className="border-blue-200"
					/>
				))}
			</div>

			{hasMore && (
				<div className="mt-6 flex justify-center">
					<Button
						onClick={handleToggle}
						className="rounded-full bg-[#2563EB] px-6 hover:bg-indigo-600/90 text-white font-Outfit text-sm sm:text-base font-normal leading-[140%]"
					>
						{showAll ? "Show Less" : "See All"}
					</Button>
				</div>
			)}
		</section>
	);
}
