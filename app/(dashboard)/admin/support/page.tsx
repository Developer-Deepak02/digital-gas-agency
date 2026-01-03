"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
	Calendar,
	Clock,
	MessageSquare,
	Send,
	CornerDownRight,
	Hash,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";

type Ticket = {
	id: string;
	subject: string;
	message: string;
	order_id: string;
	created_at: string;
	status: string;
	user_id: string;
	admin_reply?: string;
	profiles?: { full_name: string; email: string }; // Optional: if you fetch user details
};

export default function AdminSupportInbox() {
	const [tickets, setTickets] = useState<Ticket[]>([]);
	// Track reply text for each ticket independently
	const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
	const supabase = createClient();

	useEffect(() => {
		fetchTickets();
	}, []);

	const fetchTickets = async () => {
		// Fetch tickets and join profiles to get user names if needed
		const { data } = await supabase
			.from("support_tickets")
			.select(`*, profiles (full_name, email)`)
			.order("created_at", { ascending: false });

		if (data) setTickets(data);
	};

	const handleResolve = async (id: string) => {
		const reply = replyText[id];

		// If Admin typed a reply, save it. Otherwise just resolve.
		const updateData: any = { status: "resolved" };
		if (reply) updateData.admin_reply = reply;

		await supabase.from("support_tickets").update(updateData).eq("id", id);
		fetchTickets(); // Refresh list
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Support Inbox</h1>
				<p className="text-gray-500">
					Reply to queries and mark them as resolved.
				</p>
			</div>

			<div className="grid gap-4">
				{tickets.map((ticket) => (
					<div
						key={ticket.id}
						className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-all hover:shadow-md"
					>
						{/* 1. HEADER: Subject + Status */}
						<div className="flex justify-between items-start mb-2">
							<div>
								<h3 className="font-bold text-gray-900 text-lg">
									{ticket.subject}
								</h3>
								{/* Optional: Show User Name */}
								{ticket.profiles && (
									<p className="text-xs text-gray-400 font-medium">
										From: {ticket.profiles.full_name} ({ticket.profiles.email})
									</p>
								)}
							</div>

							<span
								className={`px-2 py-1 rounded text-xs font-bold border tracking-wide uppercase ${
									ticket.status === "open"
										? "bg-blue-50 text-blue-700 border-blue-100"
										: "bg-green-50 text-green-700 border-green-100"
								}`}
							>
								{ticket.status}
							</span>
						</div>

						{/* 2. USER MESSAGE */}
						<p className="text-sm text-gray-700 mb-6 leading-relaxed">
							{ticket.message}
						</p>

						{/* 3. ACTION AREA */}
						{ticket.status === "open" ? (
							// OPEN TICKET: Show Reply Form
							<div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
								<label className="block text-xs font-bold text-gray-500 uppercase mb-2">
									Write a Reply
								</label>
								<textarea
									className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
									rows={3}
									placeholder="Type your response to the customer..."
									value={replyText[ticket.id] || ""}
									onChange={(e) =>
										setReplyText({ ...replyText, [ticket.id]: e.target.value })
									}
								></textarea>
								<div className="mt-3 flex justify-end">
									<button
										onClick={() => handleResolve(ticket.id)}
										disabled={!replyText[ticket.id]}
										className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-sm"
									>
										<Send size={14} /> Send & Resolve
									</button>
								</div>
							</div>
						) : (
							// RESOLVED TICKET: Show "Your Reply" (Matches User UI)
							ticket.admin_reply && (
								<div className="bg-green-50 p-4 rounded-lg border border-green-100 flex gap-3 animate-in fade-in">
									<CornerDownRight
										className="text-green-600 flex-shrink-0 mt-1"
										size={18}
									/>
									<div>
										<p className="text-xs font-bold text-green-800 uppercase mb-1 flex items-center gap-1">
											<CheckCircle2 size={12} /> You Replied
										</p>
										<p className="text-sm text-gray-800 leading-relaxed">
											{ticket.admin_reply}
										</p>
									</div>
								</div>
							)
						)}

						{/* 4. FOOTER: Metadata */}
						<div className="mt-4 pt-4 border-t border-gray-100 flex gap-4 text-xs text-gray-400 font-medium">
							<span className="flex items-center gap-1.5">
								<Calendar size={14} />
								{new Date(ticket.created_at).toLocaleDateString("en-IN", {
									year: "numeric",
									month: "short",
									day: "numeric",
									hour: "2-digit",
									minute: "2-digit",
								})}
							</span>
							{ticket.order_id && (
								<span className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded text-gray-500">
									<Hash size={12} /> Ref: {ticket.order_id}
								</span>
							)}
						</div>
					</div>
				))}

				{tickets.length === 0 && (
					<div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
						<MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-2" />
						<p className="text-gray-500 font-medium">Inbox is empty</p>
						<p className="text-xs text-gray-400">
							Great job! No pending queries.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
