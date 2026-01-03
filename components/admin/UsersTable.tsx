"use client";

import { useState } from "react";
import { Eye, Search, Filter, UserCheck, Users } from "lucide-react";
import UserDetailsModal from "./UserDetailsModal";

export default function UsersTable({ users }: { users: any[] }) {
	const [selectedUser, setSelectedUser] = useState<any | null>(null);
	const [filter, setFilter] = useState<"all" | "active">("all");
	const [search, setSearch] = useState("");

	// Filter Logic
	const filteredUsers = users.filter((user) => {
		// 1. Check Status Filter
		if (filter === "active" && user.connection_status !== "active")
			return false;

		// 2. Check Search (Name or Email or Mobile)
		if (search) {
			const query = search.toLowerCase();
			return (
				user.full_name?.toLowerCase().includes(query) ||
				user.email?.toLowerCase().includes(query) ||
				user.mobile?.includes(query)
			);
		}
		return true;
	});

	return (
		<div className="space-y-6">
			{/* CONTROLS BAR */}
			<div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
				{/* TABS */}
				<div className="flex bg-gray-100 p-1 rounded-lg w-fit">
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
							filter === "all"
								? "bg-white text-gray-900 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						<Users size={16} /> All Users
					</button>
					<button
						onClick={() => setFilter("active")}
						className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
							filter === "active"
								? "bg-white text-green-700 shadow-sm"
								: "text-gray-500 hover:text-gray-700"
						}`}
					>
						<UserCheck size={16} /> With Connection
					</button>
				</div>

				{/* SEARCH */}
				<div className="relative w-full md:w-64">
					<Search
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
						size={18}
					/>
					<input
						type="text"
						placeholder="Search name, email..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
					/>
				</div>
			</div>

			{/* MODAL */}
			{selectedUser && (
				<UserDetailsModal
					user={selectedUser}
					onClose={() => setSelectedUser(null)}
				/>
			)}

			{/* TABLE - Updated for Mobile Scrolling */}
			<div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50/50">
						<tr>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								User
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Contact
							</th>
							<th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Connection Status
							</th>
							<th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-200 bg-white">
						{filteredUsers.map((user) => (
							<tr
								key={user.id}
								className="hover:bg-gray-50/50 transition-colors"
							>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="flex items-center gap-3">
										<div className="h-8 w-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">
											{user.full_name?.charAt(0) || "U"}
										</div>
										<div>
											<div className="text-sm font-medium text-gray-900">
												{user.full_name}
											</div>
											<span
												className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
													user.role === "admin"
														? "bg-purple-100 text-purple-700"
														: "bg-gray-100 text-gray-500"
												}`}
											>
												{user.role}
											</span>
										</div>
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<div className="text-sm text-gray-600">{user.email}</div>
									<div className="text-xs text-gray-400 mt-0.5">
										{user.mobile || "-"}
									</div>
								</td>
								<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${
											user.connection_status === "active"
												? "bg-green-50 text-green-700 border-green-200"
												: user.connection_status === "pending"
												? "bg-yellow-50 text-yellow-700 border-yellow-200"
												: "bg-gray-50 text-gray-600 border-gray-200"
										}`}
									>
										{user.connection_status === "active" && (
											<div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
										)}
										{user.connection_status || "Not Applied"}
									</span>
								</td>
								<td className="px-6 py-4 text-right whitespace-nowrap">
									<button
										onClick={() => setSelectedUser(user)}
										className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:text-orange-600 hover:border-orange-200 rounded-lg text-xs font-medium transition-colors shadow-sm"
									>
										<Eye size={14} /> View
									</button>
								</td>
							</tr>
						))}

						{filteredUsers.length === 0 && (
							<tr>
								<td colSpan={4} className="p-8 text-center text-gray-500">
									No users found matching your filters.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
