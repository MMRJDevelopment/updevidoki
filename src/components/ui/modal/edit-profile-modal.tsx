/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
  message,
  Row,
  Col,
  Image,
  Spin,
} from "antd";
import {
  UserOutlined,
  QrcodeOutlined,
  SaveOutlined,
  UploadOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface FormValues {
  fullName: string;
  dateOfBirth: moment.Moment | null;
  dateOfDeath: moment.Moment | null;
  bio: string;
  country: string;
  city: string;
  relation: string;
  privacy: "PUBLIC" | "PRIVATE";
  profilePhoto?: any;
  coverPhoto?: any;
}

interface MemorialData {
  id: string;
  userId: string;
  orderNo: string;
  coverPhoto: string;
  profilePhoto: string;
  bio: string;
  city: string;
  country: string;
  createdAt: string;
  dateOfBirth: string;
  dateOfDeath: string;
  fullName: string;
  photos: string[];
  privacy: "PUBLIC" | "PRIVATE";
  qrCode: string;
  relation: string;
  updatedAt: string;
  videos: string[];
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  memorialData: MemorialData | null; // Allow null
}

export function EditProfileModal({
  isOpen,
  onClose,
  memorialData,
}: EditProfileModalProps) {
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [isFormModified, setIsFormModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const token = useAppSelector((state: RootState) => state.auth.access_token);

  // Safe data access functions
  const getFullName = () => memorialData?.fullName || "Memorial Profile";
  const getProfilePhoto = () => memorialData?.profilePhoto || "";
  const getCoverPhoto = () => memorialData?.coverPhoto || "";
  const getRelation = () => memorialData?.relation || "";
  const getBio = () => memorialData?.bio || "";
  const getCountry = () => memorialData?.country || "";
  const getCity = () => memorialData?.city || "";
  const getPrivacy = () => memorialData?.privacy || "PUBLIC";
  const getQrCode = () => memorialData?.qrCode || "";
  const getId = () => memorialData?.id || "";

  // Populate form with props data
  useEffect(() => {
    if (memorialData && isOpen) {
      const formValues = {
        fullName: getFullName(),
        dateOfBirth: memorialData.dateOfBirth
          ? moment(memorialData.dateOfBirth)
          : null,
        dateOfDeath: memorialData.dateOfDeath
          ? moment(memorialData.dateOfDeath)
          : null,
        bio: getBio(),
        country: getCountry(),
        city: getCity(),
        relation: getRelation(),
        privacy: getPrivacy(),
      };

      form.setFieldsValue(formValues);

      // Set preview images from props data
      setProfilePreview(getProfilePhoto());
      setCoverPreview(getCoverPhoto());

      // Reset modification state
      setIsFormModified(false);
    }
  }, [
    memorialData,
    isOpen,
    form,
    getFullName,
    getProfilePhoto,
    getCoverPhoto,
    getRelation,
    getBio,
    getCountry,
    getCity,
    getPrivacy,
  ]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleProfilePhotoChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      setProfilePhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setProfilePreview(previewUrl);
      setIsFormModified(true);
    }
  };

  const handleCoverPhotoChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      setCoverPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
      setIsFormModified(true);
    }
  };

  const removeProfilePhoto = () => {
    setProfilePhotoFile(null);
    setProfilePreview(getProfilePhoto());
    form.setFieldValue("profilePhoto", undefined);
    setIsFormModified(true);
  };

  const removeCoverPhoto = () => {
    setCoverPhotoFile(null);
    setCoverPreview(getCoverPhoto());
    form.setFieldValue("coverPhoto", undefined);
    setIsFormModified(true);
  };

  const handleClose = () => {
    if (isFormModified) {
      Modal.confirm({
        title: "Unsaved Changes",
        content: "You have unsaved changes. Are you sure you want to close?",
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          form.resetFields();
          setProfilePreview(getProfilePhoto());
          setCoverPreview(getCoverPhoto());
          setProfilePhotoFile(null);
          setCoverPhotoFile(null);
          setIsFormModified(false);
          onClose();
        },
      });
    } else {
      onClose();
    }
  };

  const handleSave = async (values: FormValues) => {
    if (!memorialData) {
      message.error("No memorial data found!");
      return;
    }

    try {
      const formData = new FormData();

      // Prepare update data
      const updateData: any = {
        fullName: values.fullName?.trim(),
        bio: values.bio?.trim(),
        country: values.country?.trim(),
        city: values.city?.trim(),
        relation: values.relation?.trim(),
        privacy: values.privacy,
      };

      // Only include dates if they are valid
      if (values.dateOfBirth && values.dateOfBirth.isValid()) {
        updateData.dateOfBirth = values.dateOfBirth.toISOString();
      }
      if (values.dateOfDeath && values.dateOfDeath.isValid()) {
        updateData.dateOfDeath = values.dateOfDeath.toISOString();
      }

      formData.append("data", JSON.stringify(updateData));

      // Append files if they exist
      if (profilePhotoFile) {
        formData.append("profilePhoto", profilePhotoFile);
      }
      if (coverPhotoFile) {
        formData.append("coverPhoto", coverPhotoFile);
      }

      // await updateMemorial({
      //   id: getId(),
      //   formData,
      // }).unwrap();

      setIsLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/memories/update/${getId()}`,
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

      message.success("Profile updated successfully!");
      setIsFormModified(false);
      onClose();
    } catch (error: any) {
      message.error(
        error?.data?.message || "Failed to update profile. Please try again."
      );
      console.error("Error updating memorial:", error);
    }
  };

  const generateQRCodeValue = () => {
    const name = form.getFieldValue("fullName") || getFullName();
    const formattedName = name.toLowerCase().replace(/\s+/g, "-");
    return `${window.location.origin}/memorial/${getId()}/${formattedName}`;
  };

  const handleDownloadQR = () => {
    const canvas = document
      .getElementById("profile-qrcode")
      ?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${getFullName()}-qrcode.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    const url = generateQRCodeValue();
    const shareData = {
      title: `${getFullName()} - Memorial`,
      text: `Remembering ${getFullName()}`,
      url: url,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        message.success("Profile link copied to clipboard!");
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        message.success("Profile link copied to clipboard!");
      }
    }
  };

  const uploadButton = (
    <div className="text-center">
      <UploadOutlined className="text-2xl mb-2" />
      <div className="text-xs">Upload</div>
    </div>
  );

  // Don't render if no memorial data
  if (!memorialData && isOpen) {
    return (
      <Modal open={isOpen} onCancel={onClose} footer={null} width={400}>
        <div className="flex flex-col items-center justify-center py-8">
          <Spin size="large" />
          <Text className="mt-4">Loading memorial data...</Text>
        </div>
      </Modal>
    );
  }

  const tabItems = [
    {
      key: "profile",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Edit Profile
        </span>
      ),
      children: (
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="mt-4"
            onValuesChange={() => setIsFormModified(true)}
          >
            {/* Basic Information */}
            <div className="mb-6">
              <Title level={5} className="mb-4">
                Basic Information
              </Title>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[
                      { required: true, message: "Please enter full name" },
                      { min: 2, message: "Name must be at least 2 characters" },
                    ]}
                  >
                    <Input
                      placeholder="Enter full name"
                      prefix={<UserOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="relation"
                    label="Relationship"
                    rules={[
                      {
                        min: 2,
                        message: "Relation must be at least 2 characters",
                      },
                    ]}
                  >
                    <Input placeholder="e.g., Father, Mother, Spouse, Friend" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[
                      {
                        required: true,
                        message: "Please select date of birth",
                      },
                    ]}
                  >
                    <DatePicker
                      className="w-full"
                      format="MMMM DD, YYYY"
                      placeholder="Select date of birth"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="dateOfDeath"
                    label="Date of Passing"
                    rules={[
                      {
                        required: true,
                        message: "Please select date of passing",
                      },
                    ]}
                  >
                    <DatePicker
                      className="w-full"
                      format="MMMM DD, YYYY"
                      placeholder="Select date of passing"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Biography */}
            <div className="mb-6">
              <Title level={5} className="mb-4">
                Biography
              </Title>
              <Form.Item
                name="bio"
                label="Life Story & Memories"
                rules={[
                  { required: true, message: "Please share some memories" },
                  { min: 10, message: "Please write at least 10 characters" },
                  {
                    max: 1000,
                    message: "Biography cannot exceed 1000 characters",
                  },
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Share the life story, memories, achievements, and special moments..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>
            </div>

            {/* Location */}
            <div className="mb-6">
              <Title level={5} className="mb-4">
                Location
              </Title>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="country"
                    label="Country"
                    rules={[
                      {
                        min: 2,
                        message: "Country must be at least 2 characters",
                      },
                    ]}
                  >
                    <Input placeholder="Enter country" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[
                      { min: 2, message: "City must be at least 2 characters" },
                    ]}
                  >
                    <Input placeholder="Enter city" />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            {/* Privacy Settings */}
            <div className="mb-6">
              <Title level={5} className="mb-4">
                Privacy Settings
              </Title>
              <Form.Item
                name="privacy"
                label="Profile Visibility"
                tooltip="Public: Anyone can view | Private: Only you can view"
              >
                <Select placeholder="Select privacy setting">
                  <Option value="PUBLIC">Public - Anyone can view</Option>
                  <Option value="PRIVATE">Private - Only you can view</Option>
                </Select>
              </Form.Item>
            </div>

            {/* Photos */}
            <div className="mb-6">
              <Title level={5} className="mb-4">
                Photos
              </Title>

              {/* Profile Photo */}
              <Form.Item label="Profile Photo">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="relative">
                    <Upload
                      name="profilePhoto"
                      listType="picture-card"
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={handleProfilePhotoChange}
                      accept="image/*"
                      className="avatar-uploader"
                    >
                      {profilePreview ? (
                        <div className="relative">
                          <Image
                            src={profilePreview}
                            alt="Profile"
                            width={100}
                            height={100}
                            className="rounded-full object-cover w-24 h-24"
                            preview={false}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-full transition-all flex items-center justify-center">
                            <UploadOutlined className="text-white text-xl opacity-0 hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      ) : (
                        uploadButton
                      )}
                    </Upload>
                    {profilePreview && profilePreview !== getProfilePhoto() && (
                      <Button
                        type="primary"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={removeProfilePhoto}
                        className="absolute -top-2 -right-2 shadow-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <Text type="secondary" className="text-sm">
                      Upload a clear portrait photo. Recommended: Square image,
                      500x500 pixels, max 2MB.
                    </Text>
                  </div>
                </div>
              </Form.Item>

              {/* Cover Photo */}
              <Form.Item label="Cover Photo">
                <div className="space-y-3">
                  <Upload
                    name="coverPhoto"
                    listType="picture-card"
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={handleCoverPhotoChange}
                    accept="image/*"
                    className="cover-uploader"
                  >
                    {coverPreview ? (
                      <div className="relative">
                        <Image
                          src={coverPreview}
                          alt="Cover"
                          width={200}
                          height={100}
                          className="object-cover w-48 h-24 rounded-lg"
                          preview={false}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center">
                          <UploadOutlined className="text-white text-xl opacity-0 hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                  {coverPreview && coverPreview !== getCoverPhoto() && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={removeCoverPhoto}
                      size="small"
                    >
                      Remove Cover Photo
                    </Button>
                  )}
                  <div>
                    <Text type="secondary" className="text-sm">
                      Upload a landscape photo for the cover. Recommended:
                      1200x400 pixels, max 2MB.
                    </Text>
                  </div>
                </div>
              </Form.Item>
            </div>

            {/* Action Buttons */}
            <Form.Item className="mb-0 sticky bottom-0 bg-white pt-4 border-t">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  loading={isLoading}
                  disabled={!isFormModified}
                  className="min-w-32"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "qrcode",
      label: (
        <span className="flex items-center gap-2">
          <QrcodeOutlined />
          Share Profile
        </span>
      ),
      children: (
        <div className="flex flex-col items-center space-y-6 py-8">
          <div
            id="profile-qrcode"
            className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
          >
            <QRCode
              value={generateQRCodeValue()}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
            />
          </div>

          <div className="text-center max-w-md">
            <Title level={4} className="mb-2">
              Share {getFullName()}&apos;s Profile
            </Title>
            <Text type="secondary" className="text-base">
              Scan this QR code to quickly access the memorial profile on any
              device
            </Text>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg max-w-md">
            <Text code className="break-all text-sm">
              {generateQRCodeValue()}
            </Text>
          </div>

          <Space size="middle">
            <Button
              size="large"
              onClick={handleDownloadQR}
              icon={<DownloadOutlined />}
            >
              Download QR
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleShare}
              icon={<ShareAltOutlined />}
            >
              Share Profile
            </Button>
          </Space>

          {/* Existing QR Code */}
          {getQrCode() && (
            <div className="mt-8 p-4 border rounded-lg text-center">
              <Title level={5} className="mb-3">
                Current QR Code
              </Title>
              <Image
                src={getQrCode()}
                alt="Current QR Code"
                width={120}
                height={120}
                preview={false}
                className="mx-auto"
              />
              <Text type="secondary" className="text-sm block mt-2">
                Previously generated QR code
              </Text>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserOutlined />
            Edit {getFullName()}
          </span>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleClose}
            className="hover:bg-gray-100"
          />
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      width={window.innerWidth < 768 ? "95%" : 900}
      style={{ top: 20 }}
      destroyOnClose
      closable={false}
      className="edit-profile-modal"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
        tabPosition={window.innerWidth < 768 ? "top" : "left"}
      />
    </Modal>
  );
}

// Add missing icons
const DownloadOutlined = () => (
  <svg width="1em" height="1em" viewBox="0 0 1024 1024">
    <path
      fill="currentColor"
      d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"
    />
  </svg>
);

const ShareAltOutlined = () => (
  <svg width="1em" height="1em" viewBox="0 0 1024 1024">
    <path
      fill="currentColor"
      d="M752 664c-28.5 0-54.3 10.6-73.8 28l-149-94.4c1.6-7.2 2.6-14.5 2.6-22.2 0-7.8-1-15.1-2.6-22.2l150.9-95.4C696 348.3 722.3 338 752 338c62.4 0 113 50.6 113 113s-50.6 113-113 113zm0-490c-97.2 0-176 78.8-176 176 0 7.8 1 15.1 2.6 22.2l-150.9 95.4C400 348.3 373.7 338 344 338c-62.4 0-113 50.6-113 113s50.6 113 113 113c28.5 0 54.3-10.6 73.8-28l149 94.4c-1.6 7.2-2.6 14.5-2.6 22.2 0 97.2 78.8 176 176 176s176-78.8 176-176-78.8-176-176-176zm0 656c-79.5 0-144-64.5-144-144s64.5-144 144-144 144 64.5 144 144-64.5 144-144 144z"
    />
  </svg>
);
