// src/services/contactService.js
const API_URL = `${process.env.REACT_APP_API_URL}/api/contacts`;

export const getContacts = async () => {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener los contactos");
  return res.json();
};

export const createContact = async (contacto) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(contacto),
  });
  if (!res.ok) throw new Error("Error al crear el contacto");
  return res.json();
};

export const updateContact = async (id, contacto) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(contacto),
  });
  if (!res.ok) throw new Error("Error al actualizar el contacto");
  return res.json();
};

export const deleteContact = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  if (!res.ok) throw new Error("Error al eliminar el contacto");
  return res.json();
};
