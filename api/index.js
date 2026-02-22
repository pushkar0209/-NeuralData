import express from 'express';
import cors from 'cors';

const app = express();

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

// POST to add an alert manually
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

// POST simulate full audit
app.post('/api/audit', (req, res) => {
    // Vercel serverless doesn't need long setTimeouts, but we can simulate a small 500ms delay 
    // to give the frontend animation time to breathe before returning.
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
    }, 500);
});

// POST simulate AI chat
app.post('/api/chat', (req, res) => {
    const { message, connectedSources, globalTrustScore, settings } = req.body;

    const query = message.toLowerCase();
    let responseText = "";

    if (query.includes('source') || query.includes('connect')) {
        if (!connectedSources || connectedSources.length === 0) {
            responseText = "There are currently **no data sources** connected. Please navigate to the Data Sources page to connect PostgreSQL, Snowflake, MongoDB, or S3.";
        } else {
            const sourceNames = connectedSources.map(s => `\n- **${s.name}** (${s.type})`).join('');
            responseText = `Currently, the following systems are connected and analyzed in the knowledge layer:${sourceNames}\n\nI am actively monitoring these sources for schema changes and PII.`;
        }
    } else if (query.includes('trust') || query.includes('score')) {
        responseText = `The Global Trust Score is currently at **${globalTrustScore}%**.\n\n> **Trust Warning**: If the score is below 90%, it indicates recent SLA misses or potential PII leaks. Check the Dashboard for detailed metrics.`;
    } else if (query.includes('pii') || query.includes('sensitive') || query.includes('redact')) {
        if (settings && settings.autoPiiRedact) {
            responseText = "PII Auto-redaction is currently **ENABLED** in your governance settings. If I detect SSNs, emails, or phone numbers in your data, they will be masked automatically before being displayed.";
        } else {
            responseText = "PII Auto-redaction is currently **DISABLED**. \n\n> **Trust Warning**: Unmasked PII may be exposed in query results. Please review your Data Governance settings.";
        }
    } else if (query.includes('reliability') || query.includes('dataset has low') || query.includes('low reliability')) {
        const hasMongo = connectedSources && connectedSources.find(s => s.id === 'mongodb');
        if (hasMongo) {
            responseText = "Looking at your connected sources, the **MongoDB - Users** dataset currently has the lowest reliability score (**78%**). \n\nThis is primarily due to several missing fields in the `address` sub-document and inconsistent date formatting (mixing ISODate and string types). I recommend enforcing a strict JSON schema validation rule.";
        } else {
            responseText = "Based on the metrics, none of your currently connected datasets are displaying dangerously low reliability. Everything is operating above the 92% SLA threshold. Connect more sources to expand the audit scope.";
        }
    } else {
        responseText = `Based on the schema extracted from your connected sources, the \`customer_ltv\` column represents the Lifetime Value of a customer calculated over a 12-month trailing period. Would you like me to generate a SQL query relating to this? You asked: "${message}"`;
    }

    res.json({ success: true, text: responseText });
});

function updateTrustHistory(newScore) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const nextDay = days[(trustHistory.length + 1) % 7];
    trustHistory = [...trustHistory.slice(1), { name: 'Today', score: newScore }];
}

export default app;
