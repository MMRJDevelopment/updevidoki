import Image from "next/image";
import love from "@/assets/images/home/Love.png";
import { Container } from "@/components/ui-library/container";

const Love = () => {
	return (
		<section className="lg:py-32 sm:py-20 py-10 bg-[#F5F7FB]">
			<Container>
				<div className="flex flex-col sm:gap-6 gap-4 lg:gap-11  md:flex-row items-center justify-between">
					<div className="md:w-1/2 w-full">
						<h2 className="text-[#100C08] font-Outfit sm:text4xl text-3xl lg:text-[56px] font-medium leading-[120%] xl:w-[504px]">
							Remembering With Love
						</h2>
						<p className="text-[#100C08] font-Outfit lg:text-xl sm:text-lg text-base mt-4 sm:mt-6 font-normal leading-[140%] xl:w-[504px]">
							This section allows visitors to preview a real example of a
							memorial page, showing how a memory can be preserved and accessed
							through a QR code
						</p>
					</div>
					<div className="md:w-1/2 w-full">
						<Image src={love} alt="Memorial Example" />
					</div>
				</div>
			</Container>
		</section>
	);
};

export default Love;
