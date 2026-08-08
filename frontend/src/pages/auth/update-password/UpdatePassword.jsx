import * as React from "react";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";

export default function Page() {
	return (
		<GuestGuard>
			<UpdatePasswordForm />
		</GuestGuard>
	);
}
