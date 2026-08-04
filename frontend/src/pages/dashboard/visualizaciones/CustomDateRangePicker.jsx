import * as React from "react";
import {
  Popover,
  Box,
  Stack,
  Typography,
  IconButton,
  Button,
  Divider
} from "@mui/material";

const fullMonthsEs = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

const weekDaysEs = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export default function CustomDateRangePicker({
  open,
  anchorEl,
  onClose,
  initialStartDate,
  initialEndDate,
  onApply
}) {
  const [startDate, setStartDate] = React.useState(initialStartDate || new Date());
  const [endDate, setEndDate] = React.useState(initialEndDate || new Date());
  const [viewMonth, setViewMonth] = React.useState(() => (initialStartDate || new Date()).getMonth());
  const [viewYear, setViewYear] = React.useState(() => (initialStartDate || new Date()).getFullYear());

  React.useEffect(() => {
    if (open) {
      setStartDate(null);
      setEndDate(null);
      setViewMonth(new Date().getMonth());
      setViewYear(new Date().getFullYear());
    }
  }, [open]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (clickedDate) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate >= startDate) {
      setEndDate(clickedDate);
    } else {
      setStartDate(clickedDate);
      setEndDate(null);
    }
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0=Dom ... 6=Sáb
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      marginThreshold={12}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      PaperProps={{
        sx: {
          borderRadius: "16px",
          p: 2.5,
          width: { xs: "290px", sm: "320px" },
          maxWidth: "calc(100vw - 24px)",
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          mt: 1,
          bgcolor: "#FFFFFF"
        }
      }}
    >
      {/* Cabecera del calendario: mes, año y flechas de navegación */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <IconButton size="small" onClick={handlePrevMonth} sx={{ color: "#475569" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>{"<"}</Typography>
        </IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#0F172A", textTransform: "lowercase" }}>
          {fullMonthsEs[viewMonth]} de {viewYear}
        </Typography>
        <IconButton size="small" onClick={handleNextMonth} sx={{ color: "#475569" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", lineHeight: 1 }}>{">"}</Typography>
        </IconButton>
      </Stack>

      {/* Días de la semana */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          mb: 0.8
        }}
      >
        {weekDaysEs.map((d) => (
          <Typography
            key={d}
            align="center"
            sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8" }}
          >
            {d}
          </Typography>
        ))}
      </Box>

      {/* Rejilla real del mes */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          rowGap: 0.5
        }}
      >
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <Box key={`empty-${idx}`} sx={{ height: 36 }} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const dayNum = idx + 1;
          const currentCellDate = new Date(viewYear, viewMonth, dayNum);
          const isStart = startDate && isSameDay(currentCellDate, startDate);
          const isEnd = endDate && isSameDay(currentCellDate, endDate);
          const isInRange =
            startDate &&
            endDate &&
            currentCellDate > startDate &&
            currentCellDate < endDate;

          return (
            <Box
              key={dayNum}
              onClick={() => handleDayClick(currentCellDate)}
              sx={{
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                bgcolor:
                  isStart || isEnd
                    ? "#002B49"
                    : isInRange
                      ? "rgba(0, 43, 73, 0.12)"
                      : "transparent",
                borderRadius:
                  isStart && isEnd
                    ? "50%"
                    : isStart
                      ? "50% 0 0 50%"
                      : isEnd
                        ? "0 50% 50% 0"
                        : isInRange
                          ? "0px"
                          : "8px",
                transition: "all 0.15s ease",
                "&:hover": {
                  bgcolor: isStart || isEnd ? "#002B49" : "#F1F5F9"
                }
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: isStart || isEnd ? 700 : 500,
                  color:
                    isStart || isEnd
                      ? "#FFFFFF"
                      : isInRange
                        ? "#002B49"
                        : "#1E293B"
                }}
              >
                {dayNum}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ my: 1.5 }} />

      {/* Botones Cancelar y Aceptar (estilo institucional #002B49) */}
      <Stack direction="row" justifyContent="space-between" gap={1.5}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#002B49",
            borderColor: "#002B49",
            py: 0.7,
            "&:hover": { borderColor: "#002B49", bgcolor: "rgba(0, 43, 73, 0.04)" }
          }}
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          variant="contained"
          disabled={!startDate}
          onClick={() => {
            const s = startDate;
            const e = endDate || startDate;
            onApply(s, e);
            onClose();
          }}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            boxShadow: "none",
            backgroundColor: "#002B49",
            color: "#FFFFFF",
            py: 0.7,
            "&:hover": { backgroundColor: "#001e33", boxShadow: "none" }
          }}
        >
          Aceptar
        </Button>
      </Stack>
    </Popover>
  );
}
