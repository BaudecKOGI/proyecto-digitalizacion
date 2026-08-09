import * as React from "react";
import {
  Paper,
  Box,
  Typography,
  Stack,
  MenuItem,
  Select
} from "@mui/material";
import Chart from "react-apexcharts";

import { Eye as EyeIcon } from "@phosphor-icons/react/dist/ssr/Eye";
import { Heart as HeartIcon } from "@phosphor-icons/react/dist/ssr/Heart";
import { ShareNetwork as ShareNetworkIcon } from "@phosphor-icons/react/dist/ssr/ShareNetwork";

import CustomDateRangePicker from "./CustomDateRangePicker";

const monthNamesEs = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

// GRÁFICO
export default function VisualizacionesChart({ metricas = [], syncButton }) {
  // Pestaña activa
  const [activeTab, setActiveTab] = React.useState("vistas");
  // Período seleccionado ("week" por defecto; se elimina "today")
  const [period, setPeriod] = React.useState("week");

  // Referencia fija al contenedor del Select para anclar el Popover en su posición real y responsive
  const selectContainerRef = React.useRef(null);
  // Estado para el popover de calendario personalizado
  const [anchorElCustom, setAnchorElCustom] = React.useState(null);
  const [customStartDate, setCustomStartDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d;
  });
  const [customEndDate, setCustomEndDate] = React.useState(() => new Date());

  // Totales reales acumulados desde la base de datos
  const totals = React.useMemo(() => {
    const v = metricas.reduce((acc, curr) => acc + (curr.vistas_totales || 0), 0);
    const l = metricas.reduce((acc, curr) => acc + (curr.likes_totales || 0), 0);
    const c = metricas.reduce((acc, curr) => acc + (curr.compartidos_totales || 0), 0);
    return {
      vistas: v,
      likes: l,
      compartidos: c
    };
  }, [metricas]);

  // Configuración institucional para cada pestaña
  const tabConfig = {
    vistas: {
      label: "Vistas",
      titleTotal: "Total Vistas Institucionales",
      color: "#1E88E5", // Azul institucional vibrante
      icon: <EyeIcon size={20} weight="bold" />
    },
    likes: {
      label: "Likes",
      titleTotal: "Total 'Me Gusta'",
      color: "#E11D48", // Rojo/Rosa cálido
      icon: <HeartIcon size={20} weight="bold" />
    },
    compartidos: {
      label: "Compartidos",
      titleTotal: "Total Proyectos Compartidos",
      color: "#10B981", // Verde esmeralda
      icon: <ShareNetworkIcon size={20} weight="bold" />
    }
  };

  const currentTab = tabConfig[activeTab];

  const chartDataConfig = React.useMemo(() => {
    const now = new Date();
    
    // Arrays para las categorías y datos
    let categories = [];
    let seriesData = [];

    if (period === "week") {
      categories = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
      seriesData = new Array(7).fill(0);
      
      const currentDay = now.getDay();
      const distFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distFromMonday);
      startOfWeek.setHours(0,0,0,0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      metricas.forEach(item => {
        const d = new Date(item.ultima_visita || now);
        if (d >= startOfWeek && d < endOfWeek) {
          const idx = (d.getDay() + 6) % 7;
          seriesData[idx] += item[`${activeTab}_totales`] || 0;
        }
      });
    } else if (period === "month") {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      categories = Array.from({ length: daysInMonth }, (_, i) => `${i + 1} ${monthNamesEs[now.getMonth()]}`);
      seriesData = new Array(daysInMonth).fill(0);

      metricas.forEach(item => {
        const d = new Date(item.ultima_visita || now);
        if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
          seriesData[d.getDate() - 1] += item[`${activeTab}_totales`] || 0;
        }
      });
    } else if (period === "year") {
      categories = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      seriesData = new Array(12).fill(0);

      metricas.forEach(item => {
        const d = new Date(item.ultima_visita || now);
        if (d.getFullYear() === now.getFullYear()) {
          seriesData[d.getMonth()] += item[`${activeTab}_totales`] || 0;
        }
      });
    } else if (period === "hist") {
      const currentYear = now.getFullYear();
      categories = [
        String(currentYear - 4),
        String(currentYear - 3),
        String(currentYear - 2),
        String(currentYear - 1),
        String(currentYear)
      ];
      seriesData = new Array(5).fill(0);

      metricas.forEach(item => {
        const d = new Date(item.ultima_visita || now);
        const diff = currentYear - d.getFullYear();
        if (diff >= 0 && diff <= 4) {
          seriesData[4 - diff] += item[`${activeTab}_totales`] || 0;
        }
      });
    } else if (period === "custom") {
      const start = new Date(customStartDate);
      start.setHours(0,0,0,0);
      const end = new Date(customEndDate);
      end.setHours(0,0,0,0);
      const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      const realEnd = new Date(customEndDate);
      realEnd.setHours(23,59,59,999);

      categories = [];
      for (let i = 0; i < diffDays; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        categories.push(`${d.getDate()} ${monthNamesEs[d.getMonth()]}`);
      }
      seriesData = new Array(diffDays).fill(0);

      metricas.forEach(item => {
        const d = new Date(item.ultima_visita || now);
        if (d >= start && d <= realEnd) {
          const dNoTime = new Date(d);
          dNoTime.setHours(0,0,0,0);
          const dayDiff = Math.round((dNoTime - start) / (1000 * 60 * 60 * 24));
          if (dayDiff >= 0 && dayDiff < diffDays) {
            seriesData[dayDiff] += item[`${activeTab}_totales`] || 0;
          }
        }
      });
    }

    return { categories, seriesData };
  }, [period, activeTab, metricas, customStartDate, customEndDate]);

  const series = [
    {
      name: currentTab.label,
      data: chartDataConfig.seriesData
    }
  ];

  // Opciones de ApexCharts
  const options = React.useMemo(() => {
    return {
      chart: {
        type: "area",
        height: 380,
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: "Inter, sans-serif",
        background: "transparent",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 600
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight",
        width: 3.5,
        colors: [currentTab.color]
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.38,
          opacityTo: 0.02,
          stops: [0, 85, 100],
          colorStops: [
            {
              offset: 0,
              color: currentTab.color,
              opacity: 0.38
            },
            {
              offset: 100,
              color: currentTab.color,
              opacity: 0.02
            }
          ]
        }
      },
      markers: {
        size: 5,
        colors: ["#FFFFFF"],
        strokeColors: currentTab.color,
        strokeWidth: 3,
        hover: {
          size: 7
        }
      },
      xaxis: {
        categories: chartDataConfig.categories,
        labels: {
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          style: {
            colors: "#64748B",
            fontSize: "12px",
            fontWeight: 700
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: (val) => Math.round(val).toLocaleString("es-ES"),
          style: {
            colors: "#64748B",
            fontSize: "12px",
            fontWeight: 600
          }
        }
      },
      grid: {
        borderColor: "#F1F5F9",
        strokeDashArray: 4,
        yaxis: {
          lines: { show: true }
        },
        xaxis: {
          lines: { show: false }
        },
        padding: {
          top: 10,
          right: 20,
          bottom: 10,
          left: 20
        }
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `${val.toLocaleString("es-ES")} ${currentTab.label.toLowerCase()}`
        },
        marker: {
          show: true
        }
      }
    };
  }, [currentTab, chartDataConfig.categories]);

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        p: { xs: 2.5, md: 4.5 },
        borderRadius: "12px",
        border: "1px solid rgba(0, 0, 0, 0.06)",
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)",
        bgcolor: "#FFFFFF",
        position: "relative"
      }}
    >
      {/* 1. Título Superior  */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", fontSize: "1.25rem" }}>
            Resumen de Métricas
          </Typography>
        </Box>
        {syncButton && <Box>{syncButton}</Box>}
      </Stack>

      {/* 2. Pestañas Horizontales */}
      <Stack
        direction="row"
        spacing={{ xs: 3, sm: 5 }}
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          mb: 3.5,
          overflowX: "auto",
          flexWrap: "nowrap",
          "&::-webkit-scrollbar": { display: "none" }
        }}
      >
        {Object.keys(tabConfig).map((key) => {
          const tab = tabConfig[key];
          const isSelected = activeTab === key;
          return (
            <Box
              key={key}
              onClick={() => setActiveTab(key)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.2,
                pb: 1.8,
                cursor: "pointer",
                flexShrink: 0,
                borderBottom: isSelected ? `2.5px solid ${tab.color}` : "2.5px solid transparent",
                color: isSelected ? tab.color : "#64748B",
                fontWeight: isSelected ? 700 : 600,
                transition: "all 0.2s ease",
                "&:hover": {
                  color: isSelected ? tab.color : "#1E293B"
                }
              }}
            >
              {tab.icon}
              <Typography variant="body1" sx={{ fontWeight: "inherit", fontSize: "0.98rem" }}>
                {tab.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {/* 3. Sección del Total Real Acumulado y Selector Desplegable */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "#64748B", fontWeight: 700, fontSize: "0.85rem", display: "block" }}
          >
            {currentTab.titleTotal}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "#111827",
              mt: 0.4,
              lineHeight: 1.1,
              fontSize: { xs: "1.9rem", md: "2.5rem" },
              letterSpacing: -0.8
            }}
          >
            {chartDataConfig.seriesData.reduce((acc, val) => acc + val, 0).toLocaleString("es-ES")}
          </Typography>
        </Box>

        <Box ref={selectContainerRef} sx={{ position: "relative" }}>
          <Select
            size="small"
            value={period}
            onChange={(e) => {
              if (e.target.value === "custom") {
                // Se aplicará únicamente al pulsar Aceptar en el popover.
                return;
              }
              setPeriod(e.target.value);
            }}
            renderValue={(selected) => {
              if (selected === "week") return "Esta Semana";
              if (selected === "month") return "Este Mes";
              if (selected === "year") return "Este Año";
              if (selected === "hist") return "Histórico";
              if (selected === "custom") {
                const startStr = `${customStartDate.getDate()} ${monthNamesEs[customStartDate.getMonth()].toLowerCase()}`;
                const endStr = customStartDate.getMonth() === customEndDate.getMonth()
                  ? `${customEndDate.getDate()}`
                  : `${customEndDate.getDate()} ${monthNamesEs[customEndDate.getMonth()].toLowerCase()}`;
                return `${startStr} - ${endStr} · Personalizado`;
              }
              return "";
            }}
            sx={{
              borderRadius: "8px",
              fontSize: "0.9rem",
              fontWeight: 700,
              bgcolor: "#FFFFFF",
              color: "#334155",
              minWidth: 160,
              height: 42,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(0, 0, 0, 0.16)"
              }
            }}
          >
            <MenuItem value="week" sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Esta Semana
            </MenuItem>
            <MenuItem value="month" sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Este Mes
            </MenuItem>
            <MenuItem value="year" sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Este Año
            </MenuItem>
            <MenuItem value="hist" sx={{ fontSize: "0.9rem", fontWeight: 600 }}>
              Histórico
            </MenuItem>
            <MenuItem
              value="custom"
              onClick={(e) => {
                e.stopPropagation();
                setAnchorElCustom(selectContainerRef.current);
              }}
              sx={{ fontSize: "0.9rem", fontWeight: 600 }}
            >
              Personalizado...
            </MenuItem>
          </Select>
        </Box>

        {/* Popover del Calendario Personalizado independiente con CSS Grid */}
        <CustomDateRangePicker
          open={Boolean(anchorElCustom)}
          anchorEl={anchorElCustom}
          onClose={() => setAnchorElCustom(null)}
          initialStartDate={customStartDate}
          initialEndDate={customEndDate}
          onApply={(s, e) => {
            setCustomStartDate(s);
            setCustomEndDate(e);
            setPeriod("custom");
          }}
        />
      </Stack>

      {/* 4. Gráfico ApexCharts*/}
      <Box sx={{ width: "100%", minHeight: 380, mt: 1 }}>
        <Chart
          options={options}
          series={series}
          type="area"
          height={380}
          width="100%"
        />
      </Box>
    </Paper>
  );
}
