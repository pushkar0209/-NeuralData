import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Terminal, Database, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntelligence } from '../context/IntelligenceContext';
import './AssistantPage.css';

const initialMessages = [
    { id: 1, type: 'assistant', text: "Hello! I'm NeuralData's AI Intelligence Agent. I've analyzed your connected data sources. How can I help you extract insights today?", time: '10:00 AM' }
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

const AssistantPage = () => {
    const { connectedSources, globalTrustScore, settings } = useIntelligence();
    const [messages, setMessages] = useState(initialMessages);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = (e, presetText = null) => {
        if (e) e.preventDefault();
        const textToSend = presetText || inputValue;
        if (!textToSend.trim()) return;

        const newUserMsg = { id: Date.now(), type: 'user', text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, newUserMsg]);
        setInputValue('');
        setIsTyping(true);

        // Dynamic AI response reasoning
        setTimeout(() => {
            const query = textToSend.toLowerCase();
            let responseText = "";

            if (query.includes('source') || query.includes('connect')) {
                if (connectedSources.length === 0) {
                    responseText = "There are currently **no data sources** connected. Please navigate to the Data Sources page to connect PostgreSQL, Snowflake, MongoDB, or S3.";
                } else {
                    const sourceNames = connectedSources.map(s => `\n- **${s.name}** (${s.type})`).join('');
                    responseText = `Currently, the following systems are connected and analyzed in the knowledge layer:${sourceNames}\n\nI am actively monitoring these sources for schema changes and PII.`;
                }
            } else if (query.includes('trust') || query.includes('score')) {
                responseText = `The Global Trust Score is currently at **${globalTrustScore}%**.\n\n> **Trust Warning**: If the score is below 90%, it indicates recent SLA misses or potential PII leaks. Check the Dashboard for detailed metrics.`;
            } else if (query.includes('pii') || query.includes('sensitive')) {
                if (settings.autoPiiRedact) {
                    responseText = "PII Auto-redaction is currently **ENABLED** in your governance settings. If I detect SSNs, emails, or phone numbers in your data, they will be masked automatically before being displayed.";
                } else {
                    responseText = "PII Auto-redaction is currently **DISABLED**. \n\n> **Trust Warning**: Unmasked PII may be exposed in query results. Please review your Data Governance settings.";
                }
            } else {
                responseText = "Based on the schema extracted from `analytics_prod.users`, the `customer_ltv` column represents the Lifetime Value of a customer calculated over a 12-month trailing period. Would you like me to generate a SQL query relating to this?";
            }

            const newAiMsg = { id: Date.now() + 1, type: 'assistant', text: responseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, newAiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const renderMessageContent = (text) => {
        // Advanced mock markdown parsing (handles blockquotes, bold, and code)
        const blocks = text.split('\n\n');
        return blocks.map((block, i) => {
            if (block.startsWith('> **Trust Warning**:')) {
                return (
                    <div key={i} className="msg-alert-block warning">
                        <Zap size={16} /> <span>{block.replace('> **Trust Warning**:', '').trim()}</span>
                    </div>
                );
            }

            const parts = block.split(/(`[^`]+`|\*\*[^*]+\*\*)/);
            return (
                <p key={i}>
                    {parts.map((part, j) => {
                        if (part.startsWith('`') && part.endsWith('`')) {
                            return <code key={j} className="inline-code">{part.slice(1, -1)}</code>;
                        }
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="neon-text">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <motion.div
            className="assistant-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="assistant-layout">
                <motion.div className={`chat-area glass-panel ${isTyping ? 'ai-thinking' : ''}`} variants={itemVariants}>
                    <div className="chat-header">
                        <div className="chat-title">
                            <Sparkles size={20} className="text-accent pulse-icon" />
                            <h2>Intelligence Agent</h2>
                        </div>
                        <span className="model-badge">NeuralEngine-v3.0</span>
                    </div>

                    <div className="messages-list">
                        <AnimatePresence>
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    className={`message-wrapper ${msg.type}`}
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <div className="message-avatar">
                                        {msg.type === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                                    </div>
                                    <div className="message-content">
                                        <div className="message-author">
                                            {msg.type === 'assistant' ? 'Neural Agent' : 'You'}
                                            <span className="message-time">{msg.time}</span>
                                        </div>
                                        <div className={`message-bubble ${msg.type}`}>
                                            {renderMessageContent(msg.text)}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    key="typing"
                                    className="message-wrapper assistant"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <div className="message-avatar typing-avatar"><Bot size={20} /></div>
                                    <div className="message-content">
                                        <div className="message-author">Neural Agent <span className="message-time">Synthesizing insights...</span></div>
                                        <div className="message-bubble assistant typing-bubble">
                                            <div className="typing-waves">
                                                <span></span><span></span><span></span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-wrapper">
                        <form className="chat-input-area" onSubmit={(e) => handleSend(e)}>
                            <input
                                type="text"
                                placeholder="Ask about schemas, trust scores, or request an audit..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="chat-input"
                                disabled={isTyping}
                            />
                            <button type="submit" className={`send-btn ${inputValue.trim() ? 'active' : ''}`} disabled={!inputValue.trim() || isTyping}>
                                <Send size={18} />
                            </button>
                        </form>
                        <div className="input-glow"></div>
                    </div>
                </motion.div>

                <motion.div className="context-sidebar glass-panel" variants={itemVariants}>
                    <h3>Active Context</h3>

                    <div className="context-section">
                        <h4><Database size={14} className="text-secondary" /> Synthesized Sources</h4>
                        <div className="context-tags">
                            {connectedSources.length === 0 ? (
                                <span className="source-tag">No sources connected</span>
                            ) : (
                                connectedSources.map(s => (
                                    <span key={s.id} className={`source-tag ${s.id === 'postgres' ? 'pg' : 'sf'}`}>
                                        <span className="dot" style={{ backgroundColor: s.color }}></span>{s.name.split(' - ')[0]}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="context-section">
                        <h4><Terminal size={14} className="text-secondary" /> Suggested Inquiries</h4>
                        <ul className="suggestion-list">
                            <motion.li whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }} onClick={() => handleSend(null, "Show me all tables containing PII data")}>
                                <ChevronRight size={14} className="li-icon" /> Show me tables with PII
                            </motion.li>
                            <motion.li whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }} onClick={() => handleSend(null, "What is the definition of customer_ltv?")}>
                                <ChevronRight size={14} className="li-icon" /> Define 'customer_ltv'
                            </motion.li>
                            <motion.li whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }} onClick={() => handleSend(null, "Why did the trust score drop yesterday?")}>
                                <ChevronRight size={14} className="li-icon" /> Why did Trust drop yesterday?
                            </motion.li>
                        </ul>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AssistantPage;
