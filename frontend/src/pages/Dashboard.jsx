import React, { useEffect, useState } from 'react';
import { getEmployees, getTasks } from '../services/api';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [stats, setStats] = useState({ employees: 0, tasks: 0, pendingTasks: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, taskRes] = await Promise.all([getEmployees(), getTasks()]);
                const employees = empRes.data;
                const tasks = taskRes.data;
                const pending = tasks.filter(t => t.status !== 'Completed').length;

                setStats({
                    employees: employees.length,
                    tasks: tasks.length,
                    pendingTasks: pending
                });
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="card">
                    <h2>Employees</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.employees}</p>
                    <Link to="/employees" className="btn btn-primary">Manage Employees</Link>
                </div>
                <div className="card">
                    <h2>Total Tasks</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.tasks}</p>
                    <Link to="/tasks" className="btn btn-primary">Manage Tasks</Link>
                </div>
                <div className="card">
                    <h2>Pending Tasks</h2>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.pendingTasks}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
