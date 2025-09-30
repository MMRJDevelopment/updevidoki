/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Tabs,
  QRCode,
  Space,
  Typography,
  DatePicker,
  Select,
  Upload,
} from "antd";
import {
  UserOutlined,
  QrcodeOutlined,
  SaveOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useUpdateMemorialMutation } from "@/redux/features/userDashbord/userDashbordApi";
import moment from "moment";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface EditProfileModalProps {
  isOpen: boolean;
  id?: string;
  onClose: () => void;
}

export function EditProfileModal({
  isOpen,
  id,
  onClose,
}: EditProfileModalProps) {
  const [updateMemorial] = useUpdateMemorialMutation();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("profile");

  const initialValues = {
    fullName: "Sadik Ahmmed",
    dateOfBirth: moment("1995-06-20T00:00:00.000Z"),
    dateOfDeath: moment("2025-05-01T00:00:00.000Z"),
    bio: "A loving memory of a wonderful person.",
    country: "Bangladesh",
    city: "Dhaka",
    relation: "Friend",
    privacy: "PUBLIC",
    deletedPhotos: [
      "https://nyc3.digitaloceanspaces.com/smtech-space/uploads/1758023576497-q1kbq68r42.png",
      "https://nyc3.digitaloceanspaces.com/smtech-space/uploads/1758023577444-t5lkkmdjlw.webp",
    ],
    deletedVideos: [
      "https://nyc3.digitaloceanspaces.com/smtech-space/uploads/1758023597385-s01x1qq53y.mp4",
    ],
    profilePhoto: null,
    coverPhoto: null,
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e[0];
    }
    return e?.file;
  };

  const handleSave = async (values: any) => {
    const formData = new FormData();

    // Append fields to FormData only if they have valid values
    if (values.fullName) formData.append("fullName", values.fullName);
    if (values.dateOfBirth)
      formData.append("dateOfBirth", values.dateOfBirth.toISOString());
    if (values.dateOfDeath)
      formData.append("dateOfDeath", values.dateOfDeath.toISOString());
    if (values.bio) formData.append("bio", values.bio);
    if (values.country) formData.append("country", values.country);
    if (values.city) formData.append("city", values.city);
    if (values.relation) formData.append("relation", values.relation);
    if (values.privacy) formData.append("privacy", values.privacy);
    if (values.profilePhoto)
      formData.append("profilePhoto", values.profilePhoto.originFileObj);
    if (values.coverPhoto)
      formData.append("coverPhoto", values.coverPhoto.originFileObj);
    if (values.deletedPhotos && Array.isArray(values.deletedPhotos)) {
      formData.append("deletedPhotos", JSON.stringify(values.deletedPhotos));
    }
    if (values.deletedVideos && Array.isArray(values.deletedVideos)) {
      formData.append("deletedVideos", JSON.stringify(values.deletedVideos));
    }

    try {
      await updateMemorial({ id, formData }).unwrap();
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error updating memorial:", error);
    }
  };

  const generateQRCodeValue = () => {
    const name = form.getFieldValue("fullName") || initialValues.fullName;
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    return `https://profile.example.com/${id || "profile"}/${formattedName}`;
  };

  const tabItems = [
    {
      key: "profile",
      label: (
        <span>
          <UserOutlined />
          Edit Profile
        </span>
      ),
      children: (
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleSave}
          className="mt-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter full name" }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item name="relation" label="Relation">
              <Input placeholder="Enter relation" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="dateOfBirth"
              label="Date of Birth"
              rules={[
                { required: true, message: "Please select date of birth" },
              ]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item
              name="dateOfDeath"
              label="Date of Death"
              rules={[
                { required: true, message: "Please select date of death" },
              ]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>
          </div>

          <Form.Item
            name="bio"
            label="Bio"
            rules={[{ required: true, message: "Please enter bio" }]}
          >
            <TextArea rows={4} placeholder="Enter bio" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="country" label="Country">
              <Input placeholder="Enter country" />
            </Form.Item>
            <Form.Item name="city" label="City">
              <Input placeholder="Enter city" />
            </Form.Item>
          </div>

          <Form.Item name="privacy" label="Privacy">
            <Select placeholder="Select privacy">
              <Option value="PUBLIC">Public</Option>
              <Option value="PRIVATE">Private</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="profilePhoto"
            label="Profile Photo"
            valuePropName="file"
            getValueFromEvent={normFile}
          >
            <Upload
              name="profilePhoto"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Profile Photo</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="coverPhoto"
            label="Cover Photo"
            valuePropName="file"
            getValueFromEvent={normFile}
          >
            <Upload
              name="coverPhoto"
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Cover Photo</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Deleted Photos">
            <Form.List name="deletedPhotos">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          { required: true, message: "Missing photo URL" },
                        ]}
                      >
                        <Input placeholder="Photo URL to delete" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Photo URL to Delete
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item label="Deleted Videos">
            <Form.List name="deletedVideos">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          { required: true, message: "Missing video URL" },
                        ]}
                      >
                        <Input placeholder="Video URL to delete" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Video URL to Delete
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: "qrcode",
      label: (
        <span>
          <QrcodeOutlined />
          QR Code
        </span>
      ),
      children: (
        <div className="flex flex-col items-center space-y-6 py-8">
          <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <QRCode
              value={generateQRCodeValue()}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <div className="text-center">
            <Title level={4}>Profile QR Code</Title>
            <Text type="secondary">
              Share this QR code to let others quickly access your profile
            </Text>
          </div>
          <Space>
            <Button>Download</Button>
            <Button type="primary">Share</Button>
          </Space>
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <span>
          <UserOutlined className="mr-2" />
          Edit Profile
        </span>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </Modal>
  );
}
