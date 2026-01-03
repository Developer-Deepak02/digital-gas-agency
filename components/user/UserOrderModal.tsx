"use client";

import { X, CheckCircle2, Truck, Package, Clock } from "lucide-react";

type Order = {
	id: string;
	status: string;
	created_at: string;
	delivery_date?: string;
};

export default function UserOrderModal({
	order,
	onClose,
}: {
	order: Order;
	onClose: () => void;
}) {
	if (!order) return null;

	// Calculate Expected Delivery (Created Date + 2 Days)
	const createdDate = new Date(order.created_at);
	const expectedDate = new Date(createdDate);
	expectedDate.setDate(createdDate.getDate() + 2);

	// Determine current step index
	let currentStep = 0;
	if (order.status === "approved") currentStep = 1;
	if (order.status === "delivered") currentStep = 2;
	if (order.status === "rejected") currentStep = -1;

	const steps = [
		{
			label: "Order Placed",
			icon: Package,
			date: createdDate.toLocaleDateString(),
		},
		{
			label: "Out for Delivery",
			icon: Truck,
			date: order.status !== "pending" ? "In Transit" : "Pending Approval",
		},
		{
			label: "Delivered",
			icon: CheckCircle2,
			date:
				order.status === "delivered"
					? "Delivered"
					: `Exp: ${expectedDate.toLocaleDateString()}`,
		},
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
			<div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
				{/* Header */}
				<div className="bg-slate-900 p-4 flex justify-between items-center text-white">
					<h3 className="font-bold text-lg">
						Order Tracking #{order.id.slice(0, 6)}
					</h3>
					<button
						onClick={onClose}
						className="hover:bg-white/20 p-1 rounded-full"
					>
						<X size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="p-8">
					{order.status === "rejected" ? (
						<div className="text-center py-8">
							<div className="bg-red-50 text-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
								<X size={32} />
							</div>
							<h3 className="text-xl font-bold text-red-700">Order Rejected</h3>
							<p className="text-gray-500 mt-2">
								Your booking request was declined by the admin.
							</p>
						</div>
					) : (
						<div className="relative">
							{/* Progress Bar Line */}
							<div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>

							{/* Steps */}
							<div className="space-y-8 relative z-10">
								{steps.map((step, index) => {
									const isCompleted = index <= currentStep;
									const isCurrent = index === currentStep;

									return (
										<div key={index} className="flex items-start gap-4">
											{/* Icon Bubble */}
											<div
												className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
													isCompleted
														? "bg-green-600 border-green-600 text-white"
														: "bg-white border-gray-300 text-gray-300"
												}`}
											>
												<step.icon size={20} />
											</div>

											{/* Text */}
											<div className="pt-1">
												<h4
													className={`font-bold text-lg ${
														isCompleted ? "text-gray-900" : "text-gray-400"
													}`}
												>
													{step.label}
												</h4>
												<p className="text-sm text-gray-500 flex items-center gap-1">
													<Clock size={12} /> {step.date}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}

					<div className="mt-8 pt-6 border-t border-gray-100 text-center">
						<p className="text-xs text-gray-400">
							Need help?{" "}
							<a href="/user/support" className="text-blue-600 hover:underline">
								Contact Support
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
