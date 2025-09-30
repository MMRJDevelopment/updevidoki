"use client";

import { useState } from "react";
import { Modal, Upload, Button, Space, Typography, message } from "antd";
import {
	VideoCameraOutlined,
	UploadOutlined,
	PlusOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface AddVideoModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function AddVideoModal({ isOpen, onClose }: AddVideoModalProps) {
	const [fileList, setFileList] = useState<UploadFile[]>([]);

	const uploadProps: UploadProps = {
		name: "videos",
		multiple: true,
		accept: "video/*",
		fileList,
		beforeUpload: () => false, // Prevent auto upload
		onChange: ({ fileList: newFileList }) => {
			setFileList(newFileList);
		},
		onDrop: (e) => {
			console.log("Dropped files", e.dataTransfer.files);
		},
	};

	const handleUpload = () => {
		if (fileList.length === 0) {
			message.warning("Please select at least one video");
			return;
		}

		console.log("Uploading videos:", fileList);
		message.success(`Successfully added ${fileList.length} videos`);
		setFileList([]);
		onClose();
	};

	const handleCancel = () => {
		setFileList([]);
		onClose();
	};

	return (
		<Modal
			title={
				<span>
					<VideoCameraOutlined className="mr-2" />
					Add Videos
				</span>
			}
			open={isOpen}
			onCancel={handleCancel}
			width={600}
			footer={
				<Space>
					<Button onClick={handleCancel}>Cancel</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						onClick={handleUpload}
						disabled={fileList.length === 0}
					>
						Add Videos ({fileList.length})
					</Button>
				</Space>
			}
		>
			<div className="space-y-4">
				<Dragger {...uploadProps} className="border-2 border-dashed">
					<div className="p-8 text-center">
						<VideoCameraOutlined className="text-4xl text-gray-400 mb-4" />
						<Title level={4} className="mb-2">
							Upload Videos
						</Title>
						<Text type="secondary" className="block mb-4">
							Choose videos from your device or drag and drop them here
						</Text>
						<Button icon={<UploadOutlined />} type="primary">
							Choose Videos
						</Button>
					</div>
				</Dragger>

				{fileList.length > 0 && (
					<div>
						<Text strong>Selected Videos ({fileList.length})</Text>
						<div className="grid grid-cols-2 gap-4 mt-2">
							{fileList.map((file, index) => (
								<div
									key={file.uid}
									className="relative group border rounded-lg p-2"
								>
									<div className="flex items-center space-x-2">
										<VideoCameraOutlined className="text-blue-500" />
										<div className="flex-1 min-w-0">
											<Text ellipsis className="text-sm">
												{file.name}
											</Text>
											<div className="text-xs text-gray-500">
												{file.size
													? `${(file.size / 1024 / 1024).toFixed(1)} MB`
													: "Unknown size"}
											</div>
										</div>
										<Button
											type="text"
											size="small"
											danger
											onClick={() => {
												const newFileList = fileList.filter(
													(_, i) => i !== index
												);
												setFileList(newFileList);
											}}
										>
											×
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		</Modal>
	);
}
