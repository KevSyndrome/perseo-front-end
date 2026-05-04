import React from "react";
import { Box, Card, CardContent, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
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
      }}
    >
      <Card
        sx={{
          width: 500,
          height: 640,
          maxWidth: "80%",
          borderRadius: 3,
          boxShadow: 8,
          zIndex: 2,
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" textAlign="center" fontWeight="bold" gutterBottom color="white">
            Crear cuenta
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nombres"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ input: { color: "white" }, fieldset: { borderColor: "rgba(255,255,255,0.5)" } }}
            />
            <TextField
              label="Apellido Paterno"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ input: { color: "white" }, fieldset: { borderColor: "rgba(255,255,255,0.5)" } }}
            />
            <TextField
              label="Apellido Materno"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ input: { color: "white" }, fieldset: { borderColor: "rgba(255,255,255,0.5)" } }}
            />
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
            <TextField
              label="Confirmar contraseña"
              type="password"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ input: { color: "white" }, fieldset: { borderColor: "rgba(255,255,255,0.5)" } }}
            />

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 2, backgroundColor: "#00BCD4", "&:hover": { backgroundColor: "#00ACC1" } }}
            >
              Registrarse
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              ¿Ya tienes cuenta?{" "}
              <Button variant="text" onClick={handleLogin} sx={{ color: "#00BCD4" }}>
                Inicia sesión
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
