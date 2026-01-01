"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowRight } from "lucide-react";
import Logo from "@/components/common/Logo"; // <--- Import the shared Logo component

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});
			if (error) throw error;

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
			{/* Left Side - Branding */}
			<div className="hidden lg:flex flex-col justify-between bg-slate-900 p-12 text-white">
				{/* Replaced hardcoded text with Component for consistency */}
				<div>
					<Logo />
				</div>

				<div className="max-w-md">
					<h1 className="text-4xl font-bold mb-6 leading-tight">
						Seamless Booking for your Daily Needs.
					</h1>
					<p className="text-slate-400 text-lg">
						Manage your cylinder bookings, track payments, and get fast delivery
						with our new digital platform.
					</p>
				</div>

				<div className="text-sm text-slate-500">
					© 2025 Gas Agency Inc. All rights reserved.
				</div>
			</div>

			{/* Right Side - Form */}
			<div className="flex items-center justify-center p-8 bg-gray-50">
				<div className="w-full max-w-md space-y-8">
					<div className="text-center lg:text-left">
						<h2 className="text-3xl font-bold tracking-tight text-gray-900">
							Welcome back
						</h2>
						<p className="mt-2 text-sm text-gray-600">
							Please enter your details to sign in.
						</p>
					</div>

					{error && (
						<div className="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
							{error}
						</div>
					)}

					<form onSubmit={handleLogin} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<input
								type="email"
								required
								className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all duration-200"
								placeholder="you@example.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div>
							<div className="flex items-center justify-between">
								<label className="block text-sm font-medium text-gray-700">
									Password
								</label>
								<a
									href="#"
									className="text-sm font-medium text-orange-600 hover:text-orange-500"
								>
									Forgot password?
								</a>
							</div>
							<input
								type="password"
								required
								className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-orange-600 focus:outline-none focus:ring-1 focus:ring-orange-600 sm:text-sm sm:leading-6 transition-all duration-200"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="flex w-full justify-center rounded-md bg-orange-600 px-3 py-2.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-70 transition-colors cursor-pointer"
						>
							{loading ? (
								<Loader2 className="mr-2 h-5 w-5 animate-spin" />
							) : (
								"Sign In"
							)}
						</button>
					</form>

					<p className="text-center text-sm text-gray-500 flex justify-center align-items-center gap-1">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="font-semibold text-orange-600 hover:text-orange-500 flex items-center justify-center gap-1 hover:underline"
						>
							Create an account{" "}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
