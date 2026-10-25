# Cambios: sincronización con backend y limpieza de estilos

Rama: `feature/sync-backend-sesiones-y-estilos` (sale de `develop`)
Fecha: 2026-10-24

## Resumen

1. El front ahora reacciona a los cambios de sesiones y permisos del backend: 401 global, logout después de cambiar la contraseña y Configuración controlada por permisos.
2. Se corrigieron un endpoint mal escrito y el indicador "escribiendo..." del chat.
3. Se limpió el CSS heredado que pisaba las clases de Tailwind: por eso los paddings y márgenes no se aplicaban.

---

## 1. Sesiones y autenticación

### Manejo global de 401
- **Archivo:** `src/services/api.js`, nueva función `apiFetch`.
- **Lógica:** envuelve a `fetch`. Si la respuesta es `401`, borra `localStorage` y `sessionStorage` y redirige a `/login`.
- **Por qué:** los access tokens del backend ahora llevan el id de sesión (`sid`). Los tokens viejos y las sesiones revocadas responden 401, y antes el usuario se quedaba "logueado" con todas las llamadas fallando.
- **Archivos que cambiaron `fetch` por `apiFetch`:** todos los de `src/services/` excepto `authService.js`.
  - El login sigue usando `fetch` normal a propósito: ahí un 401 significa "credenciales inválidas" y no debe redirigir.

> ⚠️ Al desplegar, **todos los usuarios tendrán que volver a iniciar sesión una vez**.

### Cambiar contraseña
- **Archivo:** `src/app/Modals/ChangePasswordModal.jsx`
- **Lógica:** si `PUT /usuarios/cambiar-contraseña` responde 200, se muestra "¡Contraseña actualizada! Vuelve a iniciar sesión." y, 1.5 s después, se ejecuta `logoutUsuario()` y se redirige a `/login`.
- **Por qué:** el backend cierra **todas** las sesiones del usuario al cambiar la contraseña, incluida la actual.

## 2. Permisos

### Configuración (Usuarios / Cargos / Permisos por cargo)
- **Archivo:** `src/app/Pages/Configuration.jsx`
- **Antes:** se comparaba `usuario.cargo_id` contra `VITE_CARGO_ADMIN_ID`.
- **Ahora:** se consulta `GET /permisos-cargos/?cargo_id=<cargo del usuario>` y la página se muestra solo si el módulo `usuarios` tiene la acción `editar` habilitada.
- **Por qué:** el backend exige `usuarios.editar` para escribir en usuarios, cargos, permisos-cargos y tipo-status (si falta, responde 403). Así el front usa la misma regla que el backend y no depende de un id fijo.
- **`.env.example`:** se eliminó `VITE_CARGO_ADMIN_ID`, que ya no se usa. Pueden quitarlo también de su `.env` local.

Permisos que exige el backend (referencia):

| Acción | Permiso |
|---|---|
| `POST /usuarios/` | `usuarios.crear` |
| `PUT /usuarios/desactivar/{id}` | `usuarios.eliminar` |
| `PUT /usuarios/{id}` sobre otro usuario, o cambiando `cargo_id`, `status_logico` o `contraseña` | `usuarios.editar` |
| `POST/PUT/DELETE` en `/cargos/`, `/permisos-cargos/`, `/tipo-status/` | `usuarios.editar` |
| `PUT /usuarios/{id}` sobre uno mismo (nombre, apellidos, correo) | ninguno |

Hoy solo el cargo "Administrador Total" tiene esos permisos.

## 3. Endpoints y chat

- **`src/services/tipoStatusService.js`:** `/tipos-status/` → `/tipo-status/` (singular, como lo define el backend; antes daba 404). El servicio no se usa todavía en ninguna pantalla.
- **`src/services/mensajesServices.js`:** `crearConexionWS` ahora también reenvía el evento `{"type":"typing","usuario_id","usuario_nombre"}`, que llega en la raíz del mensaje y no dentro de `data`. Antes el indicador "escribiendo..." de `Mensajes.jsx` nunca se mostraba.

## 4. Limpieza de estilos (CSS → Tailwind)

### Causa del problema de paddings
`src/styles/branding.css` tenía esta regla global:

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
```

En Tailwind v4 las utilidades viven en `@layer utilities`, y **cualquier CSS fuera de capas gana siempre a las capas**, sin importar la especificidad. Por eso esa regla anulaba todos los `p-*`, `px-*`, `m-*`, etc., incluidos los de las celdas de `DataTable`. Se eliminó; el preflight de Tailwind ya hace ese reset sin pisar las utilidades.

> Regla para el equipo: **no agregar CSS global fuera de `@layer`** en `branding.css` ni en `index.css`. Si hace falta, usar `@layer base { ... }` o, mejor, clases de Tailwind.

### Estado actual de los archivos de estilos
- `src/styles/branding.css`: solo variables (`:root`) y el estilo de `body`. Se importa **una sola vez** en `src/main.jsx`.
- `src/index.css`: `@import "tailwindcss"` y `@theme` con los colores de marca expuestos como utilidades (`bg-primary`, `text-tertiary`, etc.).

### Componentes migrados
| Archivo | Cambio |
|---|---|
| `src/app/Components/Sidebar.jsx` | Clases `app-sidebar*` reemplazadas por Tailwind. |
| `src/app/Layouts/Layout.jsx` | Layout con Tailwind y variables de tamaño (`--sidebar-width`, `--navbar-height`). |
| `src/app/Components/Navbar.jsx` | Usaba clases `app-navbar*` que ya no existían, así que no tenía estilos ni estaba fija arriba. Se migró a Tailwind con el mismo diseño. También se eliminó código muerto de un dropdown que lanzaba `ReferenceError: setDropdownOpen is not defined` en cada clic fuera del avatar, y las props `sidebarOpen`, `sidebarCollapsed` y `onToggleSidebar`, que nadie pasaba. |
| `Navbar.jsx`, `UI/ImageUpload.jsx`, `Forms/LogoutForm.jsx`, `Pages/Login.jsx`, `Pages/Dashboard.jsx` | Se quitaron los `import "branding.css"` duplicados. |

No queda ningún componente que use clases del CSS eliminado.

---

## Pendiente (no incluido en esta rama)

- **Proyectos:** visibilidad por propietario o colaborador, invitación por código y propietario asignado por el backend. Es una propuesta del backend que todavía no está implementada.
- **Colaboradores:** el backend usa `/colaboraciones/...`; `/proyectos-colaborativos` no existe (404). Se va a rediseñar junto con las invitaciones.
- **Módulos rotos en el backend** (no conectar pantallas todavía): `/comentarios`, `/fases/timeline`, `/fases/estadisticas`, `/tareas/estadisticas`, `PUT /fases/reordenar`.
- **Mostrar los 403 en la UI:** hoy los tabs de Configuración solo hacen `console.error` del `detail`.
- `Task.jsx`, `Sprint.jsx` y `Calendar.jsx` siguen usando datos mock.
