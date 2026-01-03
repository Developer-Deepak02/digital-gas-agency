"use client";

import { useState } from "react";
import {
	Eye,
	CheckCircle2,
	Truck,
	Loader2,
	Hash,
	AlertTriangle,
	X,
} from "lucide-react";
import OrderDetailsModal from "./OrderDetailsModal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HistoryTable({ bookings }: { bookings: any[] }) {
	const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

	// State for the Custom Confirmation Modal
	const [confirmId, setConfirmId] = useState<string | null>(null);

	const [loadingId, setLoadingId] = useState<string | null>(null);
	const supabase = createClient();
	const router = useRouter();

	// 1. Trigger the Modal
	const initiateDeliveryMark = (id: string) => {
		setConfirmId(id);
	};

	// 2. Actual Logic (Runs only after confirmation)
	const processDelivery = async () => {
		if (!confirmId) return;

		setLoadingId(confirmId);
		setConfirmId(null); // Close modal immediately

		const { error } = await supabase
			.from("bookings")
			.update({ status: "delivered" })
			.eq("id", confirmId);

		if (error) {
			console.error(error);
			alert("Error: " + error.message);
		} else {
			router.refresh();
		}
		setLoadingId(null);
	};

	return (
		<>
			{/* 1. ORDER DETAILS MODAL */}
			{selectedOrder && (
				<OrderDetailsModal
					order={selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			)}

			{/* 2. CUSTOM CONFIRMATION MODAL */}
			{confirmId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
					<div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 text-center scale-100 transform transition-all">
						{/* Icon */}
						<div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<Truck size={28} />
						</div>

						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Confirm Delivery
						</h3>
						<p className="text-gray-500 text-sm mb-6">
							Are you sure you want to mark this order as{" "}
							<strong>Delivered</strong>? This action updates the user's status
							immediately.
						</p>

						{/* Buttons */}
						<div className="flex gap-3">
							<button
								onClick={() => setConfirmId(null)}
								className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={processDelivery}
								className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2"
							>
								Yes, Confirm
							</button>
						</div>
					</div>
				</div>
			)}

			{/* 3. THE TABLE - Updated for Mobile Scrolling */}
			<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50/50">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Order ID
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Customer
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Status
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Amount
							</th>
							<th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{bookings.map((booking) => (
							<tr key={booking.id} className="hover:bg-gray-50/50">
								<td className="px-6 py-4 whitespace-nowrap">
									<span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-600">
										<Hash size={12} /> {booking.id.slice(0, 8)}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{booking.profiles?.full_name}
									</div>
									<div className="text-xs text-gray-500">
										{booking.profiles?.email}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border
                    ${
											booking.status === "delivered"
												? "bg-green-100 text-green-800 border-green-200"
												: booking.status === "approved"
												? "bg-blue-100 text-blue-800 border-blue-200"
												: booking.status === "rejected"
												? "bg-red-100 text-red-800 border-red-200"
												: "bg-yellow-100 text-yellow-800 border-yellow-200"
										}`}
									>
										{booking.status === "approved"
											? "Out for Delivery"
											: booking.status}
									</span>
								</td>
								<td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
									₹{booking.amount}
								</td>
								<td className="px-6 py-4 text-right whitespace-nowrap">
									<div className="flex justify-end gap-2 items-center">
										{/* Mark Delivered Button (Trigger Modal) */}
										{booking.status === "approved" && (
											<button
												onClick={() => initiateDeliveryMark(booking.id)}
												disabled={!!loadingId}
												className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white hover:bg-green-700 rounded-md text-xs font-medium transition-colors shadow-sm disabled:opacity-50"
											>
												{loadingId === booking.id ? (
													<Loader2 className="animate-spin h-3 w-3" />
												) : (
													<CheckCircle2 size={14} />
												)}
												Mark Delivered
											</button>
										)}

										{/* View Details */}
										<button
											onClick={() => setSelectedOrder(booking)}
											className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-200 transition-all"
											title="View Full Details"
										>
											<Eye size={16} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
