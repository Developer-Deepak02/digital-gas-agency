"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, IndianRupee, Loader2, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
	const [price, setPrice] = useState("");
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [success, setSuccess] = useState(false);
	const supabase = createClient();

	useEffect(() => {
		fetchSettings();
	}, []);

	const fetchSettings = async () => {
		const { data } = await supabase
			.from("system_settings")
			.select("value")
			.eq("key", "cylinder_price")
			.single();

		if (data) setPrice(data.value);
		setFetching(false);
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setSuccess(false);

		const { error } = await supabase
			.from("system_settings")
			.update({ value: price })
			.eq("key", "cylinder_price");

		if (!error) {
			setSuccess(true);
			setTimeout(() => setSuccess(false), 3000);
		} else {
			alert("Failed to update price");
		}
		setLoading(false);
	};

	if (fetching)
		return (
			<div className="p-10 flex justify-center">
				<Loader2 className="animate-spin text-orange-500" />
			</div>
		);

	return (
		<div className="max-w-xl mx-auto space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					System Settings
				</h1>
				<p className="text-gray-500">
					Manage global configurations and pricing.
				</p>
			</div>

			<div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
				{success && (
					<div className="absolute top-0 left-0 right-0 bg-green-50 text-green-700 p-2 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top">
						<CheckCircle2 size={16} /> Price Updated Successfully!
					</div>
				)}

				<form onSubmit={handleUpdate} className="space-y-6 mt-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Current Cylinder Price
						</label>
						<div className="relative">
							<div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
								<IndianRupee size={20} />
							</div>
							<input
								type="number"
								required
								min="0"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								className="w-full pl-10 pr-4 py-3 text-lg font-bold text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
							/>
						</div>
						<p className="text-xs text-gray-500 mt-2">
							This price will be applied to all new bookings immediately.
						</p>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 font-medium flex items-center justify-center gap-2 transition-colors"
					>
						{loading ? (
							<Loader2 className="animate-spin h-5 w-5" />
						) : (
							<>
								<Save size={18} /> Update Price
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
