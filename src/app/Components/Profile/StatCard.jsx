// src/Components/Profile/StatCard.jsx

import React from "react";

const StatCard = ({ label, value, sublabel, highlight = false }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        <span style={styles.icon}>▢</span>
      </div>
      <span style={{ ...styles.value, color: highlight ? "var(--color-terciario, #e53935)" : "#1a1a1a" }}>
        {value}
      </span>
      <span style={styles.sublabel}>{sublabel}</span>
    </div>
  );
};

const styles = {
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "12px",
    padding: "1rem 1.25rem",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  label: {
    fontSize: "0.7rem",
    color: "#999",
    fontWeight: 600,
    letterSpacing: "0.03em",
    lineHeight: 1.3,
    maxWidth: "80%",
  },
  icon: {
    color: "#ccc",
    fontSize: "1rem",
  },
  value: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    lineHeight: 1,
  },
  sublabel: {
    fontSize: "0.75rem",
    color: "#aaa",
  },
};

export default StatCard;