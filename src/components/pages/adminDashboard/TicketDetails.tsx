/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import type React from "react";

import { X, Send, Paperclip, Clock, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoSearch } from "react-icons/io5";
import { usePathname } from "next/navigation";
import {
  useGetSingleUserTicketQuery,
  useGetUserTokenListQuery,
  useCreateMassagesReplyMutation,
  useUpdateTockenStatusMutation,
} from "@/redux/features/adminDashbord/adminDashboardApi";

const TicketDetails = () => {
  const path = usePathname();
  const userId = path.split("/").pop();
  const [search, setSearch] = useState<string>("");
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { data } = useGetUserTokenListQuery({
    userId: userId,
    page: 1,
    limit: 10,
  });
  const userTickets = data?.data?.data || [];
  const id = selectedRequest?.id;
  const { data: ticketData } = useGetSingleUserTicketQuery(id);

  const [createMassagesReply, { isLoading: isReplying }] =
    useCreateMassagesReplyMutation();
  const [updateTockenStatus, { isLoading: isUpdatingStatus }] =
    useUpdateTockenStatusMutation();

  console.log(ticketData?.data, "data in selected ticket details");
  const selectedData = ticketData?.data;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleViewDetails = (request: any) => {
    setSelectedRequest(request);
    setIsDetailViewOpen(true);
    setSelectedStatus(request.status);
    // Initialize chat messages with the initial request message
    setChatMessages([
      {
        id: `initial-${request.id}`,
        text: request.description,
        sender: "user",
        timestamp: request.createdAt,
        senderName: `${request.user?.firstName} ${request.user?.lastName}`,
        senderImage: request.user?.profileImage,
      },
    ]);

    // Load reply messages if they exist
    if (request.replyMessage) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `reply-${request.id}`,
          text: request.replyMessage,
          sender: "admin",
          timestamp: request.updatedAt,
          senderName: "Support Agent",
        },
      ]);
    }
  };

  const handleCancel = () => {
    setIsDetailViewOpen(false);
    setMessage("");
    setSelectedRequest(null);
    setChatMessages([]);
  };
  const handleSendMessage = async () => {
    if (message.trim() && selectedRequest) {
      try {
        // Send message to backend
        const result = await createMassagesReply({
          id: selectedData?.userId,
          replyMessage: message,
        }).unwrap();

        // Add message to chat
        const newMessage = {
          id: Date.now(),
          text: message,
          sender: "admin",
          timestamp: new Date().toISOString(),
          senderName: "Support Agent",
        };
        setChatMessages([...chatMessages, newMessage]);
        setMessage("");

        console.log("Message sent successfully:", result);
      } catch (error) {
        console.error("Failed to send message:", error);
        // Optionally show error notification to user
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (selectedRequest) {
      try {
        await updateTockenStatus({
          id: selectedData?.id,
          status: newStatus,
        }).unwrap();

        setSelectedStatus(newStatus);
        // Update the selected request status
        setSelectedRequest({
          ...selectedRequest,
          status: newStatus,
        });

        console.log("Status updated successfully");
      } catch (error) {
        console.error("Failed to update status:", error);
        // Optionally show error notification to user
      }
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string, priority: string) => {
    const statusColors: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      RESOLVED: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded-full font-medium ${
          statusColors[status] || statusColors.PENDING
        }`}
      >
        {status}
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      HIGH: "bg-red-100 text-red-700 border-red-200",
      MEDIUM: "bg-orange-100 text-orange-700 border-orange-200",
      LOW: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return colors[priority] || colors.LOW;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Request List */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">
            Support Requests
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userTickets.length} active tickets
          </p>

          <div className="relative mt-4">
            <input
              value={search}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search requests..."
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <IoSearch className="absolute right-3 top-2.5 text-gray-400 text-xl" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {userTickets?.map((request: any) => (
            <div
              key={request.id}
              onClick={() => handleViewDetails(request)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all ${
                selectedRequest?.id === request.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium flex-shrink-0">
                  {request.user?.profileImage ? (
                    <Image
                      src={request.user.profileImage}
                      alt={request.user?.firstName || "User"}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    request.user?.firstName?.charAt(0).toUpperCase() || "U"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + Date */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {request.user?.firstName} {request.user?.lastName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(request.createdAt)}
                    </span>
                  </div>

                  {/* Request Name */}
                  <p className="text-sm font-medium text-gray-700 mb-1 truncate">
                    {request.name}
                  </p>

                  {/* Description */}
                  <p className="text-sm text-gray-600 truncate mb-2">
                    {request.description}
                  </p>

                  {/* Status + Priority */}
                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status, request.priorityLevel)}
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium border ${getPriorityColor(
                        request.priorityLevel
                      )}`}
                    >
                      {request.priorityLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col">
        {isDetailViewOpen && selectedRequest ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                  {selectedData?.user?.profileImage ? (
                    <Image
                      src={selectedData?.user.profileImage}
                      alt={selectedData?.user?.firstName || "User"}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    selectedData?.user?.firstName?.charAt(0).toUpperCase() ||
                    "U"
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedData?.user?.firstName}{" "}
                    {selectedData?.user?.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{selectedData?.user?.email}</span>
                    {selectedData?.user?.isVerified && (
                      <span className="text-green-600 text-xs">✓ Verified</span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Request Details Card */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="max-w-4xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {selectedData?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {selectedData?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium border ${getPriorityColor(
                        selectedData?.priorityLevel
                      )}`}
                    >
                      {selectedData?.priorityLevel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Created: {formatDate(selectedData?.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Ticket ID: {selectedData?.id.slice(-8)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-4">
                {chatMessages.map((msg) =>
                  msg.sender === "user" ? (
                    // User Message (Left)
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {msg.senderImage ? (
                          <Image
                            src={msg.senderImage}
                            alt={msg.senderName}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          msg.senderName?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {msg.senderName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{msg.text}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Admin Message (Right)
                    <div
                      key={msg.id}
                      className="flex items-start gap-3 justify-end"
                    >
                      <div className="flex-1 flex justify-end">
                        <div className="bg-blue-500 text-white rounded-lg shadow-sm p-4 max-w-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              {msg.senderName}
                            </span>
                            <span className="text-xs text-blue-100 ml-3">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{msg.text}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        A
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="max-w-4xl mx-auto flex items-end gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={isReplying || !message.trim()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReplying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleStatusChange("RESOLVED")}
                  className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Shlove
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <IoSearch className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Request Selected
              </h3>
              <p className="text-sm text-gray-500">
                Select a support request to view details and chat
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
