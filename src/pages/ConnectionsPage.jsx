import React, { useState } from 'react';
import { Database, ShieldAlert, CheckCircle2, ArrowRight, HardDrive, Cloud, Server, Terminal as TermIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntelligence } from '../context/IntelligenceContext';
import ConnectionModal from '../components/ConnectionModal';
import './ConnectionsPage.css';

const terminalLines = [
    "[SYSTEM] Initializing secure connection gateway...",
    "[AUTH] Handshake successful. TLS 1.3 established.",
    "[SCAN] Extrapolating schema topologies...",
    "[SCAN] 142 tables identified. Generating AST...",
    "[ML-ENGINE] Initiating PII Named Entity Recognition (NER)...",
    "[ML-ENGINE] Scanning column headers and sampling 10k rows...",
    "[ALERT] Potential PII found: 'ssn' in table 'users_raw' (Confidence: 98%)",
    "[PROFILE] Calculating null-ratios and value distributions...",
    "[PROFILE] Freshness SLA check passed (Latency < 500ms)",
    "[SYSTEM] Synthesizing Knowledge Graph nodes...",
    "[SUCCESS] Neural Intelligence Layer integration complete."
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const ConnectionsPage = () => {
    const { availableSources, connectedSources, connectSource } = useIntelligence();
    const [activeConnection, setActiveConnection] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractionComplete, setExtractionComplete] = useState(false);
    const [logs, setLogs] = useState([]);
    const [progress, setProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSourceForModal, setSelectedSourceForModal] = useState(null);

    const handleOpenModal = (source) => {
        setSelectedSourceForModal(source);
        setIsModalOpen(true);
    };

    const handleConnectFromModal = (source, config) => {
        setIsModalOpen(false);
        setActiveConnection(source);
        setIsExtracting(true);
        setExtractionComplete(false);
        setLogs([]);
        setProgress(0);

        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < terminalLines.length) {
                setLogs(prev => [...prev, terminalLines[currentLine]]);
                setProgress(Math.floor(((currentLine + 1) / terminalLines.length) * 100));
                currentLine++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    setIsExtracting(false);
                    setExtractionComplete(true);
                    connectSource(source.id, config);
                }, 1000);
            }
        }, 300); // Faster extraction animation
    };

    const scrollToGrid = () => {
        document.getElementById('sources-grid-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <motion.div
            className="page-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="page-header" variants={itemVariants}>
                <div>
                    <h1 className="text-gradient">Data Sources</h1>
                    <p className="page-subtitle">Connect to your fragmented data silos to build a unified knowledge layer.</p>
                </div>
                <motion.button
                    className="primary-btn pulse-glow-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={scrollToGrid}
                >
                    <Database size={18} />
                    <span>Add New Source</span>
                </motion.button>
            </motion.div>

            <motion.div id="sources-grid-section" className="sources-grid" variants={containerVariants}>
                {availableSources.map((source) => {
                    const mappedIcon = source.id === 'postgres' ? Database :
                        source.id === 'snowflake' ? Cloud :
                            source.id === 'mongodb' ? Server : HardDrive;
                    const isConnected = connectedSources.some(s => s.id === source.id);
                    const IconComp = mappedIcon;

                    return (
                        <motion.div
                            key={source.id}
                            className={`glass-panel source-card interactive-card ${activeConnection?.id === source.id ? 'active' : ''}`}
                            variants={itemVariants}
                            whileHover={{ y: -8, scale: 1.02, boxShadow: `0 15px 35px -10px ${source.color}40` }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <div className="source-card-bg" style={{ background: `radial-gradient(circle at top right, ${source.color}20, transparent 70%)` }}></div>

                            <div className="source-header-layout">
                                <div className="source-icon-wrap" style={{ background: source.bg, color: source.color, border: `1px solid ${source.color}40` }}>
                                    <IconComp size={28} />
                                </div>
                                <div className="source-info">
                                    <h3>{source.name}</h3>
                                    <p>{source.type}</p>
                                </div>
                            </div>

                            {!isConnected && activeConnection?.id !== source.id && (
                                <motion.button
                                    className="connect-btn"
                                    onClick={() => handleOpenModal(source)}
                                    disabled={isExtracting}
                                    whileHover={{ backgroundColor: `${source.color}25`, borderColor: source.color }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Zap size={16} /> Connect & Analyze
                                </motion.button>
                            )}

                            {activeConnection?.id === source.id && isExtracting && (
                                <div className="extraction-terminal">
                                    <div className="terminal-header">
                                        <TermIcon size={14} className="term-icon" />
                                        <span>neural-extraction-engine.exe</span>
                                        <div className="term-actions">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                    <div className="terminal-body">
                                        <AnimatePresence>
                                            {logs.map((log, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`log-line ${log.includes('[ALERT]') ? 'log-warn' : log.includes('[SUCCESS]') ? 'log-success' : ''}`}
                                                >
                                                    {log}
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                        <div className="cursor-blink">_</div>
                                    </div>
                                    <div className="terminal-progress-wrap">
                                        <div className="terminal-progress-bar">
                                            <motion.div
                                                className="terminal-progress-fill"
                                                style={{ background: source.color }}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <span className="terminal-pct">{progress}%</span>
                                    </div>
                                </div>
                            )}

                            {(isConnected || (activeConnection?.id === source.id && extractionComplete)) && (
                                <motion.div
                                    className="extraction-success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ borderColor: `${source.color}50`, background: `${source.color}15`, color: source.color }}
                                >
                                    <CheckCircle2 size={24} className="success-icon" />
                                    <span>Knowledge Layer Synced</span>
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </motion.div>

            {extractionComplete && activeConnection && (
                <motion.div
                    className="glass-panel extraction-results"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                    <div className="results-bg-glow" style={{ background: `radial-gradient(circle at center, ${activeConnection.color}15 0%, transparent 60%)` }}></div>

                    <div className="results-header">
                        <h2><SparklesIcon sourceColor={activeConnection.color} /> Intelligence Summary: {activeConnection.name}</h2>
                        <button className="secondary-btn glow-hover">View Full Dictionary <ArrowRight size={16} /></button>
                    </div>

                    <div className="metrics-grid">
                        <ResultCard label="Tables/Collections" value="142" trend="+12 new" />
                        <ResultCard label="Columns/Fields" value="1,894" trend="+45 new" />
                        <ResultAlertCard label="PII Entities Detected" value="24" desc="SSN, Emails, Credit Cards" />
                        <ResultTrustCard label="Initial Trust Score" value="89%" />
                    </div>
                </motion.div>
            )}

            <ConnectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                source={selectedSourceForModal}
                onConnect={handleConnectFromModal}
            />
        </motion.div>
    );
};

// Helper Components for Results
const SparklesIcon = ({ sourceColor }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px', color: sourceColor }}>
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
    </svg>
);

const ResultCard = ({ label, value, trend }) => (
    <motion.div className="metric-card" whileHover={{ y: -5, background: 'rgba(255,255,255,0.05)' }}>
        <span className="metric-label">{label}</span>
        <span className="metric-value">{value}</span>
        <span className="metric-trend positive">{trend}</span>
    </motion.div>
);

const ResultAlertCard = ({ label, value, desc }) => (
    <motion.div className="metric-card alert-card" whileHover={{ y: -5, boxShadow: '0 0 20px rgba(245, 158, 11, 0.15)' }}>
        <div className="metric-title-wrap">
            <span className="metric-label">{label}</span>
            <ShieldAlert size={16} className="text-warning" />
        </div>
        <span className="metric-value warning-text">{value}</span>
        <span className="metric-desc">{desc}</span>
    </motion.div>
);

const ResultTrustCard = ({ label, value }) => (
    <motion.div className="metric-card trust-card" whileHover={{ y: -5, boxShadow: '0 0 20px rgba(99, 102, 241, 0.15)' }}>
        <span className="metric-label">{label}</span>
        <span className="metric-value text-gradient">{value}</span>
        <div className="trust-meter">
            <motion.div
                className="trust-fill"
                initial={{ width: 0 }}
                animate={{ width: '89%' }}
                transition={{ duration: 1.5, delay: 0.5 }}
            />
        </div>
    </motion.div>
);

export default ConnectionsPage;
