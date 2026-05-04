import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Avatar,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const Proyect = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ correcto

  // 🔹 Datos simulados (luego vienen del backend)
  const project = {
    name: id,
    description:
      "Este proyecto está enfocado en el desarrollo y gestión de tareas mediante sprints organizados.",
    startDate: "01/01/2026",
    endDate: "30/06/2026",
    type: "Colaborativo",
    status: "Pendiente", // Activo | Pendiente | Inactivo
    owner: "Zio Zukey",
    phases: ["Sprint 1", "Sprint 2", "Sprint 3", "Sprint 4"],
  };

  const statusColor = {
    Activo: "success",
    Pendiente: "warning",
    Inactivo: "default",
  };

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <Paper
        elevation={4}
        sx={{
          width: "1100px",
          backgroundColor: "rgba(196, 194, 196, 1)",
          maxWidth: "90vw",
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#00bcd4",
                width: 100,
                height: 100,
                fontSize: 24,
              }}
            >
              {project.name.charAt(0)}
            </Avatar>

            <Typography variant="h3" fontWeight="bold">
              {project.name}
            </Typography>
          </Box>

          <Chip
            label={project.status}
            color={statusColor[project.status]}
            sx={{ fontWeight: "bold" }}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* INFO */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Propietario
            </Typography>
            <Typography>{project.owner}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Tipo de proyecto
            </Typography>
            <Typography>{project.type}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha inicio
            </Typography>
            <Typography>{project.startDate}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha final
            </Typography>
            <Typography>{project.endDate}</Typography>
          </Grid>
        </Grid>

        {/* DESCRIPCIÓN */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Descripción del proyecto
          </Typography>
          <Typography>{project.description}</Typography>
        </Box>

        {/* SPRINTS */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Fases del proyecto
          </Typography>

          <Stack direction="row" spacing={2} flexWrap="wrap">
            {project.phases.map((phase) => (
              <Button
                key={phase}
                variant="contained"
                sx={{
                  bgcolor: "#122D36",
                  "&:hover": { bgcolor: "#1a3b45" },
                }}
                onClick={() =>
                  navigate(
                    `/proyecto/${id}/sprint/${encodeURIComponent(phase)}`
                  )
                }
              >
                {phase}
              </Button>
            ))}

            <Button
              variant="outlined"
              onClick={() => console.log("Crear nuevo sprint")}
            >
              + Crear Sprint
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => console.log("Eliminar proyecto")}
            >
              Eliminar
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Proyect;
