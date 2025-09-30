import { Testimonial } from "@/types/testimonial";

const baseContent =
	"It brought tears to my eyes seeing his life captured so beautifully. Now, anyone in our family, no matter where they are in the world, can simply scan the code and revisit his memory, his story, and everything he meant to us.";

export const testimonials: Testimonial[] = Array.from({ length: 12 }).map(
	(_, i) => ({
		id: `t-${i + 1}`,
		name: "Harley Quin",
		avatar: `/placeholder.svg?height=56&width=56&query=portrait%20avatar%20man%20${
			i + 1
		}`,
		timeAgo: "2 months ago",
		content: baseContent,
		rating: 5.5,
	})
);
