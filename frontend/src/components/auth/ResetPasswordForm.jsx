import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink } from "react-router-dom";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { authClient } from "@/lib/auth/client";

const schema = zod.object({
	email: zod.string().min(1, { message: "El correo es obligatorio" }).email({ message: "Correo no válido" }),
});

const defaultValues = { email: "" };

export function ResetPasswordForm() {
	const [isPending, setIsPending] = React.useState(false);
	const [isSent, setIsSent] = React.useState(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (values) => {
			setIsPending(true);

			const { error } = await authClient.resetPassword(values);

			if (error) {
				setError("root", { type: "server", message: error });
				setIsPending(false);
				return;
			}

			setIsPending(false);
			setIsSent(true);
		},
		[setError]
	);

	return (
		<Stack spacing={4}>
			<Typography variant="h4">Restablecer contraseña</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<FormControl error={Boolean(errors.email)}>
								<InputLabel>Correo electrónico</InputLabel>
								<OutlinedInput {...field} label="Correo electrónico" type="email" />
								{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>
					{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					{isSent ? <Alert color="success">Se ha enviado un enlace de recuperación a tu correo.</Alert> : null}
					<Button disabled={isPending || isSent} type="submit" variant="contained">
						Enviar enlace de recuperación
					</Button>
				</Stack>
			</form>
            <Typography color="text.secondary" variant="body2" sx={{ textAlign: "center" }}>
                ¿Recuerdas tu contraseña?{" "}
                <Link component={RouterLink} to={paths.auth.signIn} underline="hover" variant="subtitle2">
                    Iniciar sesión
                </Link>
            </Typography>
		</Stack>
	);
}
