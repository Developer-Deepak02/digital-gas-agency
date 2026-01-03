import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RequestTable from "@/components/admin/RequestTable";

export default async function AdminRequestsPage() {
	const supabase = await createClient();

	// 1. Verify Admin Role
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profile?.role !== "admin") {
		return (
			<div className="p-8 text-center text-red-600">
				Access Denied. You are not an administrator.
			</div>
		);
	}

	// 2. Fetch Pending Bookings + User Details
	// Update query to fetch mobile and address
	const { data: bookings } = await supabase
		.from("bookings")
		.select(
			`
      *,
      profiles (full_name, email, mobile, address) 
    `
		)
		.eq("status", "pending")
		.order("created_at", { ascending: true });
		
	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Cylinder Requests
				</h1>
				<p className="text-gray-500">
					Manage incoming booking requests from customers.
				</p>
			</div>

			<RequestTable bookings={bookings || []} />
		</div>
	);
}
