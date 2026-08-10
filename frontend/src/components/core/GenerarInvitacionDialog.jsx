import * as React from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Link2, Copy, Check, X } from "lucide-react";
import { createInvitacion } from "@/services/api";

const fieldSx = {
  bgcolor: "#F8FAFC",
  borderRadius: "2px 2px 0 0",
  "& .MuiOutlinedInput-root": {
    bgcolor: "#F8FAFC",
    borderRadius: "2px 2px 0 0",
    "& fieldset": { border: "none", borderBottom: "1px solid #002B49" },
    "&:hover fieldset": { border: "none", borderBottom: "1.5px solid #002B49" },
    "&.Mui-focused fieldset": { border: "none", borderBottom: "2px solid #002B49" },
  },
  "& .MuiInputBase-input": { py: 1.2, px: 1.5, fontSize: "0.95rem", color: "#0F172A", fontWeight: 500 },
};

const labelSx = { fontWeight: 600, color: "#1E293B", mb: 0.6, fontSize: "0.85rem" };

const DURACION_OPCIONES = [
  { value: 1, label: "1 hora" },
  { value: 6, label: "6 horas" },
  { value: 12, label: "12 horas" },
  { value: 24, label: "24 horas (por defecto)" },
  { value: 48, label: "48 horas" },
  { value: 72, label: "72 horas" },
  { value: 168, label: "7 días" },
];

// Calcular días y horas a partir de horas totales
const calcularDiasYHoras = (totalHoras) => {
  const dias = Math.floor(totalHoras / 24);
  const horas = totalHoras % 24;
  return { dias, horas };
};

// Calcular horas totales a partir de días y horas
const calcularTotalHoras = (dias, horas) => {
  return (dias || 0) * 24 + (horas || 0);
};

export default function GenerarInvitacionDialog({ open, onClose, tipo, autorNombreInicial = "" }) {
  const [autorNombre, setAutorNombre] = React.useState(autorNombreInicial);
  const [dias, setDias] = React.useState(1);
  const [horas, setHoras] = React.useState(0);
  const [totalHoras, setTotalHoras] = React.useState(24);
  const [status, setStatus] = React.useState("idle");
  const [resultado, setResultado] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [copiado, setCopiado] = React.useState(false);

  // Sincronizar totalHoras con días y horas
  React.useEffect(() => {
    const total = calcularTotalHoras(dias, horas);
    setTotalHoras(total);
  }, [dias, horas]);

  React.useEffect(() => {
    if (open) {
      setAutorNombre(autorNombreInicial || "");
      // Resetear a 24 horas (1 día)
      setDias(1);
      setHoras(0);
      setStatus("idle");
      setResultado(null);
      setErrorMsg("");
      setCopiado(false);
    }
  }, [open, autorNombreInicial]);

  // Determinar si los días/horas coinciden con alguna opción predefinida
  const opcionSeleccionada = DURACION_OPCIONES.find(op => op.value === totalHoras);

  const handleSelectChange = (e) => {
    const value = Number(e.target.value);
    const { dias: d, horas: h } = calcularDiasYHoras(value);
    setDias(d);
    setHoras(h);
  };

  const handleDiasChange = (e) => {
    const val = Math.max(0, Number(e.target.value) || 0);
    setDias(val);
  };

  const handleHorasChange = (e) => {
    const val = Math.max(0, Math.min(23, Number(e.target.value) || 0));
    setHoras(val);
  };

  const link = resultado ? `${window.location.origin}/completar/${resultado.token}` : "";

  async function handleGenerar() {
    if (!autorNombre.trim()) return;
    if (totalHoras < 1) {
      setErrorMsg("La duración debe ser al menos 1 hora.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await createInvitacion({
        tipo,
        autor_nombre: autorNombre.trim(),
        duracion_horas: totalHoras,
      });
      setResultado(data);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "No se pudo generar el enlace.");
      setStatus("error");
    }
  }

  function handleCopiar() {
    navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const expiraTexto = resultado?.expira_en
    ? new Date(resultado.expira_en).toLocaleString("es-PE", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: "6px" } }}>
      <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "8px",
                bgcolor: "#F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#002B49",
              }}
            >
              <Link2 size={18} />
            </Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "text.primary" }}>
              Generar enlace para alumno
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <X size={18} />
          </IconButton>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          El alumno recibirá un enlace para completar los datos de su proyecto{" "}
          {tipo === "3D" ? "3D" : "de software"}. El enlace vence al usarse una vez o al expirar el plazo.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {status !== "success" && (
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="body2" sx={labelSx}>
                Nombre del alumno (autor)
              </Typography>
              <TextField
                fullWidth
                required
                autoFocus
                placeholder="Ej. Alessandro Ramírez"
                value={autorNombre}
                onChange={(e) => setAutorNombre(e.target.value)}
                sx={fieldSx}
                disabled={status === "loading"}
              />
            </Box>

            <Box>
              <Typography variant="body2" sx={labelSx}>
                Duración del enlace
              </Typography>
              <Stack spacing={1.5}>
                <FormControl fullWidth>
                  <Select
                    value={opcionSeleccionada ? opcionSeleccionada.value : ""}
                    onChange={handleSelectChange}
                    displayEmpty
                    sx={fieldSx}
                    disabled={status === "loading"}
                  >
                    <MenuItem value="" disabled>
                      <em>Seleccionar duración</em>
                    </MenuItem>
                    {DURACION_OPCIONES.map((op) => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                    {!opcionSeleccionada && totalHoras > 0 && (
                      <MenuItem value={totalHoras}>
                        Personalizado ({totalHoras}h)
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Días"
                    type="number"
                    value={dias}
                    onChange={handleDiasChange}
                    disabled={status === "loading"}
                    InputProps={{
                      inputProps: { min: 0, max: 30 },
                      endAdornment: <InputAdornment position="end">d</InputAdornment>,
                    }}
                    sx={{ ...fieldSx, width: "50%" }}
                  />
                  <TextField
                    label="Horas"
                    type="number"
                    value={horas}
                    onChange={handleHorasChange}
                    disabled={status === "loading"}
                    InputProps={{
                      inputProps: { min: 0, max: 23 },
                      endAdornment: <InputAdornment position="end">h</InputAdornment>,
                    }}
                    sx={{ ...fieldSx, width: "50%" }}
                  />
                </Stack>
                <Typography variant="caption" color="text.secondary">
                  Total: <strong>{totalHoras} horas</strong>
                </Typography>
              </Stack>
            </Box>

            {status === "error" && (
              <Alert severity="error" sx={{ borderRadius: "2px" }}>
                {errorMsg}
              </Alert>
            )}

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "2px",
                  borderColor: "#002B49",
                  color: "#002B49",
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                onClick={handleGenerar}
                disabled={!autorNombre.trim() || status === "loading" || totalHoras < 1}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "2px",
                  bgcolor: "#002B49",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#001e33", boxShadow: "none" },
                }}
              >
                {status === "loading" ? "Generando..." : "Generar enlace"}
              </Button>
            </Stack>
          </Stack>
        )}

        {status === "success" && (
          <Stack spacing={2.5}>
            <Alert severity="success" sx={{ borderRadius: "2px" }}>
              Enlace generado para <strong>{resultado.autor_nombre}</strong>. Vence el {expiraTexto}.
            </Alert>

            <Box>
              <Typography variant="body2" sx={labelSx}>
                Comparte este enlace con el alumno
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField fullWidth value={link} InputProps={{ readOnly: true }} sx={fieldSx} />
                <Button
                  variant="outlined"
                  onClick={handleCopiar}
                  sx={{
                    minWidth: 110,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: "2px",
                    borderColor: "#002B49",
                    color: "#002B49",
                  }}
                  startIcon={copiado ? <Check size={16} /> : <Copy size={16} />}
                >
                  {copiado ? "Copiado" : "Copiar"}
                </Button>
              </Stack>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="text"
                onClick={() => {
                  setStatus("idle");
                  setResultado(null);
                }}
                sx={{ textTransform: "none", fontWeight: 600, color: "#002B49" }}
              >
                Generar otro
              </Button>
              <Button
                variant="contained"
                onClick={onClose}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "2px",
                  bgcolor: "#002B49",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#001e33", boxShadow: "none" },
                }}
              >
                Listo
              </Button>
            </Stack>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}