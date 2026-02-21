import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Key, Save, Bell, Lock, Database } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import './SettingsPage.css';

const tabs = [
    { id: 'profile', label: 'User Profile', icon: User },
    { id: 'governance', label: 'Data Governance', icon: Shield },
    { id: 'api', label: 'API & Integrations', icon: Key },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
};

const SettingsPage = () => {
    const { settings, toggleSetting } = useIntelligence();
    const [activeTab, setActiveTab] = useState('governance');

    const handleToggle = (setting) => {
        toggleSetting(setting);
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
                    <h1 className="text-gradient">Platform Settings</h1>
                    <p className="page-subtitle">Configure intelligence agents, security policies, and access control.</p>
                </div>
                <motion.button
                    className="primary-btn pulse-glow-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Save size={18} />
                    <span>Save Changes</span>
                </motion.button>
            </motion.div>

            <motion.div className="settings-layout" variants={itemVariants}>
                <div className="settings-sidebar glass-panel">
                    <nav className="settings-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <tab.icon size={18} className="tab-icon" />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div className="active-tab-indicator" layoutId="activeTab" />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="settings-content glass-panel">
                    <AnimatePresence mode="wait">
                        {activeTab === 'governance' && (
                            <motion.div
                                key="governance"
                                className="tab-pane"
                                variants={tabContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="pane-header">
                                    <h2><Shield size={24} className="text-secondary" /> Data Governance & Security</h2>
                                    <p>Manage how NeuralData handles sensitive information and schema changes.</p>
                                </div>

                                <div className="settings-group">
                                    <h3><Lock size={16} /> Privacy Controls</h3>
                                    <div className="settings-list">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Auto-redact PII Entities</h4>
                                                <p>Automatically mask detected PII (SSN, emails) in Assistant responses and query results.</p>
                                            </div>
                                            <div className={`cyber-toggle ${settings.autoPiiRedact ? 'on' : 'off'}`} onClick={() => handleToggle('autoPiiRedact')}>
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3><Database size={16} /> Knowledge Graph</h3>
                                    <div className="settings-list">
                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Schema Auto-Sync</h4>
                                                <p>Automatically update the knowledge graph when underlying database schemas change.</p>
                                            </div>
                                            <div className={`cyber-toggle ${settings.schemaAutoSync ? 'on' : 'off'}`} onClick={() => handleToggle('schemaAutoSync')}>
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>

                                        <div className="setting-item">
                                            <div className="setting-info">
                                                <h4>Strict SLA Alerts</h4>
                                                <p>Trigger critical dashboard alerts if data freshness falls below 99% SLA.</p>
                                            </div>
                                            <div className={`cyber-toggle ${settings.strictSlaAlerts ? 'on' : 'off'}`} onClick={() => handleToggle('strictSlaAlerts')}>
                                                <div className="toggle-thumb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                className="tab-pane"
                                variants={tabContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="pane-header">
                                    <h2><User size={24} className="text-accent-primary" /> User Profile</h2>
                                    <p>Manage your account details and preferences.</p>
                                </div>
                                <div className="profile-form">
                                    <div className="avatar-upload">
                                        <div className="avatar-circle pulse-icon">
                                            <User size={40} />
                                        </div>
                                        <button className="secondary-btn glow-hover">Change Avatar</button>
                                    </div>
                                    <div className="form-grid">
                                        <div className="input-group">
                                            <label>Full Name</label>
                                            <input type="text" className="cyber-input" defaultValue="Admin User" />
                                        </div>
                                        <div className="input-group">
                                            <label>Email Address</label>
                                            <input type="email" className="cyber-input" defaultValue="admin@neuraldata.io" disabled />
                                        </div>
                                        <div className="input-group">
                                            <label>Role</label>
                                            <input type="text" className="cyber-input" defaultValue="Data Engineer" disabled />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'api' && (
                            <motion.div
                                key="api"
                                className="tab-pane"
                                variants={tabContentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                <div className="pane-header">
                                    <h2><Key size={24} className="text-warning" /> API & Integrations</h2>
                                    <p>Manage API keys for programmatic access to the Intelligence Engine.</p>
                                </div>

                                <div className="api-keys-section">
                                    <div className="api-keys-header">
                                        <h3>Active Keys</h3>
                                        <button className="secondary-btn glow-hover">+ Generate New Key</button>
                                    </div>
                                    <div className="api-key-card">
                                        <div className="api-key-info">
                                            <h4>Production Environment</h4>
                                            <p>Created on Oct 24, 2025 • Last used 2 hours ago</p>
                                        </div>
                                        <div className="api-key-value">
                                            <code>nd_prod_***...8f2a</code>
                                            <button className="copy-btn">Copy</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SettingsPage;
