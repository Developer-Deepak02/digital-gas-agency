"use client";

import {
	X,
	User,
	Phone,
	MapPin,
	Mail,
	Calendar,
	CreditCard,
} from "lucide-react";

type OrderDetails = {
	id: string;
	amount: number;
	status: string;
	payment_mode: string;
	created_at: string;
	profiles: {
		full_name: string;
		email: string;
		mobile?: string;
		address?: string;
	};
};

export default function OrderDetailsModal({
	order,
	onClose,
}: {
	order: OrderDetails;
	onClose: () => void;
}) {
	if (!order) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
			{/* FIX: Changed max-h to 85vh for better mobile browser support */}
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
				{/* Header */}
				<div className="bg-slate-900 p-4 flex justify-between items-center text-white shrink-0">
					<h3 className="font-bold text-lg flex items-center gap-2">
						Order Details
					</h3>
					<button
						onClick={onClose}
						className="hover:bg-white/20 p-1 rounded-full transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Scrollable Content - FIX: Responsive padding */}
				<div className="p-4 sm:p-6 overflow-y-auto space-y-6">
					{/* Section 1: Customer Info */}
					<div>
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
							Customer Information
						</h4>
						<div className="bg-gray-50 p-4 rounded-lg space-y-3 border border-gray-100">
							<div className="flex items-start gap-3">
								<User size={18} className="text-gray-400 mt-0.5" />
								<div>
									<p className="text-sm font-semibold text-gray-900">
										{order.profiles?.full_name || "Unknown"}
									</p>
									<p className="text-xs text-gray-500">Customer Name</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Mail size={18} className="text-gray-400 mt-0.5" />
								<div>
									<p className="text-sm font-medium text-gray-900 break-all">
										{order.profiles?.email}
									</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Phone size={18} className="text-gray-400 mt-0.5" />
								<div>
									<p className="text-sm font-medium text-gray-900">
										{order.profiles?.mobile || "No mobile provided"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Section 2: Delivery Address */}
					<div>
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
							Delivery Address
						</h4>
						<div className="bg-orange-50 p-4 rounded-lg border border-orange-100 flex items-start gap-3">
							<MapPin
								size={20}
								className="text-orange-600 mt-0.5 flex-shrink-0"
							/>
							<div>
								<p className="text-sm font-medium text-gray-900 leading-relaxed">
									{order.profiles?.address ||
										"No address provided. Please contact customer."}
								</p>
							</div>
						</div>
					</div>

					{/* Section 3: Order Summary */}
					<div>
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
							Order Summary
						</h4>
						{/* FIX: Stacks vertically on very small screens */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="border border-gray-200 p-3 rounded-lg">
								<div className="flex items-center gap-2 text-gray-500 mb-1">
									<Calendar size={14} /> <span className="text-xs">Date</span>
								</div>
								<p className="font-semibold text-gray-900 text-sm">
									{new Date(order.created_at).toLocaleDateString()}
								</p>
							</div>
							<div className="border border-gray-200 p-3 rounded-lg">
								<div className="flex items-center gap-2 text-gray-500 mb-1">
									<CreditCard size={14} />{" "}
									<span className="text-xs">Payment</span>
								</div>
								<p className="font-semibold text-gray-900 text-sm">
									{order.payment_mode}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
					<button
						onClick={onClose}
						className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors w-full sm:w-auto"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
}
