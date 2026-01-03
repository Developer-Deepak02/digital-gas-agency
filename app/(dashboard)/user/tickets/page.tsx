import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
	Calendar,
	CheckCircle2,
	Clock,
	MessageSquare,
	Hash,
	Ticket,
	CornerDownRight,
} from "lucide-react";

export default async function TicketHistoryPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) redirect("/login");

	const { data: tickets } = await supabase
		.from("support_tickets")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	return (
		<div className="space-y-6">
			<h1 className="text-3xl font-bold tracking-tight text-gray-900">
				My Support Tickets
			</h1>

			<div className="grid gap-4">
				{tickets?.map((ticket) => (
					<div
						key={ticket.id}
						className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
					>
						<div className="flex justify-between items-start mb-2">
							<h3 className="font-bold text-gray-900">{ticket.subject}</h3>
							<span
								className={`px-2 py-1 rounded text-xs font-medium border ${
									ticket.status === "open"
										? "bg-blue-50 text-blue-700 border-blue-100"
										: "bg-green-50 text-green-700 border-green-100"
								}`}
							>
								{ticket.status.toUpperCase()}
							</span>
						</div>

						<p className="text-sm text-gray-600 mb-4">{ticket.message}</p>

						{/* THE ADMIN REPLY */}
						{ticket.admin_reply && (
							<div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-100 flex gap-3">
								<CornerDownRight
									className="text-green-600 flex-shrink-0 mt-1"
									size={18}
								/>
								<div>
									<p className="text-xs font-bold text-green-800 uppercase mb-1">
										Support Team Replied
									</p>
									<p className="text-sm text-gray-800">{ticket.admin_reply}</p>
								</div>
							</div>
						)}

						<div className="mt-4 pt-4 border-t border-gray-50 flex gap-4 text-xs text-gray-400">
							<span className="flex items-center gap-1">
								<Calendar size={12} />{" "}
								{new Date(ticket.created_at).toLocaleDateString()}
							</span>
							{ticket.order_id && (
								<span className="flex items-center gap-1">
									<Hash size={12} /> Order: {ticket.order_id}
								</span>
							)}
						</div>
					</div>
				))}

				{(!tickets || tickets.length === 0) && (
					<div className="text-center py-12 text-gray-400">
						No tickets found.
					</div>
				)}
			</div>
		</div>
	);
}
