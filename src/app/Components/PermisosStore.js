import { create } from 'zustand';
import { getMisPermisos } from '../../services/usuariosService';

// Permisos del cargo del usuario logueado. Se recargan si cambia el token (otro login).
export const usePermisosStore = create((set, get) => ({
  permisos: null,
  token: null,
  cargar: async () => {
    const token = localStorage.getItem('token');
    if (!token || get().token === token) return;
    set({ token, permisos: null });
    try {
      const { permisos } = await getMisPermisos();
      set({ permisos });
    } catch {
      set({ permisos: {} });
    }
  },
}));

// Una acción que no viene en el módulo cuenta como false
export const puede = (permisos, modulo, accion) => Boolean(permisos?.[modulo]?.[accion]);
export const tieneModulo = (permisos, modulo) => Object.values(permisos?.[modulo] || {}).some(Boolean);
