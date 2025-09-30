/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Upload,
  Button,
  Space,
  Typography,
  message,
  Progress,
} from "antd";
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
  id?: string;
  onClose: () => void;
}

export function AddVideoModal({ isOpen, onClose, id }: AddVideoModalProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState<string>("");

  // Get token safely on mount
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token") || "";
    setToken(accessToken);
  }, []);

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

  const uploadVideosWithProgress = (
    memorialId: string,
    videoFiles: File[]
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();

      // Append all video files to FormData with key "videos"
      videoFiles.forEach((file) => {
        formData.append("videos", file);
        console.log("Adding video to FormData:", file.name, file.size);
      });

      // Log FormData contents for debugging
      console.log("FormData prepared with", videoFiles.length, "video(s)");
      console.log(
        "Uploading to:",
        `${process.env.NEXT_PUBLIC_BASE_URL}/memories/update/${memorialId}`
      );

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          console.log(
            `Upload progress: ${progress}% (${event.loaded}/${event.total} bytes)`
          );
          setUploadProgress(progress);
        }
      });

      // Handle completion
      xhr.addEventListener("load", () => {
        console.log("Upload completed with status:", xhr.status);
        console.log("Response:", xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            console.log("Upload successful:", data);
            resolve(data);
          } catch {
            console.log("Upload successful (no JSON response)");
            resolve({ success: true });
          }
        } else {
          try {
            const errorData = JSON.parse(xhr.responseText);
            console.error("Upload failed:", errorData);
            reject(new Error(errorData.message || "Upload failed"));
          } catch {
            console.error("Upload failed with status:", xhr.status);
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      // Handle errors
      xhr.addEventListener("error", () => {
        console.error("Network error during upload");
        reject(new Error("Network error occurred"));
      });

      xhr.addEventListener("abort", () => {
        console.warn("Upload cancelled");
        reject(new Error("Upload cancelled"));
      });

      // Open and send request
      const uploadUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/memories/update/${memorialId}`;
      xhr.open("PATCH", uploadUrl);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      console.log("Sending PATCH request to:", uploadUrl);
      console.log("Authorization header set with token");

      // Send FormData - browser automatically sets Content-Type with boundary
      xhr.send(formData);
    });
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning("Please select at least one video");
      return;
    }

    if (!id) {
      message.error("Memorial ID is missing");
      return;
    }

    if (!token) {
      message.error("Authentication token is missing. Please log in again.");
      return;
    }

    // Extract actual File objects from fileList
    const videoFiles = fileList
      .map((file) => file.originFileObj)
      .filter(Boolean) as File[];

    if (videoFiles.length === 0) {
      message.error("No valid video files found");
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);

    try {
      await uploadVideosWithProgress(id, videoFiles);

      message.success(
        `Successfully added ${fileList.length} video${
          fileList.length > 1 ? "s" : ""
        }`
      );
      setFileList([]);
      setUploadProgress(0);
      onClose();
    } catch (error: any) {
      console.error("Upload error:", error);
      message.error(
        error?.message || "Failed to upload videos, please try again."
      );
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCancel = () => {
    if (isLoading) {
      message.warning("Upload in progress, please wait...");
      return;
    }
    setFileList([]);
    setUploadProgress(0);
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
      closable={!isLoading}
      maskClosable={!isLoading}
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
            Add Videos ({fileList.length})
          </Button>
        </Space>
      }
    >
      <div className="space-y-4">
        {/* Upload Progress */}
        {isLoading && (
          <div className="mb-4">
            <Progress
              percent={uploadProgress}
              status={uploadProgress === 100 ? "success" : "active"}
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
            <Text type="secondary" className="text-sm">
              Uploading videos... {uploadProgress}%
            </Text>
          </div>
        )}

        {/* Drag and Drop Area */}
        <Dragger
          {...uploadProps}
          className="border-2 border-dashed"
          disabled={isLoading}
        >
          <div className="p-8 text-center">
            <VideoCameraOutlined className="text-4xl text-gray-400 mb-4" />
            <Title level={4} className="mb-2">
              Upload Videos
            </Title>
            <Text type="secondary" className="block mb-4">
              Choose videos from your device or drag and drop them here
            </Text>
            <Button
              icon={<UploadOutlined />}
              type="primary"
              disabled={isLoading}
            >
              Choose Videos
            </Button>
          </div>
        </Dragger>

        {/* Selected Videos List */}
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
                      disabled={isLoading}
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
