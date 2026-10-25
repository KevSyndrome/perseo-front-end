import React, { useState } from "react";
import { TextField, Button, Typography, Alert, CircularProgress, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthCard from "../Components/AuthCard";
import { estiloCampoAuth } from "../Components/estiloCampoAuth";
import { solicitarRecuperacion } from "../../services/authService";

// /recuperar-contrasena: pide el enlace por correo. El backend responde siempre lo mismo,
// exista o no el correo, para no revelar qué cuentas existen.
const RecuperarContrasena = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!correo.trim()) return;
    setError("");
    setLoading(true);
    try {
      const res = await solicitarRecuperacion(correo.trim());
      setMensaje(res.message || "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      titulo="RECUPERAR CONTRASEÑA"
      subtitulo="Te enviaremos un enlace a tu correo. Vence en 15 minutos."
      onSubmit={mensaje ? undefined : handleSubmit}
    >
      {mensaje ? (
        <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>
      ) : (
        <>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="caption" color="var(--color-terciario)">CORREO ELECTRÓNICO</Typography>
          <TextField
            type="email"
            fullWidth
            size="small"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            sx={estiloCampoAuth}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{ mt: 3, backgroundColor: "var(--color-selection)", "&:hover": { backgroundColor: "#00ACC1" } }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Enviar enlace"}
          </Button>
        </>
      )}
      <Box sx={{ textAlign: "center", mt: 1 }}>
        <Button variant="text" onClick={() => navigate("/login")} sx={{ color: "var(--color-blanco)" }}>
          Volver a iniciar sesión
        </Button>
      </Box>
    </AuthCard>
  );
};

export default RecuperarContrasena;
