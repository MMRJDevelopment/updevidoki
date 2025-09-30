import { Container } from "@/components/ui-library/container";
import React from "react";

const AboutBanner = () => {
	return (
		<section className="bg-img ">
			<Container className=" flex flex-col items-center justify-center md:pt-20 pt-10 xl:pt-28 pb-14 sm:pb-40 xl:pb-[450px] sm:bg-transparent bg-white/20">
				<h2 className="text-[#0C0906] text-center font-Outfit sm:text-4xl text-3xl lg:text-[56px] font-medium leading-[120%]">
					How it Works
				</h2>
				<p className="text-[#100C08] text-center font-[Outfit] sm:text-lg text-sm lg:text-xl  font-normal lg:w-[554px] leading-[140%]">
					A simple 3-step process to create a digital memorial, personalize it
					with memories, and share it with loved ones.
				</p>
			</Container>
		</section>
	);
};

export default AboutBanner;
