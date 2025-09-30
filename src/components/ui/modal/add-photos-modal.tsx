/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Modal, Upload, Button, Space, Typography, message } from "antd";
import {
  CameraOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface AddPhotosModalProps {
  isOpen: boolean;
  id?: string;
  onClose: () => void;
}

export function AddPhotosModal({ isOpen, onClose, id }: AddPhotosModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("access_token") || "";

  const uploadProps: UploadProps = {
    name: "photos",
    multiple: true,
    accept: "image/*",
    fileList,
    beforeUpload: () => false, // Prevent auto upload
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please select at least one photo");
      return;
    }

    if (!id) {
      message.error("Memorial ID is missing");
      return;
    }

    const formData = new FormData();

    // Append each file to FormData
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("photos", file.originFileObj);
      }
    });

    try {
      // await updateMemorial({ id, body: formData }).unwrap();
      // message.success(
      //   `Successfully added ${fileList.length} photo${
      //     fileList.length > 1 ? "s" : ""
      //   }`
      // );
      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/memories/update/${id}`,
        {
          method: "PATCH",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        message.error(
          errorData.message || "Failed to update profile. Please try again."
        );
        return;
      }
      setFileList([]);
      onClose();
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error?.data?.message || "Failed to upload photos, please try again.";
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={
        <span>
          <CameraOutlined className="mr-2" />
          Add Photos
        </span>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={600}
      footer={
        <Space>
          <Button onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleUpload}
            disabled={fileList.length === 0 || isLoading}
            loading={isLoading}
          >
            Add Photos ({fileList.length})
          </Button>
        </Space>
      }
    >
      <div className="space-y-4">
        <Dragger {...uploadProps} className="border-2 border-dashed">
          <div className="p-8 text-center">
            <CameraOutlined className="text-4xl text-gray-400 mb-4" />
            <Title level={4} className="mb-2">
              Upload Photos
            </Title>
            <Text type="secondary" className="block mb-4">
              Choose photos from your device or drag and drop them here
            </Text>
            <Button icon={<UploadOutlined />} type="primary">
              Choose Files
            </Button>
          </div>
        </Dragger>

        {fileList.length > 0 && (
          <div>
            <Text strong>Selected Photos ({fileList.length})</Text>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList: newFileList }) => setFileList(newFileList)}
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
              className="mt-2"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
