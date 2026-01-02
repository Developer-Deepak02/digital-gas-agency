import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import { Flame } from "lucide-react";

export default async function Navbar() {
	const supabase = await createClient();

	// Get User Session & Role
	const {
		data: { user },
	} = await supabase.auth.getUser();
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
		<nav className="border-b border-gray-100 bg-white shadow-sm">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo Area */}
				<Link href="/" className="flex items-center gap-2">
					<Flame className="h-6 w-6 text-orange-500" />
					<span className="text-xl font-bold text-gray-900 tracking-tight">
						BookMyGas
					</span>
				</Link>

				{/* Navigation Links */}
				<div className="flex items-center gap-6">
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
								href="/admin/history"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Full History
							</Link>
							<Link
								href="/admin/notifications"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Notifications
							</Link>
						</>
					)}
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
					<div className="h-6 w-px bg-gray-200" /> {/* Divider */}
					<LogoutButton />
				</div>
			</div>
		</nav>
	);
}
