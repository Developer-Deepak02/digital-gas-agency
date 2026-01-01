"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
	const router = useRouter();
	const supabase = createClient();

	const handleLogout = async () => {
		await supabase.auth.signOut();
		router.push("/auth"); // Redirect to auth page
		router.refresh();
	};

	return (
		<button
			onClick={handleLogout}
			className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
		>
			<LogOut size={16} />
			Logout
		</button>
	);
}
