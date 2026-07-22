import * as React from "react";
import { GuestGuard } from "@/components/auth/guest-guard";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function Page() {
	return (
		<GuestGuard>
			<ResetPasswordForm />
		</GuestGuard>
	);
}
