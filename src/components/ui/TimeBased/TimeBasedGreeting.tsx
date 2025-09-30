"use client";

import { useEffect, useState } from "react";

export default function TimeBasedGreeting() {
	const [greeting, setGreeting] = useState("");
	const userName = "David"; // dynamically from props or auth

	useEffect(() => {
		const updateGreeting = () => {
			const hours = new Date().getHours();
			if (hours < 12) {
				setGreeting("Good Morning");
			} else if (hours < 18) {
				setGreeting("Good Afternoon");
			} else {
				setGreeting("Good Evening");
			}
		};

		updateGreeting();
		const interval = setInterval(updateGreeting, 60 * 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<h1 className="text-[#100C08] font-Outfit text-lg font-medium leading-[120%]">
				Hello {userName} 👋
			</h1>
			<p className="text-[#494949] font-Outfit text-base font-normal leading-[140%]">
				{greeting}
			</p>
		</div>
	);
}
