import * as React from "react";
import { GuestGuard } from "@/components/auth/GuestGuard";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function Page() {
	return (
		<GuestGuard>
			<ResetPasswordForm />
		</GuestGuard>
	);
}
