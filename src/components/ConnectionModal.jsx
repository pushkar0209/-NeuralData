import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Database, ShieldAlert, Key, Globe, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ConnectionModal.css';

const getFieldsForSource = (sourceId) => {
    switch (sourceId) {
        case 'postgres':
        case 'mongodb':
            return [
                { name: 'host', label: 'Hostname / URI', type: 'text', placeholder: 'e.g. database.internal.net', icon: Globe },
                { name: 'port', label: 'Port', type: 'text', placeholder: 'e.g. 5432', icon: Server },
                { name: 'username', label: 'Username', type: 'text', placeholder: 'db_admin', icon: Database },
                { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Key },
            ];
        case 'snowflake':
            return [
                { name: 'account', label: 'Account Identifier', type: 'text', placeholder: 'xy12345.us-east-1', icon: Globe },
                { name: 'warehouse', label: 'Warehouse', type: 'text', placeholder: 'COMPUTE_WH', icon: Server },
                { name: 'username', label: 'User', type: 'text', placeholder: 'admin', icon: Database },
                { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', icon: Key },
            ];
        case 's3':
            return [
                { name: 'bucket', label: 'Bucket Name', type: 'text', placeholder: 'corporate-data-lake', icon: Database },
                { name: 'region', label: 'AWS Region', type: 'text', placeholder: 'us-east-1', icon: Globe },
                { name: 'accessKey', label: 'Access Key ID', type: 'text', placeholder: 'AKIA...', icon: Key },
                { name: 'secretKey', label: 'Secret Access Key', type: 'password', placeholder: '••••••••', icon: Key },
            ];
        default:
            return [];
    }
};

const ConnectionModal = ({ isOpen, onClose, source, onConnect }) => {
    const [config, setConfig] = useState({});
    const [testStatus, setTestStatus] = useState('idle'); // idle, testing, success, error
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen || !source) return null;

    const fields = getFieldsForSource(source.id);

    const handleChange = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
        if (testStatus !== 'idle') {
            setTestStatus('idle');
            setErrorMessage('');
        }
    };

    const handleTest = async () => {
        // Basic validation
        const allFilled = fields.every(f => config[f.name] && config[f.name].trim() !== '');
        if (!allFilled) {
            setTestStatus('error');
            setErrorMessage('Please fill in all configuration fields.');
            return;
        }

        setTestStatus('testing');
        setErrorMessage('');

        try {
            const res = await fetch('/api/sources/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceId: source.id, config })
            });
            const data = await res.json();

            if (data.success) {
                setTestStatus('success');
            } else {
                setTestStatus('error');
                setErrorMessage(data.error || 'Connection simulation failed.');
            }
        } catch (err) {
            setTestStatus('error');
            setErrorMessage('Network error occurred while testing connection.');
        }
    };

    const handleConnectClick = () => {
        if (testStatus === 'success') {
            onConnect(source, config);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <div className="modal-wrapper" onClick={onClose}>
                        <motion.div
                            className="modal-content glass-panel"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <div className="modal-header-title">
                                    <div className="modal-source-icon" style={{ backgroundColor: source.bg, color: source.color, borderColor: `${source.color}40` }}>
                                        <Database size={20} />
                                    </div>
                                    <h2>Configure {source.name}</h2>
                                </div>
                                <button className="icon-btn-small" onClick={onClose}><X size={18} /></button>
                            </div>

                            <div className="modal-body">
                                <p className="modal-desc">Enter the credentials to authenticate computing resources and establish a secure tunnel.</p>

                                <div className="config-form">
                                    {fields.map(field => {
                                        const Icon = field.icon;
                                        return (
                                            <div key={field.name} className="form-group">
                                                <label>{field.label}</label>
                                                <div className="input-wrapper">
                                                    <Icon size={16} className="input-icon" />
                                                    <input
                                                        type={field.type}
                                                        placeholder={field.placeholder}
                                                        value={config[field.name] || ''}
                                                        onChange={(e) => handleChange(field.name, e.target.value)}
                                                        className="config-input"
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {testStatus === 'error' && (
                                    <motion.div className="status-alert error-alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <ShieldAlert size={18} />
                                        <span>{errorMessage}</span>
                                    </motion.div>
                                )}

                                {testStatus === 'success' && (
                                    <motion.div className="status-alert success-alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                        <CheckCircle2 size={18} />
                                        <span>Connection verified. Security handshake successful.</span>
                                    </motion.div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="secondary-btn" onClick={onClose}>Cancel</button>
                                <div className="action-buttons">
                                    <button
                                        className={`test-btn ${testStatus === 'success' ? 'success' : ''}`}
                                        onClick={handleTest}
                                        disabled={testStatus === 'testing' || testStatus === 'success'}
                                    >
                                        {testStatus === 'testing' ? (
                                            <><Loader2 size={16} className="spinner" /> Testing...</>
                                        ) : testStatus === 'success' ? (
                                            <><CheckCircle2 size={16} /> Verified</>
                                        ) : (
                                            'Test Connection'
                                        )}
                                    </button>
                                    <button
                                        className="primary-btn pulse-glow-btn"
                                        disabled={testStatus !== 'success'}
                                        onClick={handleConnectClick}
                                    >
                                        Extract & Sync
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ConnectionModal;
