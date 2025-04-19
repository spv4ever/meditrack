const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nombre: { type: String, required: true },
  apellidos: { type: String },
  email: { type: String, required: true },
  telegramId: { type: String }, // opcional
});

module.exports = mongoose.model("Contact", contactSchema);
