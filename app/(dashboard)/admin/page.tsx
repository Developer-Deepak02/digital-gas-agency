import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
	Users,
	FileText,
	Clock,
	TrendingUp,
	ArrowRight,
	CheckCircle2,
	Megaphone,
	Bell,
} from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";
import ExportButton from "@/components/admin/ExportButton";

export default async function AdminDashboardHome() {
	const supabase = await createClient();

	// 1. Verify Admin
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();
	if (profile?.role !== "admin") redirect("/user");

	// 2. Fetch Data
	// FIX: Added 'payment_mode' and 'profiles(full_name)' for the Export Report
	const { data: bookings } = await supabase
		.from("bookings")
		.select("id, status, created_at, amount, payment_mode, profiles(full_name)")
		.order("created_at", { ascending: true });

	const { count: userCount } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.eq("role", "user");

	// NEW: Fetch recent announcements
	const { data: announcements } = await supabase
		.from("notifications")
		.select("*")
		.eq("is_active", true)
		.order("created_at", { ascending: false })
		.limit(3);

	// 3. Stats Calculation
	const totalRevenue =
		bookings?.reduce(
			(acc, curr) =>
				acc +
				(curr.status === "approved" || curr.status === "delivered"
					? curr.amount
					: 0),
			0
		) || 0;

	const pendingCount =
		bookings?.filter((b) => b.status === "pending").length || 0;

	const deliveredCount =
		bookings?.filter((b) => b.status === "delivered").length || 0;

	// 4. Chart Data Processing
	const chartDataMap = new Map();
	bookings?.forEach((booking) => {
		if (booking.status === "approved" || booking.status === "delivered") {
			const date = new Date(booking.created_at).toLocaleDateString("en-IN", {
				day: "numeric",
				month: "short",
			});
			const currentVal = chartDataMap.get(date) || 0;
			chartDataMap.set(date, currentVal + booking.amount);
		}
	});
	const chartData = Array.from(chartDataMap, ([date, revenue]) => ({
		date,
		revenue,
	}));

	return (
		<div className="space-y-8 pb-8">
			{/* Header - UPDATED WITH EXPORT BUTTON */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-gray-900">
						Admin Overview
					</h1>
					<p className="text-gray-500">
						Welcome back. Here is what's happening today.
					</p>
				</div>

				<div className="flex items-center gap-3">
					{/* Date Badge (Hidden on very small screens to save space) */}
					<div className="hidden md:block text-sm text-gray-500 bg-white px-4 py-2 rounded-full border shadow-sm w-fit">
						{new Date().toLocaleDateString("en-IN", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>

					{/* NEW EXPORT BUTTON */}
					<ExportButton
						data={bookings || []}
						filename={`Sales_Report_${
							new Date().toISOString().split("T")[0]
						}.csv`}
					/>
				</div>
			</div>

			{/* STATS GRID */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Total Customers */}
				<div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
					<div className="flex justify-between items-start">
						<div>
							<p className="text-sm font-medium text-gray-500">
								Total Customers
							</p>
							<h3 className="text-3xl font-bold text-gray-900 mt-2">
								{userCount}
							</h3>
						</div>
						<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
							<Users size={20} />
						</div>
					</div>
				</div>

				{/* Pending Requests */}
				<div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
					<div className="flex justify-between items-start">
						<div>
							<p className="text-sm font-medium text-gray-500">
								Pending Requests
							</p>
							<h3 className="text-3xl font-bold text-orange-600 mt-2">
								{pendingCount}
							</h3>
						</div>
						<div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
							<Clock size={20} />
						</div>
					</div>
					{pendingCount > 0 && (
						<Link
							href="/admin/requests"
							className="text-xs font-medium text-orange-600 hover:underline flex items-center gap-1"
						>
							Review now <ArrowRight size={12} />
						</Link>
					)}
				</div>

				{/* Delivered */}
				<div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
					<div className="flex justify-between items-start">
						<div>
							<p className="text-sm font-medium text-gray-500">
								Delivered Cylinders
							</p>
							<h3 className="text-3xl font-bold text-green-700 mt-2">
								{deliveredCount}
							</h3>
						</div>
						<div className="p-2 bg-green-50 text-green-600 rounded-lg">
							<CheckCircle2 size={20} />
						</div>
					</div>
				</div>

				{/* Revenue */}
				<div className="p-6 bg-slate-900 rounded-xl shadow-sm flex flex-col justify-between h-32 text-white">
					<div className="flex justify-between items-start">
						<div>
							<p className="text-sm font-medium text-slate-400">
								Total Revenue
							</p>
							<h3 className="text-3xl font-bold mt-2">
								₹{totalRevenue.toLocaleString("en-IN")}
							</h3>
						</div>
						<div className="p-2 bg-slate-800 text-slate-300 rounded-lg">
							<TrendingUp size={20} />
						</div>
					</div>
				</div>
			</div>

			{/* MAIN DASHBOARD CONTENT */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
				{/* LEFT: CHART (Takes 2/3 width) */}
				<div className="lg:col-span-2 flex flex-col h-full min-h-[400px]">
					<div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
						<RevenueChart data={chartData} />
					</div>
				</div>

				{/* RIGHT: ACTION CARDS (Takes 1/3 width) */}
				<div className="flex flex-col gap-6 h-full">
					{/* Card 1: Manage Requests */}
					<Link
						href="/admin/requests"
						className="flex-1 group p-6 bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl hover:shadow-md transition-all flex flex-col justify-between min-h-[180px]"
					>
						<div className="flex items-start justify-between">
							<div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
								<FileText size={24} />
							</div>
							<ArrowRight className="text-orange-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
						</div>
						<div>
							<h3 className="text-lg font-bold text-gray-900">
								Manage Requests
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								You have{" "}
								<span className="font-semibold text-orange-600">
									{pendingCount} pending
								</span>{" "}
								requests waiting for approval.
							</p>
						</div>
					</Link>

					{/* Card 2: Announcements Feed */}
					<div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 flex flex-col min-h-[220px]">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
									<Megaphone size={18} />
								</div>
								<h3 className="font-bold text-gray-900">Announcements</h3>
							</div>
							<Link
								href="/admin/notifications"
								className="text-xs font-medium text-blue-600 hover:underline"
							>
								Manage
							</Link>
						</div>

						{/* List of Announcements */}
						<div className="space-y-3 flex-1 overflow-y-auto max-h-[150px] pr-2">
							{announcements && announcements.length > 0 ? (
								announcements.map((note) => (
									<div
										key={note.id}
										className="flex gap-3 items-start p-2 hover:bg-gray-50 rounded-lg transition-colors"
									>
										<Bell size={14} className="text-gray-400 mt-1 shrink-0" />
										<div>
											<p className="text-sm text-gray-700 font-medium line-clamp-2">
												{note.message}
											</p>
											<p className="text-[10px] text-gray-400 mt-0.5">
												{new Date(note.created_at).toLocaleDateString("en-IN", {
													month: "short",
													day: "numeric",
												})}
											</p>
										</div>
									</div>
								))
							) : (
								<div className="flex flex-col items-center justify-center h-full text-center text-gray-400 text-xs">
									<p>No active announcements.</p>
									<p>Post one to notify users.</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
