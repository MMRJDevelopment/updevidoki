"use client";
import ProfileModal from "@/components/ui/modal/ProfileModal";
import { Table } from "@/components/ui/Table/Table";
import Image from "next/image";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";

export type UserMetasss = {
	id: string;
	name: string;
	image: string;
	date: string;
	status: "Published" | "Draft";
	actions: string;
};

export const users: UserMetasss[] = [
	{
		id: "1",
		name: "John Doe",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-01-15",
		status: "Published",
		actions: "view",
	},
	{
		id: "2",
		name: "Jane Smith",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-02-20",
		status: "Draft",
		actions: "view",
	},
	{
		id: "3",
		name: "Michael Brown",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-03-10",
		status: "Draft",
		actions: "view",
	},
	{
		id: "4",
		name: "Emily Johnson",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-04-05",
		status: "Published",
		actions: "view",
	},
	{
		id: "5",
		name: "Chris Evans",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-05-12",
		status: "Draft",
		actions: "view",
	},
	{
		id: "6",
		name: "Sophia Miller",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-06-18",
		status: "Draft",
		actions: "view",
	},
	{
		id: "7",
		name: "David Wilson",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-07-22",
		status: "Published",
		actions: "view",
	},
	{
		id: "8",
		name: "Olivia Martinez",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-08-30",
		status: "Published",
		actions: "view",
	},
	{
		id: "9",
		name: "Daniel Anderson",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-09-14",
		status: "Draft",
		actions: "view",
	},
	{
		id: "10",
		name: "Ava Thomas",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		date: "2023-10-01",
		status: "Published",
		actions: "view",
	},
];

const MemorialManagement = () => {
	const [search, setSearch] = useState<string>("");

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<UserMetasss | null>(null);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	const handleViewDetails = (row: UserMetasss) => {
		setSelectedUser(row);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedUser(null);
	};

	const columns = [
		{
			header: "Memorial",
			accessor: "memorial",
			className: "pl-4 pr-12",
			render: (memorial: UserMetasss) => (
				<div className="flex items-center space-x-3">
					<Image
						src={memorial.image}
						alt={memorial.name}
						width={32}
						height={32}
						className="w-8 h-8 rounded-full object-cover"
					/>
					<span>{memorial.name}</span>
				</div>
			),
		},

		{
			header: "Status",
			accessor: "status",
			className: "px-12",
			render: (row: UserMetasss) => (
				<div>
					{row.status === "Published" ? (
						<span className="flex w-[116px] h-8 px-3 py-2  text-center justify-center items-center rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]">
							Published
						</span>
					) : (
						<span className="flex w-[116px] h-8 px-3 py-2  text-center justify-center items-center rounded-[24px] bg-[#FAECE9] text-[#881212] font-outfit text-base font-normal leading-[140%]">
							Draft
						</span>
					)}
				</div>
			),
		},
		{
			header: "Date",
			accessor: "date",
			className: "px-12",
		},
		{
			header: "Action",
			accessor: "action",
			className: "px-2",
			render: (row: UserMetasss) => (
				<div className="flex items-center space-x-2">
					<button
						className="flex w-[118px] h-8 px-3 py-2 justify-center text-center   items-center rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]"
						onClick={() => handleViewDetails(row)}
					>
						View Profile
					</button>
				</div>
			),
		},
	];

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
			<Table columns={columns} data={users} />
			{/* <Pagination
				currentPage={currentPage}
				totalPages={totalPage}
				onPageChange={setCurrentPage}
				itemsPerPage={ITEMS_PER_PAGE}
				totalItems={totalItem}
			/> */}
			<ProfileModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				user={selectedUser}
			/>
		</div>
	);
};

export default MemorialManagement;
