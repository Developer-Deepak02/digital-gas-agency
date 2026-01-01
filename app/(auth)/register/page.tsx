"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import Logo from "@/components/common/Logo"; // <--- Import your new Logo

export default function RegisterPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [fullName, setFullName] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error: signUpError } = await supabase.auth.signUp({
				email,
				password,
				options: { data: { full_name: fullName } },
			});
			if (signUpError) throw signUpError;

			if (data.user) {
				await supabase
					.from("profiles")
					.update({ phone, address })
					.eq("id", data.user.id);
			}

			router.push("/");
			router.refresh();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen w-full lg:grid lg:grid-cols-2">
			{/* LEFT SIDE - Form */}
			<div className="flex items-center justify-center p-8 bg-gray-50 order-2 lg:order-1">
				<div className="w-full max-w-md space-y-8">
					<div>
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Create an Account
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Get started with 12 cylinders/year quota immediately.
						</p>
					</div>

					{error && (
						<div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
							{error}
						</div>
					)}

					<form onSubmit={handleRegister} className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Full Name
							</label>
							<input
								type="text"
								required
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all duration-200"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Email
								</label>
								<input
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all duration-200"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">
									Phone
								</label>
								<input
									type="tel"
									required
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all duration-200"
								/>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Delivery Address
							</label>
							<textarea
								required
								rows={2}
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all duration-200"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all duration-200"
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-70 transition-colors cursor-pointer"
						>
							{loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
							Register Account
						</button>
					</form>

					<p className="text-center text-sm text-gray-500">
						Already have an account?{" "}
						<Link
							href="/login"
							className="font-semibold text-orange-600 hover:text-orange-500 hover:underline"
						>
							Log in
						</Link>
					</p>
				</div>
			</div>

			{/* RIGHT SIDE - Branding & Logo */}
			<div className="hidden lg:flex flex-col bg-slate-900 p-12 text-white order-1 lg:order-2 h-full">
				<div>
					<Logo />
				</div>

				{/* Centered Content */}
				<div className="flex-1 flex flex-col justify-center max-w-md mx-auto space-y-8">
					<h2 className="text-3xl font-bold">Why join us?</h2>

					<div className="space-y-6">
						<div className="flex gap-4">
							<div className="bg-orange-600/20 p-2 rounded h-fit">
								<CheckCircle2 className="text-orange-500" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">Instant Booking</h3>
								<p className="text-slate-400 text-sm">
									Book gas barrels in seconds without phone calls.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="bg-orange-600/20 p-2 rounded h-fit">
								<CheckCircle2 className="text-orange-500" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">Online Payments</h3>
								<p className="text-slate-400 text-sm">
									Pay via Cash on Delivery or Paytm QR instantly.
								</p>
							</div>
						</div>

						<div className="flex gap-4">
							<div className="bg-orange-600/20 p-2 rounded h-fit">
								<CheckCircle2 className="text-orange-500" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">Transparent History</h3>
								<p className="text-slate-400 text-sm">
									Track your usage and remaining quota easily.
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="text-sm text-slate-500 mt-auto">
					© 2025 Gas Agency Inc. All rights reserved.
				</div>
			</div>
		</div>
	);
}
