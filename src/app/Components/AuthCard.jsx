import React from "react";
import { Box, Card, CardContent, Typography, Divider } from "@mui/material";

// Tarjeta de las pantallas sin sesión (mismo estilo que Login y Registro)
export default function AuthCard({ titulo, subtitulo, children, onSubmit }) {
  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "var(--color-secondary)",
        py: 4,
      }}
    >
      <Card sx={{ width: 450, maxWidth: "92%", borderRadius: 3, boxShadow: 8, backgroundColor: "var(--color-primary)" }}>
        <CardContent component={onSubmit ? "form" : "div"} onSubmit={onSubmit} sx={{ p: { xs: 3, sm: 5 } }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img src="/IsotipoPrometeoColoresOscuros.png" alt="Logo Prometeo" style={{ width: 64, height: 64, objectFit: "contain" }} />
          </Box>
          <Typography variant="h5" textAlign="center" fontWeight="bold" color="white">
            {titulo}
          </Typography>
          {subtitulo && (
            <Typography variant="body2" textAlign="center" color="var(--color-blanco)" mt={1}>
              {subtitulo}
            </Typography>
          )}
          <Divider sx={{ backgroundColor: "var(--color-blanco)", my: 3 }} />
          {children}
        </CardContent>
      </Card>
    </Box>
  );
}
