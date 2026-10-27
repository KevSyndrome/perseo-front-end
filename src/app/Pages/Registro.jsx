import React, { useState } from "react";
import {
  Box, Card, CardContent, TextField, Button,
  Typography, Divider, Alert, CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { registrarUsuario, loginUsuario } from "../../services/authService";
import { tomarRutaPendiente } from "../../services/api";
import { errorContrasena } from "../../utils/password";
import CampoContrasena from "../Components/CampoContrasena";

const CAMPOS = [
  { key: "nombre", label: "NOMBRE", type: "text", min: 3, max: 45 },
  { key: "apellido_paterno", label: "APELLIDO PATERNO", type: "text", min: 3, max: 50 },
  { key: "apellido_materno", label: "APELLIDO MATERNO", type: "text", min: 3, max: 50 },
  { key: "correo", label: "CORREO ELECTRÓNICO", type: "email" },
  { key: "contraseña", label: "CONTRASEÑA", type: "password" },
  { key: "confirmar_contraseña", label: "CONFIRMAR CONTRASEÑA", type: "password" },
];

const estiloCampo = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--color-secondary)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
  },
  "& .MuiFormHelperText-root": { color: "var(--color-terciario)" },
};

// Mismas reglas que valida el backend (POST /usuarios/registro)
const validar = (form) => {
  for (const c of CAMPOS) {
    const valor = form[c.key].trim();
    if (!valor) return `Completa ${c.label.toLowerCase()}.`;
    if (c.min && (valor.length < c.min || valor.length > c.max)) {
      return `${c.label.charAt(0) + c.label.slice(1).toLowerCase()} debe tener entre ${c.min} y ${c.max} caracteres.`;
    }
  }
  return errorContrasena(form.contraseña, form.confirmar_contraseña);
};

const Registro = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(Object.fromEntries(CAMPOS.map((c) => [c.key, ""])));
  const [error, setError] = useState("");
  const [correoRegistrado, setCorreoRegistrado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");
    setCorreoRegistrado(false);
    const problema = validar(form);
    if (problema) {
      setError(problema);
      return;
    }
    setLoading(true);
    try {
      const datos = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, k.includes("contraseña") ? v : v.trim()]));
      await registrarUsuario(datos);
      // Login automático y, si venía de un link de invitación, se completa la unión
      await loginUsuario(datos.correo, datos.contraseña);
      navigate(tomarRutaPendiente() || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
      setCorreoRegistrado(/ya está registrado/i.test(err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        backgroundColor: "var(--color-secondary)",
        py: 4,
      }}
    >
      <Card
        sx={{
          width: 520, maxWidth: "92%",
          borderRadius: 3, boxShadow: 8,
          backgroundColor: "var(--color-primary)",
        }}
      >
        <CardContent component="form" onSubmit={handleRegistro} sx={{ p: { xs: 3, sm: 5 } }}>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <img
              src="/IsotipoPrometeoColoresOscuros.png"
              alt="Logo Prometeo"
              style={{ width: 64, height: 64, objectFit: "contain" }}
            />
          </Box>

          <Typography variant="h4" textAlign="center" fontWeight="bold" color="white" sx={{ fontSize: { xs: "1.6rem", sm: "2.125rem" } }}>
            CREAR CUENTA
          </Typography>
          <Typography variant="body2" textAlign="center" color="var(--color-blanco)" mb={2}>
            Regístrate para colaborar en proyectos
          </Typography>

          <Divider sx={{ backgroundColor: "var(--color-blanco)", my: 2 }} />

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              action={correoRegistrado && (
                <Button color="inherit" size="small" onClick={() => navigate("/login")}>
                  Iniciar sesión
                </Button>
              )}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
            {CAMPOS.map((c) => { const Campo = c.type === "password" ? CampoContrasena : TextField; return (
              <Box key={c.key} sx={{ gridColumn: c.key === "nombre" || c.key === "correo" ? "1 / -1" : "auto" }}>
                <Typography variant="caption" color="var(--color-terciario)">{c.label}</Typography>
                <Campo
                  {...(c.type !== "password" && { type: c.type })}
                  fullWidth
                  size="small"
                  value={form[c.key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [c.key]: e.target.value }))}
                  inputProps={{ maxLength: c.max }}
                  helperText={c.key === "contraseña" ? "8+ caracteres: mayúscula, minúscula, número y símbolo" : ""}
                  sx={estiloCampo}
                />
              </Box>
            ); })}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: "var(--color-selection)",
              "&:hover": { backgroundColor: "#00ACC1" },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Crear cuenta"}
          </Button>

          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Button variant="text" onClick={() => navigate("/login")} sx={{ color: "var(--color-blanco)" }}>
              ¿Ya tienes cuenta? Inicia sesión
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Registro;
