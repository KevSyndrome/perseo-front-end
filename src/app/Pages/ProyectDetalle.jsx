import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectDetalleCard from '../Components/Cards/ProjectDetalleCard';
import { getProyectos } from '../../services/proyectoService';
import { extraerIdCortoDeSlug } from '../../utils/slug';
import Breadcrumb, { useBreadcrumb } from '../Components/Breadcrumb';

const ProyectDetalle = () => {
  const { slug } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);

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
      />
    </motion.div>
  );
};

export default ProyectDetalle;