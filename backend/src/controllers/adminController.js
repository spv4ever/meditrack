// controllers/adminController.js

const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // excluye la password
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, update, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};
