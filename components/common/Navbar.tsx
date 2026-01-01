import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import { Flame } from "lucide-react";

export default async function Navbar() {
	const supabase = createClient();

	// Get User Session
	const {
		data: { user },
	} = await supabase.auth.getUser();

	// If user exists, fetch their role profile
	let role = null;
	if (user) {
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();
		role = profile?.role;
	}

	return (
		<nav className="border-b bg-white shadow-sm">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<div className="flex items-center gap-2">
					<Flame className="h-6 w-6 text-orange-600" />
					<span className="text-xl font-bold text-gray-900">GasAgency</span>
				</div>

				{/* Navigation Links */}
				<div className="flex items-center gap-6">
					{user ? (
						<>
							{/* ADMIN LINKS */}
							{role === "admin" && (
								<>
									<Link
										href="/admin/requests"
										className="text-sm font-medium text-gray-600 hover:text-orange-600"
									>
										Requests
									</Link>
									<Link
										href="/admin/notifications"
										className="text-sm font-medium text-gray-600 hover:text-orange-600"
									>
										Notifications
									</Link>
								</>
							)}

							{/* USER LINKS */}
							{role === "user" && (
								<>
									<Link
										href="/user/book"
										className="text-sm font-medium text-gray-600 hover:text-orange-600"
									>
										Book Cylinder
									</Link>
									<Link
										href="/user/history"
										className="text-sm font-medium text-gray-600 hover:text-orange-600"
									>
										History
									</Link>
								</>
							)}

							<LogoutButton />
						</>
					) : (
						<Link
							href="/auth"
							className="text-sm font-medium text-blue-600 hover:underline"
						>
							Login / Register
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
