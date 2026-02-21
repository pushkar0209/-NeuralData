import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const IntelligenceContext = createContext();

export const useIntelligence = () => useContext(IntelligenceContext);

export const IntelligenceProvider = ({ children }) => {
    const [connectedSources, setConnectedSources] = useState([]);
    const [availableSources, setAvailableSources] = useState([]);
    const [globalTrustScore, setGlobalTrustScore] = useState(0);
    const [trustHistory, setTrustHistory] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [settings, setSettings] = useState({
        autoPiiRedact: false,
        strictSlaAlerts: false,
        shareMetrics: false,
        schemaAutoSync: false
    });
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/data');
            const data = await res.json();
            setConnectedSources(data.connectedSources);
            setAvailableSources(data.availableSources);
            setGlobalTrustScore(data.globalTrustScore);
            setTrustHistory(data.trustHistory);
            setAlerts(data.alerts);
            setSettings(data.settings);
        } catch (error) {
            console.error('Error fetching intelligence data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        // Fallback polling for real-time feel if needed
        // const interval = setInterval(fetchData, 10000);
        // return () => clearInterval(interval);
    }, [fetchData]);

    const addAlert = async (type, message) => {
        try {
            const res = await fetch('/api/alerts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, message })
            });
            const data = await res.json();
            if (data.success) {
                setAlerts(data.alerts);
            }
        } catch (error) {
            console.error('Error adding alert:', error);
        }
    };

    const testConnection = async (sourceId, config) => {
        try {
            const res = await fetch('/api/sources/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceId, config })
            });
            return await res.json();
        } catch (error) {
            console.error('Error testing connection:', error);
            return { success: false, error: 'Network error preventing connection test.' };
        }
    };

    const updateTrustScore = async (change) => {
        try {
            const res = await fetch('/api/trust', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ change })
            });
            const data = await res.json();
            if (data.success) {
                setGlobalTrustScore(data.globalTrustScore);
                setTrustHistory(data.trustHistory);
            }
        } catch (error) {
            console.error('Error updating trust score:', error);
        }
    };

    const connectSource = async (sourceId, config = {}) => {
        try {
            const res = await fetch('/api/sources/connect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceId, config })
            });
            const data = await res.json();

            if (data.success) {
                setConnectedSources(data.connectedSources);
                setAlerts(data.alerts);
                setGlobalTrustScore(data.globalTrustScore);
                setTrustHistory(data.trustHistory);

                if (data.shouldPenalize) {
                    setTimeout(() => {
                        addAlert('danger', `PII Leak Risk: Sensitive patterns detected in ${data.sourceName}`);
                        updateTrustScore(-3);
                    }, 4000);
                }
            }
        } catch (error) {
            console.error('Error connecting source:', error);
        }
    };

    const toggleSetting = async (settingKey) => {
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settingKey })
            });
            const data = await res.json();
            if (data.success) {
                setSettings(data.settings);
                setAlerts(data.alerts);
            }
        } catch (error) {
            console.error('Error toggling setting:', error);
        }
    };

    const value = {
        connectedSources,
        availableSources,
        globalTrustScore,
        trustHistory,
        alerts,
        settings,
        connectSource,
        testConnection,
        toggleSetting,
        addAlert,
        loading
    };

    return (
        <IntelligenceContext.Provider value={value}>
            {children}
        </IntelligenceContext.Provider>
    );
};
