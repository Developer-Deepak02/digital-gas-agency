import { createClient } from "@/lib/supabase/server";
import { Megaphone } from "lucide-react";

export default async function NotificationBanner() {
	const supabase = await createClient();

	// Fetch the latest active notification
	const { data: notifications } = await supabase
		.from("notifications")
		.select("message")
		.eq("is_active", true)
		.order("created_at", { ascending: false })
		.limit(1);

	if (!notifications || notifications.length === 0) return null;

	return (
		<div className="bg-blue-600 text-white px-4 py-3 rounded-lg shadow-sm mb-6 flex items-start gap-3">
			<Megaphone className="h-5 w-5 mt-0.5 shrink-0 animate-pulse" />
			<div>
				<p className="font-medium text-sm md:text-base">
					{notifications[0].message}
				</p>
			</div>
		</div>
	);
}
