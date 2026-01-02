import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BookingForm from "@/components/user/BookingForm";

export default async function BookCylinderPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	// Fetch Quota
	const { data: profile } = await supabase
		.from("profiles")
		.select("quota_remaining")
		.eq("id", user.id)
		.single();

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

			<BookingForm userId={user.id} quota={profile?.quota_remaining ?? 0} />
		</div>
	);
}
