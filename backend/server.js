import express from 'express';
import cors from 'cors';

const app = express();
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

function updateTrustHistory(newScore) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const nextDay = days[(trustHistory.length + 1) % 7];
    trustHistory = [...trustHistory.slice(1), { name: 'Today', score: newScore }];
}

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
