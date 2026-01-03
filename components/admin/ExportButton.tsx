"use client";

import { Download } from "lucide-react";

type Props = {
	data: any[];
	filename?: string;
};

export default function ExportButton({ data, filename = "report.csv" }: Props) {
	const handleExport = () => {
		if (!data || data.length === 0) {
			alert("No data to export");
			return;
		}

		// 1. Define the headers (Columns)
		const headers = [
			"Order ID",
			"Date",
			"Customer Name",
			"Status",
			"Amount (INR)",
			"Payment Mode",
		];

		// 2. Map the data to match headers
		const csvRows = [
			headers.join(","), // Header Row
			...data.map((row) => {
				const date = new Date(row.created_at).toLocaleDateString();
				const name = row.profiles?.full_name || "Unknown";
				// Escape commas in data to avoid breaking CSV format
				const cleanName = `"${name.replace(/"/g, '""')}"`;

				return [
					row.id,
					date,
					cleanName,
					row.status,
					row.amount,
					row.payment_mode,
				].join(",");
			}),
		];

		// 3. Create the file blob
		const csvString = csvRows.join("\n");
		const blob = new Blob([csvString], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);

		// 4. Trigger Download
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		window.URL.revokeObjectURL(url);
	};

	return (
		<button
			onClick={handleExport}
			className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm"
		>
			<Download size={16} /> Export Report
		</button>
	);
}
