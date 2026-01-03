import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import HistoryTable from "@/components/admin/HistoryTable"; // Import new component

export default async function AdminHistoryPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	// Fetch ALL bookings with FULL details (including address/mobile)
	const { data: bookings } = await supabase
		.from("bookings")
		.select(`*, profiles (full_name, email, mobile, address)`)
		.order("created_at", { ascending: false });

	// Stats Calculation
	const stats = {
		total: bookings?.length || 0,
		delivered: bookings?.filter((b) => b.status === "delivered").length || 0,
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
				<div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 bg-gray-100 rounded-lg">
							<FileText size={16} className="text-gray-600" />
						</div>
						<span className="text-xs font-medium text-gray-500">
							Total Orders
						</span>
					</div>
					<p className="text-2xl font-bold text-gray-900">{stats.total}</p>
				</div>
				<div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 bg-green-50 rounded-lg">
							<CheckCircle2 size={16} className="text-green-600" />
						</div>
						<span className="text-xs font-medium text-green-600">
							Delivered
						</span>
					</div>
					<p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
				</div>
				<div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 bg-yellow-50 rounded-lg">
							<Clock size={16} className="text-yellow-600" />
						</div>
						<span className="text-xs font-medium text-yellow-600">Pending</span>
					</div>
					<p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
				</div>
				<div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2 bg-red-50 rounded-lg">
							<XCircle size={16} className="text-red-600" />
						</div>
						<span className="text-xs font-medium text-red-600">Rejected</span>
					</div>
					<p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
				</div>
			</div>

			{/* NEW INTERACTIVE TABLE */}
			<HistoryTable bookings={bookings || []} />
		</div>
	);
}
