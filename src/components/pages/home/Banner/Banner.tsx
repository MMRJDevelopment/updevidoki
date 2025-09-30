'use client'
import { useGSAPTimeline } from "@/components/ui-library/container";
import { useLayoutEffect, useRef } from "react";
import HeroVideo from "./HeroVideo";

const Banner = () => {
	const timeline = useGSAPTimeline();
	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		// Run once after mount
		if (timeline && containerRef.current) {
			timeline
				.from(".title", { opacity: 0, y: -50, duration: 0.8 })
				.from(".subtitle", { opacity: 0, x: -30, duration: 0.6 }, "-=0.4")
				.from(
					".content",
					{
						opacity: 0,
						scale: 0.8,
						stagger: 0.1,
						duration: 0.5,
						ease: "back.out(1.7)",
					},
					"-=0.3"
				)
				.to(".container", {
					backgroundColor: "#f3f4f6",
					duration: 0.5,
				});
		}
	}, [timeline]);

	return (
		<div>
			<HeroVideo />
		</div>
	);
};

export default Banner;