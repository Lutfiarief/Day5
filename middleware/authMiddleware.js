const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ error: 'Akses ditolak. Token tidak disertakan.' });

    try {
        const decoded = jwt.verify(token, 'jwtSecretKey');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Token tidak valid.' });
    }
};

module.exports = verifyToken;
