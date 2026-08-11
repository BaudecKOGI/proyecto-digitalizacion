import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { ListChecks, Lightbulb } from '@phosphor-icons/react/dist/ssr';

export const GuiaPasos = ({ camposCompletados, tipo }) => {
  const pasos = tipo === '3D'
    ? [
        { id: 'titulo', label: 'Título del proyecto' },
        { id: 'autor', label: 'Autor (ya está asignado)' },
        { id: 'carrera', label: 'Seleccionar carrera' },
        { id: 'ciclo', label: 'Seleccionar ciclo' },
        { id: 'categoria', label: 'Seleccionar categoría' },
        { id: 'ods', label: 'Seleccionar ODS (opcional)' },
        { id: 'descripcion', label: 'Escribir descripción' },
        { id: 'archivo', label: 'Subir archivo 3D' },
        { id: 'piezas', label: 'Configurar piezas móviles' },
      ]
    : [
        { id: 'titulo', label: 'Título del proyecto' },
        { id: 'autor', label: 'Autor (ya está asignado)' },
        { id: 'carrera', label: 'Seleccionar carrera' },
        { id: 'ciclo', label: 'Seleccionar ciclo' },
        { id: 'categoria', label: 'Seleccionar categoría' },
        { id: 'ods', label: 'Seleccionar ODS (opcional)' },
        { id: 'descripcion', label: 'Escribir descripción' },
        { id: 'archivos', label: 'Subir archivos (video, portada)' },
        { id: 'tecnologias', label: 'Seleccionar tecnologías' },
      ];

  const completados = camposCompletados || {};
  const total = pasos.length;
  const completadosCount = Object.values(completados).filter(Boolean).length;

  return (
    <Box
      sx={{
        p: 2.5,
        height: '100%',
        bgcolor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        overflowY: 'auto',
      }}
    >
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ color: '#0F172A', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <ListChecks size={22} weight="bold" />
        Guía paso a paso
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          {completadosCount} de {total} completados
        </Typography>
        <Box
          sx={{
            width: 60,
            height: 4,
            bgcolor: '#E2E8F0',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${(completadosCount / total) * 100}%`,
              height: '100%',
              bgcolor: '#0F172A',
              transition: 'width 0.3s ease',
            }}
          />
        </Box>
      </Box>

      <Stack spacing={1.5} sx={{ flex: 1 }}>
        {pasos.map((paso) => {
          const completado = completados[paso.id] || false;
          return (
            <Box
              key={paso.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                p: 0.75,
                borderRadius: 1,
                transition: 'background-color 0.2s',
                '&:hover': {
                  bgcolor: completado ? 'transparent' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: completado ? '#0F172A' : 'transparent',
                  border: completado ? '2px solid #0F172A' : '2px solid #CBD5E1',
                  color: completado ? '#FFFFFF' : '#94A3B8',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                }}
              >
                {completado ? '✓' : pasos.indexOf(paso) + 1}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: completado ? '#334155' : '#1E293B',
                  fontWeight: completado ? 500 : 400,
                  textDecoration: completado ? 'line-through' : 'none',
                  opacity: completado ? 0.7 : 1,
                  fontSize: '0.85rem',
                  transition: 'all 0.3s ease',
                }}
              >
                {paso.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {tipo === '3D' && (
        <Box
          sx={{
            mt: 1,
            p: 1.5,
            bgcolor: '#F1F5F9',
            borderRadius: 2,
            border: '1px solid #E2E8F0',
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            color="#0F172A"
            sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
          >
            <Lightbulb size={16} weight="fill" />
            Tips para piezas móviles
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ mb: 0.5, fontSize: '0.7rem' }}>
            • El <strong style={{ color: '#0F172A' }}>ID</strong> debe coincidir con el nombre en Fusion 360.
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ mb: 0.5, fontSize: '0.7rem' }}>
            • <strong style={{ color: '#0F172A' }}>Eje</strong>: selecciona dirección de rotación (X, Y, Z).
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ mb: 0.5, fontSize: '0.7rem' }}>
            • <strong style={{ color: '#0F172A' }}>Límites</strong>: define el ángulo mínimo y máximo.
          </Typography>
          <Typography variant="caption" display="block" color="#475569" sx={{ fontSize: '0.7rem' }}>
            • <strong style={{ color: '#0F172A' }}>Invertir giro</strong>: invierte la dirección del movimiento.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
