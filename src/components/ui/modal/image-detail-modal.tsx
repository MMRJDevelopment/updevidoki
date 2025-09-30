"use client";

import { Modal, Image } from "antd";

interface ImageDetailModalProps {
	isOpen: boolean;
	onClose: () => void;
	imageUrl: string;
	imageIndex: number;
	totalImages: number;
}

export function ImageDetailModal({
	isOpen,
	onClose,
	imageUrl,
	imageIndex,
	totalImages,
}: ImageDetailModalProps) {
	return (
		<Modal
			open={isOpen}
			onCancel={onClose}
			footer={null}
			width={800}
			centered
			title={`Photo ${imageIndex + 1} of ${totalImages}`}
			className="image-detail-modal"
		>
			<div className="flex flex-col items-center">
				<Image
					src={imageUrl || "/placeholder.svg"}
					alt={`Photo ${imageIndex + 1}`}
					className="max-w-full max-h-120 object-contain"
					preview={false}
				/>
			</div>
		</Modal>
	);
}
