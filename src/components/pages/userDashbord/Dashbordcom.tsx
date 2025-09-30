/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/buttons/Button";
import { Card, CardContent } from "@/components/ui/card/Card";
import {
  useGetUserDashbordOverviewQuery,
  useGetUserMemorialsQuery,
} from "@/redux/features/userDashbord/userDashbordApi";
import { Modal, Skeleton, Spin } from "antd";
import { Heart, Eye, QrCode } from "lucide-react";
import Image from "next/image";
// import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineDoNotDisturbOff } from "react-icons/md";

interface DashboardProps {
  onPurchaseQRCode: () => void;
  onCreateMemorial: () => void;
}

export function Dashboard({
  onPurchaseQRCode,
  onCreateMemorial,
}: DashboardProps) {
  const [modalStates, setModalStates] = useState({
    basic: false,
  });
  const { data, isLoading } = useGetUserDashbordOverviewQuery({});
  const router = useRouter();
  const { data: memorialsData, isLoading: memorialsLoading } =
    useGetUserMemorialsQuery({
      page: 1,
      limit: 10,
    });

  const memorials = memorialsData?.data?.data || [];
  console.log(memorials, "memorials data");

  const stats = data?.data;
  console.log(stats, "user dashboard stats");
  const totalMemorials = stats?.totalMemories || 0;
  const totalViews = stats?.usedOrders || 0;
  const totalQRCodes = stats?.totalOrders || 0;
  const unusedOrders = stats?.unusedOrders || 0;

  const openModal = (type: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type: keyof typeof modalStates) => {
    setModalStates((prev) => ({ ...prev, [type]: false }));
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[#100C08] font-Outfit text-[28px] font-medium leading-[120%]">
            My Dashboard
          </h1>
          <Button
            onClick={onPurchaseQRCode}
            className="text-white font-Outfit text-base font-normal leading-[140%] rounded-[28px] bg-[#2563EB] flex py-2 px-4 justify-center items-center gap-2"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Purchase QR Code
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className=" py-6">
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {totalMemorials}
                      </div>
                      <div className="text-sm text-gray-500">
                        Total Memorial
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {totalViews}
                      </div>
                    </>
                  )}
                  <div className="text-sm text-gray-500">Total Used</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <QrCode className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {totalQRCodes}
                      </div>
                    </>
                  )}
                  <div className="text-sm text-gray-500">Total QR Code</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MdOutlineDoNotDisturbOff className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  {isLoading ? (
                    <Spin />
                  ) : (
                    <>
                      <div className="text-2xl font-bold text-gray-900">
                        {unusedOrders}
                      </div>
                    </>
                  )}
                  <div className="text-sm text-gray-500">
                    Total Unused Orders
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <div>
          <div className="rounded-[12px] bg-white shadow-[0_1px_50px_rgba(0,0,0,0.07)] flex py-[59px] px-[385px] justify-center flex-col gap-3 items-center self-stretch">
            <div className="w-16 h-16 mx-auto  bg-gray-100 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-[#595959] font-Outfit text-base lg:text-lg font-medium leading-[120%] ">
              No memorials yet
            </h3>
            <p className="text-[#595959] font-Outfit text-base lg:text-lg font-light leading-[120%] mb-3">
              Create your first memorial page to get started
            </p>
            {unusedOrders < 0 ? (
              <Button onClick={onCreateMemorial}>Purchase QR Code</Button>
            ) : (
              <Button
                onClick={() => router.push("/dashboard/create-memorial")}
                className="text-white font-Outfit sm:text-base text-sm  lg:text-xl font-normal leading-[140%] rounded-[28px] bg-[#2563EB] flex h-[50px] p-[20px] justify-center items-center gap-[10px]"
              >
                <FiPlusCircle />
                Create New Memorial
              </Button>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mt-12">
            <h4 className="text-[#100C08] font-Outfit sm:text-xl  lg:text-[28px] font-medium leading-[120%]">
              My Memorial Page
            </h4>

            {unusedOrders < 0 ? (
              <Button
                onClick={() => router.push("/dashboard/create-memorial")}
                className="text-white font-Outfit text-xl font-normal leading-[140%] rounded-full bg-[#2563EB] flex w-[100px] h-[42px] p-5 justify-center items-center gap-2"
              >
                <FiPlusCircle />
                Add
              </Button>
            ) : (
              <Button
                onClick={() => openModal("basic")}
                className="text-white font-Outfit text-xl font-normal leading-[140%] rounded-full bg-[#2563EB] flex w-[100px] h-[42px] p-5 justify-center items-center gap-2"
              >
                <FiPlusCircle />
                Add
              </Button>
            )}
          </div>
          <div className="flex flex-wrap flex-row gap-6">
            {memorialsLoading ? (
              <div className="mt-4 w-full">
                <Skeleton active />
              </div>
            ) : (
              memorials.map((item: any) => (
                <div
                  onClick={() =>
                    router.push(`/dashboard/memorial/${item.orderNo}`)
                  }
                  key={item.id}
                  className="rounded-lg bg-white flex w-[269px] px-4 py-5 flex-col mt-4 gap-8 shadow-sm"
                >
                  {/* Top section: Profile */}
                  <div className="flex gap-2">
                    <Image
                      src={item.profilePhoto}
                      alt={item.fullName}
                      width={100}
                      height={100}
                      className="rounded-full object-cover w-9 h-9"
                    />
                    <div className="flex flex-col">
                      <h4 className="text-[#100C08] font-Outfit text-xl font-medium leading-[120%]">
                        {item.fullName}
                      </h4>
                      <p className="text-[#494949] font-Outfit text-base font-normal leading-[140%]">
                        {new Date(item.dateOfBirth).getFullYear()} -{" "}
                        {new Date(item.dateOfDeath).getFullYear()}
                      </p>
                    </div>
                  </div>

                  {/* Bottom section: Actions */}
                  <div className="flex items-center gap-3">
                    <Button className="rounded-[24px] bg-[rgba(22,163,74,0.1)] flex h-8 px-3 py-2 hover:bg-gray-200 items-center gap-2 text-[#16A34A] font-Outfit text-base font-normal leading-[140%]">
                      {item.videos?.length || 0} Videos
                    </Button>

                    <Button className="rounded-[24px] bg-[rgba(81,142,248,0.1)] flex w-[87px] h-8 px-3 hover:bg-gray-200 py-2 justify-between items-center text-[#2563EB] font-Outfit text-[16px] font-normal leading-[140%]">
                      {item.photos?.length || 0} Photos
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        open={modalStates.basic}
        onCancel={() => closeModal("basic")}
        footer={null}
      >
        <div>
          <h4 className="text-[#100C08] font-outfit text-[22px] font-medium leading-[120%]">
            Limited QR code
          </h4>
          <div className="w-full my-4 h-[1px] bg-black " />
          <div>
            <h4 className="text-[#100C08] font-outfit text-[20px] not-italic font-normal leading-[140%]">
              You have {totalMemorials} of {totalQRCodes} unlocks left
            </h4>
            <p className="text-[#494949] font-outfit text-[16px] not-italic font-normal leading-[140%] mt-2">
              You have purchased {totalQRCodes} QR codes for memorial pages.{" "}
              {totalViews} is already used only {unusedOrders} remain
            </p>
          </div>
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              className="text-[#100C08] text-center font-outfit text-[16px] not-italic font-normal leading-[140%] 
							rounded-[28px] bg-[#DEE8FC] flex hover:text-white duration-300 h-[38px] px-4 py-[20px] justify-between items-center flex-shrink-0"
              onClick={() => closeModal("basic")}
            >
              Cancel
            </Button>
            {unusedOrders < 0 ? (
              <Button
                className="rounded-full  bg-[#2563EB] flex px-4 py-2 justify-center items-center gap-2 
text-[#FFF] font-outfit text-[16px] not-italic font-normal leading-[140%]"
                onClick={onPurchaseQRCode}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={() => {
                  router.push("/dashboard/create-memorial");
                }}
                className="rounded-full  bg-[#2563EB] flex px-4 py-2 justify-center items-center gap-2 
text-[#FFF] font-outfit text-[16px] not-italic font-normal leading-[140%]"
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
