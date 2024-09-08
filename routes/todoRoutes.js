const express = require('express');
const { validatePostInput, validatePutInput } = require('../middleware/validationMiddleware');
const verifyToken = require('../middleware/authMiddleware');
const Todo = require('../models/Todo');

const router = express.Router();

// GET /todos: Menampilkan semua todo milik user yang login
router.get('/', verifyToken, async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user.userId });
        res.json(todos);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data todos.' });
    }
});

// POST /todos: Membuat todo baru
router.post('/', [verifyToken, validatePostInput], async (req, res) => {
    const { description, date } = req.body;

    try {
        let todo = new Todo({ description, date, userId: req.user.userId });
        todo = await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat membuat todo.' });
    }
});

// PUT /todos/:id: Mengupdate todo berdasarkan id
router.put('/:id', [verifyToken, validatePutInput], async (req, res) => {
    const { description, date } = req.body;

    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.userId },
            { description, date },
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ error: 'Todo tidak ditemukan atau bukan milik Anda.' });
        }

        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mengupdate todo.' });
    }
});

// DELETE /todos/:id: Menghapus todo berdasarkan id
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const todo = await Todo.findOneAndRemove({ _id: req.params.id, userId: req.user.userId });

        if (!todo) {
            return res.status(404).json({ error: 'Todo tidak ditemukan atau bukan milik Anda.' });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat menghapus todo.' });
    }
});

// PATCH /todos/:id/toggle: Mengubah status is_checked todo
router.patch('/:id/toggle', verifyToken, async (req, res) => {
    try {
        let todo = await Todo.findOne({ _id: req.params.id, userId: req.user.userId });

        if (!todo) {
            return res.status(404).json({ error: 'Todo tidak ditemukan atau bukan milik Anda.' });
        }

        todo.is_checked = !todo.is_checked;
        todo = await todo.save();

        res.json(todo);
    } catch (err) {
        res.status(500).json({ error: 'Terjadi kesalahan saat mengubah status todo.' });
    }
});

module.exports = router;
