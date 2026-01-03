import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	} else {
		// Check role to redirect to correct dashboard
		const { data: profile } = await supabase
			.from("profiles")
			.select("role")
			.eq("id", user.id)
			.single();

		// Redirect to the new Home Pages instead of sub-pages
		if (profile?.role === "admin") {
			redirect("/admin");
		} else {
			redirect("/user"); 
		}
	}
}
