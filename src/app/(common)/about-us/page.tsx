import AboutBanner from "@/components/pages/about/AboutBanner";
import { Container } from "@/components/ui-library/container";
import WorkCard from "@/components/ui/card/WorkCard";
import MemorialSlider from "@/components/ui/Slider/MemorialSlider";
import { ShoppingCart, Edit3, MapPin } from "lucide-react";

const page = () => {
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
		<div>
			<AboutBanner />
			<Container>
				<div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:py-12 py-8 lg:py-20 xl:py-30">
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
			</Container>
			<MemorialSlider />
		</div>
	);
};

export default page;
