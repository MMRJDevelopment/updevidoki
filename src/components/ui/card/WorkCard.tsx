import { type LucideIcon, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./Card";

export type WorkCardProps = {
	title?: string;
	description?: string;
	Icon?: LucideIcon;
	iconColor?: string;
	iconBg?: string;
};

export function WorkCard({
	title = "Purchase your Memory Square",
	description = "You'll receive a unique QR plaque by mail.",
	Icon = ShoppingCart,
	iconColor = "text-blue-600",
	iconBg = "bg-blue-50",
}: WorkCardProps) {
	return (
		<Card className="relative w-full max-w-sm rounded-2xl border-0 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
			<CardContent className="py-7 px-4 ">
				<div
					className={cn(
						"mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full",
						iconBg
					)}
					aria-hidden="true"
				>
					<Icon className={cn("h-6 w-6", iconColor)} />
				</div>

				<h3 className="text-[#100C08] text-center font-Outfit text-[28px] font-medium leading-[120%] mt-6">
					{title}
				</h3>

				<p className="text-[#494949] text-center font-[Outfit] text-[16px] font-normal leading-[140%] mt-2">
					{description}
				</p>
			</CardContent>
		</Card>
	);
}

export default WorkCard;
