import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Database, MessageSquareText, Settings, User } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <div className="logo-icon text-gradient">✨</div>
                <h1 className="logo-text">NeuralData</h1>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <LayoutDashboard size={20} />
                            <span>Trust Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/connections" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <Database size={20} />
                            <span>Data Sources</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/assistant" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            <MessageSquareText size={20} />
                            <span>AI Assistant</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
                <div className="user-profile">
                    <div className="user-avatar">
                        <User size={18} />
                    </div>
                    <div className="user-info">
                        <p className="user-name">Admin User</p>
                        <p className="user-role">Data Engineer</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
