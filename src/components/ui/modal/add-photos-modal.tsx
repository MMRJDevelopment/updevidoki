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
import { useUpdateMemorialMutation } from "@/redux/features/userDashbord/userDashbordApi";

const { Title, Text } = Typography;
const { Dragger } = Upload;

interface AddPhotosModalProps {
  isOpen: boolean;
  id?: string;
  onClose: () => void;
}

export function AddPhotosModal({ isOpen, onClose, id }: AddPhotosModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [updateMemorial] = useUpdateMemorialMutation();

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

    const formData = new FormData();

    // ✅ use originFileObj for real File
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("photos", file.originFileObj);
        console.log("Added file:", file.originFileObj.name);
      }
    });

    try {
      await updateMemorial({ id, formData }).unwrap();
      message.success(`Successfully added ${fileList.length} photos`);
      setFileList([]);
      onClose();
    } catch (error: any) {
      console.error("Upload error:", error);
      message.error("Failed to upload photos, please try again.");
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
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleUpload}
            disabled={fileList.length === 0}
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
