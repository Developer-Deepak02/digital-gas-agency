"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, Send, Trash2, Loader2, AlertCircle } from "lucide-react";

// Define the type for a notification
type Notification = {
	id: string;
	message: string;
	created_at: string;
	is_active: boolean;
};

export default function AdminNotificationsPage() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const supabase = createClient();

	// Fetch notifications on load
	useEffect(() => {
		fetchNotifications();
	}, []);

	const fetchNotifications = async () => {
		const { data } = await supabase
			.from("notifications")
			.select("*")
			.order("created_at", { ascending: false });
		if (data) setNotifications(data);
	};

	const handlePost = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim()) return;

		setLoading(true);
		const { error } = await supabase
			.from("notifications")
			.insert({ message, is_active: true });

		if (!error) {
			setMessage("");
			fetchNotifications(); // Refresh list
		}
		setLoading(false);
	};

	const handleDelete = async (id: string) => {
		const { error } = await supabase
			.from("notifications")
			.delete()
			.eq("id", id);
		if (!error) fetchNotifications();
	};

	return (
		<div className="max-w-4xl mx-auto space-y-8">
			<div>
				<h1 className="text-3xl font-bold tracking-tight text-gray-900">
					Manage Announcements
				</h1>
				<p className="text-gray-500">
					Post updates that will be visible to all customers.
				</p>
			</div>

			{/* CREATE POST CARD */}
			<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
				<h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
					<Bell className="text-orange-500" size={20} />
					Create New Notification
				</h2>
				<form onSubmit={handlePost} className="flex gap-4">
					<input
						type="text"
						placeholder="Type your announcement here (e.g., 'Gas prices dropping next week!')"
						className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button
						type="submit"
						disabled={loading || !message.trim()}
						className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 font-medium transition-colors"
					>
						{loading ? (
							<Loader2 className="animate-spin h-4 w-4" />
						) : (
							<Send size={16} />
						)}
						Post
					</button>
				</form>
			</div>

			{/* EXISTING NOTIFICATIONS LIST */}
			<div className="space-y-4">
				<h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
					Active Announcements
				</h3>

				{notifications.map((note) => (
					<div
						key={note.id}
						className="flex items-center justify-between p-4 bg-white border border-l-4 border-l-blue-500 border-gray-100 rounded-lg shadow-sm"
					>
						<div className="flex gap-3">
							<AlertCircle
								className="text-blue-500 mt-1 flex-shrink-0"
								size={20}
							/>
							<div>
								<p className="text-gray-900 font-medium">{note.message}</p>
								<p className="text-xs text-gray-400 mt-1">
									Posted on {new Date(note.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>
						<button
							onClick={() => handleDelete(note.id)}
							className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
							title="Delete Notification"
						>
							<Trash2 size={18} />
						</button>
					</div>
				))}

				{notifications.length === 0 && (
					<div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400">
						No active announcements.
					</div>
				)}
			</div>
		</div>
	);
}
