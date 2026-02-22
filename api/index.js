import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory mock data
let connectedSources = [];
const availableSources = [
    { id: 'postgres', name: 'PostgreSQL - Prod DB', type: 'Relational Database', color: '#336791', bg: 'rgba(51, 103, 145, 0.15)' },
    { id: 'snowflake', name: 'Snowflake Analytics', type: 'Data Warehouse', color: '#29B5E8', bg: 'rgba(41, 181, 232, 0.15)' },
    { id: 'mongodb', name: 'MongoDB - Users', type: 'NoSQL Database', color: '#47A248', bg: 'rgba(71, 162, 72, 0.15)' },
    { id: 's3', name: 'AWS S3 Data Lake', type: 'Object Storage', color: '#FF9900', bg: 'rgba(255, 153, 0, 0.15)' },
];

let globalTrustScore = 89;
let trustHistory = [
    { name: 'Mon', score: 82 },
    { name: 'Tue', score: 85 },
    { name: 'Wed', score: 84 },
    { name: 'Thu', score: 88 },
    { name: 'Fri', score: 92 },
    { name: 'Sat', score: 89 }
];

let alerts = [
    { id: 1, type: 'warning', message: 'System Initialized. Baseline established.', time: 'Just now' }
];

let settings = {
    autoPiiRedact: true,
    strictSlaAlerts: true,
    shareMetrics: false,
    schemaAutoSync: true
};

// Endpoints

// GET all intelligence data
app.get('/api/data', (req, res) => {
    res.json({
        connectedSources,
        availableSources,
        globalTrustScore,
        trustHistory,
        alerts,
        settings
    });
});

// POST to test a connection
app.post('/api/sources/test', (req, res) => {
    const { sourceId, config } = req.body;
    // Simulate network latency for connection testing
    setTimeout(() => {
        if (!sourceId || !config || Object.keys(config).length === 0) {
            res.status(400).json({ success: false, error: 'Missing configuration parameters' });
        } else {
            res.json({ success: true, message: 'Connection established successfully.' });
        }
    }, 1500); // 1.5s delay
});

// POST to connect a new source
app.post('/api/sources/connect', (req, res) => {
    const { sourceId, config } = req.body;
    const source = availableSources.find(s => s.id === sourceId);

    if (source && !connectedSources.find(s => s.id === sourceId)) {
        connectedSources.push(source);

        // Add success alert
        const newAlert = {
            id: Date.now(),
            type: 'success',
            message: `Schema synced: ${source.name} (${Math.floor(Math.random() * 50) + 10} tables)`,
            time: 'Just now'
        };
        alerts = [newAlert, ...alerts].slice(0, 10);

        let shouldPenalize = false;
        if (sourceId === 'mongodb' || sourceId === 'postgres') {
            shouldPenalize = true;
        } else {
            // Bonus for successful safe sync
            globalTrustScore = Math.min(Math.max(globalTrustScore + 2, 0), 100);
            updateTrustHistory(globalTrustScore);
        }

        res.json({ success: true, connectedSources, alerts, globalTrustScore, trustHistory, shouldPenalize, sourceName: source.name });
    } else {
        res.status(400).json({ error: 'Invalid source or already connected' });
    }
});

// POST to add an alert manually (e.g. from setTimeout simulation on frontend)
app.post('/api/alerts', (req, res) => {
    const { type, message } = req.body;
    const newAlert = {
        id: Date.now(),
        type,
        message,
        time: 'Just now'
    };
    alerts = [newAlert, ...alerts].slice(0, 10);
    res.json({ success: true, alerts });
});

// POST to add a new available source
app.post('/api/sources/available', (req, res) => {
    const { name, type, color, bg } = req.body;

    if (!name || !type) {
        return res.status(400).json({ error: 'Name and type are required' });
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    // Check if it already exists
    if (availableSources.find(s => s.id === id)) {
        return res.status(400).json({ error: 'A source with a similar name already exists' });
    }

    const newSource = {
        id,
        name,
        type,
        color: color || '#888888',
        bg: bg || 'rgba(136, 136, 136, 0.15)'
    };

    availableSources.push(newSource);

    const newAlert = {
        id: Date.now(),
        type: 'info',
        message: `New data source registered: ${name}`,
        time: 'Just now'
    };
    alerts = [newAlert, ...alerts].slice(0, 10);

    res.json({ success: true, availableSources, alerts });
});

// POST to update trust score
app.post('/api/trust', (req, res) => {
    const { change } = req.body;
    globalTrustScore = Math.min(Math.max(globalTrustScore + change, 0), 100);
    updateTrustHistory(globalTrustScore);
    res.json({ success: true, globalTrustScore, trustHistory });
});

// PUT to toggle setting
app.put('/api/settings', (req, res) => {
    const { settingKey } = req.body;
    if (settings.hasOwnProperty(settingKey)) {
        settings[settingKey] = !settings[settingKey];

        const newVal = settings[settingKey];
        const newAlert = {
            id: Date.now(),
            type: 'info',
            message: `Governance Policy Updated: ${settingKey} is now ${newVal ? 'ON' : 'OFF'}`,
            time: 'Just now'
        };
        alerts = [newAlert, ...alerts].slice(0, 10);

        res.json({ success: true, settings, alerts });
    } else {
        res.status(400).json({ error: 'Invalid setting key' });
    }
});

// POST simulate full audit
app.post('/api/audit', (req, res) => {
    // Simulate network latency and processing time
    setTimeout(() => {
        const newAlert = {
            id: Date.now(),
            type: 'success',
            message: 'Full security and schema audit completed. No critical anomalies found.',
            time: 'Just now'
        };
        alerts = [newAlert, ...alerts].slice(0, 10);
        globalTrustScore = Math.min(Math.max(globalTrustScore + 5, 0), 100);
        updateTrustHistory(globalTrustScore);

        res.json({ success: true, alerts, globalTrustScore, trustHistory });
    }, 2000); // 2s simulated audit
});

// POST AI chat using Gemini API
app.post('/api/chat', async (req, res) => {
    const { message, connectedSources, globalTrustScore, settings } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
        return res.status(401).json({ success: false, text: "Gemini API key is not configured. Please add GEMINI_API_KEY to your backend .env file." });
    }

    try {
        const sourceNames = connectedSources && connectedSources.length > 0
            ? connectedSources.map(s => s.name).join(', ')
            : 'None';

        const systemInstruction = `You are DataIntell, an advanced AI Data Intelligence Assistant.
Current Global Trust Score: ${globalTrustScore}%
Connected Data Sources: ${sourceNames}
Governance Settings: ${JSON.stringify(settings)}

Your goal is to help users understand their data, governance alerts, and trust score. You should keep responses concise and formatted in Markdown. If the user asks about PII, trust score, or connected sources, use the provided context to answer. If no sources are connected, advise them to connect sources first.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        res.json({ success: true, text: response.text });
    } catch (error) {
        console.error("Gemini API Error:", error.message || error);
        res.status(500).json({ success: false, text: "Error communicating with the Gemini AI engine. Please ensure your API key is valid." });
    }
});

function updateTrustHistory(newScore) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const nextDay = days[(trustHistory.length + 1) % 7];
    trustHistory = [...trustHistory.slice(1), { name: 'Today', score: newScore }];
}

export default app;
