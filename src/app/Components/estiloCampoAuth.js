// Estilo de los TextField de MUI en las pantallas sin sesión (fondo oscuro)
export const estiloCampoAuth = {
  "& .MuiInputBase-input": { color: "white" },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "var(--color-secondary)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.5)" },
  },
};
