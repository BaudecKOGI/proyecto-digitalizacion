import React from "react";
import { Box, Stack } from "@mui/material";

export default function ProyectosDigitalesTabs({ activeTab, setActiveTab, proyectosCount, tecnologiasCount, invitacionesCount }) {
  const tabs = [
    { label: `Proyectos Digitales: ${proyectosCount}`, value: 0 },
    { label: `Catálogo de Tecnologías: ${tecnologiasCount}`, value: 1 },
    { label: `Invitaciones: ${invitacionesCount}`, value: 2 }
  ];

  return (
    <Box sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.08)", mb: 3.5 }}>
      <Stack direction="row" spacing={4}>
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.value;
          return (
            <Box
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              sx={{
                position: "relative",
                pb: 1.5,
                cursor: "pointer",
                color: isSelected ? "#111827" : "#94A3B8",
                fontWeight: isSelected ? 700 : 600,
                fontSize: "0.98rem",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#111827"
                },
                "&::after": isSelected
                  ? {
                    content: '""',
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: "2.5px",
                    backgroundColor: "#111827",
                    borderRadius: "2px 2px 0 0"
                  }
                  : {}
              }}
            >
              {tab.label}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
