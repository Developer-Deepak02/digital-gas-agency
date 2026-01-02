import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Calendar, Clock, CreditCard, Ban, CheckCircle2 } from "lucide-react";

export default async function HistoryPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	// Fetch bookings sorted by newest first
	const { data: bookings } = await supabase
		.from("bookings")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	// Helper to get status color/icon
	const getStatusStyle = (status: string) => {
		switch (status) {
			case "approved":
				return {
					color: "text-green-700 bg-green-50 border-green-200",
					icon: <CheckCircle2 size={16} />,
				};
			case "rejected":
				return {
					color: "text-red-700 bg-red-50 border-red-200",
					icon: <Ban size={16} />,
				};
			default:
				return {
					color: "text-yellow-700 bg-yellow-50 border-yellow-200",
					icon: <Clock size={16} />,
				};
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Booking History
				</h1>
				<p className="text-gray-500">
					Track the status of your previous cylinder requests.
				</p>
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50/50">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Date
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Status
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Payment
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
								Amount
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{bookings?.map((booking) => {
							const style = getStatusStyle(booking.status);
							return (
								<tr
									key={booking.id}
									className="hover:bg-gray-50/50 transition-colors"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
											<Calendar size={16} className="text-gray-400" />
											{new Date(booking.created_at).toLocaleDateString(
												"en-IN",
												{
													day: "numeric",
													month: "short",
													year: "numeric",
												}
											)}
										</div>
										<div className="text-xs text-gray-500 pl-6">
											{new Date(booking.created_at).toLocaleTimeString(
												"en-IN",
												{
													hour: "2-digit",
													minute: "2-digit",
												}
											)}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border ${style.color}`}
										>
											{style.icon}
											{booking.status.charAt(0).toUpperCase() +
												booking.status.slice(1)}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										<div className="flex items-center gap-2">
											<CreditCard size={16} className="text-gray-400" />
											{booking.payment_mode}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
										₹{booking.amount}
									</td>
								</tr>
							);
						})}

						{(!bookings || bookings.length === 0) && (
							<tr>
								<td
									colSpan={4}
									className="px-6 py-12 text-center text-gray-500"
								>
									<div className="flex flex-col items-center gap-2">
										<Clock className="h-8 w-8 text-gray-300" />
										<p>No bookings found yet.</p>
									</div>
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
