import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Divider, Alert, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUsuario } from "../../services/authService";
import "../../styles/branding.css";

const LoginModal = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!correo || !contraseña) return;
    setError("");
    setLoading(true);

    try {
      const data = await loginUsuario(correo, contraseña);
      localStorage.setItem("token", data.token || data.access_token || "loggedin");
      localStorage.setItem("usuario", JSON.stringify(data.usuario || data));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <Box
      sx={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100vh",
        display: "flex", alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-secondary)",
        flexDirection: "column",
      }}
    >
      <Card
        sx={{
          width: 450, maxWidth: "90%",
          borderRadius: 3, boxShadow: 8,
          backdropFilter: "blur(8px)",
          backgroundColor: "var(--color-primary)",
        }}
      >
        <CardContent sx={{ p: 6 }}>
          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom color="white">
            INICIO DE SESIÓN
          </Typography>

          <Typography variant="body2" textAlign="center" color="var(--color-blanco)" mb={3}>
            Accede a tus proyectos
          </Typography>

          <Divider sx={{ backgroundColor: "var(--color-blanco)", my: 3 }} />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Typography variant="body2" color="var(--color-terciario)" mb={1}>
            CORREO ELECTRÓNICO
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              label="usuario@empresa.com"
              type="email"
              fullWidth
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              onKeyDown={handleKeyDown}
              InputLabelProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--color-secondary)",
                  boxShadow: 8,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                },
              }}
            />

            <Typography variant="body2" color="var(--color-terciario)">
              CONTRASEÑA
            </Typography>

            <TextField
              label="* * * * * * * * * * * *"
              type="password"
              fullWidth
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              onKeyDown={handleKeyDown}
              InputLabelProps={{ style: { color: "white" } }}
              sx={{
                "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "var(--color-secondary)",
                  boxShadow: 8,
                  "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                },
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              sx={{
                mt: 2,
                backgroundColor: "var(--color-selection)",
                "&:hover": { backgroundColor: "#00ACC1" },
              }}
            >
              {loading
                ? <CircularProgress size={24} sx={{ color: "white" }} />
                : "Iniciar sesión"
              }
            </Button>
          </Box>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button
              variant="text"
              onClick={() => navigate("/recuperarpass")}
              sx={{ color: "var(--color-blanco)" }}
            >
              ¿Olvidaste tu contraseña?
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginModal;