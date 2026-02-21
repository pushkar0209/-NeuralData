import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Activity, ShieldCheck, Clock, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIntelligence } from '../context/IntelligenceContext';
import './DashboardPage.css';

const qualityMetrics = [
    { name: 'Completeness', value: 98, color: '#3b82f6' }, // Cyber Blue
    { name: 'Freshness', value: 92, color: '#8b5cf6' }, // Purple
    { name: 'Reliability', value: 87, color: '#ec4899' }, // Neon Pink
    { name: 'Consistency', value: 95, color: '#10b981' }, // Emerald
];

// Animation variants
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

const DashboardPage = () => {
    const { globalTrustScore, trustHistory, alerts, connectedSources, runAudit } = useIntelligence();
    const [mounted, setMounted] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAudit = async () => {
        setIsAuditing(true);
        // Add a slight artificial delay for the UI animation even if the network is fast
        setTimeout(async () => {
            await runAudit();
            setIsAuditing(false);
        }, 800);
    };

    return (
        <motion.div
            className="dashboard-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div className="page-header" variants={itemVariants}>
                <div>
                    <h1 className="text-gradient">Trust Command Center</h1>
                    <p className="page-subtitle">Real-time monitoring of your unified data knowledge layer.</p>
                </div>
                <motion.button
                    className={`primary-btn pulse-glow-btn ${isAuditing ? 'auditing' : ''}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAudit}
                    disabled={isAuditing}
                >
                    <Activity size={18} className={isAuditing ? 'spin' : ''} />
                    <span>{isAuditing ? 'Auditing Systems...' : 'Run Full Audit'}</span>
                </motion.button>
            </motion.div>

            {isAuditing && <div className="global-scanning-laser"></div>}

            <motion.div className={`stats-row ${isAuditing ? 'blur-sm' : ''}`} variants={containerVariants}>
                {/* Stat Card 1 */}
                <motion.div
                    className="stat-card glass-panel interactive-card"
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)" }}
                >
                    <div className="stat-header">
                        <h3 className="stat-title">Global Trust Score</h3>
                        <div className="stat-icon pulse-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-primary)' }}>
                            <ShieldCheck size={20} />
                        </div>
                    </div>
                    <div className="stat-value text-gradient">{globalTrustScore}<span className="stat-unit">%</span></div>
                    <div className="stat-trend positive">
                        <TrendingUp size={14} />
                        <span>Real-time</span>
                    </div>
                    <div className="card-glow-border primary"></div>
                </motion.div>

                {/* Stat Card 2 */}
                <motion.div
                    className="stat-card glass-panel interactive-card"
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(168, 85, 247, 0.5)" }}
                >
                    <div className="stat-header">
                        <h3 className="stat-title">Total Active Sources</h3>
                        <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-secondary)' }}>
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="stat-value">{connectedSources.length}</div>
                    <div className="stat-desc">Connected Systems</div>
                    <div className="card-glow-border secondary"></div>
                </motion.div>

                {/* Stat Card 3 */}
                <motion.div
                    className="stat-card glass-panel interactive-card"
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.5)" }}
                >
                    <div className="stat-header">
                        <h3 className="stat-title">Data Freshness SLA</h3>
                        <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success-color)' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div className="stat-value">99.2<span className="stat-unit">%</span></div>
                    <div className="stat-trend positive">
                        <TrendingUp size={14} />
                        <span>On track</span>
                    </div>
                    <div className="card-glow-border success"></div>
                </motion.div>

                {/* Stat Card 4 */}
                <motion.div
                    className="stat-card glass-panel alert-stat interactive-card"
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.5)" }}
                >
                    <div className="stat-header">
                        <h3 className="stat-title">Open Governance Alerts</h3>
                        <div className="stat-icon pulse-icon-danger" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger-color)' }}>
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div className="stat-value text-danger">{alerts.filter(a => a.type === 'danger' || a.type === 'warning').length}</div>
                    <div className="stat-desc">Action Required</div>
                    <div className="card-glow-border danger"></div>
                </motion.div>
            </motion.div>

            <motion.div className="charts-grid" variants={containerVariants}>
                <motion.div className="chart-card glass-panel" variants={itemVariants}>
                    <div className="chart-header">
                        <h2>Trust Score Intelligence</h2>
                        <button className="icon-btn-small"><ArrowUpRight size={16} /></button>
                    </div>
                    <div className="chart-wrapper">
                        {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trustHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.6} />
                                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 2']} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(10, 10, 15, 0.8)',
                                            backdropFilter: 'blur(12px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                                            color: '#fff'
                                        }}
                                        cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="url(#colorScore)"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        animationDuration={2000}
                                        animationEasing="ease-out"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                <motion.div className="chart-card glass-panel" variants={itemVariants}>
                    <div className="chart-header">
                        <h2>Quality Dimensions</h2>
                    </div>
                    <div className="chart-wrapper">
                        <div className="custom-progress-bars">
                            {qualityMetrics.map((metric, i) => (
                                <div key={metric.name} className="progress-item">
                                    <div className="progress-label">
                                        <span>{metric.name}</span>
                                        <span>{metric.value}%</span>
                                    </div>
                                    <div className="progress-track">
                                        <motion.div
                                            className="progress-fill-animated"
                                            style={{ background: metric.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.value}%` }}
                                            transition={{ duration: 1.5, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                                        >
                                            <div className="progress-glow" style={{ background: metric.color }}></div>
                                        </motion.div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div className="activity-feed glass-panel" variants={itemVariants}>
                <div className="feed-header">
                    <h2>Live Intelligence Feed</h2>
                    <div className="live-indicator">
                        <span className="live-dot"></span> Live
                    </div>
                </div>
                <div className="feed-list">
                    {alerts.map((alert, i) => (
                        <motion.div
                            key={alert.id}
                            className="feed-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + (i * 0.1) }}
                        >
                            <div className={`feed-icon ${alert.type}`}>
                                {alert.type === 'warning' && <AlertTriangle size={16} />}
                                {alert.type === 'danger' && <ShieldCheck size={16} />}
                                {alert.type === 'success' && <Activity size={16} />}
                            </div>
                            <div className="feed-content">
                                <p>{alert.message}</p>
                                <span className="feed-time">{alert.time}</span>
                            </div>
                            {alert.type === 'danger' && <div className="scanning-line"></div>}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardPage;
