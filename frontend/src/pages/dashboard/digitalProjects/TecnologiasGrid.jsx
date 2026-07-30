import * as React from "react";
import { Grid, Card, Box, Typography, Stack, IconButton } from "@mui/material";
import { PencilSimple as EditIcon } from "@phosphor-icons/react/dist/ssr/PencilSimple";
import { Trash as TrashIcon } from "@phosphor-icons/react/dist/ssr/Trash";

export default function TecnologiasGrid({ tecnologias, onEdit, onDelete }) {
  return (
    <Grid container spacing={3}>
      {tecnologias.map((tech) => (
        <Grid item xs={12} sm={6} md={3} key={tech.id}>
          <Card
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0px 8px 24px rgba(0,0,0,0.06)"
              }
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {tech.nombre}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Slug: {tech.slug}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.5}>
              <IconButton size="small" onClick={() => onEdit(tech)}>
                <EditIcon size={16} />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(tech.id)}
              >
                <TrashIcon size={16} />
              </IconButton>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
