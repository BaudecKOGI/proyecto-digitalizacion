"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { EyeSlashIcon } from "@phosphor-icons/react/dist/ssr/EyeSlash";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z as zod } from "zod";

import { paths } from "@/paths";
import { authClient } from "@/lib/auth/client";

const schema = zod.object({
	password: zod.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
	confirmPassword: zod.string().min(1, { message: "Confirma tu nueva contraseña" }),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Las contraseñas no coinciden",
	path: ["confirmPassword"],
});

const defaultValues = { password: "", confirmPassword: "" };

export function UpdatePasswordForm() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const uid = searchParams.get("uid");
	const token = searchParams.get("token");

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
			if (!uid || !token) {
				setError("root", { type: "server", message: "Enlace de recuperación inválido." });
				return;
			}

			setIsPending(true);

			const { error } = await authClient.confirmPasswordReset({
				uid,
				token,
				password: values.password,
			});

			if (error) {
				setError("root", { type: "server", message: error });
				setIsPending(false);
				return;
			}

			setIsPending(false);
			// Redirigimos al login recomendación del usuario
			navigate(paths.auth.signIn, { replace: true });
		},
		[uid, token, navigate, setError]
	);

	if (!uid || !token) {
		return (
			<Alert color="error" sx={{ borderRadius: "2px" }}>
				Enlace inválido o incompleto. Asegúrate de copiar el enlace completo de tu correo.
			</Alert>
		);
	}

	return (
		<Stack spacing={4}>
			<Stack spacing={1}>
				<Typography variant="h4" fontWeight={800} sx={{ color: "#002B49" }}>
					Nueva contraseña
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Escribe tu nueva contraseña a continuación.
				</Typography>
			</Stack>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Stack spacing={3}>
					<Controller
						control={control}
						name="password"
						render={({ field }) => (
							<Box>
								<Typography variant="body2" sx={labelSx}>
									Nueva Contraseña *
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
													onClick={() => setShowPassword(false)}
												/>
											) : (
												<EyeSlashIcon
													cursor="pointer"
													fontSize="var(--icon-fontSize-md)"
													onClick={() => setShowPassword(true)}
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

					<Controller
						control={control}
						name="confirmPassword"
						render={({ field }) => (
							<Box>
								<Typography variant="body2" sx={labelSx}>
									Confirmar Contraseña *
								</Typography>
								<FormControl fullWidth error={Boolean(errors.confirmPassword)}>
									<OutlinedInput
										{...field}
										placeholder="••••••••••••"
										type={showPassword ? "text" : "password"}
										sx={fieldSx}
									/>
									{errors.confirmPassword ? <FormHelperText>{errors.confirmPassword.message}</FormHelperText> : null}
								</FormControl>
							</Box>
						)}
					/>

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
						Guardar y continuar
					</Button>
				</Stack>
			</form>
		</Stack>
	);
}
