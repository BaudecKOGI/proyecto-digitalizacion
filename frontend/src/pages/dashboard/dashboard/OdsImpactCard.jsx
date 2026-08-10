import * as React from "react";
import { Paper, Box, Typography, Stack, Grid } from "@mui/material";
import { ODS_LIST } from "../digitalProjects/odsData";

/**
 * Función auxiliar para generar los datos de arco SVG (paths) para el gráfico circular de ODS
 */
const getPieSlicesData = (slices, cx = 140, cy = 135, radius = 95) => {
  let accumulatedAngle = -Math.PI / 2; // Empezar desde arriba (-90 grados)

  return slices.map((slice) => {
    const sliceAngle = (slice.percentage / 100) * (Math.PI * 2);
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + sliceAngle;
    accumulatedAngle = endAngle;

    if (slice.percentage >= 99.9) {
      return {
        ...slice,
        isFullCircle: true,
        cx,
        cy,
        radius,
      };
    }

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    const pathData = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius * 0.65;
    const tx = cx + labelRadius * Math.cos(midAngle);
    const ty = cy + labelRadius * Math.sin(midAngle);

    return {
      ...slice,
      isFullCircle: false,
      pathData,
      tx,
      ty,
    };
  });
};

/**
 * COMPONENTE DE IMPACTO EN ODS Y DISTRIBUCIÓN POR CATEGORÍAS
 */
export default function OdsImpactCard({ disenos = [], proyectos = [], categorias = [] }) {
  const [hoveredSlice, setHoveredSlice] = React.useState(null);
  const [hoveredBar, setHoveredBar] = React.useState(null);

  // 1. Calcular distribución ODS
  const todosLosProyectos = React.useMemo(() => [...disenos, ...proyectos], [disenos, proyectos]);
  const slices = React.useMemo(() => {
    const conteoOds = {};
    todosLosProyectos.forEach((item) => {
      if (item.ods_detalle && Array.isArray(item.ods_detalle)) {
        item.ods_detalle.forEach((odsObj) => {
          const num = Number(odsObj.id);
          conteoOds[num] = (conteoOds[num] || 0) + 1;
        });
      } else if (item.ods) {
        const num = Number(item.ods);
        conteoOds[num] = (conteoOds[num] || 0) + 1;
      }
    });

    const totalConOds = Object.values(conteoOds).reduce((acc, v) => acc + v, 0);

    if (totalConOds > 0) {
      const sorted = Object.entries(conteoOds)
        .map(([odsNum, count]) => {
          const found = ODS_LIST.find((o) => o.id === Number(odsNum));
          return {
            label: found ? found.label.split(":")[0] : `ODS ${odsNum}`,
            fullName: found ? found.label : `ODS ${odsNum}`,
            color: found ? found.color : "#002B49",
            hoverColor: found ? found.color : "#001A2E",
            percentage: Math.round((count / totalConOds) * 100),
            count,
          };
        })
        .sort((a, b) => b.count - a.count);
        // Sin límite — se muestran todos los ODS con proyectos

      const sum = sorted.reduce((acc, s) => acc + s.percentage, 0);
      if (sorted.length > 0 && sum !== 100) {
        sorted[0].percentage += 100 - sum;
      }
      return sorted;
    }

    // Si no hay ODS, retornar un círculo gris (100%)
    return [
      { 
        label: "Sin datos", 
        fullName: "Aún no hay proyectos vinculados", 
        color: "#E2E8F0", 
        hoverColor: "#CBD5E1", 
        percentage: 100, 
        count: 0 
      },
    ];
  }, [todosLosProyectos]);

  const pieSlicesData = React.useMemo(() => getPieSlicesData(slices, 160, 155, 130), [slices]);

  // 2. Calcular distribución por Categorías — SOLO categorías con proyectos asignados
  const { barData, maxVal } = React.useMemo(() => {
    let data = [];
    if (categorias.length > 0) {
      data = categorias
        .map((cat) => {
          const catId = cat.id;
          const valA = proyectos.filter((p) => {
            const pCat = typeof p.categoria === "object" ? p.categoria?.id : Number(p.categoria);
            return pCat === catId;
          }).length;
          const valB = disenos.filter((d) => {
            const dCat = typeof d.categoria === "object" ? d.categoria?.id : Number(d.categoria);
            return dCat === catId;
          }).length;
          return {
            label: cat.nombre.length > 10 ? cat.nombre.substring(0, 9) + "…" : cat.nombre,
            fullName: cat.nombre,
            valA,
            valB,
          };
        })
        .filter((d) => d.valA + d.valB > 0)
        .slice(0, 12);
    }

    const maxReal = Math.max(...data.map((d) => Math.max(d.valA, d.valB)), 0);

    if (maxReal === 0 || data.length === 0) {
      data = [];
    }
    const max = Math.max(...data.map((d) => Math.max(d.valA, d.valB)), 10);
    return { barData: data, maxVal: max };
  }, [categorias, proyectos, disenos]);

  const ySteps = [4, 3, 2, 1, 0];

  return (
    <Grid container spacing={3}>

      {/* 1. TARJETA IZQUIERDA: GRÁFICO CIRCULAR DE ODS */}
      <Grid size={{ xs: 12, lg: 4 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
            bgcolor: "#FFFFFF",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", mb: 1, fontSize: "1.05rem" }}>
              Distribución por ODS
            </Typography>
          </Box>

          {/* Tooltip Flotante de ODS al pasar el mouse — muestra nombre completo y porcentaje */}
          {hoveredSlice && (
            <Paper
              elevation={0}
              sx={{
                position: "absolute",
                top: 70,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: "#FFFFFF",
                boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.14), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                borderRadius: "12px",
                overflow: "hidden",
                zIndex: 20,
                border: "1px solid rgba(0, 0, 0, 0.06)",
                pointerEvents: "none",
                minWidth: 185,
                maxWidth: 240,
              }}
            >
              <Box sx={{ bgcolor: "#F8FAFC", px: 1.8, py: 0.7, borderBottom: "1px solid #F1F5F9", textAlign: "center" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569", fontSize: "0.82rem" }}>
                  {hoveredSlice.label}
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.8, py: 1.2 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: hoveredSlice.color, flexShrink: 0 }} />
                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, fontSize: "0.83rem", flex: 1 }}>
                  {hoveredSlice.fullName}
                </Typography>
                <Typography variant="body2" sx={{ color: "#0F172A", fontWeight: 800, fontSize: "0.85rem" }}>
                  {hoveredSlice.percentage}%
                </Typography>
              </Stack>
            </Paper>
          )}

          {/* SVG Pie Chart — sin leyenda, tooltip al hover */}
          <Box sx={{ display: "flex", justifyContent: "center", my: 2, flex: 1, alignItems: "center" }}>
            <svg
              viewBox="0 0 320 310"
              width="100%"
              style={{ maxWidth: 310, maxHeight: 310 }}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              {pieSlicesData.map((slice, i) => {
                const isHovered = hoveredSlice?.label === slice.label;

                if (slice.isFullCircle) {
                  return (
                    <g key={i} onMouseEnter={() => setHoveredSlice(slice)} style={{ cursor: "pointer" }}>
                      <circle cx={slice.cx} cy={slice.cy} r={slice.radius} fill={slice.color} />
                      {slice.count > 0 && (
                        <text
                          x={slice.cx} y={slice.cy}
                          textAnchor="middle" dominantBaseline="middle"
                          fill="#FFFFFF" fontWeight="700" fontSize="14px" fontFamily="Inter, sans-serif"
                        >
                          100%
                        </text>
                      )}
                    </g>
                  );
                }

                return (
                  <g key={i} onMouseEnter={() => setHoveredSlice(slice)} style={{ cursor: "pointer" }}>
                    <path
                      d={slice.pathData}
                      fill={isHovered ? slice.hoverColor : slice.color}
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      style={{ transition: "fill 0.2s ease" }}
                    />
                    {slice.percentage >= 6 && slice.count > 0 && (
                      <text
                        x={slice.tx} y={slice.ty}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#FFFFFF" fontWeight="700" fontSize="12.5px" fontFamily="Inter, sans-serif"
                        style={{ pointerEvents: "none" }}
                      >
                        {slice.percentage}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </Box>
        </Paper>
      </Grid>

      {/* 2. TARJETA DERECHA: GRÁFICO DE BARRAS POR CATEGORÍA */}
      <Grid size={{ xs: 12, lg: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid rgba(0, 0, 0, 0.05)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.02)",
            bgcolor: "#FFFFFF",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Encabezado */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={2}
            sx={{ mb: 2 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1E293B", fontSize: "1.05rem" }}>
                Proyectos por Categorías
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 500, fontSize: "0.82rem" }}>
                Solo categorías con proyectos asignados
              </Typography>
            </Box>

            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#2563EB" }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.82rem" }}>
                  Proyectos Digitales
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.8} alignItems="center">
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#F59E0B" }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.82rem" }}>
                  Modelos 3D
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Tooltip Flotante */}
          {hoveredBar && (
            <Paper
              elevation={0}
              sx={{
                position: "absolute",
                top: 60,
                left: hoveredBar.xPos ? Math.min(hoveredBar.xPos, 450) : 180,
                bgcolor: "#FFFFFF",
                boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.14), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                borderRadius: "12px",
                overflow: "hidden",
                zIndex: 20,
                border: "1px solid rgba(0, 0, 0, 0.06)",
                pointerEvents: "none",
                minWidth: 175,
              }}
            >
              <Box sx={{ bgcolor: "#F8FAFC", px: 1.8, py: 0.7, borderBottom: "1px solid #F1F5F9", textAlign: "center" }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569", fontSize: "0.82rem" }}>
                  {hoveredBar.category}
                </Typography>
              </Box>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 1.8, py: 1.2 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: hoveredBar.color }} />
                <Typography variant="body2" sx={{ color: "#475569", fontWeight: 500, fontSize: "0.85rem" }}>
                  {hoveredBar.type}:
                </Typography>
                <Typography variant="body2" sx={{ color: "#0F172A", fontWeight: 700, fontSize: "0.85rem", ml: "auto" }}>
                  {hoveredBar.value} {hoveredBar.value === 1 ? "proyecto" : "proyectos"}
                </Typography>
              </Stack>
            </Paper>
          )}

          {/* SVG Vertical Bar Chart con scroll horizontal */}
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              pt: 2,
              pb: 0.5,
              flexGrow: 1,
              "&::-webkit-scrollbar": { height: "5px" },
              "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
              "&::-webkit-scrollbar-thumb": { bgcolor: "rgba(0,0,0,0.15)", borderRadius: "4px" },
            }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            <svg
              viewBox={`0 0 ${Math.max(680, barData.length * 80)} 270`}
              style={{
                width: "100%",
                minWidth: barData.length > 8 ? `${barData.length * 80}px` : 500,
                height: "auto",
                display: "block",
              }}
            >
              {/* Líneas de cuadrícula horizontales */}
              {ySteps.map((step) => {
                const totalWidth = Math.max(680, barData.length * 80);
                const val = Math.round((maxVal * step) / 4);
                const y = 230 - (step / 4) * 190;
                return (
                  <g key={step}>
                    <line
                      x1="45" y1={y}
                      x2={totalWidth - 10} y2={y}
                      stroke="rgba(0, 0, 0, 0.07)" strokeDasharray="4 4" strokeWidth="1"
                    />
                    <text
                      x="35" y={y}
                      textAnchor="end" dominantBaseline="middle"
                      fill="#94A3B8" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Barras verticales agrupadas */}
              {barData.map((cat, i) => {
                const totalWidth = Math.max(680, barData.length * 80);
                const usableWidth = totalWidth - 55;
                const N = barData.length;
                const stepX = usableWidth / N;
                const centerX = 45 + stepX * i + stepX / 2;
                const barWidth = Math.min(18, Math.max(10, stepX * 0.22));

                const xA = centerX - barWidth - 2;
                const hA = maxVal > 0 ? (cat.valA / maxVal) * 190 : 0;
                const yA = 230 - hA;

                const xB = centerX + 2;
                const hB = maxVal > 0 ? (cat.valB / maxVal) * 190 : 0;
                const yB = 230 - hB;

                const isAHovered = hoveredBar?.category === cat.fullName && hoveredBar?.type === "Proyectos Digitales";
                const isBHovered = hoveredBar?.category === cat.fullName && hoveredBar?.type === "Diseños 3D";

                return (
                  <g key={i}>
                    {/* Barra Proyectos Digitales */}
                    {hA > 0 && (
                      <rect
                        x={xA} y={yA} width={barWidth} height={hA} rx="3"
                        fill={isAHovered ? "#1D4ED8" : "#2563EB"}
                        onMouseEnter={() => setHoveredBar({ category: cat.fullName, type: "Proyectos Digitales", value: cat.valA, color: "#2563EB", xPos: Math.max(30, Math.min(centerX - 60, 440)) })}
                        style={{ transition: "fill 0.2s ease", cursor: "pointer" }}
                      />
                    )}
                    {/* Barra Modelos 3D */}
                    {hB > 0 && (
                      <rect
                        x={xB} y={yB} width={barWidth} height={hB} rx="3"
                        fill={isBHovered ? "#D97706" : "#F59E0B"}
                        onMouseEnter={() => setHoveredBar({ category: cat.fullName, type: "Diseños 3D", value: cat.valB, color: "#F59E0B", xPos: Math.max(30, Math.min(centerX - 60, 440)) })}
                        style={{ transition: "fill 0.2s ease", cursor: "pointer" }}
                      />
                    )}
                    {/* Etiqueta Eje X */}
                    <text
                      x={centerX} y="252" textAnchor="middle"
                      fill="#64748B" fontSize="11.5" fontWeight="600" fontFamily="Inter, sans-serif"
                    >
                      {cat.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
