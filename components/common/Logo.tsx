import { Flame } from "lucide-react";

export default function Logo() {
	return (
		<div className="flex items-center gap-2 mb-8">
			{" "}
			{/* Added margin-bottom for spacing */}
			<Flame className="h-8 w-8 text-orange-500" />
			<span className="text-2xl font-bold tracking-tight text-white">
				BookMyGas
			</span>
		</div>
	);
}
