"use client";
import OrderDetailsModal, { OrderData } from "@/components/ui/modal/OrderDetailsModal";
import { Pagination } from "@/components/ui/pagination/Pagination";
import { Table } from "@/components/ui/Table/Table";
import { useGetAllOrdersQuery } from "@/redux/features/adminDashbord/adminDashboardApi";
// import Image from "next/image";
import type React from "react";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";


const OrderManagement = () => {
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = useGetAllOrdersQuery({
    page: currentPage,
    limit: 10,
    searchTerm: search,
  });
  const ITEMS_PER_PAGE = 5;
  const totalItem = data?.data?.total || 0;
  const totalPage = Math.ceil(totalItem / ITEMS_PER_PAGE);
  const order = data?.data?.data || [];
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const columns = [
    {
      header: "Order ID",
      accessor: "orderNo",
      className: "pl-4 pr-12",
    },
    // {
    //   header: "Customer",
    //   accessor: "customer",
    //   className: "pl-4 pr-12",
    //   render: (memorial: OrderMeta) => (
    //     <div className="flex items-center space-x-3">
    //       <Image
    //         src={memorial.image || "/placeholder.svg"}
    //         alt={memorial.name}
    //         width={32}
    //         height={32}
    //         className="w-8 h-8 rounded-full object-cover"
    //       />
    //       <span>{memorial.name}</span>
    //     </div>
    //   ),
    // },
    {
      header: "Email",
      accessor: "email",
      className: "pl-4 pr-12",
      render: (row: OrderData) => <span>{row.user.email}</span>,
    },
    {
      header: "Date",
      accessor: "createdAt",
      className: "pl-4 pr-12",
      render: (row: OrderData) => (
        <span>{new Date(row.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: "Price",
      accessor: "amount",
      className: "pl-4 pr-12",
    },
    {
      header: "Status",
      accessor: "status",
      className: "px-12",
      render: (row: OrderData) => (
        <div>
          {row.status === "COMPLETED" ? (
            <span className="flex px-6 inline-block py-2 justify-center items-center gap-1 rounded-[24px] bg-[rgba(22,163,74,0.1)] text-[#16A34A] font-outfit text-base font-normal leading-[140%]">
              Delivered
            </span>
          ) : (
            <span className="flex px-6 inline-block py-2 justify-center items-center gap-1 rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]">
              Processing
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Action",
      accessor: "action",
      className: "px-2",
      render: (row: OrderData) => (
        <div className="flex items-center space-x-2">
          <button
            className="flex w-[118px] h-8 px-3 py-2 justify-center items-center rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]"
            onClick={() => handleViewDetails(row)}
          >
            View Profile
          </button>
        </div>
      ),
    },
  ];

  const handleViewDetails = (row: OrderData) => {
    setSelectedOrder(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="flex flex-col gap-6 py-6 ">
      <div className="relative w-full flex items-center">
        <input
          value={search}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search Speaker Name..."
          className="text-[#8C8C8C] outline-none rounded-full border-[#BFBFBF] border-[1px] cursor-pointer font-dm text-sm font-normal leading-[20px] rounded-[8px] bg-white shadow-[0px_4px_50px_0px_rgba(0,_0,_0,_0.08)] flex h-[44px] px-[12px] py-[10px] pl-[16px] justify-between items-end flex-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-blue-500"
        />
        <IoSearch className="absolute right-[12px] top-[50%] text-[20px] transform -translate-y-[50%] text-[#8C8C8C]" />
      </div>
      <Table columns={columns} data={order} />
      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        order={selectedOrder}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPage}
        onPageChange={setCurrentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={totalItem}
      />
    </div>
  );
};

export default OrderManagement;
