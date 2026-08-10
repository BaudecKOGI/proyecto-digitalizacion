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
			<Stack spacing={1}>
				<Typography variant="h4" fontWeight={800} sx={{ color: "#002B49" }}>
					Restablecer contraseña
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Ingresa el correo electrónico asociado a tu cuenta para enviarte un enlace de recuperación
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
					{errors.root ? <Alert color="error" sx={{ borderRadius: "2px" }}>{errors.root.message}</Alert> : null}
					{isSent ? <Alert color="success" sx={{ borderRadius: "2px" }}>Se ha enviado un enlace de recuperación a tu correo.</Alert> : null}
					<Button
						disabled={isPending || isSent}
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
						Enviar enlace de recuperación
					</Button>
				</Stack>
			</form>
            <Typography color="text.secondary" variant="body2" sx={{ textAlign: "center" }}>
                ¿Recuerdas tu contraseña?{" "}
                <Link component={RouterLink} to={paths.auth.signIn} underline="hover" variant="subtitle2" sx={{ color: "#002B49", fontWeight: 600 }}>
                    Iniciar sesión
                </Link>
            </Typography>
		</Stack>
	);
}
