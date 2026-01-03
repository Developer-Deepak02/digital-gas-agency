"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, X, Loader2, Eye } from "lucide-react"; // Import Eye
import { useRouter } from "next/navigation";
import OrderDetailsModal from "./OrderDetailsModal"; // Import Modal

export default function RequestTable({ bookings }: { bookings: any[] }) {
	const [loadingId, setLoadingId] = useState<string | null>(null);

	// New State for Modal
	const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

	const router = useRouter();
	const supabase = createClient();

	const handleAction = async (
		bookingId: string,
		userId: string,
		action: "approved" | "rejected"
	) => {
		setLoadingId(bookingId);
		try {
			// 1. Update Booking Status
			const { error: updateError } = await supabase
				.from("bookings")
				.update({
					status: action,
					delivery_date:
						action === "approved" ? new Date().toISOString() : null,
				})
				.eq("id", bookingId);

			if (updateError) throw updateError;

			// 2. If REJECTED, Refund the Quota
			if (action === "rejected") {
				const { data: profile } = await supabase
					.from("profiles")
					.select("quota_remaining")
					.eq("id", userId)
					.single();
				if (profile) {
					await supabase
						.from("profiles")
						.update({ quota_remaining: profile.quota_remaining + 1 })
						.eq("id", userId);
				}
			}
			router.refresh();
		} catch (error) {
			console.error(error);
			alert("Failed to update request");
		} finally {
			setLoadingId(null);
		}
	};

	return (
		<>
			{/* RENDER MODAL IF ORDER SELECTED */}
			{selectedOrder && (
				<OrderDetailsModal
					order={selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			)}

			{/* FIX: Added overflow-x-auto for horizontal scroll on mobile */}
			<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50/50">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								User
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								Date
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								Payment
							</th>
							<th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{bookings.map((booking) => (
							<tr key={booking.id} className="hover:bg-gray-50/50">
								<td className="px-6 py-4">
									<div className="text-sm font-medium text-gray-900">
										{booking.profiles?.full_name || "Unknown User"}
									</div>
									<div className="text-xs text-gray-500">
										{booking.profiles?.email}
									</div>
								</td>
								<td className="px-6 py-4 text-sm text-gray-500">
									{new Date(booking.created_at).toLocaleDateString()}
								</td>
								<td className="px-6 py-4 text-sm text-gray-500">
									{booking.payment_mode}
								</td>
								<td className="px-6 py-4 text-right">
									<div className="flex justify-end gap-2">
										{/* VIEW DETAILS BUTTON */}
										<button
											onClick={() => setSelectedOrder(booking)}
											className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md border border-transparent hover:border-blue-200 transition-all"
											title="View Details"
										>
											<Eye size={16} />
										</button>

										<div className="w-px h-6 bg-gray-200 mx-1"></div>

										{/* ACTION BUTTONS */}
										<button
											onClick={() =>
												handleAction(booking.id, booking.user_id, "approved")
											}
											disabled={!!loadingId}
											className="flex items-center gap-1 rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100 border border-green-200 transition-colors"
										>
											{loadingId === booking.id ? (
												<Loader2 className="animate-spin h-3 w-3" />
											) : (
												<Check size={14} />
											)}
											Approve
										</button>
										<button
											onClick={() =>
												handleAction(booking.id, booking.user_id, "rejected")
											}
											disabled={!!loadingId}
											className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
										>
											{loadingId === booking.id ? (
												<Loader2 className="animate-spin h-3 w-3" />
											) : (
												<X size={14} />
											)}
											Reject
										</button>
									</div>
								</td>
							</tr>
						))}
						{bookings.length === 0 && (
							<tr>
								<td colSpan={4} className="p-8 text-center text-gray-500">
									No pending requests.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
