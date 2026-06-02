import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./app/Layouts/Layout";
import Dashboard from "./app/Pages/Dashboard";
import Login from "./app/Pages/Login";
import Proyect from "./app/Pages/Proyect";
import Sprint from "./app/Pages/Sprint";
import Calendar from "./app/Pages/Calendar";
import Profile from "./app/Pages/Profile";
import Configuration from "./app/Pages/Configuration";
import Task from "./app/Pages/Task";
import Mensajes from "./app/Pages/Mensajes";
import PrivateRoute from "./app/Components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Layout><Calendar /></Layout></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
        <Route path="/configuration" element={<PrivateRoute><Layout><Configuration /></Layout></PrivateRoute>} />
        <Route path="/proyectos" element={<PrivateRoute><Layout><Proyect /></Layout></PrivateRoute>} />
        <Route path="/sprint" element={<PrivateRoute><Layout><Sprint /></Layout></PrivateRoute>} />
        <Route path="/mensajes" element={<PrivateRoute><Layout><Mensajes /></Layout></PrivateRoute>} />
        <Route path="task/:taskId" element={<PrivateRoute><Layout><Task /></Layout></PrivateRoute>} />

        {/* Redirección */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;