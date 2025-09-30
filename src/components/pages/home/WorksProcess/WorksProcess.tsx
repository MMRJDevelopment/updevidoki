import { Container } from "@/components/ui-library/container";
import WorkCard from "@/components/ui/card/WorkCard";
import { ShoppingCart, Edit3, MapPin } from "lucide-react";

const WorksProcess = () => {
	const cards = [
		{
			id: "purchase",
			title: "Purchase your Memory Square",
			description: "You'll receive a unique QR plaque by mail.",
			Icon: ShoppingCart,
			iconColor: "text-blue-600",
			iconBg: "bg-blue-50",
		},
		{
			id: "personalize",
			title: "Personalize your memorial",
			description: "Add photos, stories, and a tribute page.",
			Icon: Edit3,
			iconColor: "text-purple-600",
			iconBg: "bg-purple-50",
		},
		{
			id: "place",
			title: "Place the plaque",
			description: "Attach the QR plaque to a meaningful location.",
			Icon: MapPin,
			iconColor: "text-emerald-600",
			iconBg: "bg-emerald-50",
		},
	];
	return (
		<Container>
			<div className="flex flex-col items-center justify-center sm:pt-20 pt-10 lg:pt-[140px] sm:pb-16 pb-8 lg:pb-[120px] bg-white">
				<h2 className="text-[#0C0906] text-center font-outfit sm:text-4xl text-3xl lg:text-[56px] font-medium leading-[120%]">
					How it Works
				</h2>
				<p className="text-[#494949] text-center font-outfit text-sm sm:text-base  lg:text-[20px] font-normal leading-[140%] md:w-[554px] mt-2 sm:mt-4">
					A simple 3-step process to create a digital memorial, personalize it
					with memories, and share it with loved ones.
				</p>
				<div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:mt-8 mt-4 lg:mt-12">
					{cards.map(({ id, title, description, Icon, iconColor, iconBg }) => (
						<WorkCard
							key={id}
							title={title}
							description={description}
							Icon={Icon}
							iconColor={iconColor}
							iconBg={iconBg}
						/>
					))}
				</div>
			</div>
		</Container>
	);
};

export default WorksProcess;
