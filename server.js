const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
require('dotenv').config();

const fs = require('fs');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

mongoose.connect('mongodb://127.0.0.1:27017/appstore', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const AppSchema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    size: String,
    version: String,
    rating: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    imageUrl: String,
    apkUrl: String,
    createdAt: { type: Date, default: Date.now }
});
const App = mongoose.model('App', AppSchema);

app.get('/api/apps', async (req, res) => {
    try {
        const apps = await App.find();
        res.json(apps);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/apps', async (req, res) => {
    const app = new App(req.body);
    try {
        await app.save();
        res.status(201).json(app);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server jalan di http://localhost:${PORT}`);
});
