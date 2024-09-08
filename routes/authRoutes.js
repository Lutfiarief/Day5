const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// REGISTER: Membuat akun baru
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: 'Username sudah terdaftar.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User berhasil terdaftar.' });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat registrasi.' });
    }
});

// LOGIN: Mendapatkan token JWT
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Username atau password salah.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Username atau password salah.' });
        }

        const token = jwt.sign({ userId: user._id }, 'jwtSecretKey', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat login.' });
    }
});

module.exports = router;
