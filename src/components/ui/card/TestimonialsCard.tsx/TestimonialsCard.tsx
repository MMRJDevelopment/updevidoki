import Image from "next/image";
import { cn } from "@/lib/utils";
import { StarRating } from "../../star-rating";

type TestimonialCardProps = {
	name?: string;
	avatarSrc?: string;
	avatarAlt?: string;
	timeAgo?: string;
	content?: string;
	rating?: number;
	className?: string;
};

export function TestimonialCard({
	name = "Harley Quin",
	avatarSrc = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
	avatarAlt = "Reviewer avatar",
	timeAgo = "2 months ago",
	content = "It brought tears to my eyes seeing his life captured so beautifully. Now, anyone in our family, no matter where they are in the world, can simply scan the code and revisit his memory, his story, and everything he meant to us.",
	rating = 5.5,
	className,
}: TestimonialCardProps) {
	return (
		<article
			className={cn(
				"rounded-3xl border bg-background p-6 md:p-8",
				// Subtle bluish border to match the reference
				"border-blue-200",
				// Gentle radius and spacing
				"shadow-sm",
				className
			)}
		>
			<header className="flex items-center gap-4 mb-2 sm:mb-4">
				<div className="relative h-14 w-14  overflow-hidden rounded-full ring-1 ring-border">
					<Image
						src={avatarSrc}
						alt={avatarAlt}
						width={56}
						height={56}
						className="h-full w-full object-cover"
					/>
				</div>
				<div className="min-w-0">
					<h3 className="text-[#100C08] font-Outfit text-lg sm:text-xl lg:text-[28px] font-medium leading-[120%]">
						{name}
					</h3>
					<p className="mt-2 text-[#494949] font-Outfit text-sm md:text-lg: lg:text-xl font-normal leading-[140%]">
						{timeAgo}
					</p>
				</div>
			</header>

			<p className="text-[#494949] font-Outfit text-sm lg:text-base font-normal leading-[140%]">
				{content}
			</p>

			<div className="sm:mt-6 mt-3">
				<StarRating value={rating} />
			</div>
		</article>
	);
}
