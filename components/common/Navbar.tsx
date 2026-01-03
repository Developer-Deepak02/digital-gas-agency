import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";
import { Flame } from "lucide-react";

export default async function Navbar() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	let role = null;
	let status = "not_applied";

	if (user) {
		const { data: profile } = await supabase
			.from("profiles")
			.select("role, connection_status")
			.eq("id", user.id)
			.single();
		role = profile?.role;
		status = profile?.connection_status || "not_applied";
	}

	// Everyone goes to /user home now (we will handle the "Apply Button" there)
	const homeLink = role === "admin" ? "/admin" : "/user";

	return (
		<nav className="border-b border-gray-100 bg-white shadow-sm">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				<Link href={homeLink} className="flex items-center gap-2">
					<Flame className="h-6 w-6 text-orange-500" />
					<span className="text-xl font-bold text-gray-900 tracking-tight">
						BookMyGas
					</span>
				</Link>

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
								href="/admin/connections"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								New Connections
							</Link>
							<Link
								href="/admin/history"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								History
							</Link>
							<Link
								href="/admin/users"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Users
							</Link>
							<Link
								href="/admin/settings"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Settings
							</Link>
							<Link
								href="/admin/support"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Inbox
							</Link>
						</>
					)}

					{/* USER LINKS - MIXED ACCESS */}
					{role === "user" && (
						<>
							{/* RESTRICTED: Only for Active Users */}
							{status === "active" && (
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

							{/* PUBLIC: For Everyone (Active or Pending) */}
							<Link
								href="/user/tickets"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Track Tickets
							</Link>
							<Link
								href="/user/support"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Support
							</Link>
							<Link
								href="/user/profile"
								className="text-sm font-medium text-gray-600 hover:text-orange-600"
							>
								Profile
							</Link>
						</>
					)}

					<div className="h-6 w-px bg-gray-200" />
					<LogoutButton />
				</div>
			</div>
		</nav>
	);
}
