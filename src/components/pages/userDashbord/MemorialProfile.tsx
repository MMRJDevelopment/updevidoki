/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, QrCode, Edit } from "lucide-react";

import Image from "next/image";
import { EditProfileModal } from "@/components/ui/modal/edit-profile-modal";
import { AddPhotosModal } from "@/components/ui/modal/add-photos-modal";
import { AddVideoModal } from "@/components/ui/modal/add-video-modal";
import { ImageDetailModal } from "@/components/ui/modal/image-detail-modal";
import { VideoDetailModal } from "@/components/ui/modal/video-detail-modal";
import { TbCirclesRelation } from "react-icons/tb";
import { usePathname } from "next/navigation";
import { getMemory } from "@/lib/api-client";

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
  const [memory, setMemory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


    const loadMemory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getMemory(id as string);
      setMemory(data?.data || null);
    } catch (error) {
      console.error("Failed to load memory:", error);
      setError(error instanceof Error ? error.message : "Failed to load memory");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadMemory();
    }
  }, [id]);

  console.log(memory, isLoading,error);
  const photos = memory?.photos || [];
  const videos = memory?.videos || [];



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
                memory?.coverPhoto || "/placeholder.svg?height=320&width=1280"
              })`,
            }}
          />

          {/* Profile Picture */}
          <div className="absolute -bottom-16 left-8">
            <Image
              src={
                memory?.profilePhoto ||
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
                {memory?.fullName}
              </h1>
              <p className="text-gray-600 text-lg">{memory?.occupation}</p>
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
            <p className="text-gray-700 leading-relaxed">{memory?.bio}</p>
          </div>

          {/* About Section */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-gray-700">
                  {memory?.dateOfBirth
                    ? new Date(memory.dateOfBirth).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : ""}{" "}
                  -{" "}
                  {memory?.dateOfDeath
                    ? new Date(memory.dateOfDeath).toLocaleDateString(
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
                  {memory?.country}, {memory?.city}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TbCirclesRelation className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">
                  Relationship - {memory?.relation}
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
              {(memory?.photos as any)?.map((photo: any, index: any) => (
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
              {(memory?.videos as any)?.map((video: any, index: any) => (
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
        memorialData={memory}
      />
      <AddPhotosModal
        isOpen={isPhotosModalOpen}
        onClose={() => setIsPhotosModalOpen(false)}
        id={memory?.id}
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
