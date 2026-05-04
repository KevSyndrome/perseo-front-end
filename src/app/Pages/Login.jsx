import React from "react";
import { Box, Card, CardContent, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FcAcceptDatabase } from "react-icons/fc";

const LoginModal = () => {
  const navigate = useNavigate(); // Hook para navegación
  const handleLogin = () => {
  // Aquí podrías validar usuario/contraseña
  navigate("/dashboard"); // ruta del Dashboard
};

  const handleRegister = () => {
    navigate("/register"); // Redirige al screen de registro
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        backgroundColor: "#0f1f2e",
        flexDirection: "column",
      }}
    >
      <FcAcceptDatabase size={120} />
      {/* Card centrado */}
      <Card
        sx={{
          width: 400,
          maxWidth: "90%",
          borderRadius: 3,
          boxShadow: 8,
          zIndex: 2,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom color="white">
            Task Board
          </Typography>

          <Typography variant="body2" textAlign="center" color="rgba(255,255,255,0.7)" mb={3}>
            Inicia sesión para continuar
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Correo electrónico"
              type="email"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ input: { color: "white" }, fieldset: { borderColor: "rgba(255,255,255,0.5)" } }}
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ input: { color: "white" }, fieldset: { borderColor: "rgba(255,255,255,0.5)" } }}
            />

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 2, backgroundColor: "#00BCD4", "&:hover": { backgroundColor: "#00ACC1" } }}
              onClick={handleLogin}
            >
              Ingresar
            </Button>
          </Box>

          {/* Mensaje de registro */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              ¿No tienes cuenta?{" "}
              <Button variant="text" onClick={handleRegister} sx={{ color: "#00BCD4" }}>
                Regístrate
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginModal;
