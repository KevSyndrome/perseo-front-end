import { Plus, Link2, BarChart3, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import Card from "../Components/Cards/Card";
import ProjectCarousel from "../Components/ProjectCarousel";
import React, { useState, useEffect } from "react";
import ProyectoForm from "../Forms/ProyectoForm";
import UnirseModal from '../Modals/UnirseModal';
import { getMiResumen } from "../../services/usuariosService";
import { getSalas } from "../../services/salaService";
import { useNotificacionesStore } from "../Components/NotificacionesStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [unirseOpen, setUnirseOpen] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [error, setError] = useState("");
  const [salas, setSalas] = useState([]);
  const { noLeidos, ultimoAviso } = useNotificacionesStore();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useBreadcrumb([{ label: "Dashboard" }]);

  const cargarResumen = () =>
    getMiResumen().then(setResumen).catch((err) => setError(err.message));

  useEffect(() => {
    cargarResumen();
    getSalas().then((res) => setSalas(res.data || [])).catch(() => setSalas([]));
  }, []);

  // Mensaje nuevo en cualquier sala: actualiza la actividad sin recargar
  useEffect(() => {
    if (!ultimoAviso) return;
    setSalas((prev) => prev.map((s) => (s.id === ultimoAviso.sala_id ? { ...s, ultimo_mensaje: ultimoAviso.data } : s)));
    // Y en el widget de chat del proyecto: el nuevo arriba, se guardan los 8 más recientes
    setResumen((prev) => prev && {
      ...prev,
      proyectos: prev.proyectos.map((p) => (p.chat?.sala_id === ultimoAviso.sala_id
        ? { ...p, chat: { ...p.chat, ultimos_mensajes: [ultimoAviso.data, ...p.chat.ultimos_mensajes].slice(0, 8) } }
        : p)),
    });
  }, [ultimoAviso]);

  const proyectos = resumen?.proyectos || [];
  const activos = proyectos.filter((p) => p.status?.nombre?.toLowerCase() === "activo").length;
  // Sala del chat de un proyecto (si tiene varios canales, el de actividad más reciente)
  const salaDe = (proyectoId) => salas
    .filter((s) => s.tipo === "proyecto" && s.proyecto?.id === proyectoId)
    .sort((a, b) => new Date(b.ultimo_mensaje?.fechaC || 0) - new Date(a.ultimo_mensaje?.fechaC || 0))[0] ?? null;

  return (
    <div className="flex h-full w-full flex-col">
      <Breadcrumb />

      <h1 className="text-2xl font-bold text-slate-800">
        Bienvenido, {usuario.nombre} {usuario.apellido_paterno} {usuario.apellido_materno}
      </h1>

      <div className="flex flex-1 flex-col gap-8 pt-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card
            icon={<BarChart3 size={32} />}
            label="Proyectos activos"
            value={resumen ? activos : undefined}
            color="var(--color-selection)"
            onClick={() => navigate("/proyectos")}
          />
          <Card
            icon={<Link2 size={36} />}
            label="Unirse al proyecto"
            color="var(--color-selection)"
            onClick={() => setUnirseOpen(true)}
          />
          <Card
            icon={<Plus size={36} />}
            label="Crear proyecto"
            color="var(--color-grey)"
            onClick={() => setCreateOpen(true)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Proyectos con su avance, mis tareas y su chat */}
        <section>
          <h2 className="mb-3 text-lg font-bold text-slate-800">Mis proyectos</h2>
          {resumen
            ? <ProjectCarousel projects={proyectos} misTareas={resumen.mis_tareas} salaDe={salaDe} noLeidos={noLeidos} />
            : !error && <div className="flex justify-center py-8 text-slate-400"><Loader2 className="animate-spin" /></div>}
        </section>

      </div>

      <ProyectoForm
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onProyectoCreado={cargarResumen}
      />

      <UnirseModal
        isOpen={unirseOpen}
        onClose={() => setUnirseOpen(false)}
        onUnido={cargarResumen}
      />
    </div>
  );
};

export default Dashboard;
