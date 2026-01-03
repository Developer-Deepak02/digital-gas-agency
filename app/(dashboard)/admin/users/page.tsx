import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, UserCheck } from "lucide-react";
import UsersTable from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
	const supabase = await createClient();

	// 1. Verify Admin
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();
	if (profile?.role !== "admin") redirect("/user");

	// 2. Fetch All Users
	const { data: users } = await supabase
		.from("profiles")
		.select("*")
		.order("created_at", { ascending: false }); // Or order by full_name

	// 3. Calculate Stats
	const totalUsers = users?.length || 0;
	const activeUsers =
		users?.filter((u) => u.connection_status === "active").length || 0;

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					User Management
				</h1>
				<p className="text-gray-500">View and manage all registered users.</p>
			</div>

			{/* STATS CARDS */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
				{/* Total Users Card */}
				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 mb-1">
							Total Users
						</p>
						<h3 className="text-3xl font-bold text-gray-900">{totalUsers}</h3>
					</div>
					<div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
						<Users size={24} />
					</div>
				</div>

				{/* Active Connections Card */}
				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
					<div>
						<p className="text-sm font-medium text-gray-500 mb-1">
							Active Connections
						</p>
						<h3 className="text-3xl font-bold text-green-700">{activeUsers}</h3>
					</div>
					<div className="h-12 w-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
						<UserCheck size={24} />
					</div>
				</div>
			</div>

			{/* TABLE SECTION */}
			<UsersTable users={users || []} />
		</div>
	);
}
