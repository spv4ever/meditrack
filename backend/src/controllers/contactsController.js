const Contact = require("../models/Contact");

// GET /api/contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los contactos" });
  }
};

// POST /api/contacts
const createContact = async (req, res) => {
    const { nombre, apellidos, email, telegramId } = req.body;
  
    if (!nombre || !email) {
      return res.status(400).json({ message: "Nombre y email son obligatorios" });
    }
  
    try {
      const newContact = await Contact.create({
        user: req.user._id,
        nombre,
        apellidos,
        email,
        telegramId,
      });
  
      res.status(201).json(newContact);
    } catch (error) {
      console.error("❌ Error al crear el contacto:", error.message);
      res.status(500).json({ message: "Error al crear el contacto" });
    }
  };

// PUT /api/contacts/:id
const updateContact = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidos, email, telegramId } = req.body;

  try {
    const updated = await Contact.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { nombre, apellidos, email, telegramId },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Contacto no encontrado" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el contacto" });
  }
};

// DELETE /api/contacts/:id
const deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Contact.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: "Contacto no encontrado" });

    res.json({ message: "Contacto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el contacto" });
  }
};

module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
