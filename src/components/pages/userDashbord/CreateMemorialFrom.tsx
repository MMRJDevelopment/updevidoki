/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Upload, ImageIcon, Video, X, Loader2, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { createMemory } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function CreateMemorialPage() {
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [coverPhotoUrl, setCoverPhotoUrl] = useState<string | null>(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    dateOfDeath: "",
    bio: "",
    country: "Bangladesh",
    city: "",
    relation: "Friend",
    privacySetting: "public",
  });

  const coverUploadRef = useRef<HTMLInputElement>(null);
  const profileUploadRef = useRef<HTMLInputElement>(null);
  const photosUploadRef = useRef<HTMLInputElement>(null);
  const videoUploadRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
  const MAX_GALLERY_PHOTOS = 10;
  const MAX_VIDEOS = 5;
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif"];
  const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/mpeg", "video/webm"];
  const tocken = useAppSelector((state: RootState) => state.auth.access_token);
  console.log(tocken, "tocken");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateImageFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File must be less than 10MB");
      return false;
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, or GIF images are allowed");
      return false;
    }
    return true;
  };

  const validateVideoFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File must be less than 10MB");
      return false;
    }
    if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
      toast.error("Only MP4, MPEG, or WEBM videos are allowed");
      return false;
    }
    return true;
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (!validateImageFile(file)) {
        if (profileUploadRef.current) profileUploadRef.current.value = "";
        return;
      }
      setProfilePhoto(file);
    } else {
      setProfilePhoto(null);
    }
  };

  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      if (!validateImageFile(file)) {
        if (coverUploadRef.current) coverUploadRef.current.value = "";
        return;
      }
      setCoverPhoto(file);
    } else {
      setCoverPhoto(null);
    }
  };

  const handleGalleryPhotosChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    const validFiles: File[] = [];
    newFiles.forEach((file) => {
      if (validateImageFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
      if (photosUploadRef.current) photosUploadRef.current.value = "";
      return;
    }

    const existingNames = galleryPhotos.map((photo) => photo.name);
    const uniqueFiles = validFiles.filter(
      (file) => !existingNames.includes(file.name)
    );

    if (uniqueFiles.length < validFiles.length) {
      toast.warning("Some files were skipped as they were already added");
    }

    if (uniqueFiles.length + galleryPhotos.length > MAX_GALLERY_PHOTOS) {
      toast.error(`Maximum ${MAX_GALLERY_PHOTOS} photos allowed`);
      if (photosUploadRef.current) photosUploadRef.current.value = "";
      return;
    }

    setGalleryPhotos((prev) => [...prev, ...uniqueFiles]);
    toast.success(`Added ${uniqueFiles.length} photo(s)`);
    if (photosUploadRef.current) photosUploadRef.current.value = "";
  };

  const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    const validFiles: File[] = [];
    newFiles.forEach((file) => {
      if (validateVideoFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length === 0) {
      if (videoUploadRef.current) videoUploadRef.current.value = "";
      return;
    }

    const existingNames = videos.map((video) => video.name);
    const uniqueFiles = validFiles.filter(
      (file) => !existingNames.includes(file.name)
    );

    if (uniqueFiles.length < validFiles.length) {
      toast.warning("Some files were skipped as they were already added");
    }

    if (uniqueFiles.length + videos.length > MAX_VIDEOS) {
      toast.error(`Maximum ${MAX_VIDEOS} videos allowed`);
      if (videoUploadRef.current) videoUploadRef.current.value = "";
      return;
    }

    setVideos((prev) => [...prev, ...uniqueFiles]);
    toast.success(`Added ${uniqueFiles.length} video(s)`);
    if (videoUploadRef.current) videoUploadRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.fullName.trim()) {
      toast.error("Please enter a full name");
      return;
    }
    if (!formData.dateOfBirth) {
      toast.error("Please select date of birth");
      return;
    }
    if (!formData.dateOfDeath) {
      toast.error("Please select date of death");
      return;
    }

    // Enhanced date validation
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const deathDate = new Date(formData.dateOfDeath);

    if (isNaN(birthDate.getTime()) || isNaN(deathDate.getTime())) {
      toast.error("Invalid date format");
      return;
    }
    if (birthDate > today) {
      toast.error("Date of birth cannot be in the future");
      return;
    }
    if (deathDate > today) {
      toast.error("Date of death cannot be in the future");
      return;
    }
    if (deathDate < birthDate) {
      toast.error("Date of death cannot be before date of birth");
      return;
    }

    try {
      // Create FormData matching Postman structure
      const submitFormData = new FormData();

      // 1. Add profilePhoto (if exists)
      if (profilePhoto) {
        submitFormData.append("profilePhoto", profilePhoto);
      }

      // 2. Add data as JSON string (Text field in Postman)
      const memorialData = {
        fullName: formData.fullName.trim(),
        dateOfBirth: birthDate.toISOString(),
        dateOfDeath: deathDate.toISOString(),
        bio: formData.bio.trim(),
        country: formData.country,
        city: formData.city.trim(),
        relation: formData.relation,
        privacy: formData.privacySetting.toUpperCase(),
      };
      const dataJsonString = JSON.stringify(memorialData);
      submitFormData.append("data", dataJsonString);
      console.log("[v0] ✓ data (JSON string):", dataJsonString);

      // 3. Add coverPhoto (if exists)
      if (coverPhoto) {
        submitFormData.append("coverPhoto", coverPhoto);
      }

      // 4. Add photos array (multiple files with same key name)
      if (galleryPhotos.length > 0) {
        galleryPhotos.forEach((photo) => {
          submitFormData.append("photos", photo);
        });
      }

      // 5. Add videos array (multiple files with same key name)
      if (videos.length > 0) {
        videos.forEach((video) => {
          submitFormData.append("videos", video);
        });
      }

      setIsLoading(true); // start loading

      const res = await createMemory(submitFormData);
      if (res.success) {
        setIsLoading(false); // end loading
        toast.success("Memorial created successfully!");
        router.back(); // Go back to previous page
      } else {
        toast.error("Failed to create memory");
      }

      resetForm();
    } catch (error: any) {
      console.error(" Error Details:", {
        status: error?.status,
        data: error?.data,
        message: error?.data?.message || error?.message,
        fullError: error,
      });

      if (error?.status === 413) {
        toast.error("Files are too large. Please reduce file sizes.");
      } else if (error?.status === 400) {
        toast.error(error?.data?.message || "Invalid data provided.");
      } else if (error?.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to create memorial. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      dateOfBirth: "",
      dateOfDeath: "",
      bio: "",
      country: "Bangladesh",
      city: "",
      relation: "Friend",
      privacySetting: "public",
    });
    setCoverPhoto(null);
    setProfilePhoto(null);
    setGalleryPhotos([]);
    setVideos([]);

    if (coverUploadRef.current) coverUploadRef.current.value = "";
    if (profileUploadRef.current) profileUploadRef.current.value = "";
    if (photosUploadRef.current) photosUploadRef.current.value = "";
    if (videoUploadRef.current) videoUploadRef.current.value = "";
  };

  const removeGalleryPhoto = (index: number) => {
    setGalleryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (profilePhoto) {
      const url = URL.createObjectURL(profilePhoto);
      setProfilePhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setProfilePhotoUrl(null);
    }
  }, [profilePhoto]);

  useEffect(() => {
    if (coverPhoto) {
      const url = URL.createObjectURL(coverPhoto);
      setCoverPhotoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCoverPhotoUrl(null);
    }
  }, [coverPhoto]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Memorial
          </h1>
          <p className="text-gray-600">Honor and remember your loved one</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Photo Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cover Photo
            </h3>

            {coverPhotoUrl ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={coverPhotoUrl || "/placeholder.svg"}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCoverPhoto(null);
                    if (coverUploadRef.current)
                      coverUploadRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="cover-upload"
                  ref={coverUploadRef}
                  onChange={handleCoverPhotoChange}
                />
                <label
                  htmlFor="cover-upload"
                  className="cursor-pointer block"
                  aria-label="Upload cover photo"
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-600 text-sm mb-2">
                    Add a cover photo
                  </p>
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <Upload className="h-4 w-4" />
                    <span>Click to upload</span>
                  </div>
                </label>
              </div>
            )}

            {coverPhoto && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 truncate block max-w-xs">
                      {coverPhoto.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(coverPhoto.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Profile Information
            </h3>

            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                    src={profilePhotoUrl || "/placeholder.svg"}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover bg-gray-200"
                  />
                </div>
                <label
                  htmlFor="profile-upload"
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 shadow-lg transition-colors"
                >
                  <Upload className="w-3 h-3 text-white" />
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile-upload"
                  ref={profileUploadRef}
                  onChange={handleProfilePhotoChange}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Profile Photo</p>
                <p className="text-sm text-gray-500">Optional</p>
              </div>
            </div>

            {profilePhoto && (
              <div className="mb-6 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <span className="text-sm font-medium text-gray-900 block">
                      Profile: {profilePhoto.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {(profilePhoto.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setProfilePhoto(null);
                    if (profileUploadRef.current)
                      profileUploadRef.current.value = "";
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  required
                  className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Death <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfDeath"
                  value={formData.dateOfDeath}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share memories, accomplishments, and the legacy..."
                  rows={4}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Relation
                </label>
                <select
                  name="relation"
                  value={formData.relation}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Friend">Friend</option>
                  <option value="Sister">Sister</option>
                  <option value="Brother">Brother</option>
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gallery Photos Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Gallery Photos
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="photos-upload"
                ref={photosUploadRef}
                onChange={handleGalleryPhotosChange}
              />
              <label
                htmlFor="photos-upload"
                className="cursor-pointer block"
                aria-label="Upload gallery photos"
              >
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600 text-sm mb-2">
                  Add photos to the memorial gallery
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Upload className="h-4 w-4" />
                  <span>Select Images</span>
                </div>
              </label>
            </div>

            {galleryPhotos.length > 0 && (
              <div className="mt-4 space-y-2">
                {galleryPhotos.map((photo, index) => (
                  <div
                    key={`${photo.name}-${index}`}
                    className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5 text-blue-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block truncate max-w-xs">
                          {photo.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(photo.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeGalleryPhoto(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Videos</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <input
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                id="video-upload"
                ref={videoUploadRef}
                onChange={handleVideosChange}
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer block"
                aria-label="Upload videos"
              >
                <Video className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                <p className="text-gray-600 text-sm mb-2">
                  Add memorial videos
                </p>
                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                  <Upload className="h-4 w-4" />
                  <span>Select Videos</span>
                </div>
              </label>
            </div>

            {videos.length > 0 && (
              <div className="mt-4 space-y-2">
                {videos.map((video, index) => (
                  <div
                    key={`${video.name}-${index}`}
                    className="p-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5 text-purple-600" />
                      <div>
                        <span className="text-sm font-medium text-gray-900 block truncate max-w-xs">
                          {video.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(video.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Setting */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Privacy Setting
            </label>
            <select
              name="privacySetting"
              value={formData.privacySetting}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-300 rounded-lg h-12 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="public">Public - Anyone can view</option>
              <option value="private">
                Private - Only invited people can view
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Creating Memorial...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <span>Create Memorial</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
