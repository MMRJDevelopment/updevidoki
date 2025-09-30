"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { createPortal } from "react-dom";
import { Button } from "../buttons/Button";

type ModalType = "default" | "info" | "success" | "warning" | "error";
type ModalSize = "sm" | "md" | "lg" | "xl";

interface AntDesignModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: React.ReactNode;
	onCancel?: () => void;
	onContinue?: () => void;
	cancelText?: string;
	continueText?: string;
	type?: ModalType;
	size?: ModalSize;
	loading?: boolean;
	closable?: boolean;
	maskClosable?: boolean;
	centered?: boolean;
	destroyOnClose?: boolean;
}

const typeIcons = {
	default: null,
	info: <Info className="w-5 h-5 text-blue-500" />,
	success: <CheckCircle className="w-5 h-5 text-green-500" />,
	warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
	error: <AlertCircle className="w-5 h-5 text-red-500" />,
};

const sizeClasses = {
	sm: "max-w-sm",
	md: "max-w-md",
	lg: "max-w-lg",
	xl: "max-w-xl",
};

export function AntDesignModal({
	isOpen,
	onClose,
	title,
	children,
	onCancel,
	onContinue,
	cancelText = "Cancel",
	continueText = "Continue",
	type = "default",
	size = "md",
	loading = false,
	closable = true,
	maskClosable = true,
	centered = true,
	destroyOnClose = false,
}: AntDesignModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (isOpen) {
			previousActiveElement.current = document.activeElement as HTMLElement;
			modalRef.current?.focus();

			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape" && closable) {
					onClose();
				}

				// Trap focus within modal
				if (e.key === "Tab") {
					const focusableElements = modalRef.current?.querySelectorAll(
						'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
					);
					if (focusableElements && focusableElements.length > 0) {
						const firstElement = focusableElements[0] as HTMLElement;
						const lastElement = focusableElements[
							focusableElements.length - 1
						] as HTMLElement;

						if (e.shiftKey && document.activeElement === firstElement) {
							e.preventDefault();
							lastElement.focus();
						} else if (!e.shiftKey && document.activeElement === lastElement) {
							e.preventDefault();
							firstElement.focus();
						}
					}
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "hidden";

			return () => {
				document.removeEventListener("keydown", handleKeyDown);
				document.body.style.overflow = "unset";
				if (previousActiveElement.current) {
					previousActiveElement.current.focus();
				}
			};
		}
	}, [isOpen, closable, onClose]);

	if (!isOpen && destroyOnClose) return null;
	if (!isOpen) return <div style={{ display: "none" }} />;

	const modalContent = (
		<div
			className={`fixed inset-0 z-50 flex ${
				centered ? "items-center" : "items-start pt-16"
			} justify-center transition-all duration-300 ${
				isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div
				className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
					isOpen ? "opacity-100" : "opacity-0"
				}`}
				onClick={maskClosable ? onClose : undefined}
			/>

			<div
				ref={modalRef}
				tabIndex={-1}
				className={`relative bg-white rounded-lg shadow-2xl w-full ${
					sizeClasses[size]
				} mx-4 transform transition-all duration-300 ${
					isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
				} focus:outline-none`}
				style={{
					boxShadow:
						"0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
				}}
			>
				<div className="flex items-center justify-between p-6 border-b border-gray-100">
					<div className="flex items-center gap-3">
						{typeIcons[type]}
						<h2
							id="modal-title"
							className="text-lg font-semibold text-gray-900"
						>
							{title}
						</h2>
					</div>
					{closable && (
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
							aria-label="Close modal"
						>
							<X size={20} />
						</button>
					)}
				</div>

				<div className="p-6 text-gray-600 text-sm leading-relaxed">
					{children}
				</div>

				<div className="flex justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
					<Button
						variant="outline"
						onClick={onCancel || onClose}
						disabled={loading}
						className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{cancelText}
					</Button>
					<Button
						onClick={onContinue || onClose}
						disabled={loading}
						className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative"
					>
						{loading && (
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
							</div>
						)}
						<span className={loading ? "opacity-0" : "opacity-100"}>
							{continueText}
						</span>
					</Button>
				</div>
			</div>
		</div>
	);

	return typeof window !== "undefined"
		? createPortal(modalContent, document.body)
		: modalContent;
}
