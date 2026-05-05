import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./app/Layouts/Layout";
import Dashboard from "./app/Pages/Dashboard";
import Login from "./app/Pages/Login";
import Proyect from "./app/Pages/Proyect";
import Sprint from "./app/Pages/Sprint";
import Register from "./app/Pages/Register";
import Calendar from "./app/Pages/Calendar";
import Profile from "./app/Pages/Profile";
import Configuration from "./app/Pages/Configuration";
import Task from "./app/Pages/Task";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login SIN layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rutas protegidas CON layout */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>}/>
          
          <Route
          path="/calendar"
          element={
            <Layout>
              <Calendar />
            </Layout>}/>
          
          <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>}/>


            <Route 
            path="task/:taskId" 
            element={<Layout><Task />
            </Layout>} />

          
          


          <Route
          path="/configuration"
          element={
            <Layout>
              <Configuration />
            </Layout>}/>
          
          <Route path= "/proyectos"  element={
            <Layout>
              <Proyect />
            </Layout>
          }/>

          <Route
          path="/sprint"
          element={
            <Layout>
         <Sprint />
          </Layout>
            }     
          />

        {/* Redirección */}
        <Route path="" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
