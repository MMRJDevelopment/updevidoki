import { Container } from "@/components/ui-library/container";
import Image from "next/image";
import tribute from "@/assets/images/home/Tribute.png";
import { CuretIcon } from "@/assets/svg";

const Tribute = () => {
	return (
		<div className="lg:py-32 sm:py-20 py-10 ">
			<Container>
				<div>
					<h2 className="text-[#100C08]  font-Outfit sm:text-4xl text-3xl lg:text-[56px] font-medium leading-[120%]">
						Ready to Create a Timeless Tribute?
					</h2>
					<p className="text-[#100C08] font-Outfit lg:mt-6 mt-3 sm:text-lg text-sm lg:text-xl font-normal leading-[140%] xl:w-[611px]">
						Ready to Create a Timeless Tribute?&quot; invites you to begin
						honoring your loved one through a lasting, heartfelt digital
						memorial.
					</p>
					<div className="w-full flex flex-col md:flex-row  mt-6 sm:mt-10 lg:mt-20">
						<div className="lg:w-3/5 md:w-1/2 w-full">
							<Image
								src={tribute}
								alt="Tribute Example"
								className="object-cover w-full h-auto"
							/>
						</div>
						<div className="lg:w-2/5 md:w-1/2 w-full  flex justify-start sm:justify-end items-center">
							<ul className="text-[#100C08] text-center font-Outfit sm:text-lg text-base lg:text-xl font-normal leading-[140%] sm:mt-0 mt-4  space-y-2 sm:space-y-4">
								<li className="flex items-center gap-2">
									<CuretIcon />
									<p>Custom QR code</p>
								</li>
								<li className="flex items-center gap-2">
									<CuretIcon />
									<p>Secure private editing access</p>
								</li>
								<li className="flex items-center gap-2">
									<CuretIcon />
									<p>Lifetime Access to Memorial Page</p>
								</li>
								<li className="flex items-center gap-2">
									<CuretIcon />
									<p>Real-Time Tribute Updates</p>
								</li>
								<li className="flex items-center gap-2">
									<CuretIcon />
									<p>Customizable Design for Plaque</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</Container>
		</div>
	);
};

export default Tribute;
