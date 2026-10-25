import React, { useState } from "react";
import { TextField, Button, Typography, Alert, CircularProgress, Box } from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthCard from "../Components/AuthCard";
import { estiloCampoAuth } from "../Components/estiloCampoAuth";
import { restablecerContrasena, logoutUsuario } from "../../services/authService";
import { errorContrasena } from "../../utils/password";

// /restablecer-contrasena?token=XXX (link del correo). Al terminar se cierran todas las
// sesiones de la cuenta, así que también se limpia la de este navegador.
const RestablecerContrasena = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState(token ? "" : "El enlace no tiene token de recuperación.");
  // Token inválido, usado o vencido: solo queda pedir otro enlace
  const [tokenInvalido, setTokenInvalido] = useState(!token);
  const [listo, setListo] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const problema = errorContrasena(nueva, confirmar);
    if (problema) {
      setError(problema);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await restablecerContrasena(token, nueva);
      logoutUsuario();
      setListo(true);
      setTimeout(() => navigate("/login", { replace: true }), 2500);
    } catch (err) {
      setError(err.message);
      setTokenInvalido(/token/i.test(err.message));
    } finally {
      setLoading(false);
    }
  };

  const campo = (label, value, onChange) => (
    <Box>
      <Typography variant="caption" color="var(--color-terciario)">{label}</Typography>
      <TextField type="password" fullWidth size="small" value={value} onChange={(e) => onChange(e.target.value)} sx={estiloCampoAuth} />
    </Box>
  );

  return (
    <AuthCard
      titulo="NUEVA CONTRASEÑA"
      subtitulo="Mínimo 8 caracteres, con mayúscula, minúscula, número y carácter especial."
      onSubmit={listo || tokenInvalido ? undefined : handleSubmit}
    >
      {listo ? (
        <Alert severity="success">Contraseña restablecida. Te llevamos a iniciar sesión...</Alert>
      ) : (
        <>
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={tokenInvalido && (
                <Button color="inherit" size="small" onClick={() => navigate("/recuperar-contrasena")}>
                  Pedir otro
                </Button>
              )}
            >
              {error}
            </Alert>
          )}
          {!tokenInvalido && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {campo("NUEVA CONTRASEÑA", nueva, setNueva)}
              {campo("CONFIRMAR CONTRASEÑA", confirmar, setConfirmar)}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 2, backgroundColor: "var(--color-selection)", "&:hover": { backgroundColor: "#00ACC1" } }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Guardar contraseña"}
              </Button>
            </Box>
          )}
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

export default RestablecerContrasena;
