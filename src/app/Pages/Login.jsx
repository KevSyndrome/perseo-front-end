import React from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FcAcceptDatabase } from "react-icons/fc";
import "../../styles/branding.css" 


const LoginModal = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('token', 'loggedin'); // ← fix: guarda la sesión
    navigate("/dashboard");
  };

  const handleRecuperarpass = () => {
    navigate("/recuperarpass");
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
        backgroundColor: "var(--color-secondary)",
        flexDirection: "column",
      }}
    >
      <Card
        sx={{
          width: 450,
          height: 480,
          maxWidth: "90%",
          borderRadius: 3,
          boxShadow: 8,
          zIndex: 2,
          backdropFilter: "blur(8px)",
          backgroundColor: "var(--color-primary)",
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom color="white">
            INICIO DE SESION
          </Typography>

          <Typography variant="body2" textAlign="center" color="var(--color-blanco)" mb={3}>
            Accede a tus proyectos
          </Typography>

          <Divider sx={{ backgroundColor:"var(--color-blanco)", my: 3 }}/>

          <Typography variant="body2" textAlign="light" color="var(--color-terciario)" mb={1}>
            CORREO ELECTRONICO
          </Typography>

          <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              label="usuario@empresa.com"
              type="email"
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--color-secondary)",
                  boxShadow: 8,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" }
                }
              }}
            />

            <Typography variant="body2" textAlign="light" color="var(--color-terciario)">
              CONTRASEÑA
            </Typography>

            <TextField
              label="* * * * * * * * * * * *"
              type="password" 
              fullWidth
              InputLabelProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--color-secondary)",
                  boxShadow: 8,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" }
                }
              }}
            />

            <Button
              variant="contained"
              size="large"
              sx={{ mt: 2, backgroundColor: "var(--color-selection)", "&:hover": { backgroundColor: "#00ACC1" } }}
              onClick={handleLogin}
            >
              Iniciar sesion
            </Button> 
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              <Button variant="text" onClick={handleRecuperarpass} sx={{ color: "var(--color-blanco)" }}>
                ¿Olvidaste tu contraseña?
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginModal;