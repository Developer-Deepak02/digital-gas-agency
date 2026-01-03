import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookingForm from "@/components/user/BookingForm";
import NotificationBanner from "@/components/user/NotificationBanner";

export default async function BookCylinderPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	// FETCH PROFILE WITH ADDRESS & MOBILE
	const { data: profile } = await supabase
		.from("profiles")
		.select("quota_remaining, mobile, address")
		.eq("id", user.id)
		.single();

	// FETCH DYNAMIC PRICE
	const { data: settings } = await supabase
		.from("system_settings")
		.select("value")
		.eq("key", "cylinder_price")
		.single();

	const currentPrice = settings ? parseInt(settings.value) : 1000; // Default to 1000 if fetch fails
	
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-1">
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Dashboard
				</h1>
				<p className="text-gray-500">
					Manage your gas bookings and view your history.
				</p>
			</div>

			<NotificationBanner />

			<BookingForm
				userId={user.id}
				quota={profile?.quota_remaining ?? 0}
				userProfile={{
					mobile: profile?.mobile,
					address: profile?.address,
				}}
				currentPrice={currentPrice}
			/>
		</div>
	);
}
