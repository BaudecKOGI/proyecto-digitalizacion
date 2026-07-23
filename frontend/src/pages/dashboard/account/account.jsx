import * as React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { AccountDetailsForm } from "@/components/dashboard/account/AccountDetailsForm";
import { AccountInfo } from "@/components/dashboard/account/AccountInfo";

export default function Page() {
	return (
		<Stack spacing={3}>
			<div>
				<Typography variant="h4">Cuenta</Typography>
			</div>
			<Grid container spacing={3}>
				<Grid
					size={{
						lg: 4,
						md: 6,
						xs: 12,
					}}
				>
					<AccountInfo />
				</Grid>
				<Grid
					size={{
						lg: 8,
						md: 6,
						xs: 12,
					}}
				>
					<AccountDetailsForm />
				</Grid>
			</Grid>
		</Stack>
	);
}
