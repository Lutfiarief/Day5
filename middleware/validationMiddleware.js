const validatePostInput = (req, res, next) => {
    const { description, date } = req.body;
    if (!description || !date) {
        return res.status(400).json({ error: 'Description dan date harus diisi.' });
    }
    next();
};

const validatePutInput = (req, res, next) => {
    const { description, date } = req.body;
    if (!description || !date) {
        return res.status(400).json({ error: 'Hanya boleh mengubah description dan date.' });
    }
    next();
};

module.exports = { validatePostInput, validatePutInput };