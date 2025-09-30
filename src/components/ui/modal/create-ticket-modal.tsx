/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateTicketMutation } from "@/redux/features/adminDashbord/adminDashboardApi";

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  createTicket?: (data: {
    name: string;
    description: string;
    priorityLevel: string;
  }) => Promise<any>;
}

type PriorityLevel = "LOW" | "MEDIUM" | "HIGH";

export function CreateTicketModal({ isOpen, onClose }: CreateTicketModalProps) {
  const [createTicket] = useCreateTicketMutation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priorityLevel: "MEDIUM" as PriorityLevel,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      toast("Please fill in all required fields");

      return;
    }

    setIsLoading(true);

    try {
      if (createTicket) {
        await createTicket({
          name: formData.name,
          description: formData.description,
          priorityLevel: formData.priorityLevel,
        });
      }

      toast("Ticket created successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        priorityLevel: "MEDIUM",
      });

      onClose();
    } catch (error) {
      console.error("Create ticket error:", error);
      toast("Failed to create ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      name: "",
      description: "",
      priorityLevel: "MEDIUM",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Support Ticket</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ticket Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter ticket name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Provide detailed information about your issue"
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priorityLevel">Priority Level</Label>
            <Select
              value={formData.priorityLevel}
              onValueChange={(value: PriorityLevel) =>
                setFormData({ ...formData, priorityLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
