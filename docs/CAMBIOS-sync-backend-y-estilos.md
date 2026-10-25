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
| `Pages/Mensajes.jsx` | **Celular (<640px): pantalla completa** debajo del Navbar (`fixed` con `top`/`bottom`, sin márgenes ni bordes). Así no hay doble scroll (página + chat) y no depende de `dvh`, que algunos navegadores no soportan. Se quedan el encabezado de la sala y la caja de mensaje. La caja usa letra de 16 px en celular porque con menos iOS hace zoom al tocarla, y respeta la barra de inicio del iPhone (`safe-area-inset-bottom`; `viewport-fit=cover` en `index.html`). **Tablet y escritorio:** tarjeta como antes. |

Revisado en 390 px (celular) y 820 px (tablet): Dashboard, Proyectos, detalle de proyecto, Perfil, Configuración (la tabla hace scroll horizontal dentro de su tarjeta), panel de salas, chat, menú lateral y modales. No hay scroll horizontal de página.

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
- ⚠️ Fondo con imagen (Cloudinary) sin probar en el navegador: requiere elegir un archivo local.
- ⚠️ **No probado en el navegador:** subir o quitar el logo y la foto de perfil (requieren elegir un archivo local), quitar a un colaborador desde el propietario y cambiar la contraseña.

## Pendiente

- Conectar `Task.jsx`, `Sprint.jsx` y `Calendar.jsx` (hoy usan datos mock) con fases y tareas. Con permisos: si `tareas` no tiene `ver_todas` (por ejemplo, Tester), el usuario solo ve las tareas asignadas a él o creadas por él.
- Mostrar los 403 en pantalla en los tabs de Configuración (hoy solo hacen `console.error`). Con los permisos aplicados en la UI ya casi no deberían ocurrir.
