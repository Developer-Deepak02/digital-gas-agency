"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
	FileText,
	MapPin,
	Phone,
	User,
	Loader2,
	Send,
	ShieldCheck,
} from "lucide-react";

export default function ConnectionPage() {
	const [loading, setLoading] = useState(false);
	const [status, setStatus] = useState("loading"); // loading, not_applied, pending, active
	const [userId, setUserId] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		mobile: "",
		address: "",
		aadhar: "", // Just for realism, we won't validate strict regex
	});

	const supabase = createClient();
	const router = useRouter();

	useEffect(() => {
		checkStatus();
	}, []);

	const checkStatus = async () => {
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (user) {
			setUserId(user.id);
			const { data } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", user.id)
				.single();

			if (data) {
				if (data.connection_status === "active") router.push("/user"); // Redirect if already active
				setStatus(data.connection_status);
				// Pre-fill if they tried before
				setFormData({
					mobile: data.mobile || "",
					address: data.address || "",
					aadhar: "",
				});
			}
		}
	};

	const handleApply = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// 1. Update Profile details AND set status to 'pending'
		const { error } = await supabase
			.from("profiles")
			.update({
				mobile: formData.mobile,
				address: formData.address,
				connection_status: "pending",
			})
			.eq("id", userId);

		if (!error) {
			setStatus("pending");
		} else {
			alert("Application failed. Try again.");
		}
		setLoading(false);
	};

	if (status === "loading")
		return (
			<div className="p-10 flex justify-center">
				<Loader2 className="animate-spin text-orange-500" />
			</div>
		);

	// VIEW 1: ALREADY APPLIED (PENDING)
	if (status === "pending") {
		return (
			<div className="max-w-xl mx-auto mt-10 p-8 bg-white border border-yellow-200 rounded-xl shadow-sm text-center">
				<div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
					<ClockIcon />
				</div>
				<h2 className="text-2xl font-bold text-gray-900">
					Application Under Review
				</h2>
				<p className="text-gray-500 mt-2">
					Your request for a new gas connection has been submitted.
					<br />
					The admin will verify your details shortly.
				</p>
				<div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600 text-left">
					<p>
						<strong>Note:</strong> You will get access to booking and history
						features once your connection is approved.
					</p>
				</div>
				<button
					onClick={() => window.location.reload()}
					className="mt-6 text-orange-600 text-sm font-medium hover:underline"
				>
					Check Status
				</button>
			</div>
		);
	}

	// VIEW 2: APPLICATION FORM
	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">
					New Connection Application
				</h1>
				<p className="text-gray-500">
					Please fill your details to register as a consumer.
				</p>
			</div>

			<div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
				<form onSubmit={handleApply} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Mobile Number
						</label>
						<div className="relative">
							<Phone
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="tel"
								required
								value={formData.mobile}
								onChange={(e) =>
									setFormData({ ...formData, mobile: e.target.value })
								}
								placeholder="9876543210"
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Aadhar Number / ID Proof
						</label>
						<div className="relative">
							<ShieldCheck
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="text"
								required
								value={formData.aadhar}
								onChange={(e) =>
									setFormData({ ...formData, aadhar: e.target.value })
								}
								placeholder="xxxx-xxxx-xxxx"
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Delivery Address
						</label>
						<div className="relative">
							<MapPin
								size={18}
								className="absolute left-3 top-3 text-gray-400"
							/>
							<textarea
								required
								rows={3}
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								placeholder="Full address with pincode"
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-orange-500"
							></textarea>
						</div>
					</div>

					<div className="pt-2">
						<button
							disabled={loading}
							className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 font-medium flex items-center justify-center gap-2"
						>
							{loading ? (
								<Loader2 className="animate-spin h-5 w-5" />
							) : (
								<>
									<Send size={18} /> Submit Application
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function ClockIcon() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	);
}
