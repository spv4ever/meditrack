// src/components/ContactoControl/ListadoContactos.js
import React, { useEffect, useState } from "react";
import NuevoContactoModal from "./NuevoContactoModal";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../services/contactService";
import "./ListadoContactos.css";

const ListadoContactos = () => {
  const [contactos, setContactos] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);

  const cargarContactos = async () => {
    const data = await getContacts();
    setContactos(data);
  };

  useEffect(() => {
    
    cargarContactos();
  }, []);

  const handleGuardar = async (contacto) => {
    if (editando) {
      await updateContact(editando._id, contacto);
    } else {
      await createContact(contacto);
    }
    setModalAbierto(false);
    setEditando(null);
    cargarContactos();
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este contacto?")) {
      await deleteContact(id);
      cargarContactos();
    }
  };

  return (
    <div className="contactos-widget">
        
      <div className="contactos-header">
        <h2>Contactos de Control</h2>
        <button onClick={() => setModalAbierto(true)}>+ Nuevo contacto</button>
      </div>

      <table className="contactos-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Telegram ID</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contactos.map((c) => (
            <tr key={c._id}>
              <td>{c.nombre}</td>
              <td>{c.apellidos}</td>
              <td>{c.email}</td>
              <td>{c.telegramId}</td>
              <td>
                <button
                  onClick={() => {
                    setEditando(c);
                    setModalAbierto(true);
                  }}
                >
                  ✏️
                </button>
                <button onClick={() => handleEliminar(c._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalAbierto && (
        <NuevoContactoModal
          contacto={editando}
          onClose={() => {
            setModalAbierto(false);
            setEditando(null);
          }}
          onSave={handleGuardar}
        />
      )}
    </div>
  );
};

export default ListadoContactos;
