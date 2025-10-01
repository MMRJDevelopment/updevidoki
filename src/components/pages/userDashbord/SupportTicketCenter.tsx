/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Check,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription } from "@/components/ui/card/Card";
import { CreateTicketModal } from "@/components/ui/modal/create-ticket-modal";
import {
  useGetConversationDetailsQuery,
  useGetMyAllTicketsQuery,
  useGetUserTokenListQuery,
} from "@/redux/features/adminDashbord/adminDashboardApi";
import { useAppSelector } from "@/redux/hooks";

export interface Ticket {
  id: string;
  userId: string;
  name: string;
  replyMessage?: string; // Added replyMessage property
  description: string;
  priorityLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  notes?: string; // Added notes property
}

export function SupportTicketCenter() {
  const user = useAppSelector((state) => state.auth.user);
  const { data } = useGetMyAllTicketsQuery({
    id: user.id,
    page: 1,
    limit: 10,
  });
  const mockTickets: Ticket[] = data?.data?.data || [];
  console.log(user, "user from support ticket center");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(
    mockTickets[0] || null
  );

  const [editingNotes, setEditingNotes] = useState("");

  const { data: conversationDetails } = useGetConversationDetailsQuery({
    id: selectedTicket?.id,
  });

  console.log(selectedTicket, "selectedTicket");

  console.log(conversationDetails?.data?.data, "conversation details");
  const messages = conversationDetails?.data;
  const handleUpdateTicketStatus = (
    ticketId: string,
    status: Ticket["status"]
  ) => {
    mockTickets.map((ticket) =>
      ticket.id === ticketId
        ? { ...ticket, status, updatedAt: new Date().toLocaleString() }
        : ticket
    );
  };

  const handleUpdateNotes = (ticketId: string, notes: string) => {
    mockTickets.map((ticket) =>
      ticket.id === ticketId
        ? { ...ticket, notes, updatedAt: new Date().toLocaleString() }
        : ticket
    );
    setSelectedTicket((prev) => (prev ? { ...prev, notes } : null));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CLOSED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "OPEN":
        return <Clock className="h-4 w-4" />;
      case "IN_PROGRESS":
        return <AlertCircle className="h-4 w-4" />;
      case "RESOLVED":
        return <CheckCircle className="h-4 w-4" />;
      case "CLOSED":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getUserInitials = (userId: string) => {
    return userId.slice(0, 2).toUpperCase();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-2xl font-semibold">Chat Support</h1>
          <Badge
            variant="secondary"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Ticket
          </Badge>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create new ticket
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side - Tickets List */}
        <div className="w-1/2 border-r overflow-y-auto">
          <div className="p-4 space-y-4">
            {mockTickets?.map((ticket) => (
              <Card
                key={ticket.id}
                className={`cursor-pointer transition-all ${
                  selectedTicket?.id === ticket.id
                    ? "ring-2 ring-blue-500 shadow-md"
                    : "hover:shadow-md"
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-gray-200 text-gray-700">
                        {getUserInitials(ticket.userId)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {ticket.name}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {ticket.createdAt}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                        {ticket.description}
                      </p>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                          className={`text-xs ${getStatusColor(ticket.status)}`}
                        >
                          {ticket.status.charAt(0).toUpperCase() +
                            ticket.status.slice(1).toLowerCase()}
                        </Badge>
                        <Badge
                          className={`text-xs ${getPriorityColor(
                            ticket.priorityLevel
                          )}`}
                        >
                          {ticket.priorityLevel.charAt(0).toUpperCase() +
                            ticket.priorityLevel.slice(1).toLowerCase()}{" "}
                          priority
                        </Badge>
                      </div>
                    </div>

                    <MessageCircle className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Side - Ticket Details */}
        <div className="w-1/2 flex flex-col">
          {selectedTicket ? (
            <>
              {/* Ticket Header */}
              <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white rounded-xl overflow-hidden border-2 border-blue-500 shadow-lg">
                    {/* Header */}
                    <div className="bg-blue-50 p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                            AD
                          </AvatarFallback>
                        </Avatar>
                        <h1 className="text-xl font-semibold text-gray-900">
                          {messages?.user?.firstName}
                        </h1>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-0 px-3 py-1">
                          Pending
                        </Badge>
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 px-3 py-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                          High priority
                        </Badge>
                      </div>
                    </div>

                    {/* Conversation */}
                    <div className="p-6 space-y-6 bg-white">
                      {/* User message */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                              AD
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {selectedTicket.userId}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(
                                selectedTicket.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="pl-0 mt-3">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {selectedTicket.description}
                          </p>
                        </div>
                      </div>

                      {/* Reply bubble */}
                      {selectedTicket.replyMessage && (
                        <div className="flex gap-3 items-start">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-gray-200 text-gray-700 text-sm">
                              AD
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-blue-50 rounded-2xl rounded-tl-sm p-4 text-gray-800 max-w-xl">
                            <p className="leading-relaxed">
                              {selectedTicket.replyMessage}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Action */}
                    {selectedTicket.status === "RESOLVED" && (
                      <div className="bg-blue-600 text-white text-center py-4 font-medium flex items-center justify-center gap-2 cursor-default">
                        <Check className="w-5 h-5" strokeWidth={3} />
                        <span>Ticket solved</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Notes */}
              {/* <div className="flex-1 overflow-y-auto p-6">
                <h4 className="font-medium mb-4">Notes</h4>

                <div className="space-y-4">
                  {selectedTicket.notes ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="text-sm whitespace-pre-wrap">
                        {selectedTicket.notes}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No notes added yet
                    </p>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Add/Edit Notes:
                    </label>
                    <textarea
                      value={editingNotes || selectedTicket.notes || ""}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Add notes about this ticket..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                    />
                    <Button
                      onClick={() => {
                        handleUpdateNotes(
                          selectedTicket.id,
                          editingNotes || selectedTicket.notes || ""
                        );
                        setEditingNotes("");
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>
              </div> */}
              {/* Actions */}
              {/* <div className="flex-shrink-0 p-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    <Button
                      onClick={() => setIsCreateModalOpen(true)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create new ticket
                    </Button>
                  </div>

                  {selectedTicket.status === "RESOLVED" && (
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Ticket resolved
                    </Button>
                  )}
                </div>
              </div> */}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a ticket to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
