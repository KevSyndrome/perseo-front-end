import React from 'react'
import Breadcrumb, { useBreadcrumb } from "../Components/Breadcrumb";
import "../../styles/branding.css";

const Profile = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useBreadcrumb([{ label: "Profile" }]);

  return (
    
    <div>
      <Breadcrumb/>
    </div>
  );
};

export default Profile