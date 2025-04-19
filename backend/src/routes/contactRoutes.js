const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactsController");
const { protect } = require('../middleware/authMiddleware');

//router.use(auth); // Todos requieren estar logueado

router.get("/", protect, getContacts);
router.post("/", protect, createContact);
router.put("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;
