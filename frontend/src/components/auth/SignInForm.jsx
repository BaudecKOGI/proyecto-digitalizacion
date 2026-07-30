"use client";

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
import { EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { authClient } from "@/lib/auth/client";
import { useUser } from "@/hooks/use-user";

const schema = zod.object({
	email: zod.string().min(1, { message: "El correo es obligatorio" }).email({ message: "Correo no válido" }),
	password: zod.string().min(1, { message: "La contraseña es obligatoria" }),
});

const defaultValues = { email: "", password: "" };

export function SignInForm() {
	const navigate = useNavigate();

	const { checkSession } = useUser();

	const [showPassword, setShowPassword] = React.useState();

	const [isPending, setIsPending] = React.useState(false);

	const {
		control,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({ defaultValues, resolver: zodResolver(schema) });

	const onSubmit = React.useCallback(
		async (values) => {
			setIsPending(true);

			const { data, error } = await authClient.signInWithPassword(values);

			if (error) {
				setError("root", { type: "server", message: error });
				setIsPending(false);
				return;
			}

			// Refresh the auth state
			await checkSession?.();

			if (data?.user?.rol === "EDITOR") {
				navigate("/editor/hub");
			} else {
				navigate(paths.dashboard.overview);
			}
		},
		[checkSession, navigate, setError]
	);

	return (
		<Stack spacing={4}>
			<Stack spacing={1}>
				<Typography variant="h4">Iniciar sesion</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={2}>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<FormControl error={Boolean(errors.email)}>
								<InputLabel>Correo electronico</InputLabel>
								<OutlinedInput {...field} label="Correo electronico" type="email" />
								{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<FormControl error={Boolean(errors.password)}>
								<InputLabel>Contraseña</InputLabel>
								<OutlinedInput
									{...field}
									endAdornment={
										showPassword ? (
											<EyeIcon
												cursor="pointer"
												fontSize="var(--icon-fontSize-md)"
												onClick={() => {
													setShowPassword(false);
												}}
											/>
										) : (
											<EyeSlashIcon
												cursor="pointer"
												fontSize="var(--icon-fontSize-md)"
												onClick={() => {
													setShowPassword(true);
												}}
											/>
										)
									}
									label="Contraseña"
									type={showPassword ? "text" : "password"}
								/>

								{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
							</FormControl>
						)}
					/>

					<div>
						<Link component={RouterLink} to={paths.auth.resetPassword} variant="subtitle2">
							¿Olvidaste tu contraseña?
						</Link>
					</div>
					{errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
					<Button disabled={isPending} type="submit" variant="contained">
						Iniciar sesion
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}
