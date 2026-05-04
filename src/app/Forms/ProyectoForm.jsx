import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const ProyectoForm = ({ tipo: tipoInicial = "", onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState(tipoInicial);

  // LOGO
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    formData.append("tipo", tipo);
    if (logo) formData.append("logo", logo);

    console.log("Proyecto listo para enviar", formData);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.98 }}
        transition={{ duration: 0.35 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
            maxWidth: 720,
            mx: "auto",
            p: 6,
            bgcolor: "#f5f5f5",
            borderRadius: 3,
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* TÍTULO */}
          <Typography variant="h5" fontWeight="bold" textAlign="center" color="black">
            Crear Proyecto
          </Typography>

          {/* NOMBRE */}
          <TextField
            size="small"
            label="Nombre del proyecto"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          {/* DESCRIPCIÓN */}
          <TextField
            size="small"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />

          {/* LOGO */}
          <Box
            sx={{
              flexDirection: "column",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar
              src={logoPreview}
              sx={{
                width: 72,
                height: 72,
                bgcolor: "#e0e0e0",
                fontSize: 12,
              }}
            >
              {!logoPreview && "LOGO"}
            </Avatar>

            <Button variant="outlined" component="label" size="small">
              Subir logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoChange}
              />
            </Button>
          </Box>

          {/* FECHAS */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                type="date"
                label="Fecha inicial"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                type="date"
                label="Fecha final"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
              />
            </Grid>
          </Grid>

          {/* TIPO */}
          <FormControl size="small" fullWidth required>
            <InputLabel>Tipo de proyecto</InputLabel>
            <Select
              value={tipo}
              label="Tipo de proyecto"
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="Colaborativo">Colaborativo</MenuItem>
              <MenuItem value="Propio">Propio</MenuItem>
            </Select>
          </FormControl>

          {/* BOTONES */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
            }}
          >
            <Button size="small" variant="outlined" onClick={onCancel}>
              Cancelar
            </Button>
            <Button size="small" variant="contained" type="submit">
              Crear proyecto
            </Button>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProyectoForm;
