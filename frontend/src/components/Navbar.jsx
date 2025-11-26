import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#4f46e5' }}>
                    ProU Manager
                </Link>
                <div className="nav-links">
                    <Link to="/">Dashboard</Link>
                    <Link to="/employees">Employees</Link>
                    <Link to="/tasks">Tasks</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
