"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
	Headphones,
	Mail,
	Phone,
	MessageSquare,
	ChevronDown,
	ChevronUp,
	Send,
	Loader2,
	CheckCircle2,
} from "lucide-react";

// Mock Data for FAQs
const faqs = [
	{
		question: "How long does delivery take?",
		answer:
			"Standard delivery takes 24-48 hours from the time of booking approval.",
	},
	{
		question: "My payment failed but money was deducted.",
		answer:
			"Don't worry! If the amount was deducted, it is usually refunded automatically within 5-7 business days. You can also raise a ticket here with your transaction ID.",
	},
	{
		question: "Can I change my delivery address?",
		answer:
			"Currently, you can only update your address by visiting our local branch or contacting admin support directly.",
	},
	{
		question: "What is the current price of a cylinder?",
		answer:
			"The current subsidized rate is ₹1000 per cylinder for registered members.",
	},
];

export default function SupportPage() {
	const [openFaq, setOpenFaq] = useState<number | null>(0);
	const [loading, setLoading] = useState(false);
	const [sent, setSent] = useState(false);

	const supabase = createClient();
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			const { data } = await supabase.auth.getUser();
			setUserId(data.user?.id || null);
		};
		fetchUser();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userId) return;

		setLoading(true);

		const formData = new FormData(e.target as HTMLFormElement);
		const subject = formData.get("subject") as string;
		const orderIdInput = formData.get("orderId") as string;
		const message = formData.get("message") as string;

		// FIX: Convert empty string to NULL to prevent Database Error
		const orderId = orderIdInput.trim() === "" ? null : orderIdInput.trim();

		const { error } = await supabase.from("support_tickets").insert({
			user_id: userId,
			subject,
			order_id: orderId, // Now sends NULL if empty
			message,
			status: "open",
		});

		if (!error) {
			setSent(true);
		} else {
			console.error(error);
			// Show the actual error message to help debugging
			alert(`Failed to send message: ${error.message}`);
		}
		setLoading(false);
	};

	return (
		<div className="max-w-5xl mx-auto space-y-8">
			{/* HEADER */}
			<div>
				<h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
				<p className="text-gray-500">
					We are here to help. Find answers or contact us directly.
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
				{/* LEFT COLUMN: CONTACT INFO & FAQ */}
				<div className="lg:col-span-1 space-y-6">
					{/* Contact Card */}
					<div className="bg-slate-900 text-white p-6 rounded-xl shadow-md">
						<h3 className="text-lg font-bold flex items-center gap-2 mb-4">
							<Headphones className="text-orange-500" /> Contact Details
						</h3>
						<div className="space-y-4 text-sm text-slate-300">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-slate-800 rounded-lg">
									<Phone size={16} />
								</div>
								<span>+91 98765 43210</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="p-2 bg-slate-800 rounded-lg">
									<Mail size={16} />
								</div>
								<span>support@bookmygas.com</span>
							</div>
							<div className="flex items-center gap-3">
								<div className="p-2 bg-slate-800 rounded-lg">
									<MessageSquare size={16} />
								</div>
								<span>Mon - Sat (9 AM - 6 PM)</span>
							</div>
						</div>
					</div>

					{/* FAQ Accordion */}
					<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
						<div className="p-4 bg-gray-50 border-b border-gray-200">
							<h3 className="font-bold text-gray-900">
								Frequently Asked Questions
							</h3>
						</div>
						<div>
							{faqs.map((faq, index) => (
								<div
									key={index}
									className="border-b border-gray-100 last:border-0"
								>
									<button
										onClick={() => setOpenFaq(openFaq === index ? null : index)}
										className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
									>
										<span className="font-medium text-gray-700 text-sm pr-4">
											{faq.question}
										</span>
										{openFaq === index ? (
											<ChevronUp
												size={16}
												className="text-orange-500 flex-shrink-0"
											/>
										) : (
											<ChevronDown
												size={16}
												className="text-gray-400 flex-shrink-0"
											/>
										)}
									</button>
									{openFaq === index && (
										<div className="px-4 pb-4 text-sm text-gray-500 bg-gray-50/50 leading-relaxed">
											{faq.answer}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* RIGHT COLUMN: CONTACT FORM */}
				<div className="lg:col-span-2">
					<div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
						{!sent ? (
							<>
								<h3 className="text-xl font-bold text-gray-900 mb-6">
									Send us a Message
								</h3>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Subject
											</label>
											<select
												name="subject"
												className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
											>
												<option>General Inquiry</option>
												<option>Payment Issue</option>
												<option>Delivery Delay</option>
												<option>Booking Cancellation</option>
											</select>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">
												Order ID (Optional)
											</label>
											<input
												type="text"
												name="orderId"
												placeholder="e.g. #BOOK-1234"
												className="w-full rounded-md border border-gray-300 p-2.5 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">
											Message
										</label>
										<textarea
											rows={6}
											required
											name="message"
											placeholder="Describe your issue in detail..."
											className="w-full rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
										></textarea>
									</div>
									<div className="flex justify-end pt-2">
										<button
											type="submit"
											disabled={loading}
											className="flex items-center gap-2 bg-orange-600 text-white px-6 py-2.5 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors font-medium"
										>
											{loading ? (
												<Loader2 className="animate-spin h-5 w-5" />
											) : (
												<>
													<Send size={18} /> Send Message
												</>
											)}
										</button>
									</div>
								</form>
							</>
						) : (
							<div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in">
								<div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
									<CheckCircle2 size={40} />
								</div>
								<h3 className="text-2xl font-bold text-gray-900">
									Message Sent!
								</h3>
								<p className="text-gray-500 mt-2 max-w-sm">
									We have received your request. Our support team will respond
									within 24 hours.
								</p>
								<button
									onClick={() => setSent(false)}
									className="mt-8 text-orange-600 font-medium hover:underline"
								>
									Send another message
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
