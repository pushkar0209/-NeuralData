import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, AlertTriangle, ShieldCheck, Activity, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const MOCK_NOTIFICATIONS = [
    { id: 1, type: 'danger', title: 'PII Leak Risk', message: 'New column "ssn" found in raw_events', time: '5m ago' },
    { id: 2, type: 'warning', title: 'SLA Breach', message: 'analytics_prod.users freshness < 99%', time: '1h ago' },
    { id: 3, type: 'success', title: 'Extraction Complete', message: 'Snowflake connection established', time: '2h ago' },
];

const Header = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="header glass-panel">
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input
                    type="text"
                    placeholder="Ask NeuralData anything... (e.g., 'What is our trust score?')"
                    className="search-input"
                />
                <div className="search-shortcut">⌘K</div>
            </div>

            <div className="header-actions">
                <div className="status-badge">
                    <span className="status-dot"></span>
                    <span>System Healthy</span>
                </div>

                <div className="notification-container" ref={dropdownRef}>
                    <button
                        className={`icon-btn ${showNotifications ? 'active' : ''}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        <motion.span
                            className="notification-dot"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        ></motion.span>
                    </button>

                    <AnimatePresence>
                        {showNotifications && (
                            <motion.div
                                className="notification-dropdown glass-panel"
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            >
                                <div className="dropdown-header">
                                    <h3>Intelligence Alerts</h3>
                                    <button className="icon-btn-small" onClick={() => setShowNotifications(false)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="dropdown-body">
                                    {MOCK_NOTIFICATIONS.map((notif, index) => (
                                        <motion.div
                                            key={notif.id}
                                            className="notification-item"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className={`notif-icon ${notif.type}`}>
                                                {notif.type === 'danger' && <ShieldCheck size={16} />}
                                                {notif.type === 'warning' && <AlertTriangle size={16} />}
                                                {notif.type === 'success' && <Activity size={16} />}
                                            </div>
                                            <div className="notif-content">
                                                <h4>{notif.title}</h4>
                                                <p>{notif.message}</p>
                                                <span className="notif-time">{notif.time}</span>
                                            </div>
                                            {notif.type === 'danger' && <div className="danger-glow-bar" />}
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="dropdown-footer">
                                    <button className="view-all-btn">View All Intelligence Logs</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Header;
