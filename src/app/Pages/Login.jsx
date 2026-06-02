import React, { useState } from "react";
import { Box, Card, CardContent, TextField, Button, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styles/branding.css";

const BASE_URL = "https://backend-tasks-production-1f22.up.railway.app";

const LoginModal = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError("Correo o contraseña incorrectos");
        return;
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("usuario_id", data.id);
      navigate("/dashboard");

    } catch (err) {
      setError("Error de red, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const handleRecuperarpass = () => {
    navigate("/recuperarpass");
  };

  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", backgroundColor: "var(--color-secondary)", flexDirection: "column" }}>

      <Card sx={{ width: 450, height: 480, maxWidth: "90%", borderRadius: 3,
        boxShadow: 8, zIndex: 2, backdropFilter: "blur(8px)",
        backgroundColor: "var(--color-primary)" }}>
        <CardContent sx={{ p: 6 }}>

          <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom color="white">
            INICIO DE SESION
          </Typography>

          <Typography variant="body2" textAlign="center" color="var(--color-blanco)" mb={3}>
            Accede a tus proyectos
          </Typography>

          <Divider sx={{ backgroundColor: "var(--color-blanco)", my: 3 }} />

          <Typography variant="body2" color="var(--color-terciario)" mb={1}>
            CORREO ELECTRONICO
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <TextField
              label="usuario@empresa.com"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": { backgroundColor: "var(--color-secondary)",
                  boxShadow: 8, "& fieldset": { borderColor: "rgba(255,255,255,0.5)" } } }}
            />

            <Typography variant="body2" color="var(--color-terciario)">
              CONTRASEÑA
            </Typography>

            <TextField
              label="* * * * * * * * * * * *"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: "white" } }}
              sx={{ "& .MuiInputBase-input": { color: "white" },
                "& .MuiOutlinedInput-root": { backgroundColor: "var(--color-secondary)",
                  boxShadow: 8, "& fieldset": { borderColor: "rgba(255,255,255,0.5)" } } }}
            />

            {error && (
              <Typography variant="body2" color="error" textAlign="center">
                {error}
              </Typography>
            )}

            <Button variant="contained" size="large"
              sx={{ mt: 2, backgroundColor: "var(--color-selection)", "&:hover": { backgroundColor: "#00ACC1" } }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
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