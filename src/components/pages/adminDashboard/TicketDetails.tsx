/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import type React from "react"

import { X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { IoSearch } from "react-icons/io5"

const TicketDetails = () => {
  type RequestMeta = {
    id: string
    name: string
    image: string
    email: string
    requestId: string
    subject: string
    action: string
    message: string
    timestamp: string
    status: "Pending" | "High priority" | "Resolved"
    department: string
    priority: "Low" | "Medium" | "High"
  }

  const requests: RequestMeta[] = [
    {
      id: "1",
      name: "John Doe",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "johndoe@example.com",
      requestId: "REQ-1001",
      subject: "Access Request",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "2",
      name: "Jane Smith",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "janesmith@example.com",
      requestId: "REQ-1002",
      subject: "Password Reset",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "3",
      name: "Michael Brown",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "michael.brown@example.com",
      requestId: "REQ-1003",
      subject: "Account Update",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "4",
      name: "Emily Johnson",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "emily.johnson@example.com",
      requestId: "REQ-1004",
      subject: "Data Export",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "5",
      name: "Chris Evans",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "chris.evans@example.com",
      requestId: "REQ-1005",
      subject: "Bug Report",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "6",
      name: "Sophia Miller",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "sophia.miller@example.com",
      requestId: "REQ-1006",
      subject: "Feature Request",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "7",
      name: "David Wilson",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "david.wilson@example.com",
      requestId: "REQ-1007",
      subject: "Access Removal",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "8",
      name: "Olivia Martinez",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "olivia.martinez@example.com",
      requestId: "REQ-1008",
      subject: "Invoice Query",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "9",
      name: "Daniel Anderson",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "daniel.anderson@example.com",
      requestId: "REQ-1009",
      subject: "Refund Request",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
    {
      id: "10",
      name: "Ava Thomas",
      image: "https://plus.unsplash.com/premium_photo-1690407617542-2f210cf20d7e?w=500&auto=format&fit=crop&q=60",
      email: "ava.thomas@example.com",
      requestId: "REQ-1010",
      subject: "General Inquiry",
      action: "view",
      message:
        "I need help to process the payment via my VISA card. Its returning failed payment after the checkout. I need to send out this campaign within today, can you please help ASAP.",
      timestamp: "24 May 2025, 11:00 am",
      status: "Pending",
      department: "Finance department",
      priority: "High",
    },
  ]

  const [search, setSearch] = useState<string>("")
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({})
  const [selectedRequest, setSelectedRequest] = useState<RequestMeta | null>(null)
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Object.keys(openDropdowns).every((id) => {
        const ref = dropdownRefs.current[id]
        return !ref || !ref.contains(event.target as Node)
      })

      if (clickedOutside) {
        setOpenDropdowns({})
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdowns])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
  }

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const closeDropdown = (id: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: false,
    }))
  }

  const handleViewDetails = (row: RequestMeta) => {
    setSelectedRequest(row)
    setIsDetailViewOpen(true)
    closeDropdown(row.id)
  }

  const handleSolve = (row: RequestMeta) => {
    console.log("Solving request:", row)
    setIsDetailViewOpen(false)
    closeDropdown(row.id)
  }

  const handleCancel = () => {
    setIsDetailViewOpen(false)
    setReplyText("")
  }

  const getStatusBadge = (status: string, priority: string) => {
    const badges = []

    if (status === "Pending") {
      badges.push(
        <span key="status" className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          Pending
        </span>,
      )
    }

    if (priority === "High") {
      badges.push(
        <span key="priority" className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
          • High priority
        </span>,
      )
    }

    return badges
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/2 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Support Requests</h1>
          <p className="text-sm text-gray-600 mb-4">Manage and respond to user support inquiries efficiently.</p>

          <div className="relative">
            <input
              value={search}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search requests..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <IoSearch className="absolute right-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {requests.map((request) => (
            <div
              key={request.id}
              onClick={() => handleViewDetails(request)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedRequest?.id === request.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
              }`}
            >
              <div className="flex items-start space-x-3">
                <Image
                  src={request.image || "/placeholder.svg"}
                  alt={request.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{request.name}</h3>
                    <span className="text-xs text-gray-500">{request.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-2">{request.subject}</p>
                  <div className="flex flex-wrap gap-2">
                    {getStatusBadge(request.status, request.priority)}
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {request.department}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDetailViewOpen && selectedRequest ? (
        <div className="w-1/2 bg-white flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">{selectedRequest.subject}</h2>
              <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {getStatusBadge(selectedRequest.status, selectedRequest.priority)}
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{selectedRequest.department}</span>
            </div>

            <div className="flex items-center space-x-3 mb-4">
              <Image
                src={selectedRequest.image || "/placeholder.svg"}
                alt={selectedRequest.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedRequest.name}</p>
                <p className="text-xs text-gray-500">{selectedRequest.timestamp}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">Hello sir, Hope your are well</p>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{selectedRequest.message}</p>
          </div>

          <div className="flex-1 p-6">
            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-3">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="Your avatar"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Reply to</span>
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{selectedRequest.email} ×</span>
                </div>
              </div>

              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write notes here"
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSolve(selectedRequest)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Solved
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-1/2 bg-gray-50 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg mb-2">Select a support request</p>
            <p className="text-sm">Choose a request from the list to view details</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default TicketDetails
