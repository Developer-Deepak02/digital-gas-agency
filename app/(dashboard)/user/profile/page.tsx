"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, MapPin, Phone, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserProfilePage() {
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(true);
	const [success, setSuccess] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		full_name: "",
		email: "",
		mobile: "",
		address: "",
	});

	const supabase = createClient();
	const router = useRouter();

	useEffect(() => {
		const fetchProfile = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUserId(user.id);
				const { data: profile } = await supabase
					.from("profiles")
					.select("full_name, email, mobile, address")
					.eq("id", user.id)
					.single();

				if (profile) {
					setFormData({
						full_name: profile.full_name || "",
						email: profile.email || "",
						mobile: profile.mobile || "",
						address: profile.address || "",
					});
				}
			}
			setFetching(false);
		};
		fetchProfile();
	}, []);

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setSuccess(false);

		const { error } = await supabase
			.from("profiles")
			.update({
				mobile: formData.mobile,
				address: formData.address,
			})
			.eq("id", userId);

		if (!error) {
			setSuccess(true);
			router.refresh();
			setTimeout(() => setSuccess(false), 3000);
		} else {
			alert("Failed to update profile");
		}
		setLoading(false);
	};

	if (fetching)
		return (
			<div className="p-8 text-center">
				<Loader2 className="animate-spin h-8 w-8 mx-auto text-orange-500" />
			</div>
		);

	return (
		<div className="max-w-2xl mx-auto">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
				<p className="text-gray-500">
					Manage your contact information and delivery address.
				</p>
			</div>

			<div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
				{success && (
					<div className="absolute top-0 left-0 right-0 bg-green-50 text-green-700 p-3 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top">
						<CheckCircle2 size={16} /> Profile Updated Successfully!
					</div>
				)}

				<form onSubmit={handleUpdate} className="space-y-6 mt-2">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Full Name
							</label>
							<div className="relative">
								<User
									size={18}
									className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
								/>
								<input
									type="text"
									value={formData.full_name}
									disabled
									className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
								/>
							</div>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Email Address
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
									@
								</span>
								<input
									type="text"
									value={formData.email}
									disabled
									className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
								/>
							</div>
						</div>
					</div>

					<div className="border-t border-gray-100 my-6"></div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Mobile Number <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<Phone
								size={18}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
							/>
							<input
								type="tel"
								required
								placeholder="Enter your 10-digit mobile number"
								value={formData.mobile}
								onChange={(e) =>
									setFormData({ ...formData, mobile: e.target.value })
								}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Delivery Address <span className="text-red-500">*</span>
						</label>
						<div className="relative">
							<MapPin
								size={18}
								className="absolute left-3 top-3 text-gray-400"
							/>
							<textarea
								required
								rows={3}
								placeholder="House No, Street, Area, City, Pincode"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
							></textarea>
						</div>
						<p className="text-xs text-gray-500 mt-1">
							This address will be used for all future deliveries.
						</p>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors font-medium"
					>
						{loading ? (
							<Loader2 className="animate-spin h-5 w-5" />
						) : (
							<>
								<Save size={18} /> Save Changes
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
