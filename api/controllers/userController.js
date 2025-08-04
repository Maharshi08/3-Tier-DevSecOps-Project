const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// CREATE new user
exports.addUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, name, email });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error while hashing password' });
  }
};

// UPDATE user
exports.updateUser = (req, res) => {
  const { name, email } = req.body;
  db.query(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: req.params.id, name, email });
    }
  );
};

// DELETE user
exports.deleteUser = (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'User deleted' });
  });
};

