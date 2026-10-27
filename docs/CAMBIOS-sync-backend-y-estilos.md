# Cambios: sincronización con backend y limpieza de estilos

Fecha: 2026-10-24 / 2026-10-25
Estado: **mergeado en `develop` y en `production`.**

Ramas (ya mergeadas, en este orden):
1. `feature/sync-backend-sesiones-y-estilos`: secciones 1 a 4.
2. `feature/proyectos-invitaciones`: secciones 5 a 8.
3. `feature/modal-unirse-y-avatar`: modal de resultado al unirse y foto del Navbar (secciones 5 y 6).
4. `fix/vercel-spa-rewrites`: `vercel.json` para que recargar una ruta no dé 404.
5. `feature/chat-salas`: chat por salas estilo Discord, fondos, no leídos y avisos en tiempo real (sección 9).
6. `fix/scroll-chat`: el scroll del chat no dejaba ver los mensajes anteriores (sección 9).
7. `feature/fondos-y-responsivo`: fondos con más animación y diseño responsivo en móvil y tablet (sección 10).
8. `fix/chat-movil-pantalla-completa`: el chat en celular ocupa toda la pantalla (sección 10).
9. `feature/invitacion-por-link`: links de invitación para salas y proyectos, y pantalla de registro (sección 11).
10. `feature/chat-pantalla-completa`: chat a pantalla completa en todos los tamaños, menú ⋮ en Safari y modales encima del chat (sección 10).
11. `feature/recuperar-contrasena`: recuperación de contraseña por correo (sección 12).
12. `fix/sesion-persistente`: la sesión dura lo que dice el backend (renovación con refresh token) y la raíz respeta la sesión (sección 1).
13. `feature/logout-revoca-sesion`: cerrar sesión revoca la sesión en el backend; los WebSocket reaccionan al motivo del 1008 (sección 1).
14. `chore/email-logo`: logo chico para los correos (sección 12).
15. `feature/modo-oscuro`: modo oscuro "petróleo profundo" con botón en el Navbar (sección 13).
16. `feature/adjuntos-chat`: imágenes y archivos en el chat, cámara y links clickeables (sección 15). **Requiere** la rama `feature/chat-adjuntos` del backend desplegada.
17. `fix/indicador-escribiendo`: "está escribiendo" sin parpadeo (sección 15).
18. `feature/chat-responder-editar`: responder, editar y eliminar mensajes, y panel de fotos, archivos y enlaces (sección 16). **Requiere** la rama `feature/chat-whatsapp` del backend desplegada.
19. `feature/ver-contrasena`: botón para mostrar u ocultar la contraseña (sección 12).
20. `feature/dashboard-resumen`: Dashboard con carrusel de proyectos con avance y resumen personal (sección 17). **Requiere** la rama `feature/resumen-dashboard` del backend desplegada.
21. `feature/carrusel-anuncio`: el carrusel del Dashboard pasa a banner tipo anuncio que rota solo (sección 17).
22. `feature/carrusel-metricas`: el banner de cada proyecto incluye métricas, mis tareas y el chat del proyecto (sección 17). **Requiere** la rama `feature/resumen-metricas` del backend desplegada.
23. `feature/banner-widgets`: "Tus tareas" y "Chat del proyecto" como columnas altas con scroll dentro del banner (sección 17).
24. `fix/banner-movil`: el Dashboard cabe en una pantalla de celular y deslizar no abre el proyecto (sección 17).

Backend correspondiente: repo `backend-tasks`, desplegado desde la rama `supabase`. El contrato completo está en `docs/CAMBIOS-API.md` de ese repo.

### Antes de usar la versión nueva
- **Todos los usuarios tienen que volver a iniciar sesión una vez**: los tokens anteriores ya no sirven.
- En `.env`, `VITE_CARGO_ADMIN_ID` ya no se usa y se puede borrar.
- El cargo admin es **"Administrador"**. "Administrador Total" es un resto del seed viejo y **no** tiene acceso a los catálogos.
- **Deploy en Vercel:** `vercel.json` manda todas las rutas a `index.html`. Sin esto, recargar o abrir directo una ruta como `/dashboard` o `/proyectos/...` daba `404 NOT_FOUND`, porque Vercel buscaba un archivo con ese nombre y las rutas las maneja React Router en el navegador. Los archivos que sí existen (JS, CSS, imágenes) se siguen sirviendo normal.

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

### Sesión persistente (refresh token)
- **Antes:** el front guardaba solo el *access token*, que dura **15 min** (`EXPIRE_TIME` del backend). Al vencer, el primer 401 mandaba a login, aunque el backend da un *refresh token* de **7 días**.
- **Ahora:**
  - `loginUsuario` guarda también `refresh_token` en `localStorage`.
  - `services/api.js` tiene `refrescarSesion()`: llama a `POST /usuarios/me/refresh`, guarda el par nuevo (el backend **rota** ambos tokens) y comparte **una sola renovación** entre peticiones simultáneas; una segunda renovación con el refresh viejo cerraría la sesión.
  - `apiFetch`: ante un 401 renueva una vez y **repite la petición**. Solo si no se puede renovar limpia la sesión y manda a login (`cerrarSesionYIrALogin`).
  - Canal de avisos (WebSocket): el backend acepta y cierra con **1008** y el motivo en `reason`. "Token inválido o expirado" → renueva **una vez** y reconecta. "Sesión revocada o expirada" → login. Otro motivo (por ejemplo, el cargo sin acceso a mensajes) → no reintenta, para no entrar en bucle. 1006 y otros códigos = red caída → reintenta a los 5 s.
  - Chat de una sala: si el WebSocket se cierra con 1008 (por ejemplo, "No tienes acceso a esta sala"), se muestra el motivo en la barra de error.

### Cerrar sesión
- `logoutUsuario()` llama a `DELETE /usuarios/me/active-sessions/{sid}` (el `sid` sale del access token) para **revocar la sesión en el backend**: ni el access ni el refresh vuelven a servir. Luego borra `localStorage`/`sessionStorage`. Si responde 401 o no hay red, borra igual.
- `LogoutModal` hace una **recarga completa** a `/login`. Antes navegaba dentro de la app, y el canal de avisos y los stores en memoria seguían vivos.
- Cambiar y restablecer contraseña usan `logoutUsuario({ revocar: false })`, porque el backend ya cerró todas las sesiones.
- Probado: después de cerrar sesión, el access y el refresh anteriores responden 401.
- **Rutas:** `/` y cualquier ruta desconocida llevan a `/dashboard` si hay sesión, si no a `/login` (antes `/` mandaba siempre a login). El Login con sesión guardada redirige solo.
- Probado: con el access token vencido el dashboard carga sin pedir login; 5 peticiones simultáneas → 1 renovación → las 5 responden 200; los avisos se reconectan; con el refresh token inválido → login.
- Quien inició sesión antes de este cambio no tiene `refresh_token` guardado: al vencer su token entrará una vez más y desde ahí se mantiene.

### Cambiar contraseña
- **Archivo:** `src/app/Modals/ChangePasswordModal.jsx`
- **Lógica:** si `PUT /usuarios/cambiar-contraseña` responde 200, se muestra "¡Contraseña actualizada! Vuelve a iniciar sesión." y, 1.5 s después, se ejecuta `logoutUsuario()` y se redirige a `/login`.
- **Por qué:** el backend cierra **todas** las sesiones del usuario al cambiar la contraseña, incluida la actual.

## 2. Permisos

### Configuración (Usuarios / Cargos / Permisos por cargo)
- **Archivo:** `src/app/Pages/Configuration.jsx`
- **Antes:** se comparaba `usuario.cargo_id` contra `VITE_CARGO_ADMIN_ID`.
- **Ahora:** usa los permisos del cargo con `GET /usuarios/me/permisos` (ver la sección 7).
- **Por qué:** el backend valida cada acción por permiso (si falta, responde 403). Así el front usa la misma regla que el backend y no depende de un id fijo.
- **`.env.example`:** se eliminó `VITE_CARGO_ADMIN_ID`, que ya no se usa. Pueden quitarlo también de su `.env` local.

Permisos que exige el backend (referencia):

| Acción | Permiso |
|---|---|
| `POST /usuarios/` | `usuarios.crear` |
| `PUT /usuarios/desactivar/{id}` | `usuarios.eliminar` |
| `PUT /usuarios/{id}` sobre otro usuario, o cambiando `cargo_id`, `status_logico` o `contraseña` | `usuarios.editar` |
| `POST/PUT/DELETE` en `/cargos/`, `/permisos-cargos/`, `/tipo-status/` | `configuracion.crear` / `editar` / `eliminar` |
| `PUT /usuarios/{id}` sobre uno mismo (nombre, apellidos, correo) | ninguno |

Cargos base: **Administrador** (todo), **Desarrollador** (todo en proyectos + `usuarios.ver`), **Tester** (ver, editar solo sus tareas, comentar, subir archivos y chatear) y **Usuario Básico** (todo en proyectos; es el cargo que recibe quien se registra).

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

## 5. Proyectos: invitación por código y colaboradores

Reglas del backend: cada usuario solo ve los proyectos donde es **propietario o colaborador**; el propietario se toma del token; ya **no existe `tipo`** y en su lugar viene `colaborativo` (true si hay al menos un colaborador); `codigo_invitacion` solo le llega al propietario.

| Archivo | Cambio |
|---|---|
| `src/services/proyectoService.js` | `getProyectos(page, limit, filtros)` acepta `status_id`, `colaborativo` y `solo_propios`. Funciones nuevas: `subirLogoProyecto`, `eliminarLogoProyecto`, `regenerarCodigoProyecto`, `unirseProyecto`, `getColaboradoresProyecto` y `eliminarColaborador`. Las nuevas lanzan `Error` con el `detail` del backend. |
| `src/app/Forms/ProyectoForm.jsx` | Ya no manda `tipo`, `propietario_id` ni `logo` en base64. El logo se sube con `POST /proyectos/{id}/logo` **después** de crear el proyecto. `fecha_final` se omite si está vacía; antes mandaba "ahora" y el backend la rechazaba por no ser posterior a la inicial. Se muestra el mensaje de validación del backend. La descripción va de 10 a 200 caracteres. Se quitó el selector "Tipo de proyecto". |
| `src/app/Components/UI/TextArea.jsx` | Acepta `minLength` y `maxLength`. |
| `src/app/Forms/UnirseForm.jsx` | El código ahora es de **8 caracteres** (4 — 4); antes eran 6. Bug corregido: el botón nunca se habilitaba porque `code.includes('')` siempre es `true`. Tiene un estado "Uniendo...". |
| `src/app/Modals/UnirseModal.jsx` | Llama a `POST /proyectos/unirse` (antes solo hacía `console.log`). Prop nueva `onUnido(proyecto)`. Al terminar muestra un **modal de resultado**: éxito ("¡Te uniste al proyecto!" con el nombre, y los botones *Cerrar* y *Ver proyecto*) o rechazo ("No se pudo unir" con el motivo del backend, por ejemplo código inválido o ya eres miembro, y los botones *Cerrar* e *Intentar de nuevo*). |
| `src/app/Pages/Proyect.jsx` | "Propios" = soy dueño y no tiene colaboradores. "Colaborativos" = `colaborativo === true`. Al unirse, el proyecto se agrega a la lista y cambia a "Colaborativos". |
| `src/app/Pages/ProyectDetalle.jsx` + `Cards/ProjectDetalleCard.jsx` | **Propietario:** tiene un menú **⋮** en la esquina superior derecha con "Generar código", "Cambiar logo" y "Quitar logo". El código (que ya existe desde que se crea el proyecto) queda **oculto** hasta elegir "Generar código". Ahí se muestra con la opción "Generar nuevo" (el anterior deja de funcionar) y una ✕ para ocultarlo. **Todos:** ven la lista de colaboradores. El propietario puede "Quitar" a alguien y un colaborador puede "Salir"; al salir regresa a `/proyectos`. |

## 6. Perfil

- `POST /usuarios/me/imagen` en `usuariosService.subirImagenPerfil`.
- `Profile/AvatarCard.jsx`: el botón "Cambiar foto" ya funciona y muestra la imagen si existe.
- `Navbar.jsx`: ya **no usa pravatar** (era una foto aleatoria). Pide el usuario con `GET /usuarios/{id}`, con el id del token, y muestra `imagen`. Si no tiene, muestra el ícono genérico de perfil (`CircleUserRound`). Al subir una foto en Perfil se emite el evento `imagen-perfil` y el Navbar se actualiza sin recargar.
- `getTokenPayload()` se movió de `Profile.jsx` a `services/authService.js` para reutilizarlo.

## 7. Permisos por cargo (`GET /usuarios/me/permisos`)

Respuesta: `{ cargo, modulos, permisos: { <modulo>: { ver, crear, editar, eliminar, ... } } }`. Una acción que no viene cuenta como `false`.
Módulos: `dashboard, proyectos, fases, tareas, comentarios, archivos, mensajes, usuarios, configuracion`.

| Archivo | Cambio |
|---|---|
| `src/app/Components/PermisosStore.js` (nuevo) | Store de zustand con los permisos del usuario logueado. Se recarga si cambia el token (otro login). Helpers: `puede(permisos, modulo, accion)` y `tieneModulo(permisos, modulo)`. |
| `src/app/Components/Sidebar.jsx` | "Configuración" solo aparece si el cargo tiene algo de `usuarios` o de `configuracion`. |
| `src/app/Pages/Configuration.jsx` | El tab **Usuarios** depende del módulo `usuarios`; **Cargos** y **Permisos por Cargo** dependen de `configuracion`. Si no tiene ninguno, muestra "No tienes permisos". |
| `src/app/Tabs/UsuariosTab.jsx` | "Nuevo usuario" → `usuarios.crear`; editar y reactivar → `usuarios.editar`; desactivar → `usuarios.eliminar`. |
| `src/app/Tabs/PermisoCargoTab.jsx` | El módulo se elige de un **select** con los 9 nombres exactos. Antes era texto libre y permitía crear "Dashboard" con mayúscula, que el backend no reconoce (ahora daría 422). Para `tareas` aparece además **"Ver todas las tareas"** (`acciones.ver_todas`), en el formulario y en una columna de la tabla. |

En **sus** proyectos el propietario puede hacer todo, sin importar su cargo: no ocultar acciones del dueño dentro de su propio proyecto.

Cargo admin en el esquema nuevo: **"Administrador"**, que tiene todos los módulos incluido `configuracion`. "Administrador Total" es un resto del seed viejo y **no** tiene `configuracion`.

## 8. Otros services alineados

| Service | Cambio |
|---|---|
| `proyectoColaborativoService.js` | **Eliminado** (`/colaboraciones` ya no existe). |
| `archivoService.js` | Se quitaron `getArchivosDrive`, `getArchivoMetadata` y `crearArchivo`. `getArchivos(page, limit, filtros)`: sin filtros devuelve el drive personal. |
| `faseService.js` | `getFases(proyectoId, page, limit)` (proyecto obligatorio). Se quitó `bulkCreateFases`. |
| `tareaService.js` | `getTareas(filtros, page, limit)` con `{ fase_id }` o `{ proyecto_id }`. Se quitó `bulkCreateTareas`. |
| `comentarioService.js` | `getComentarios(tareaId, page, limit)`. |
| `tipoStatusService.js` | Se quitó `getTiposStatusOpciones`. |
| `usuariosService.js` | Se quitó `getUsuarioPublico`. Funciones nuevas: `subirImagenPerfil` y `getMisPermisos`. |
| `mensajesServices.js` | `GET /mensajes/` sin `sala_id` = sala Global. La página 1 trae los más recientes. |

## 9. Chat por salas (estilo Discord)

Backend: sección 9 de `docs/CAMBIOS-API.md`. Tipos de sala: **libre** (Global y otras generales; todos la ven), **proyecto** (se crea sola con cada proyecto; la ven el dueño y los colaboradores) y **privada** (solo miembros; se entra con un código de 8 caracteres).

### Rutas
- `/mensajes` → **panel de tarjetas** (`Pages/Salas.jsx`).
- `/mensajes/:salaId` → **chat de esa sala** (`Pages/Mensajes.jsx`). Antes era siempre la sala Global.

### Archivos
| Archivo | Cambio |
|---|---|
| `src/services/salaService.js` | Reescrito: `getSalas(filtros)` (sin paginación), `getSalaPorId`, `crearSala`, `actualizarSala`, `eliminarSala`, `unirseSala`, `regenerarCodigoSala`, `getMiembrosSala`, `eliminarMiembroSala`, `cambiarFondoSala`, `subirFondoImagenSala` y `quitarFondoSala`. Lanzan `Error` con el `detail` del backend. |
| `src/app/Pages/Salas.jsx` (nuevo) | Cuadrícula de tarjetas: franja con el fondo, ícono por tipo, proyecto, último mensaje, miembros, hora e **insignia de no leídos**. Botones "Crear sala" y "Unirse con código". Con cada aviso en tiempo real, la tarjeta actualiza su último mensaje y sube; las generales quedan primero, como en el backend. |
| `src/app/Pages/Mensajes.jsx` | Usa `salaId` de la URL para el historial y el WebSocket. Tiene un encabezado con ← volver, el nombre y la descripción de la sala y el menú ⋮, y usa el fondo de la sala. Ahora **muestra los errores**: antes se guardaban pero nunca se veían. |
| `src/app/Components/SalaOpciones.jsx` (nuevo) | Menú ⋮ según lo que el backend permite: **Cambiar fondo** (`puede_administrar`), **Código de invitación** (creador de una privada), **Miembros** (el creador puede quitar), **Salir** (miembro de una privada) y **Eliminar sala** (con confirmación; no aparece en Global). |
| `src/app/Forms/SalaForm.jsx` (nuevo) | Crear sala: **privada** (cualquiera), **canal de un proyecto mío** (si eres dueño de alguno) o **general** (requiere el módulo `configuracion`). |
| `src/app/Components/SalaFondo.jsx` + `fondosSala.js` (nuevos) | Fondos animados: `burbujas` (el de antes y el default), `aurora`, `estrellas` y `ondas`. La **clave** es lo que se guarda en el backend (`PUT /salas/{id}/fondo`). Si es imagen, se muestra la URL subida. Para agregar un fondo: agregarlo en `FONDOS_ANIMADOS` y en `COMPONENTES`. |
| `src/app/Modals/UnirseModal.jsx` + `Forms/UnirseForm.jsx` | Prop `entidad="sala"` para reutilizarlos con salas (textos, endpoint y "Abrir sala"). |
| `src/app/Modals/CreateProyectoModal.jsx` | Ahora se dibuja con un **portal** en `body`. Dentro del encabezado del chat (que tiene `backdrop-blur`) el `position: fixed` quedaba relativo al encabezado y el modal salía cortado. También se corrigió la clase rota `z|-40` → `z-40`. |
| `src/app/Components/Sidebar.jsx` | El ítem queda activo también en subrutas (`/mensajes/...`, `/proyectos/...`). |

### Scroll del chat (fix)
El scroll no permitía subir a los mensajes anteriores por tres causas en `Mensajes.jsx`:
1. Al contenedor con `overflow-y-auto` le faltaba `min-h-0`. En un flex en columna, sin eso crece al tamaño de su contenido y nunca hace scroll.
2. Los mensajes se pegaban abajo con `justify-end`, que empuja lo que sobra **hacia arriba, fuera del área de scroll**. Se cambió por `mt-auto`.
3. Al cargar la página anterior, el auto-scroll mandaba otra vez al fondo. Ahora un `useLayoutEffect` conserva la posición al anteponer el historial y solo baja al fondo en la carga inicial o con mensajes nuevos.

### No leídos y avisos en tiempo real
- `src/app/Components/NotificacionesStore.js` (nuevo, zustand) abre **una sola conexión** a `/mensajes/ws/notificaciones` mientras hay sesión (la inicia el Sidebar) y reintenta cada 5 s si se cae, salvo con el código 1008, que significa sesión inválida.
- Los no leídos iniciales salen de `no_leidos` de `GET /salas/`. Cada aviso `nuevo_mensaje` suma +1 a su sala, **excepto si es la sala abierta**, porque ese mensaje ya llega por el WS del chat.
- Al abrir una sala su contador queda en 0; el backend la marca leída solo al abrir el historial o el WS.
- **Sidebar:** la insignia de "Chat" es el total de no leídos. **Navbar:** el punto verde indica que el canal de avisos está conectado.
- Si la pestaña no está a la vista, se muestra una notificación del navegador con el nombre de la sala.
- Se eliminó el contador viejo en `localStorage` (`unread_messages`, `chat_connected`), que solo funcionaba con la pantalla de chat abierta.

## 10. Fondos animados y diseño responsivo

### Fondos (`FloatingBg.jsx`, `SalaFondo.jsx`)
- **Burbujas:** las figuras ahora recorren hasta ±140 px en ciclos de 10 a 18 s (antes ±40 px en 18 a 35 s, casi no se notaba) y son más visibles. Se agregaron burbujas pequeñas que suben de abajo hacia arriba.
- **Aurora:** cuatro manchas grandes y difuminadas (teal, violeta, rosa, azul) que se desplazan y cambian de tamaño. Antes era un solo degradado al 35%.
- **Estrellas:** 220 estrellas que parpadean, el cielo gira lentamente (un ciclo de 4 min) y pasan estrellas fugaces cada pocos segundos.
- Si el usuario activó **"reducir movimiento"** en su sistema operativo, los fondos quedan quietos (`MotionConfig reducedMotion="user"`).

### Responsivo
Puntos de corte de Tailwind: `sm` 640px, `md` 768px, `lg` 1024px.

| Archivo | Cambio |
|---|---|
| `Layouts/Layout.jsx` + `Components/Sidebar.jsx` | **Móvil (<768px):** el sidebar queda oculto y el ☰ lo abre **encima** del contenido, con fondo oscuro; se cierra al tocar fuera o al elegir una opción. **Tablet (<1024px):** arranca colapsado (solo íconos). **Escritorio:** igual que antes. El `main` usa `p-3` en móvil y `p-6` desde `sm`. |
| `Components/Navbar.jsx` | Menos padding lateral en móvil. |
| `Modals/CreateProyectoModal.jsx` | Nunca más ancho ni alto que la pantalla (`max-w`/`max-h` + scroll interno); padding menor en móvil. Aplica a todos los modales que lo usan. |
| `Forms/ProyectoForm.jsx`, `Forms/UsuarioForm.jsx` | Columnas de 2 → 1 en móvil. ProyectoForm ya no tiene alto fijo. |
| `Forms/UnirseForm.jsx`, `Modals/UnirseModal.jsx` | Las 8 casillas del código caben en 360 px (más chicas en móvil). |
| `Pages/Dashboard.jsx` | Tarjetas de acciones: 1 columna en móvil, 3 desde `sm`. |
| `Pages/Profile.jsx` | Grids que estaban en estilos en línea pasados a Tailwind: avatar arriba en móvil, estadísticas en 1, 2 o 3 columnas, e información en 1 o 2 columnas. |
| `Cards/ProjectDetalleCard.jsx` | Logo y título más chicos en móvil; fechas y descripción apiladas. |
| `Pages/Mensajes.jsx` | **Pantalla completa en todos los tamaños:** la sala va `fixed` entre el Navbar y el borde inferior, a la derecha del sidebar. El `Layout` expone `--contenido-left` (0 en móvil; el ancho del sidebar, colapsado o no, desde `md`) y el chat lo usa como `left`, así que sigue al sidebar cuando se colapsa. No depende de `dvh` y no hay doble scroll. Se quedan el encabezado de la sala y la caja de mensaje. La caja usa letra de 16 px en celular porque con menos iOS hace zoom al tocarla, y respeta la barra de inicio del iPhone (`safe-area-inset-bottom`; `viewport-fit=cover` en `index.html`). |
| Encabezado y caja del chat | **Sin `backdrop-blur`:** Safari recorta lo que sobresale de un elemento con `backdrop-filter`, así que el menú ⋮ (y el del clip) se abrían pero quedaban invisibles en iPhone. Ahora usan fondo blanco al 95%. |
| `Modals/CreateProyectoModal.jsx`, `UnirseModal`, `UnirseForm` | `z-[200]`/`z-[210]`: por encima del Navbar (100), del Sidebar (110–120) y del chat a pantalla completa (90). Con `z-50` los modales del menú ⋮ del chat (fondo, código, miembros, eliminar) se abrían **detrás** del chat. |
| Botones ⋮ (sala y proyecto) | Con fondo para que se vean; antes eran un ícono gris pequeño en la esquina. |

Revisado en 390 px (celular) y 820 px (tablet): Dashboard, Proyectos, detalle de proyecto, Perfil, Configuración (la tabla hace scroll horizontal dentro de su tarjeta), panel de salas, chat, menú lateral y modales. No hay scroll horizontal de página.

## 11. Invitación por link y registro

### Links de invitación
- Formato: `<origen>/unirse/sala/<CODIGO>` y `<origen>/unirse/proyecto/<CODIGO>`. Si se regenera el código, el link viejo deja de funcionar.
- **"Copiar link de invitación"** (`Components/CopiarLink.jsx`) aparece junto al código en el menú ⋮ del proyecto y en "Código de invitación" de las salas. Si el portapapeles no está disponible o no responde en 1.5 s, muestra el link en un campo seleccionado para copiarlo a mano.
- **`Pages/UnirsePorLink.jsx`** (ruta `/unirse/:tipo/:codigo`, fuera de `PrivateRoute`):
  - **Con sesión:** llama a `POST /salas/unirse` o `/proyectos/unirse` y navega a la sala o al proyecto. El backend es **idempotente**: si ya eras miembro también responde 200 con el recurso, así que entras directo.
  - **Sin sesión:** guarda la ruta pendiente (`sessionStorage`) y manda a `/login`. Después del login o del registro se vuelve al link y se completa la unión.
  - **404:** "El link de invitación no es válido o fue regenerado".
  - Se hace una sola petición aunque `StrictMode` ejecute el efecto dos veces en desarrollo.
- `services/api.js`: `guardarRutaPendiente` / `tomarRutaPendiente`. Si la sesión vence (401) mientras se abre un link `/unirse/...`, la ruta se conserva para retomarla después del login.

### Registro (`Pages/Registro.jsx`, ruta `/registro`)
- Campos: nombre, apellido paterno, apellido materno, correo, contraseña y confirmación. **No** se manda `cargo_id`: el backend asigna "Usuario Básico".
- Se valida antes de enviar con las mismas reglas del backend: nombre de 3 a 45 caracteres, apellidos de 3 a 50, y contraseña de 8 o más con mayúscula, minúscula, número y carácter especial, igual a la confirmación. Los errores de validación del backend (422) se muestran juntos.
- Si responde 201, inicia sesión automáticamente y sigue con la ruta pendiente si la hay (si no, `/dashboard`).
- "El correo ya está registrado" → la alerta ofrece el botón "Iniciar sesión".
- Links: "¿No tienes cuenta? Regístrate" en Login y "¿Ya tienes cuenta? Inicia sesión" en Registro.
- El rewrite de Vercel (`vercel.json`) ya cubre `/registro` y `/unirse/...`.

## 12. Recuperar contraseña por correo

El backend envía el correo con Brevo; el link vence en **15 minutos** y se puede usar **una sola vez**.

| Archivo | Cambio |
|---|---|
| `Pages/RecuperarContrasena.jsx` (ruta `/recuperar-contrasena`, sin sesión) | Pide el correo → `POST /usuarios/recuperar-contraseña`. Siempre muestra el mismo mensaje genérico, exista o no el correo, para no revelar qué cuentas existen. "¿Olvidaste tu contraseña?" del Login ahora lleva aquí (antes iba a `/recuperarpass`, que no existía). |
| `Pages/RestablecerContrasena.jsx` (ruta `/restablecer-contrasena?token=...`, **sin ñ**: es la que va en el correo) | Nueva contraseña + confirmación → `POST /usuarios/restablecer-contraseña` con `{token, nueva_contraseña}`. Si sale bien: "Contraseña restablecida", se limpia la sesión local (el backend cierra todas) y manda a `/login`. Si el token es inválido, ya se usó o venció: muestra el mensaje del backend y el botón **"Pedir otro"**. |
| `services/authService.js` | `solicitarRecuperacion(correo)` y `restablecerContrasena(token, nueva)` (con `fetch` normal; no hay sesión). |
| `utils/password.js` (nuevo) | `errorContrasena(contraseña, confirmación)`: las reglas del backend (8 o más caracteres, mayúscula, minúscula, número y carácter especial). Lo usan Registro y Restablecer. |
| `Components/AuthCard.jsx` + `estiloCampoAuth.js` (nuevos) | Tarjeta y estilo de campos de las pantallas sin sesión. |
| `Components/CampoContrasena.jsx` (nuevo) | `TextField` de contraseña con el **ojito** para mostrarla u ocultarla (`aria-label` "Mostrar/Ocultar contraseña" y `aria-pressed`; el clic no le quita el foco al campo). Se usa en **Login**, **Registro** (contraseña y confirmación) y **Nueva contraseña** (`/restablecer-contrasena`). Cada campo se muestra por separado. |

### Logo de los correos
- Los correos del backend (por ejemplo, el de recuperación de contraseña) cargan el logo desde el front: `{FRONTEND_URL}/email-logo.png` (`public/email-logo.png`, 112×102 px, 12 KB; el original de 741×672 pesa 228 KB).
- ⚠️ **No renombrar ni mover** `public/email-logo.png` ni `public/IsotipoPrometeoColoresOscuros.png`: los correos se quedarían sin logo. Si cambian, avisar al backend la ruta nueva.

## 13. Modo oscuro

### Paleta: "petróleo profundo"
En vez de gris o slate, el oscuro sale del mismo rango de tono que la marca (~184°–211°: navy `#131C26`, teal `#15878E`, verde agua `#8DBFC4`).

| Token | Claro | Oscuro |
|---|---|---|
| Fondo de la app (`--bg-main`) | `#f1f5f9` | `#0B1A1F` |
| Superficie / tarjetas (`--bg-card`, `bg-white`) | `#ffffff` | `#10242B` |
| Navbar (`--bg-navbar`) | `#ffffff` | `#0F2128` |
| Inputs / rellenos (`--bg-input`, `slate-100`) | `#f9fffe` / `#f1f5f9` | `#1A3841` |
| Bordes (`--border-color`, `slate-200`) | `#e2e8f0` | `#24464F` |
| Texto principal (`--text-primary`, `slate-800`) | `#1e293b` | `#E4F0F1` |
| Texto secundario (`--text-secondary`, `slate-600`) | `#64748b` | `#A9C6C9` |
| Texto tenue (`--text-muted`, `slate-400`) | `#94a3b8` | `#7499A0` |
| Botón fuerte (`--color-boton`) | `#0d3b4a` | `#15878E` |

Contraste del texto sobre la superficie oscura: principal 13.8:1, secundario 8.9:1, tenue 5.2:1.

### Cómo funciona
- `data-theme="dark"` en `<html>`. Un script en `index.html` lo pone **antes del primer render**, con la elección guardada (`localStorage.tema`) o, si no hay, la del sistema (`prefers-color-scheme`). Así no hay parpadeo blanco.
- **Botón ☾/☀ en el Navbar** (`utils/tema.js`: `temaActual`, `aplicarTema`). La preferencia sobrevive al cerrar sesión.
- `styles/branding.css`: tokens semánticos en claro y en oscuro, `color-scheme` (inputs, fechas y scrollbars nativos oscuros) y la base de los fondos de sala (`--fondo-burbujas`, `--fondo-aurora`, `--fondo-ondas`).
- `index.css`: bajo `[data-theme="dark"]` se **redefine la gama `slate` de Tailwind** y los tintes 50/100 de rojo, verde, azul y teal. Como las utilidades usan `var(--color-slate-*)`, toda la app cambia sin tocar cada componente. Ajustes puntuales:
  - `bg-white` (y `/95`, `/80`) → superficie. No se puede remapear por variable porque `text-white` usa la misma.
  - `bg-primary` → teal: el navy de marca se pierde sobre el fondo oscuro (burbujas propias del chat, botón enviar).
  - `text-red-500` → un rojo más claro (el original queda en 4.3:1).
- Las vistas previas de las tarjetas de salas (burbujas, ondas) también cambian con el tema (`--preview-*`).
- Colores fijos que se pasaron a variables: Perfil (`AvatarCard`, `StatCard`, `InfoSection`, `Profile`), `ChangePasswordModal`, Navbar, Sidebar (botón ☰ y tooltip), `ImageUpload`, toggle de Proyectos, unirse por código y fondos de sala (burbujas, aurora y ondas tienen base oscura; estrellas ya era oscuro).

- Probado en el navegador: Dashboard, Proyectos, detalle, panel de salas, chat (burbujas recibidas sobre la superficie, propias en teal), menús y modales, Configuración y Perfil en oscuro; el modo claro sin cambios; la preferencia se mantiene al recargar.

### Para el equipo
- Usar `bg-white`, la gama `slate` de Tailwind o las variables semánticas (`--bg-card`, `--text-primary`, `--border-color`…). **No** poner hex fijos (`#fff`, `#1a1a1a`, `#e0e0e0`) en estilos en línea, porque no cambian con el tema.
- Login, Registro y Recuperar ya eran oscuros y no cambian.

## 14. Invitar desde el chat
- En las salas **privadas**, la opción del menú ⋮ se llama ahora **"Invitar (código o link)"** (antes "Código de invitación"). Solo la ve quien creó la sala.
- En las salas **de proyecto**, el dueño del proyecto ve **"Invitar al proyecto"**, que lleva al detalle del proyecto con el código y "Copiar link de invitación" ya visibles (`?invitar=1`). Estas salas no tienen código propio porque sus miembros vienen del proyecto.
- La sala Global no tiene invitación (la ven todos).

## 15. Adjuntos en el chat

Backend: `POST /mensajes/` multipart (`file` obligatorio, `mensaje` opcional, `sala_id` opcional). Cada mensaje (historial, `new_message`, `nuevo_mensaje`) trae `archivos: [{id, nombre_archivo, fileURL, extension}]`; `extension` va sin punto y en minúsculas. Máximo 10 MB; tipos: png, jpg, jpeg, gif, webp, pdf, doc, docx, xls, xlsx, txt y zip.

| Archivo | Cambio |
|---|---|
| `Components/AttachmentMenu.jsx` | Opciones **Imagen**, **Documento**, **Archivo** y **Cámara**. Se quitó "Enlace": los links escritos en el mensaje se vuelven clickeables solos. Antes ninguna opción hacía nada (`onSelect={() => {}}`). |
| `Pages/Mensajes.jsx` | Selector de archivo con el filtro de cada opción. Valida tipo y tamaño **antes** de enviar. Muestra una **vista previa** (miniatura o ícono, nombre y tamaño; se puede quitar y agregar un mensaje). Con archivo se envía por REST y el mensaje llega a todos, también al autor, por el WebSocket de la sala. Un solo `aVista()` convierte los mensajes del historial y del WebSocket (antes había dos copias). |
| `Components/CamaraModal.jsx` (nuevo) | **Cámara en computadora:** primero avisa "Estás en una computadora… te recomendamos usar esta opción desde tu celular". Si el usuario sigue, usa la webcam (`getUserMedia`) para tomar la foto, y la apaga al cerrar. **En celular** se usa el selector con `capture="environment"`, que abre la cámara nativa. |
| `Components/ContenidoMensaje.jsx` (nuevo) | Imágenes en línea (miniatura que se abre en una pestaña nueva), demás archivos como tarjeta con nombre, tipo y descarga, y texto con links `http(s)` clickeables (`target=_blank`, `rel=noopener noreferrer`). |
| `utils/archivos.js`, `utils/enlaces.js` (nuevos) | Reglas de archivos iguales a las del backend, tamaño legible, detección de celular, y separación de texto y links (solo `http`/`https`; quita la puntuación final). |
| `services/mensajesServices.js` | `enviarMensajeConArchivo(salaId, mensaje, file)`. |
| `Pages/Salas.jsx`, `NotificacionesStore.js` | Un mensaje que solo trae archivo se muestra como "📎 Archivo" / "Envió un archivo". |

En local, el backend guarda los archivos en disco (`STORAGE_LOCAL_URL`); en Railway usa Cloudinary.

### "Está escribiendo…" sin parpadeo
- **Antes:** se mandaba un aviso por cada tecla, cada aviso programaba su propio temporizador de 3 s (el primero que vencía borraba el indicador aunque la persona siguiera escribiendo, y el siguiente aviso lo volvía a mostrar) y el indicador estaba dentro de la lista, así que al aparecer y desaparecer hacía saltar los mensajes.
- **Ahora:** el emisor manda como máximo un aviso cada 2 s. El receptor tiene un temporizador por persona que se reinicia con cada aviso (4 s) y se quita en cuanto llega su mensaje. El indicador flota sobre la caja de mensaje con un fundido, sin mover la lista, y los tres puntos rebotan en secuencia.
- Probado: escribir, pausar 1.5 s y volver a escribir → el indicador aparece una sola vez, sin huecos, y se va 4 s después de la última tecla.

## 16. Responder, editar, eliminar y lo compartido (estilo WhatsApp)

Backend (`feature/chat-whatsapp`): `PUT`/`DELETE /mensajes/{id}` (solo el autor) se transmiten a la sala como `mensaje_editado` / `mensaje_eliminado`; cada mensaje trae `editado`, `respuesta_a_id` y `respuesta_a: {id, mensaje, usuario, tiene_archivo}`; `GET /salas/{id}/compartido?tipo=imagenes|archivos|enlaces`.

| Archivo | Cambio |
|---|---|
| `Components/BurbujaMensaje.jsx` (nuevo) | La burbuja del chat. **Menú por mensaje** con Responder, Copiar texto, Editar (propio, con texto) y Eliminar (propio). Se abre con la flechita al pasar el cursor, con **clic derecho** o **manteniendo presionado** en celular. **Deslizar a la derecha responde** (solo en pantallas táctiles). Muestra la **cita** del mensaje respondido: al tocarla salta al original y lo resalta; si se borró, "Mensaje eliminado". Etiqueta "editado". |
| `Pages/Mensajes.jsx` | Barra **"Respondiendo a…"** / **"Editando mensaje"** sobre la caja (X o Esc para cancelar). Editar guarda con `PUT`. Eliminar pide confirmación. Escucha `mensaje_editado` / `mensaje_eliminado` y los aplica en vivo. Muestra los errores del WebSocket (por ejemplo, responder a un mensaje de otra sala). Botón **🖼 Fotos, archivos y enlaces** en el encabezado. |
| `Components/PanelCompartido.jsx` (nuevo) | Panel lateral (pantalla completa en celular) con pestañas **Fotos** (cuadrícula), **Archivos** (descarga) y **Enlaces** ("Ver en el chat" salta al mensaje). Paginado con "Cargar más". |
| `services/mensajesServices.js` | `editarMensaje`, `eliminarMensaje`; `enviarMensajeWS` y `enviarMensajeConArchivo` aceptan `respuestaAId`. |
| `services/salaService.js` | `getCompartidoSala(id, tipo, page)`. |

- "Ver en el chat" y la cita solo pueden saltar a mensajes ya cargados; si el mensaje es más viejo, se avisa que hay que subir en el chat para cargarlo.

## 17. Dashboard: proyectos con avance y resumen personal

- **Antes:** la tarjeta "Proyectos activos" no hacía nada y no mostraba el número (`Card` ignoraba `value`), y el carrusel decía siempre "No hay proyectos para mostrar" porque recibía una lista vacía fija (`projects={[]}`).
- Backend: `GET /usuarios/me/resumen` → `{proyectos, mis_tareas, total_mis_tareas}`. Cada proyecto trae además `tareas_por_estado`, `tareas_vencidas`, `total_fases`, `fase_actual`, `mis_tareas` (hasta 10 de ese proyecto) y `chat: {sala_id, no_leidos, ultimos_mensajes}` (8 más recientes de la sala principal). El resumen **no marca la sala como leída**; por eso el Dashboard no usa `GET /mensajes/`, que sí la marca. Cada proyecto trae `total_tareas`, `tareas_completadas`, `porcentaje` (`null` si no tiene tareas) y `mis_tareas_pendientes`. Respeta los permisos `tareas.ver` / `tareas.ver_todas`.

| Archivo | Cambio |
|---|---|
| `Pages/Dashboard.jsx` | Tarjetas: **"Proyectos activos"** muestra el número y lleva a Proyectos. **Mis proyectos**: el carrusel recibe el resumen, la sala de chat de cada proyecto (de `GET /salas/`; si hay varios canales, el más activo) y los no leídos; la actividad se actualiza en vivo con el canal de avisos. Los paneles sueltos "Mis tareas pendientes" y "Actividad reciente" se quitaron: ahora van dentro de cada banner, por proyecto. Crear o unirse a un proyecto refresca el resumen. |
| `Components/ProjectCarousel.jsx` | **Carrusel tipo anuncio:** un proyecto grande a la vez (banner con el degradado de marca) en tres partes: **(1)** logo, nombre, estado, colaboradores, dueño, descripción, **barra por estado** (en progreso / completado / pendiente…, con leyenda), **fase actual** ("Sprint 1 · 1 fases"), **tareas vencidas** (rojo) y vencimiento del proyecto; **(2 y 3)** dos **widgets altos con scroll propio**, clickeables: **"Tus tareas"** (hasta 10 de ese proyecto con fase, estado y vencimiento; "y N más…"; → abre el proyecto) y **"Chat del proyecto"** (últimos 8 mensajes con hora y no leídos en rojo; → abre la sala; los mensajes nuevos se agregan en vivo). En escritorio son columnas del mismo alto que el banner; en tablet, arriba info y avance y abajo los dos widgets; en celular, apilado; **(4)** **anillo de avance** animado, "x/y completadas" y "Ver proyecto". **Cambia solo cada 7 s**; se pausa con el cursor o el foco; puntitos, flechas ‹ › y deslizar en táctil (`onTap`: arrastrar no abre el proyecto). Con "reducir movimiento" no rota solo. El botón "Ver proyecto" usa `--color-blanco` porque `bg-white` se remapea en modo oscuro y el banner es oscuro en ambos temas. |
| `Components/Cards/Card.jsx` | Muestra `value` (número grande) si se lo pasan. En celular, las tres tarjetas van en una fila compacta (antes ocupaban toda la pantalla). |
| `utils/vencimiento.js` (nuevo) | `textoVencimiento(fecha)`: "vence hoy / mañana / en N días", "venció ayer / hace N días" (por día de calendario). |
| `services/usuariosService.js` | `getMiResumen()`. |
| `index.css` | En oscuro, `text-teal-700` (chips de estado) usa un teal claro para que se lea. |

- **Celular (una sola pantalla):** el anillo de avance va chico junto al nombre; "Tus tareas" y "Chat" pasan a **pestañas** (una lista a la vez, con scroll, sin título repetido); "Ver proyecto" en una franja abajo. En el Dashboard se oculta el breadcrumb, el saludo va en una línea y se reducen los espacios. A 390×760 no hay scroll; a 680 de alto, solo quedan fuera los puntitos.
- **Deslizar cambia el proyecto que se ve; tocar lo abre.** Mientras se desliza, se ignoran los clics dentro del banner (`onClickCapture` + `arrastrandoRef`). Antes, si el gesto empezaba sobre una tarea o un mensaje del widget, al soltar el dedo el navegador le mandaba el clic y abría el proyecto o el chat.
- Hasta que se conecte el módulo de Tareas y Sprints, ninguna pantalla crea tareas: los proyectos van a mostrar "Sin tareas aún" y "Mis tareas" va a estar vacío.

---

## Cómo se probó

Front local (`VITE_API_URL=http://127.0.0.1:8765 npx vite`) contra el backend local con BD de prueba, usando dos usuarios de prueba: uno con cargo "Administrador" y otro con "Usuario Básico".

- ✅ Login; 401 → regresa a login (sesión borrada en el backend).
- ✅ Crear proyecto sin fecha final; ver y regenerar el código.
- ✅ Unirse con el código en minúsculas desde otra cuenta → aparece en "Colaborativos".
- ✅ El colaborador no ve el código; "Salir" lo quita del proyecto.
- ✅ Usuario Básico: no ve "Configuración" y la ruta directa muestra "No tienes permisos".
- ✅ Administrador: ve los 3 tabs y todas las acciones; select de módulos y checkbox `ver_todas` en Permisos por Cargo.
- ✅ Menú ⋮ del propietario: el código queda oculto hasta "Generar código"; el colaborador no ve el menú.
- ✅ Unirse con un código inválido → modal "No se pudo unir" con el motivo; "Intentar de nuevo" limpia las casillas.
- ✅ Unirse con un código válido → modal "¡Te uniste al proyecto!"; "Ver proyecto" abre el detalle.
- ✅ Navbar sin foto → ícono genérico de perfil.
- ✅ Chat conecta el WebSocket; el Perfil carga.
- ✅ Chat por salas: el panel muestra Global y las salas de proyecto creadas solas; un mensaje de otro usuario sube la tarjeta, aparece la insignia en la tarjeta y en el Sidebar, y al abrir la sala el contador baja.
- ✅ Fondos animados aurora, estrellas y ondas aplicados y guardados; la tarjeta muestra el fondo elegido.
- ✅ Crear una sala privada → abre la sala; código de invitación visible; enviar un mensaje; otro usuario se une con el código en minúsculas.
- ✅ Scroll del chat con 46 mensajes: abre abajo; al subir carga las páginas anteriores sin saltar hasta "No hay más mensajes"; al enviar baja al fondo.
- ✅ Link de sala sin sesión → login → entra directo a la sala. Con sesión y ya miembro → entra directo. Código inválido → mensaje de error.
- ✅ Link de proyecto sin cuenta → Regístrate → registro + login automático → queda como colaborador en el detalle del proyecto.
- ✅ "Copiar link" genera `/unirse/proyecto/<CODIGO>` (en el Chrome automatizado el portapapeles no responde, así que se probó el campo de respaldo).
- ✅ ⋮ del proyecto → "Generar código" → código + "Generar nuevo" + "Copiar link de invitación". ⋮ de una sala privada (como creador) → "Código de invitación" → modal con código, "Generar nuevo" y "Copiar link".
- ✅ El propietario quita a un colaborador desde el detalle (el backend confirma 0 colaboradores).
- ✅ Registro con un correo existente → "El correo ya está registrado" + botón "Iniciar sesión".
- ✅ Cambiar contraseña → cierra la sesión y manda a login; la contraseña vieja da 401 y la nueva entra.
- ✅ Recuperar contraseña: "¿Olvidaste tu contraseña?" → correo → mensaje genérico. Con un link válido → nueva contraseña → manda a login; la contraseña vieja da 401 y la nueva entra. Reusar el link → "Este token de recuperación ya fue utilizado" + "Pedir otro". Token inventado → "Token de recuperación inválido". Contraseña débil → validación del front antes de enviar.
- ✅ Adjuntos: el menú sin "Enlace"; Cámara en computadora muestra el aviso; imagen + texto con link → se ve en línea y el link es clickeable (sin el punto final); `.txt` solo → tarjeta con descarga; `.exe` → rechazado antes de enviar; después de recargar siguen ahí y el otro usuario los recibe. La webcam no se probó (requiere el permiso del navegador).
- ✅ Chat estilo WhatsApp: menú por mensaje (clic derecho), editar → "editado", eliminar con confirmación, responder → cita en la burbuja, y al tocarla salta al original. Ediciones y borrados de otro usuario se ven en vivo. Panel: fotos, enlaces y "Ver en el chat". **Deslizar para responder no se probó** (requiere pantalla táctil).
- ✅ Dashboard (con tareas creadas por API): "Proyectos activos: 2" → /proyectos; Proyecto Oscuro "40% · 2/5" y "2 tareas mías"; Portal Clientes "Sin tareas aún · vence en 40 días"; mis tareas "vence mañana / en 5 días"; actividad reciente; tarjeta → detalle del proyecto; modo oscuro.
- ⚠️ Subir imagen (foto de perfil, logo, fondo de sala): el front envía bien el archivo, pero en local las credenciales de Cloudinary son de ejemplo. Ahora el backend responde **502** "No se pudo subir el archivo al servicio de almacenamiento" y el front muestra ese mensaje. Falta probarlo en Railway con las credenciales reales.
- ⚠️ "¡Link copiado!" no se pudo ver: en el Chrome automatizado el portapapeles no responde; se probó el campo de respaldo con el link.
- ⚠️ **No probado en el navegador:** subir o quitar el logo y la foto de perfil (requieren elegir un archivo local), quitar a un colaborador desde el propietario y cambiar la contraseña.

## Pendiente

- Conectar `Task.jsx`, `Sprint.jsx` y `Calendar.jsx` (hoy usan datos mock) con fases y tareas. Con permisos: si `tareas` no tiene `ver_todas` (por ejemplo, Tester), el usuario solo ve las tareas asignadas a él o creadas por él.
- Mostrar los 403 en pantalla en los tabs de Configuración (hoy solo hacen `console.error`). Con los permisos aplicados en la UI ya casi no deberían ocurrir.
