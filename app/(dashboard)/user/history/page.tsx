import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserHistoryTable from "@/components/user/UserHistoryTable"; // Import new component

export default async function HistoryPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	// Fetch bookings
	const { data: bookings } = await supabase
		.from("bookings")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Booking History
				</h1>
				<p className="text-gray-500">
					Track the status of your previous cylinder requests.
				</p>
			</div>

			<UserHistoryTable bookings={bookings || []} />
		</div>
	);
}
