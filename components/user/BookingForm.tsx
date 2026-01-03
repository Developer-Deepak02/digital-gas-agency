"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
	Flame,
	CreditCard,
	Loader2,
	CheckCircle2,
	ShieldCheck,
	AlertTriangle,
	ArrowRight,
} from "lucide-react";
import Script from "next/script";
import Link from "next/link";

type Props = {
	userId: string;
	quota: number;
	userProfile: {
		mobile?: string | null;
		address?: string | null;
	};
	currentPrice: number;
};

export default function BookingForm({ userId, quota, userProfile , currentPrice}: Props) {
	const [loading, setLoading] = useState(false);
	const [paymentMode, setPaymentMode] = useState<"COD" | "ONLINE">("COD");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState("");
	const [showProfileAlert, setShowProfileAlert] = useState(false); // New State for Alert

	const router = useRouter();
	const supabase = createClient();

	const handleCOD = async () => {
		const { error: bookingError } = await supabase.from("bookings").insert({
			user_id: userId,
			payment_mode: "COD",
			status: "pending",
			amount: currentPrice,
		});
		if (bookingError) throw bookingError;
		await updateQuota();
		setSuccess(true);
	};

	const handleOnlinePayment = async () => {
		try {
			const response = await fetch("/api/payment/create-order", {
				method: "POST",
			});
			const data = await response.json();
			if (!data.orderId) throw new Error("Failed to initialize payment");

			const options = {
				key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
				amount: currentPrice * 100,
				currency: "INR",
				name: "BookMyGas",
				description: "Cylinder Refill Charge",
				order_id: data.orderId,
				handler: async function (response: any) {
					const { error: bookingError } = await supabase
						.from("bookings")
						.insert({
							user_id: userId,
							payment_mode: "Online (Razorpay)",
							status: "approved",
							amount: currentPrice,
						});

					if (bookingError) {
						setError("Payment successful but booking failed. Contact support.");
					} else {
						await updateQuota();
						setSuccess(true);
					}
				},
				prefill: {
					name: "Gas Customer",
					email: "customer@example.com",
					contact: userProfile.mobile || "9999999999", // Use real mobile if available
				},
				theme: { color: "#ea580c" },
			};
			const rzp1 = new (window as any).Razorpay(options);
			rzp1.open();
		} catch (err: any) {
			console.error(err);
			setError("Payment initialization failed. Please try COD.");
		}
	};

	const updateQuota = async () => {
		await supabase
			.from("profiles")
			.update({ quota_remaining: quota - 1 })
			.eq("id", userId);
		router.refresh();
	};

	const handleBooking = async (e: React.FormEvent) => {
		e.preventDefault();

		// 1. VALIDATION CHECK
		if (!userProfile.mobile || !userProfile.address) {
			setShowProfileAlert(true);
			return;
		}

		setLoading(true);
		setError("");

		try {
			if (quota <= 0) throw new Error("You have exhausted your yearly quota.");

			if (paymentMode === "COD") {
				await handleCOD();
			} else {
				await handleOnlinePayment();
			}
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		} finally {
			if (paymentMode === "COD") setLoading(false);
		}
	};

	if (success) {
		return (
			<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center animate-in zoom-in duration-300">
				<div className="flex justify-center mb-4">
					<CheckCircle2 className="h-16 w-16 text-green-500" />
				</div>
				<h2 className="text-2xl font-bold text-gray-900">
					Booking Successful!
				</h2>
				<p className="text-gray-500 mt-2">
					{paymentMode === "ONLINE"
						? "Payment received. Order auto-approved."
						: "Request sent for approval."}
				</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-6 text-orange-600 font-medium hover:underline"
				>
					Book another?
				</button>
			</div>
		);
	}

	return (
		<>
			<Script src="https://checkout.razorpay.com/v1/checkout.js" />

			{/* POPUP ALERT FOR MISSING PROFILE */}
			{showProfileAlert && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
					<div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-center">
						<div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<AlertTriangle size={32} />
						</div>
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							Incomplete Profile
						</h3>
						<p className="text-gray-500 mb-6 leading-relaxed">
							We need your <strong>Mobile Number</strong> and{" "}
							<strong>Delivery Address</strong> to process your order. Please
							update your profile to continue.
						</p>
						<div className="flex flex-col gap-3">
							<Link
								href="/user/profile"
								className="w-full bg-orange-600 text-white py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
							>
								Update Profile Now <ArrowRight size={18} />
							</Link>
							<button
								onClick={() => setShowProfileAlert(false)}
								className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}

			<div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
				<div className="flex items-center gap-3 mb-8">
					<div className="p-3 bg-orange-50 rounded-lg">
						<Flame className="h-8 w-8 text-orange-500" />
					</div>
					<div>
						<h2 className="text-xl font-bold text-gray-900">
							Book New Cylinder
						</h2>
						<p className="text-sm text-gray-500">
							Select payment method to proceed
						</p>
					</div>
				</div>

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
											paymentMode === "COD"
												? "text-orange-600"
												: "text-gray-400"
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

							<div
								onClick={() => setPaymentMode("ONLINE")}
								className={`p-4 border rounded-xl cursor-pointer transition-all ${
									paymentMode === "ONLINE"
										? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500"
										: "border-gray-200 hover:border-blue-200"
								}`}
							>
								<div className="flex items-center gap-3 mb-2">
									<ShieldCheck
										className={
											paymentMode === "ONLINE"
												? "text-blue-600"
												: "text-gray-400"
										}
									/>
									<span className="font-semibold text-gray-900">
										Pay Online
									</span>
								</div>
								<p className="text-xs text-gray-500">Cards, UPI, Netbanking.</p>
							</div>
						</div>

						{error && (
							<p className="text-sm text-red-600 text-center bg-red-50 p-2 rounded">
								{error}
							</p>
						)}

						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors flex justify-center items-center"
						>
							{loading ? (
								<Loader2 className="animate-spin h-5 w-5" />
							) : (
								`Confirm Booking • ₹${currentPrice}`
							)}
						</button>
					</form>
				) : (
					<div className="text-center p-6 bg-red-50 text-red-700 rounded-lg border border-red-100">
						<p className="font-medium">Annual Quota Limit Reached</p>
					</div>
				)}
			</div>
		</>
	);
}
