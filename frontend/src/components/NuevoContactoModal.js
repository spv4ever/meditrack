// src/components/ContactoControl/NuevoContactoModal.js
import React, { useState, useEffect } from "react";
import "./NuevoContactoModal.css";

const NuevoContactoModal = ({ contacto, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telegramId: "",
  });

  useEffect(() => {
    if (contacto) {
      setFormData(contacto);
    }
  }, [contacto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{contacto ? "Editar contacto" : "Nuevo contacto"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={formData.apellidos}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="telegramId"
            placeholder="Telegram ID"
            value={formData.telegramId}
            onChange={handleChange}
          />
          <div className="modal-buttons">
            <button type="submit">Guardar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoContactoModal;
