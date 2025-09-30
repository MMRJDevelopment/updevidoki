import { Container } from "@/components/ui-library/container";
import logo from "@/assets/images/logo/whiteLogo.png";
import Image from "next/image";
import { FacebookIcon, GoogleIcon } from "@/assets/svg";

const Footer = () => {
	return (
		<footer className="bg-[#2563EB]">
			<Container>
				<div className="flex items-start justify-between xl:gap-[230px] flex-col sm:flex-row gap-8 sm:pt-12 pt-8 lg:pt-24">
					<div className="flex flex-col gap-6 lg:w-[436px] sm:w-80 w-full">
						<Image src={logo} alt="logo" />
						<p className="text-white font-Outfit text-sm sm:text-base font-normal  leading-[140%]">
							Preserving memories with dignity — our digital memorials offer a
							timeless way to honor and remember your loved ones
						</p>
						<div className="flex items-center gap-4 mt-4">
							<FacebookIcon />
							<GoogleIcon />
						</div>
					</div>
					<div>
						<h6 className="text-white font-Outfit sm:text-xl text-lg lg:text-[28px] font-medium leading-[120%]">
							Quick Links
						</h6>
						<ul className="text-white font-Outfit text-sm sm:text-base font-normal leading-[140%] space-y-2 mt-4">
							<li> Home</li>
							<li>How it works</li>
							<li>Contact</li>
							<li>Privacy policy</li>
						</ul>
					</div>
					<div>
						<h6 className="text-white font-Outfit sm:text-xl text-lg lg:text-[28px] font-medium leading-[120%]">
							Contact Us
						</h6>
						<ul className="text-white font-Outfit text-sm sm:text-base font-normal leading-[140%] space-y-2 mt-4">
							<li> +4568987654</li>
							<li>david@gmail.com</li>
						</ul>
					</div>
				</div>
				<div className="border-t border-white/70 mt-8 py-6">
					<p className="text-white font-Outfit text-sm sm:text-base font-normal leading-[140%]">
						Copyright © 2025 Memory Square. All Rights Reserved.
					</p>
				</div>
			</Container>
		</footer>
	);
};

export default Footer;
