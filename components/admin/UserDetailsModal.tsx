"use client";

import {
	X,
	User,
	Phone,
	MapPin,
	Mail,
	Shield,
	Flame,
	CheckCircle2,
	XCircle,
	Clock,
} from "lucide-react";

type UserProfile = {
	id: string;
	full_name: string;
	email: string;
	mobile: string;
	address: string;
	role: string;
	connection_status: string;
	quota_remaining: number;
	created_at?: string;
};

export default function UserDetailsModal({
	user,
	onClose,
}: {
	user: UserProfile;
	onClose: () => void;
}) {
	if (!user) return null;

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "bg-green-100 text-green-700 border-green-200";
			case "pending":
				return "bg-yellow-100 text-yellow-700 border-yellow-200";
			case "rejected":
				return "bg-red-100 text-red-700 border-red-200";
			default:
				return "bg-gray-100 text-gray-700 border-gray-200";
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="bg-slate-900 p-5 flex justify-between items-center text-white">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-lg font-bold">
							{user.full_name?.charAt(0) || "U"}
						</div>
						<div>
							<h3 className="font-bold text-lg leading-tight">
								{user.full_name}
							</h3>
							<p className="text-xs text-slate-400">
								User ID: {user.id.slice(0, 8)}...
							</p>
						</div>
					</div>
					<button
						onClick={onClose}
						className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
					>
						<X size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto space-y-6">
					{/* Status Badge */}
					<div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
						<span className="text-sm font-medium text-gray-500">
							Connection Status
						</span>
						<span
							className={`px-3 py-1 rounded-full text-xs font-bold uppercase border flex items-center gap-1.5 ${getStatusColor(
								user.connection_status
							)}`}
						>
							{user.connection_status === "active" && (
								<CheckCircle2 size={12} />
							)}
							{user.connection_status === "pending" && <Clock size={12} />}
							{user.connection_status === "rejected" && <XCircle size={12} />}
							{user.connection_status || "Not Applied"}
						</span>
					</div>

					{/* Contact Info */}
					<div>
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
							Contact Details
						</h4>
						<div className="space-y-3">
							<div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
								<Mail size={18} className="text-gray-400" />
								<div>
									<p className="text-xs text-gray-400">Email Address</p>
									<p className="text-sm font-medium text-gray-900">
										{user.email}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
								<Phone size={18} className="text-gray-400" />
								<div>
									<p className="text-xs text-gray-400">Mobile Number</p>
									<p className="text-sm font-medium text-gray-900">
										{user.mobile || "N/A"}
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Address */}
					<div>
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
							Address
						</h4>
						<div className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg bg-orange-50/50 hover:bg-orange-50 transition-colors">
							<MapPin size={18} className="text-orange-500 mt-0.5 shrink-0" />
							<p className="text-sm text-gray-700 leading-relaxed">
								{user.address || "No address provided"}
							</p>
						</div>
					</div>

					{/* Account Details */}
					<div>
						<h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
							Account Info
						</h4>
						<div className="grid grid-cols-2 gap-4">
							<div className="p-3 border border-gray-100 rounded-lg">
								<div className="flex items-center gap-2 text-gray-400 mb-1">
									<Flame size={14} /> <span className="text-xs">Quota</span>
								</div>
								<p className="font-bold text-gray-900">
									{user.quota_remaining} / 12
								</p>
							</div>
							<div className="p-3 border border-gray-100 rounded-lg">
								<div className="flex items-center gap-2 text-gray-400 mb-1">
									<Shield size={14} /> <span className="text-xs">Role</span>
								</div>
								<p className="font-bold text-gray-900 capitalize">
									{user.role}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
