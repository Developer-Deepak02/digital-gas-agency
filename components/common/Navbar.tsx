"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import LogoutButton from "./LogoutButton";
import { Flame, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [role, setRole] = useState<string | null>(null);
	const [status, setStatus] = useState("not_applied");
	const supabase = createClient();
	const pathname = usePathname();

	useEffect(() => {
		const fetchUser = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				const { data: profile } = await supabase
					.from("profiles")
					.select("role, connection_status")
					.eq("id", user.id)
					.single();
				setRole(profile?.role || null);
				setStatus(profile?.connection_status || "not_applied");
			}
		};
		fetchUser();
	}, []);

	// Close mobile menu when route changes
	useEffect(() => {
		setIsOpen(false);
	}, [pathname]);

	const homeLink =
		role === "admin"
			? "/admin"
			: role === "user" && status === "active"
			? "/user"
			: "/user/connection";

	const renderLinks = () => (
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
						href="/admin/connections"
						className="text-sm font-medium text-gray-600 hover:text-orange-600"
					>
						New Connections
					</Link>
					<Link
						href="/admin/users"
						className="text-sm font-medium text-gray-600 hover:text-orange-600"
					>
						Users
					</Link>
					<Link
						href="/admin/history"
						className="text-sm font-medium text-gray-600 hover:text-orange-600"
					>
						History
					</Link>
					<Link
						href="/admin/notifications"
						className="text-sm font-medium text-gray-600 hover:text-orange-600"
					>
						Notifications
					</Link>
					<Link
						href="/admin/support"
						className="text-sm font-medium text-gray-600 hover:text-orange-600"
					>
						Inbox
					</Link>
				</>
			)}

			{/* USER LINKS (ACTIVE) */}
			{role === "user" && status === "active" && (
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

			{/* USER LINKS (PENDING) */}
			{role === "user" && status !== "active" && (
				<span
					className={`text-xs px-3 py-1 rounded-full font-medium w-fit ${
						status === "pending"
							? "bg-yellow-100 text-yellow-800"
							: "bg-blue-100 text-blue-800"
					}`}
				>
					{status === "pending"
						? "Verification Pending"
						: "Apply for Connection"}
				</span>
			)}
		</>
	);

	return (
		<nav className="border-b border-gray-100 bg-white shadow-sm sticky top-0 z-50">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* LOGO */}
				<Link href={homeLink} className="flex items-center gap-2">
					<Flame className="h-6 w-6 text-orange-500" />
					<span className="text-xl font-bold text-gray-900 tracking-tight">
						BookMyGas
					</span>
				</Link>

				{/* DESKTOP MENU (Hidden on Mobile) */}
				<div className="hidden lg:flex items-center gap-6">
					{renderLinks()}
					<div className="h-6 w-px bg-gray-200" />
					<LogoutButton />
				</div>

				{/* MOBILE MENU BUTTON (Visible on Mobile) */}
				<button
					onClick={() => setIsOpen(!isOpen)}
					className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
				>
					{isOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* MOBILE DROPDOWN */}
			{isOpen && (
				<div className="lg:hidden border-t border-gray-100 bg-white px-4 py-6 space-y-4 flex flex-col shadow-lg absolute w-full left-0">
					{renderLinks()}
					<div className="pt-4 border-t border-gray-100">
						<LogoutButton />
					</div>
				</div>
			)}
		</nav>
	);
}
