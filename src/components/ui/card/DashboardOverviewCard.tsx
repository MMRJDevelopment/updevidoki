import type { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

interface StatsCardProps {
	icon: LucideIcon | IconType;

	count: number;
	title: string;
	iconColor?: string;
}

export function DashboardOverviewCard({
	icon: Icon,
	count,
	title,
	iconColor = "text-[#2563EB]",
}: StatsCardProps) {
	return (
		<div className="rounded-lg bg-white shadow-[0_1px_50px_rgba(0,0,0,0.07)] flex w-full p-[24px_16px] flex-col items-start gap-[13px]">
			<div>
				<div className="flex items-center gap-2 mb-2">
					<Icon className={`h-5 w-5 ${iconColor}`} />
					<span className="text-[#2563EB] font-Outfit text-lg sm:text-xl sm:text-2xl font-medium leading-[120%]">
						{count}
					</span>
				</div>
				<p className="text-[#100C08] font-Outfit text-sm lg:text-base font-normal leading-[140%]">
					{title}
				</p>
			</div>
		</div>
	);
}
