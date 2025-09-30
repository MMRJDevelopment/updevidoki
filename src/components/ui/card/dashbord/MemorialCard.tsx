"use client";

import { Calendar, MapPin, MessageCircle, Heart } from "lucide-react";
import { Card, CardContent } from "../Card";
import { Badge } from "../../badge";

export interface Memorial {
	id: number;
	name: string;
	birthDate: string;
	passedDate: string;
	location: string;
	description: string;
	image?: string;
	memories: Memory[];
	createdAt: string;
}

export interface Memory {
	id: number;
	author: string;
	content: string;
	date: string;
	type: "message" | "photo" | "story";
}

interface MemorialCardProps {
	memorial: Memorial;
	onClick?: (memorial: Memorial) => void;
}

export function MemorialCard({ memorial, onClick }: MemorialCardProps) {
	return (
		<Card
			className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md bg-white dark:bg-gray-800"
			onClick={() => onClick?.(memorial)}
		>
			<CardContent className="p-6">
				<div className="flex items-start space-x-4">
					{/* <Avatar className="w-16 h-16 border-2 border-rose-200 dark:border-rose-800">
            <AvatarImage src={memorial.image} />
            <AvatarFallback className="bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20 text-rose-600 dark:text-rose-400 text-lg font-semibold">
              {memorial.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar> */}
					<div className="flex-1 min-w-0">
						<h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
							{memorial.name}
						</h3>
						<div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
							{memorial.birthDate && (
								<div className="flex items-center space-x-1">
									<Calendar className="w-4 h-4" />
									<span>
										{new Date(memorial.birthDate).getFullYear()} -{" "}
										{memorial.passedDate
											? new Date(memorial.passedDate).getFullYear()
											: "Present"}
									</span>
								</div>
							)}
							{memorial.location && (
								<div className="flex items-center space-x-1">
									<MapPin className="w-4 h-4" />
									<span>{memorial.location}</span>
								</div>
							)}
						</div>
						{memorial.description && (
							<p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed line-clamp-2">
								{memorial.description}
							</p>
						)}
						<div className="flex items-center justify-between mt-4">
							<div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
								<div className="flex items-center space-x-1">
									<MessageCircle className="w-4 h-4" />
									<span>{memorial.memories.length} memories</span>
								</div>
								<div className="flex items-center space-x-1">
									<Heart className="w-4 h-4" />
									<span>0 tributes</span>
								</div>
							</div>
							<Badge variant="secondary" className="text-xs">
								Created {new Date(memorial.createdAt).toLocaleDateString()}
							</Badge>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
