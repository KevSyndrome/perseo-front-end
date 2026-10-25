import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectDetalleCard from '../Components/Cards/ProjectDetalleCard';
import {
  getProyectos,
  getColaboradoresProyecto,
  regenerarCodigoProyecto,
  eliminarColaborador,
} from '../../services/proyectoService';
import { extraerIdCortoDeSlug } from '../../utils/slug';
import Breadcrumb, { useBreadcrumb } from '../Components/Breadcrumb';

const ProyectDetalle = () => {
  const { slug } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colaboradores, setColaboradores] = useState([]);
  const [errorAccion, setErrorAccion] = useState('');
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useBreadcrumb([
    { label: "Dashboard", path: "/dashboard" },
    { label: "Proyectos", path: "/proyectos" },
    { label: proyecto?.nombre || "Detalle" },
  ]);

  useEffect(() => {
    const idCorto = extraerIdCortoDeSlug(slug);

    // No existe endpoint de búsqueda por fragmento de id en el backend,
    // así que traemos la lista completa y buscamos coincidencia por prefijo.
    getProyectos(1, 1000)
      .then((data) => {
        const lista = data?.data || data || [];
        const encontrado = lista.find((p) => p.id.startsWith(idCorto));
        setProyecto(encontrado || null);
      })
      .catch(() => setProyecto(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!proyecto?.id) return;
    getColaboradoresProyecto(proyecto.id)
      .then((res) => setColaboradores(res.data || []))
      .catch(() => setColaboradores([]));
  }, [proyecto?.id]);

  const esPropietario = proyecto?.propietario_id === usuario.id;

  const handleRegenerarCodigo = async () => {
    setErrorAccion('');
    try {
      const res = await regenerarCodigoProyecto(proyecto.id);
      setProyecto((prev) => ({ ...prev, codigo_invitacion: res.data.codigo_invitacion }));
    } catch (err) {
      setErrorAccion(err.message);
    }
  };

  // El propietario quita a otro; un colaborador se quita a sí mismo (salir)
  const handleQuitarColaborador = async (usuarioId) => {
    setErrorAccion('');
    const ok = await eliminarColaborador(proyecto.id, usuarioId);
    if (!ok) {
      setErrorAccion('No se pudo quitar al colaborador.');
      return;
    }
    if (usuarioId === usuario.id) {
      navigate('/proyectos');
      return;
    }
    setColaboradores((prev) => prev.filter((c) => c.usuario.id !== usuarioId));
  };

  if (loading) return (
    <div className="flex h-full items-center justify-center">
      <p style={{ color: "var(--text-muted)" }}>Cargando proyecto...</p>
    </div>
  );

  if (!proyecto) return (
    <div className="flex h-full items-center justify-center">
      <p style={{ color: "var(--error)" }}>Proyecto no encontrado.</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full w-full flex-col gap-5"
    >
      <Breadcrumb />
      <ProjectDetalleCard
        project={{
          id: proyecto.id,
          name: proyecto.nombre,
          description: proyecto.descripcion,
          owner: proyecto.propietario?.nombre || "Sin propietario",
          image: proyecto.logo || "",
          status: proyecto.status?.nombre?.toLowerCase() || "activo",
          fechaInicial: proyecto.fecha_inicial,
          fechaFinal: proyecto.fecha_final,
        }}
        codigoInvitacion={esPropietario ? proyecto.codigo_invitacion : null}
        onRegenerarCodigo={handleRegenerarCodigo}
        colaboradores={colaboradores}
        esPropietario={esPropietario}
        usuarioActualId={usuario.id}
        onQuitarColaborador={handleQuitarColaborador}
        error={errorAccion}
      />
    </motion.div>
  );
};

export default ProyectDetalle;