/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, QrCode, Edit } from "lucide-react";

import Image from "next/image";
import { EditProfileModal } from "@/components/ui/modal/edit-profile-modal";
import { AddPhotosModal } from "@/components/ui/modal/add-photos-modal";
import { AddVideoModal } from "@/components/ui/modal/add-video-modal";
import { ImageDetailModal } from "@/components/ui/modal/image-detail-modal";
import { VideoDetailModal } from "@/components/ui/modal/video-detail-modal";
import { TbCirclesRelation } from "react-icons/tb";
import { useGetSingleMemorialQuery } from "@/redux/features/userDashbord/userDashbordApi";
import { usePathname } from "next/navigation";

export default function ProfilePage() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isImageDetailOpen, setIsImageDetailOpen] = useState(false);
  const [isVideoDetailOpen, setIsVideoDetailOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const path = usePathname();
  const id = path.split("/").pop();
  console.log(id);
  const { data, isLoading } = useGetSingleMemorialQuery(id);
  const memorial = data?.data;

  console.log(memorial, isLoading);

  const photos = [
    "https://plus.unsplash.com/premium_photo-1661675440353-6a6019c95bc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmlkZW98ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1528109966604-5a6a4a964e8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmlkZW98ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1673356713416-a8ed69af6f4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHZpZGVvfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1511903979581-3f1d3afb4372?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHZpZGVvfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1576460307366-51bc1d23be78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fHZpZGVvfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1528109966604-5a6a4a964e8d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmlkZW98ZW58MHx8MHx8fDA%3D",
    "https://plus.unsplash.com/premium_photo-1673356713416-a8ed69af6f4a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHZpZGVvfGVufDB8fDB8fHww",
    "https://plus.unsplash.com/premium_photo-1661675440353-6a6019c95bc7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmlkZW98ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1576460307366-51bc1d23be78?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fHZpZGVvfGVufDB8fDB8fHww",
  ];

  const videos = [
    {
      thumbnail:
        "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJhdmVsfGVufDB8fDB8fHww",
      duration: "2:34",
      url: "https://cdn.pixabay.com/video/2025/07/22/292827_tiny.mp4",
    },
    {
      thumbnail:
        "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzJ8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D",
      duration: "1:45",
      url: "https://cdn.pixabay.com/video/2025/06/24/287510_tiny.mp4",
    },
  ];

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageDetailOpen(true);
  };

  const handleVideoClick = (index: number) => {
    setSelectedVideoIndex(index);
    setIsVideoDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" bg-white">
        {/* Cover Photo Section */}
        <div className="relative">
          <div
            className="h-80 bg-cover bg-center rounded-t-lg"
            style={{
              backgroundImage: `url(${
                memorial?.coverPhoto || "/placeholder.svg?height=320&width=1280"
              })`,
            }}
          />

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-8">
            <Image
              src={
                memorial?.profilePhoto ||
                "/placeholder.svg?height=160&width=160"
              }
              alt="Profile Photo"
              width={160}
              height={160}
              className="rounded-full w-40 h-40  object-center border-4 border-white"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPhotosModalOpen(true)}
              className="bg-white/90 hover:bg-white"
            ></Button>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white/90 hover:bg-white"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* Profile Info */}
        <div className="px-8 pt-20 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {memorial?.fullName}
              </h1>
              <p className="text-gray-600 text-lg">{memorial?.occupation}</p>
            </div>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="px-8 space-y-6">
          {/* Bio Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Bio</h2>
            <p className="text-gray-700 leading-relaxed">{memorial?.bio}</p>
          </div>

          {/* About Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-700">
                  {memorial?.dateOfBirth
                    ? new Date(memorial.dateOfBirth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : ""}{" "}
                  -{" "}
                  {memorial?.dateOfDeath
                    ? new Date(memorial.dateOfDeath).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : ""}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">
                  {memorial?.country}, {memorial?.city}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TbCirclesRelation className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">
                  Relationship - {memorial?.relation}
                </span>
              </div>
            </div>
          </div>

          {/* Photos Section */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Photos</h2>
              <Button
                size="sm"
                onClick={() => setIsPhotosModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {(memorial?.photos as any)?.map((photo: any, index: any) => (
                <div key={index} className="aspect-square">
                  <Image
                    src={photo || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    onClick={() => handleImageClick(index)}
                    height={500}
                    width={500}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Videos Section */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Videos</h2>
                <p className="text-sm text-gray-500">{videos.length} items</p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-4">
              {(memorial?.videos as any)?.map((video: any, index: any) => (
                <div key={index} className="flex gap-4">
                  <div
                    className="relative w-32 h-20 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => handleVideoClick(index)}
                  >
                    {/* Thumbnail (first frame) */}
                    <video
                      src={video.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      preload="metadata"
                      poster={video.url || ""} // fallback thumbnail if available
                    />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Existing Modals */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        memorialData={memorial}
      />
      <AddPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        id={memorial?.id}
      />
      <AddVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      <ImageDetailModal
        isOpen={isImageDetailOpen}
        onClose={() => setIsImageDetailOpen(false)}
        imageUrl={photos[selectedImageIndex]}
        imageIndex={selectedImageIndex}
        totalImages={photos.length}
      />

      <VideoDetailModal
        isOpen={isVideoDetailOpen}
        onClose={() => setIsVideoDetailOpen(false)}
        videoUrl={videos[selectedVideoIndex]?.url}
        videoThumbnail={
          videos[selectedVideoIndex]?.thumbnail || "/placeholder.svg"
        }
        videoDuration={videos[selectedVideoIndex]?.duration || "0:00"}
        videoIndex={selectedVideoIndex}
        totalVideos={videos.length}
      />
    </div>
  );
}
