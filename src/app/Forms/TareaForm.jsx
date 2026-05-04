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
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const TareaForm = ({ tipo: tipoInicial = "", onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [comentario, setComentario] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState(tipoInicial);

  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("descripcion", descripcion);
    formData.append("comentario", comentario);
    formData.append("fechaInicio", fechaInicio);
    formData.append("fechaFin", fechaFin);
    formData.append("tipo", tipo);
    if (logo) formData.append("logo", logo);
    console.log("Tarea lista para enviar", formData);
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
            gap: 3,
            marginLeft: 25,
          }}
        >
          <Typography variant="h5" fontWeight="bold" textAlign="center" color="black">
            Crear tarea nueva
          </Typography>

          <TextField
            size="small"
            label="Nombre de la tarea"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
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
          <TextField
            size="small"
            label="Comentario"
            fullWidth
            multiline
            rows={3}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            required
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 12 }}>
            <Button variant="outlined" component="label" size="small">
              Subir archivos
              <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
            </Button>
          </Box>

          <FormControl size="small" fullWidth required>
            <InputLabel>Status tarea</InputLabel>
            <Select
              value={tipo}
              label="Status tarea"
              onChange={(e) => setTipo(e.target.value)}
            >
              <MenuItem value="Por hacer">Por hacer</MenuItem>

            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button size="small" variant="outlined" onClick={onCancel}>
              Cancelar
            </Button>
            <Button size="small" variant="contained" type="submit">
              Crear tarea
            </Button>
          </Box>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default TareaForm;
