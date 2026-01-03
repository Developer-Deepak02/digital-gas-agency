"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
	Check,
	X,
	User,
	MapPin,
	Phone,
	Loader2,
	ShieldCheck,
} from "lucide-react";

export default function AdminConnectionsPage() {
	const [requests, setRequests] = useState<any[]>([]);
	const [loadingId, setLoadingId] = useState<string | null>(null);
	const supabase = createClient();

	useEffect(() => {
		fetchRequests();
	}, []);

	const fetchRequests = async () => {
		const { data } = await supabase
			.from("profiles")
			.select("*")
			.eq("connection_status", "pending"); // Only fetch pending ones

		if (data) setRequests(data);
	};

	const handleAction = async (
		userId: string,
		action: "active" | "rejected"
	) => {
		setLoadingId(userId);
		const { error } = await supabase
			.from("profiles")
			.update({ connection_status: action })
			.eq("id", userId);

		if (!error) {
			fetchRequests(); // Refresh list
		}
		setLoadingId(null);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					New Connection Requests
				</h1>
				<p className="text-gray-500">
					Review and approve new consumer applications.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{requests.map((user) => (
					<div
						key={user.id}
						className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between h-full"
					>
						<div className="space-y-4 mb-6">
							<div className="flex items-center gap-3">
								<div className="h-10 w-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
									{user.full_name?.charAt(0) || "U"}
								</div>
								<div>
									<h3 className="font-bold text-gray-900">{user.full_name}</h3>
									<p className="text-xs text-gray-500">{user.email}</p>
								</div>
							</div>

							<div className="space-y-2 text-sm text-gray-600">
								<div className="flex items-center gap-2">
									<Phone size={14} className="text-gray-400" />{" "}
									{user.mobile || "N/A"}
								</div>
								<div className="flex items-start gap-2">
									<MapPin size={14} className="text-gray-400 mt-1" />{" "}
									<span className="flex-1">{user.address || "N/A"}</span>
								</div>
							</div>
						</div>

						<div className="flex gap-3 mt-auto border-t border-gray-50 pt-4">
							<button
								onClick={() => handleAction(user.id, "rejected")}
								disabled={!!loadingId}
								className="flex-1 py-2 border border-red-200 text-red-700 rounded-lg hover:bg-red-50 text-sm font-medium flex items-center justify-center gap-1"
							>
								{loadingId === user.id ? (
									<Loader2 className="animate-spin h-4 w-4" />
								) : (
									<X size={16} />
								)}{" "}
								Reject
							</button>
							<button
								onClick={() => handleAction(user.id, "active")}
								disabled={!!loadingId}
								className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-1 shadow-sm"
							>
								{loadingId === user.id ? (
									<Loader2 className="animate-spin h-4 w-4" />
								) : (
									<Check size={16} />
								)}{" "}
								Approve
							</button>
						</div>
					</div>
				))}

				{requests.length === 0 && (
					<div className="col-span-full py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
						No pending connection requests.
					</div>
				)}
			</div>
		</div>
	);
}
