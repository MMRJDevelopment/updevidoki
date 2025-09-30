"use client";
import { Table } from "@/components/ui/Table/Table";
import type React from "react";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { useRouter } from "next/navigation";

export type RequestMeta = {
	id: string;
	name: string;
	image: string;
	email: string;
	requestId: string;
	subject: string;
	action: string;
};

export const requests: RequestMeta[] = [
	{
		id: "1",
		name: "John Doe",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "johndoe@example.com",
		requestId: "REQ-1001",
		subject: "Access Request",
		action: "view",
	},
	{
		id: "2",
		name: "Jane Smith",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "janesmith@example.com",
		requestId: "REQ-1002",
		subject: "Password Reset",
		action: "view",
	},
	{
		id: "3",
		name: "Michael Brown",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "michael.brown@example.com",
		requestId: "REQ-1003",
		subject: "Account Update",
		action: "view",
	},
	{
		id: "4",
		name: "Emily Johnson",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "emily.johnson@example.com",
		requestId: "REQ-1004",
		subject: "Data Export",
		action: "view",
	},
	{
		id: "5",
		name: "Chris Evans",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "chris.evans@example.com",
		requestId: "REQ-1005",
		subject: "Bug Report",
		action: "view",
	},
	{
		id: "6",
		name: "Sophia Miller",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "sophia.miller@example.com",
		requestId: "REQ-1006",
		subject: "Feature Request",
		action: "view",
	},
	{
		id: "7",
		name: "David Wilson",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "david.wilson@example.com",
		requestId: "REQ-1007",
		subject: "Access Removal",
		action: "view",
	},
	{
		id: "8",
		name: "Olivia Martinez",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "olivia.martinez@example.com",
		requestId: "REQ-1008",
		subject: "Invoice Query",
		action: "view",
	},
	{
		id: "9",
		name: "Daniel Anderson",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "daniel.anderson@example.com",
		requestId: "REQ-1009",
		subject: "Refund Request",
		action: "view",
	},
	{
		id: "10",
		name: "Ava Thomas",
		image:
			"https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
		email: "ava.thomas@example.com",
		requestId: "REQ-1010",
		subject: "General Inquiry",
		action: "view",
	},
];

const SupportRequests = () => {
	const [search, setSearch] = useState<string>("");
	const [openDropdowns, setOpenDropdowns] = useState<{
		[key: string]: boolean;
	}>({});
	const router = useRouter();

	const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const clickedOutside = Object.keys(openDropdowns).every((id) => {
				const ref = dropdownRefs.current[id];
				return !ref || !ref.contains(event.target as Node);
			});

			if (clickedOutside) {
				setOpenDropdowns({});
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [openDropdowns]);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearch(event.target.value);
	};

	const toggleDropdown = (id: string) => {
		setOpenDropdowns((prev) => ({
			...prev,
			[id]: !prev[id],
		}));
	};

	const closeDropdown = (id: string) => {
		setOpenDropdowns((prev) => ({
			...prev,
			[id]: false,
		}));
	};

	const handleViewDetails = (row: RequestMeta) => {
		router.push(`/dashboard/support-request/${row.id}`);
	};

	const handleSolve = (row: RequestMeta) => {
		console.log("Solving request:", row);
		// Add your solve logic here
		closeDropdown(row.id);
	};

	const handleReject = (row: RequestMeta) => {
		console.log("Rejecting request:", row);
		// Add your reject logic here
		closeDropdown(row.id);
	};

	const columns = [
		{
			header: "User",
			accessor: "user",
			className: "pl-4 pr-12",
			render: (users: RequestMeta) => (
				<div className="flex items-center space-x-3">
					<Image
						src={users.image || "/placeholder.svg"}
						alt={users.name}
						width={32}
						height={32}
						className="w-8 h-8 rounded-full object-cover"
					/>
					<span>{users.name}</span>
				</div>
			),
		},
		{
			header: "Email",
			accessor: "email",
			className: "px-12",
		},
		{
			header: "Request ID",
			accessor: "requestId",
			className: "px-12",
		},
		{
			header: "Subject",
			accessor: "subject",
			className: "px-12",
		},
		{
			header: "Action",
			accessor: "action",
			className: "px-2",
			render: (row: RequestMeta) => {
				const isOpen = openDropdowns[row.id] || false;
				return (
					<div
						className="relative"
						ref={(el) => {
							dropdownRefs.current[row.id] = el;
						}}
					>
						<button
							onClick={() => toggleDropdown(row.id)}
							className="flex items-center space-x-1 px-3 py-2 rounded-[24px] bg-[var(--foundation-blue-light-hover,#DEE8FC)] text-[var(--Foundation-Blue-Normal,#2563EB)] font-outfit text-base font-normal leading-[140%]"
						>
							Action
							<ChevronDown className="w-4 h-4" />
						</button>

						{isOpen && (
							<div className="absolute right-0 mt-2 w-36 bg-white border rounded-lg shadow-lg z-10">
								<ul className="py-1 text-sm text-gray-700">
									<li>
										<button
											className="w-full text-left px-4 py-2 hover:bg-gray-100"
											onClick={() => handleViewDetails(row)}
										>
											View
										</button>
									</li>
									<li>
										<button
											className="w-full text-left px-4 py-2 hover:bg-gray-100"
											onClick={() => handleSolve(row)}
										>
											Solve
										</button>
									</li>
									<li>
										<button
											className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
											onClick={() => handleReject(row)}
										>
											Reject
										</button>
									</li>
								</ul>
							</div>
						)}
					</div>
				);
			},
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
			<Table columns={columns} data={requests} />
		</div>
	);
};

export default SupportRequests;
