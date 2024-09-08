const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

app.use(express.json());

// Koneksi ke MongoDB Atlas
mongoose.connect('mongodb+srv://lutfiarief:kKikFvs1z4iHXypi@cluster7.wmfjj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster7', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Mengimpor dan menggunakan rute
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/todos', todoRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});