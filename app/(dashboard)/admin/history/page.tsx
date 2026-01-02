import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";

export default async function AdminHistoryPage() {
	const supabase = await createClient();

	// 1. Verify Admin Access
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profile?.role !== "admin") redirect("/user/book");

	// 2. Fetch ALL bookings with User Details
	const { data: bookings } = await supabase
		.from("bookings")
		.select(
			`
      *,
      profiles (full_name, email)
    `
		)
		.order("created_at", { ascending: false });

	// 3. Calculate Stats
	const stats = {
		total: bookings?.length || 0,
		approved: bookings?.filter((b) => b.status === "approved").length || 0,
		rejected: bookings?.filter((b) => b.status === "rejected").length || 0,
		pending: bookings?.filter((b) => b.status === "pending").length || 0,
	};

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Total Booking History
				</h1>
				<p className="text-gray-500">
					Overview of all transactions and their current status.
				</p>
			</div>

			{/* STATS CARDS */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
					<div className="flex items-center gap-2 text-gray-500 mb-2">
						<FileText size={18} />{" "}
						<span className="text-sm font-medium">Total Requests</span>
					</div>
					<p className="text-2xl font-bold text-gray-900">{stats.total}</p>
				</div>
				<div className="p-4 bg-green-50 border border-green-100 rounded-xl shadow-sm">
					<div className="flex items-center gap-2 text-green-700 mb-2">
						<CheckCircle2 size={18} />{" "}
						<span className="text-sm font-medium">Approved</span>
					</div>
					<p className="text-2xl font-bold text-green-800">{stats.approved}</p>
				</div>
				<div className="p-4 bg-red-50 border border-red-100 rounded-xl shadow-sm">
					<div className="flex items-center gap-2 text-red-700 mb-2">
						<XCircle size={18} />{" "}
						<span className="text-sm font-medium">Rejected</span>
					</div>
					<p className="text-2xl font-bold text-red-800">{stats.rejected}</p>
				</div>
				<div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl shadow-sm">
					<div className="flex items-center gap-2 text-yellow-700 mb-2">
						<Clock size={18} />{" "}
						<span className="text-sm font-medium">Pending</span>
					</div>
					<p className="text-2xl font-bold text-yellow-800">{stats.pending}</p>
				</div>
			</div>

			{/* HISTORY TABLE */}
			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50/50">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
								Customer
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
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{bookings?.map((booking) => (
							<tr
								key={booking.id}
								className="hover:bg-gray-50/50 transition-colors"
							>
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
									<span className="text-xs text-gray-400 block">
										{new Date(booking.created_at).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</td>
								<td className="px-6 py-4">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${
											booking.status === "approved"
												? "bg-green-100 text-green-800"
												: booking.status === "rejected"
												? "bg-red-100 text-red-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{booking.status}
									</span>
								</td>
								<td className="px-6 py-4 text-sm font-semibold text-gray-900">
									₹{booking.amount}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
