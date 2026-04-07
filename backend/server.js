const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
const PORT = 3000;

app.use(cors()); // Allow Frontend to access Backend
app.use(express.json());

// API Routes
app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`[Server] Anatomy API running at http://localhost:${PORT}`);
});
