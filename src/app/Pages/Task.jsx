import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

const Task = () => {
  const { taskId, id: sprintId, projectId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper
        elevation={4}
        sx={{
          marginTop: 3,
          width: "1100px",
          maxWidth: "95vw",
          height: "80vh",
          borderRadius: 3,
          backgroundColor: "rgba(196, 194, 196, 1)",
          display: "flex",
          flexDirection: "column",
          p: 3,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            marginTop: 1,
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Tarea
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Vista general de la tarea
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" color="success">
              Marcar como completada
            </Button>

            <Button
              variant="outlined"
              color="error"
              sx={{ minWidth: 40 }}
              onClick={() =>
                navigate(`/proyecto/${projectId}/sprint/${sprintId}`)
              }
            >
              ✕
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* TABS */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
          <Tab label="Detalles" />
          <Tab label="Adjuntos" />
          <Tab label="Comentarios" />
        </Tabs>

        <Divider sx={{ mb: 2 }} />

        {/* CONTENIDO */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.4)",
          }}
        >
          {tab === 0 && <Typography>Detalles de la tarea</Typography>}
          {tab === 1 && <Typography>Adjuntos</Typography>}
          {tab === 2 && <Typography>Comentarios</Typography>}
        </Box>
      </Paper>
    </Box>
  );
};

export default Task;
