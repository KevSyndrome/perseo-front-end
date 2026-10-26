// Tema de color: data-theme en <html> (lo lee el CSS) + preferencia en localStorage.
// El valor inicial lo pone el script de index.html antes del primer render.
export const temaActual = () => document.documentElement.dataset.theme || 'light';

export const aplicarTema = (tema) => {
  document.documentElement.dataset.theme = tema;
  try {
    localStorage.setItem('tema', tema);
  } catch {
    // Sin almacenamiento (modo privado): el tema dura solo esta pestaña
  }
};
