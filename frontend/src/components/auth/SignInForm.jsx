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
import Box from "@mui/material/Box";
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

	const fieldSx = {
		bgcolor: "#F8FAFC",
		borderRadius: "2px 2px 0 0",
		"& .MuiOutlinedInput-notchedOutline, & fieldset": {
			border: "none",
			borderBottom: "1px solid #002B49"
		},
		"&:hover .MuiOutlinedInput-notchedOutline, &:hover fieldset": {
			border: "none",
			borderBottom: "1.5px solid #002B49"
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline, &.Mui-focused fieldset": {
			border: "none",
			borderBottom: "2px solid #002B49"
		},
		"& .MuiInputBase-input": {
			py: 1.2,
			px: 1.5,
			fontSize: "0.95rem",
			color: "#0F172A",
			fontWeight: 500
		}
	};

	const labelSx = {
		fontWeight: 600,
		color: "#1E293B",
		mb: 0.6,
		fontSize: "0.85rem"
	};

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
				<Typography variant="h4" fontWeight={800} sx={{ color: "#002B49" }}>
					Iniciar sesión
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Ingresa tus credenciales para acceder a la plataforma administrativa
				</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={3}>
					<Controller
						control={control}
						name="email"
						render={({ field }) => (
							<Box>
								<Typography variant="body2" sx={labelSx}>
									Correo electrónico *
								</Typography>
								<FormControl fullWidth error={Boolean(errors.email)}>
									<OutlinedInput
										{...field}
										placeholder="ejemplo@fablab.pe"
										type="email"
										sx={fieldSx}
									/>
									{errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
								</FormControl>
							</Box>
						)}
					/>

					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<Box>
								<Typography variant="body2" sx={labelSx}>
									Contraseña *
								</Typography>
								<FormControl fullWidth error={Boolean(errors.password)}>
									<OutlinedInput
										{...field}
										placeholder="••••••••••••"
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
										type={showPassword ? "text" : "password"}
										sx={fieldSx}
									/>
									{errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
								</FormControl>
							</Box>
						)}
					/>

					<div>
						<Link component={RouterLink} to={paths.auth.resetPassword} variant="subtitle2" sx={{ color: "#002B49", fontWeight: 600 }}>
							¿Olvidaste tu contraseña?
						</Link>
					</div>
					{errors.root ? <Alert color="error" sx={{ borderRadius: "2px" }}>{errors.root.message}</Alert> : null}
					<Button
						disabled={isPending}
						type="submit"
						variant="contained"
						sx={{
							borderRadius: "2px",
							py: 1.3,
							textTransform: "none",
							fontWeight: 700,
							fontSize: "0.95rem",
							bgcolor: "#002B49",
							color: "#FFFFFF",
							boxShadow: "none",
							"&:hover": {
								bgcolor: "#001e33",
								boxShadow: "none"
							}
						}}
					>
						Iniciar sesión
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}
