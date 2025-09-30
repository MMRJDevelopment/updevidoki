"use client";

import { Modal } from "antd";
import { PlayCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

interface VideoDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	videoUrl?: string;
	videoThumbnail: string;
	videoDuration: string;
	videoIndex: number;
	totalVideos: number;
}

export function VideoDetailModal({
	isOpen,
	onClose,
	videoUrl,
	videoThumbnail,
	videoDuration,
	videoIndex,
	totalVideos,
}: VideoDetailModalProps) {
	return (
		<Modal
			open={isOpen}
			onCancel={onClose}
			footer={null}
			width={800}
			centered
			title={`Video ${videoIndex + 1} of ${totalVideos}`}
			className="video-detail-modal"
		>
			<div className="flex flex-col items-center">
				{videoUrl ? (
					<video
						src={videoUrl}
						controls
						className="max-w-full max-h-96 rounded-lg"
						poster={videoThumbnail}
					>
						Your browser does not support the video tag.
					</video>
				) : (
					<div className="relative">
						<Image
							src={videoThumbnail || "/placeholder.svg"}
							alt={`Video ${videoIndex + 1}`}
							className="max-w-full max-h-96 object-contain rounded-lg"
						/>
						<div className="absolute inset-0 flex items-center justify-center">
							<PlayCircleOutlined className="text-6xl text-white/90" />
						</div>
						<div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-2 py-1 rounded">
							{videoDuration}
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
}
