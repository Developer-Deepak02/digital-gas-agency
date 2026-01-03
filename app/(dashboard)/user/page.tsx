import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
	Flame,
	ShieldCheck,
	Zap,
	History,
	ArrowRight,
	AlertCircle,
	Clock,
} from "lucide-react";
import NotificationBanner from "@/components/user/NotificationBanner";

export default async function UserHomePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: profile } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();
	const isActive = profile?.connection_status === "active";
	const isPending = profile?.connection_status === "pending";

	return (
		<div className="space-y-10">
			{/* 1. CONDITIONAL WELCOME BANNER */}
			<div className="relative overflow-hidden rounded-2xl bg-slate-900 px-6 py-12 shadow-xl sm:px-12 sm:py-16">
				<div className="relative z-10 max-w-2xl">
					<h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
						Welcome, {profile?.full_name?.split(" ")[0] || "Member"}!
					</h1>

					{isActive ? (
						// ACTIVE USER VIEW
						<>
							<p className="mt-4 text-lg text-slate-300">
								You have{" "}
								<span className="text-white font-bold">
									{profile?.quota_remaining} cylinders
								</span>{" "}
								remaining for this year.
							</p>
							<div className="mt-8 flex gap-4">
								<Link
									href="/user/book"
									className="rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 flex items-center gap-2"
								>
									<Flame size={18} /> Book Now
								</Link>
								<Link
									href="/user/history"
									className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 flex items-center gap-2"
								>
									<History size={18} /> View History
								</Link>
							</div>
						</>
					) : (
						// NEW / PENDING USER VIEW
						<>
							<p className="mt-4 text-lg text-slate-300">
								{isPending
									? "Your application is currently under review by our admin team."
									: "To start booking gas cylinders, you need to apply for a new connection."}
							</p>
							<div className="mt-8">
								{isPending ? (
									<button
										disabled
										className="rounded-md bg-yellow-500/20 text-yellow-200 px-6 py-3 text-sm font-semibold border border-yellow-500/50 flex items-center gap-2 cursor-not-allowed"
									>
										<Clock size={18} /> Verification Pending...
									</button>
								) : (
									<Link
										href="/user/connection"
										className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 flex items-center gap-2 w-fit"
									>
										Apply for Connection <ArrowRight size={18} />
									</Link>
								)}
							</div>
						</>
					)}
				</div>

				{/* Decoration */}
				<div className="absolute right-0 top-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-orange-500 opacity-20 blur-3xl"></div>
			</div>

			{isActive && <NotificationBanner />}

			{/* 2. BENEFITS SECTION (Visible to ALL) */}
			<div>
				<h2 className="text-2xl font-bold text-gray-900 mb-6">
					Why Choose Us?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
						<div className="h-10 w-10 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center mb-4">
							<Zap size={20} />
						</div>
						<h3 className="font-bold text-gray-900">Fast Delivery</h3>
						<p className="text-sm text-gray-500 mt-2">
							Get your cylinder delivered within 24-48 hours of booking.
						</p>
					</div>
					<div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
						<div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
							<ShieldCheck size={20} />
						</div>
						<h3 className="font-bold text-gray-900">Secure Payments</h3>
						<p className="text-sm text-gray-500 mt-2">
							Pay safely online or choose Cash on Delivery.
						</p>
					</div>
					<div className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
						<div className="h-10 w-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-4">
							<Flame size={20} />
						</div>
						<h3 className="font-bold text-gray-900">Subsidized Rates</h3>
						<p className="text-sm text-gray-500 mt-2">
							Verified consumers get government subsidized pricing.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
