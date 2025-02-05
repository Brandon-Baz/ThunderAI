
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import apiRoutes from './routes/api.js';
import { logError } from './utils/errors.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Input validation middleware
app.use((req, res, next) => {
    if (req.body && Object.keys(req.body).length > 0) {
        const { prompt, actionType } = req.body;
        if (typeof prompt !== 'string' || prompt.length > 1000) {
            return res.status(400).json({ error: 'Invalid prompt' });
        }
        if (typeof actionType !== 'string' || !['default', 'test'].includes(actionType)) {
            return res.status(400).json({ error: 'Invalid actionType' });
        }
    }
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    logError(err, 'Server');
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Mount API routes
app.use('/api', apiRoutes);

// Serve static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(`${__dirname}/public`));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
