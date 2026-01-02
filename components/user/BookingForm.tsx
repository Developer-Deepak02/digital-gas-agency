"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Flame, QrCode, CreditCard, Loader2, CheckCircle2 } from "lucide-react";

export default function BookingForm({
	userId,
	quota,
}: {
	userId: string;
	quota: number;
}) {
	const [loading, setLoading] = useState(false);
	const [paymentMode, setPaymentMode] = useState<"COD" | "Paytm">("COD");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const supabase = createClient();

	const handleBooking = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			if (quota <= 0) throw new Error("You have exhausted your yearly quota.");

			// 1. Create Booking Request
			const { error: bookingError } = await supabase.from("bookings").insert({
				user_id: userId,
				payment_mode: paymentMode,
				status: "pending",
				amount: 1000, // Fixed price for now
			});

			if (bookingError) throw bookingError;

			// 2. Decrement Quota
			const { error: profileError } = await supabase
				.from("profiles")
				.update({ quota_remaining: quota - 1 })
				.eq("id", userId);

			if (profileError) throw profileError;

			setSuccess(true);
			router.refresh();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
				<div className="flex justify-center mb-4">
					<CheckCircle2 className="h-16 w-16 text-green-500" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900">
					Booking Successful!
				</h2>
				<p className="text-gray-500 mt-2">
					Your request has been sent to the admin for approval.
				</p>
				<button
					onClick={() => setSuccess(false)}
					className="mt-6 text-orange-600 font-medium hover:underline"
				>
					Book another?
				</button>
			</div>
		);
	}

	return (
		<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
			<div className="flex items-center gap-3 mb-8">
				<div className="p-3 bg-orange-50 rounded-lg">
					<Flame className="h-8 w-8 text-orange-500" />
				</div>
				<div>
					<h2 className="text-xl font-bold text-gray-900">Book New Cylinder</h2>
					<p className="text-sm text-gray-500">
						Select payment method to proceed
					</p>
				</div>
			</div>

			{/* Quota Display */}
			<div className="mb-8 flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
				<span className="text-slate-600 font-medium">Available Quota</span>
				<div className="flex items-baseline gap-1">
					<span className="text-3xl font-bold text-slate-900">{quota}</span>
					<span className="text-sm text-slate-500">/ 12</span>
				</div>
			</div>

			{quota > 0 ? (
				<form onSubmit={handleBooking} className="space-y-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						{/* COD OPTION */}
						<div
							onClick={() => setPaymentMode("COD")}
							className={`p-4 border rounded-xl cursor-pointer transition-all ${
								paymentMode === "COD"
									? "border-orange-500 bg-orange-50/50 ring-1 ring-orange-500"
									: "border-gray-200 hover:border-orange-200"
							}`}
						>
							<div className="flex items-center gap-3 mb-2">
								<CreditCard
									className={
										paymentMode === "COD" ? "text-orange-600" : "text-gray-400"
									}
								/>
								<span className="font-semibold text-gray-900">
									Cash on Delivery
								</span>
							</div>
							<p className="text-xs text-gray-500">
								Pay cash when the cylinder arrives.
							</p>
						</div>

						{/* PAYTM OPTION */}
						<div
							onClick={() => setPaymentMode("Paytm")}
							className={`p-4 border rounded-xl cursor-pointer transition-all ${
								paymentMode === "Paytm"
									? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
									: "border-gray-200 hover:border-blue-200"
							}`}
						>
							<div className="flex items-center gap-3 mb-2">
								<QrCode
									className={
										paymentMode === "Paytm" ? "text-blue-600" : "text-gray-400"
									}
								/>
								<span className="font-semibold text-gray-900">Paytm UPI</span>
							</div>
							<p className="text-xs text-gray-500">
								Scan QR code to pay instantly.
							</p>
						</div>
					</div>

					{/* Dummy QR Code Display */}
					{paymentMode === "Paytm" && (
						<div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
							<div className="h-32 w-32 bg-white flex items-center justify-center rounded-lg shadow-sm mb-3">
								{/* You can add a real image here later: <img src="/qr.png" /> */}
								<QrCode className="h-16 w-16 text-gray-800" />
							</div>
							<p className="text-sm font-medium text-gray-900">
								Scan to pay ₹1000
							</p>
						</div>
					)}

					{error && <p className="text-sm text-red-600 text-center">{error}</p>}

					<button
						type="submit"
						disabled={loading}
						className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors flex justify-center items-center"
					>
						{loading ? (
							<Loader2 className="animate-spin h-5 w-5" />
						) : (
							"Confirm Booking • ₹1000"
						)}
					</button>
				</form>
			) : (
				<div className="text-center p-6 bg-red-50 text-red-700 rounded-lg border border-red-100">
					<p className="font-medium">Annual Quota Limit Reached</p>
					<p className="text-sm mt-1 opacity-80">
						Please contact support for extra cylinder requests.
					</p>
				</div>
			)}
		</div>
	);
}
