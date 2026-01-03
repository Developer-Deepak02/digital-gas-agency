"use client";

import { useState } from "react";
import {
	Calendar,
	CreditCard,
	Ban,
	CheckCircle2,
	Clock,
	Hash,
	Eye,
	Truck,
} from "lucide-react";
import UserOrderModal from "./UserOrderModal";

export default function UserHistoryTable({ bookings }: { bookings: any[] }) {
	const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

	const getStatusStyle = (status: string) => {
		switch (status) {
			case "delivered":
				return {
					color: "text-green-700 bg-green-50 border-green-200",
					icon: <CheckCircle2 size={16} />,
					label: "Delivered",
				};
			case "approved":
				return {
					color: "text-blue-700 bg-blue-50 border-blue-200",
					icon: <Truck size={16} />,
					label: "Out for Delivery",
				};
			case "rejected":
				return {
					color: "text-red-700 bg-red-50 border-red-200",
					icon: <Ban size={16} />,
					label: "Rejected",
				};
			default:
				return {
					color: "text-yellow-700 bg-yellow-50 border-yellow-200",
					icon: <Clock size={16} />,
					label: "Order Placed",
				};
		}
	};

	return (
		<>
			{selectedOrder && (
				<UserOrderModal
					order={selectedOrder}
					onClose={() => setSelectedOrder(null)}
				/>
			)}

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50/50">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								Order ID
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								Date
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								Status
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								Amount
							</th>
							<th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">
								Track
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{bookings.map((booking) => {
							const style = getStatusStyle(booking.status);
							return (
								<tr
									key={booking.id}
									className="hover:bg-gray-50/50 transition-colors"
								>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2 text-sm font-mono text-gray-600">
											<Hash size={14} className="text-gray-400" />{" "}
											{booking.id.slice(0, 8)}...
										</div>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
											<Calendar size={16} className="text-gray-400" />
											{new Date(booking.created_at).toLocaleDateString()}
										</div>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${style.color}`}
										>
											{style.icon} {style.label}
										</span>
									</td>
									<td className="px-6 py-4 text-sm font-semibold text-gray-900">
										₹{booking.amount}
									</td>
									<td className="px-6 py-4 text-right">
										<button
											onClick={() => setSelectedOrder(booking)}
											className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 rounded-md text-xs font-medium transition-colors"
										>
											<Eye size={14} /> View
										</button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</>
	);
}
