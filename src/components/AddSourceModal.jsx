import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Database, Cloud, Server, HardDrive, Plus, AlertCircle } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import './ConnectionModal.css'; // Reusing modal styles if possible

const sourceTypes = [
    { id: 'Relational Database', icon: Database, color: '#336791', bg: 'rgba(51, 103, 145, 0.15)' },
    { id: 'Data Warehouse', icon: Cloud, color: '#29B5E8', bg: 'rgba(41, 181, 232, 0.15)' },
    { id: 'NoSQL Database', icon: Server, color: '#47A248', bg: 'rgba(71, 162, 72, 0.15)' },
    { id: 'Object Storage', icon: HardDrive, color: '#FF9900', bg: 'rgba(255, 153, 0, 0.15)' },
    { id: 'Internal API', icon: Database, color: '#888888', bg: 'rgba(136, 136, 136, 0.15)' },
];

const AddSourceModal = ({ isOpen, onClose }) => {
    const { addAvailableSource } = useIntelligence();
    const [name, setName] = useState('');
    const [selectedType, setSelectedType] = useState(sourceTypes[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        setError(null);

        const result = await addAvailableSource(name, selectedType.id, selectedType.color, selectedType.bg);

        if (result.success) {
            setName('');
            setSelectedType(sourceTypes[0]);
            onClose();
        } else {
            setError(result.error);
        }
        setIsSubmitting(false);
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    className="modal-content glass-panel"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                >
                    <button className="modal-close" onClick={onClose}><X size={20} /></button>

                    <div className="modal-header">
                        <h2>Register New Data Source</h2>
                        <p>Add a new enterprise database, warehouse, or API to the knowledge layer.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-body">
                        {error && (
                            <div className="modal-error mb-4 p-3 rounded flex items-center gap-2 text-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Source Name</label>
                            <input
                                type="text"
                                className="glass-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. European Sales Postgres"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Source Type</label>
                            <div className="type-selector-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                                {sourceTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = selectedType.id === type.id;
                                    return (
                                        <div
                                            key={type.id}
                                            className={`type-option ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedType(type)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '12px',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                border: `1px solid ${isSelected ? type.color : 'rgba(255,255,255,0.1)'}`,
                                                background: isSelected ? type.bg : 'rgba(255,255,255,0.02)',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Icon size={18} color={type.color} />
                                            <span style={{ fontSize: '13px' }}>{type.id}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="modal-actions" style={{ marginTop: '24px' }}>
                            <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
                            <button
                                type="submit"
                                className="primary-btn pulse-glow-btn"
                                disabled={!name.trim() || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span>Registering...</span>
                                ) : (
                                    <>
                                        <Plus size={16} />
                                        <span>Register Source</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddSourceModal;
