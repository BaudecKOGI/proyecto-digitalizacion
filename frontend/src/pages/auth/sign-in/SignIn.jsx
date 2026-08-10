import * as React from "react";

import { GuestGuard } from "@/components/auth/GuestGuard";
import { SignInForm } from "@/components/auth/SignInForm";

export default function Page() {
	return (
		<GuestGuard>
			<SignInForm />
		</GuestGuard>
	);
}
