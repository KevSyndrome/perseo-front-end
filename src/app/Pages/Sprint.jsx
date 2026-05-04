import React, { useState } from "react";
import { useRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { CgAdd } from "react-icons/cg";

import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import TareaForm from "../Forms/TareaForm";

/* =======================
   TAREA
======================= */
const Tarea = ({ id }) => {
  const navigate = useNavigate();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const handleClick = () => {
    if (!isDragging) {
      navigate(`/task/${id}`);
    }
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={handleClick}
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        p: 1.5,
        mb: 1,
        bgcolor: "#4f8fe3",
        color: "white",
        borderRadius: 2,
        cursor: isDragging ? "grabbing" : "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: isDragging
          ? "0 8px 16px rgba(0,0,0,.3)"
          : "0 2px 6px rgba(0,0,0,.2)",
        "&:hover": {
          opacity: isDragging ? 1 : 0.9,
        },
      }}
    >
      {id}

      <Box
        sx={{
          bgcolor: "white",
          color: "#4f8fe3",
          px: 1,
          borderRadius: 1,
          fontSize: 12,
          fontWeight: "bold",
        }}
      >
        PR
      </Box>
    </Box>
  );
};


/* =======================
   COLUMNA
======================= */
const Columna = ({ id, title, items }) => (
  <Box
    id={id}
    sx={{
      width: 260,
      minHeight: "75vh",
      bgcolor: "#1f2329",
      borderRadius: 3,
      p: 1,
      border: "1px solid #3a3f45",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography color="white" textAlign="center" fontWeight="bold" mb={2}>
      {title}
    </Typography>

    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      {items.length === 0 ? (
        <Typography color="white" textAlign="center" fontStyle="italic">
          Suelta tareas aquí
        </Typography>
      ) : (
        items.map((task) => <Tarea key={task} id={task} />)
      )}
    </SortableContext>
  </Box>
);

/* =======================
   SPRINT
======================= */
const Sprint = () => {
  const { id } = useParams();

  const [porHacer, setPorHacer] = useState(["Tarea 1", "Tarea 2"]);
  const [haciendo, setHaciendo] = useState(["Tarea 3"]);
  const [hechas, setHechas] = useState([]);
  const [validadas, setValidadas] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const [screen, setScreen] = useState("home");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over) return;

    const listas = { porHacer, haciendo, hechas, validadas };
    const setters = {
      porHacer: setPorHacer,
      haciendo: setHaciendo,
      hechas: setHechas,
      validadas: setValidadas,
    };

    let from, to;

    for (const key in listas) {
      if (listas[key].includes(active.id)) from = key;
      if (listas[key].includes(over.id)) to = key;
    }

    if (!to) to = over.id.replace("columna-", "");

    if (from === to) {
      setters[from](
        arrayMove(
          listas[from],
          listas[from].indexOf(active.id),
          listas[from].indexOf(over.id)
        )
      );
    } else {
      setters[from]((prev) => prev.filter((t) => t !== active.id));
      setters[to]((prev) => [...prev, active.id]);
    }
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
      {screen === "home" && (
        <>
          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" color="white" fontWeight="bold" mt={5}>
              {id}
            </Typography>

            <Button
              variant="contained"
              onClick={() => setScreen("form")}
              sx={{
                bgcolor: "#00b894",
                "&:hover": { bgcolor: "#019875" },
                mt: 5,
                display: "flex",
                gap: 1,
              }}
            >
              + Crear tarea <CgAdd size={20} />
            </Button>
          </Box>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Columna id="columna-porHacer" title="Por hacer" items={porHacer} />
              <Columna id="columna-haciendo" title="Haciendo" items={haciendo} />
              <Columna id="columna-hechas" title="Hechas" items={hechas} />
              <Columna
                id="columna-validadas"
                title="Validadas"
                items={validadas}
              />
            </Box>

            <DragOverlay>
              {activeId && <Tarea id={activeId} />}
            </DragOverlay>
          </DndContext>
        </>
      )}

      {screen === "form" && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <TareaForm onCancel={() => setScreen("home")} />
        </Box>
      )}
    </Box>
  );
};

export default Sprint;
