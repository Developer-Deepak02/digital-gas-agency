import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
	key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
	key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
	try {
		// 1. Create an order on Razorpay
		const order = await razorpay.orders.create({
			amount: 1000 * 100, // Amount in paise (1000 INR = 100000 paise)
			currency: "INR",
			receipt: "receipt_" + Math.random().toString(36).substring(7),
		});

		// 2. Return the order ID to the frontend
		return NextResponse.json({ orderId: order.id });
	} catch (error) {
		console.error("Error creating Razorpay order:", error);
		return NextResponse.json(
			{ error: "Error creating order" },
			{ status: 500 }
		);
	}
}
