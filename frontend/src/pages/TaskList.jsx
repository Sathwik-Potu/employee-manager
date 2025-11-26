import React, { useEffect, useState } from 'react';
import { getTasks, createTask, deleteTask, getEmployees, updateTask } from '../services/api';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ title: '', description: '', assignee_id: '', status: 'Pending', due_date: '' });

    useEffect(() => {
        loadTasks();
        loadEmployees();
    }, []);

    const loadTasks = async () => {
        try {
            const res = await getTasks();
            setTasks(res.data);
        } catch (error) {
            console.error("Error loading tasks", error);
        }
    };

    const loadEmployees = async () => {
        try {
            const res = await getEmployees();
            setEmployees(res.data);
        } catch (error) {
            console.error("Error loading employees", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createTask(form);
            setForm({ title: '', description: '', assignee_id: '', status: 'Pending', due_date: '' });
            loadTasks();
        } catch (error) {
            console.error("Error creating task", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteTask(id);
                loadTasks();
            } catch (error) {
                console.error("Error deleting task", error);
            }
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateTask(id, { status: newStatus });
            loadTasks();
        } catch (error) {
            console.error("Error updating task status", error);
        }
    };

    const getEmployeeName = (id) => {
        const emp = employees.find(e => (e.id || e._id) === id);
        return emp ? emp.name : 'Unassigned';
    };

    return (
        <div>
            <h1>Tasks</h1>

            <div className="card">
                <h3>Add New Task</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title</label>
                        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Assignee</label>
                        <select value={form.assignee_id} onChange={e => setForm({ ...form, assignee_id: e.target.value })}>
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.id || emp._id} value={emp.id || emp._id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Due Date</label>
                        <input type="datetime-local" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Task</button>
                </form>
            </div>

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Assignee</th>
                            <th>Status</th>
                            <th>Due Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id || task._id}>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>{getEmployeeName(task.assignee_id)}</td>
                                <td>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: task.status === 'Completed' ? '#d1fae5' : task.status === 'In Progress' ? '#dbeafe' : '#f3f4f6',
                                        color: task.status === 'Completed' ? '#065f46' : task.status === 'In Progress' ? '#1e40af' : '#374151'
                                    }}>
                                        {task.status}
                                    </span>
                                </td>
                                <td>{task.due_date ? new Date(task.due_date).toLocaleString() : '-'}</td>
                                <td>
                                    <button onClick={() => handleDelete(task.id || task._id)} className="btn btn-danger">Delete</button>
                                    {task.status === 'In Progress' && (
                                        <button
                                            onClick={() => handleStatusUpdate(task.id || task._id, 'Completed')}
                                            className="btn"
                                            style={{ backgroundColor: '#10b981', color: 'white', marginLeft: '5px' }}
                                        >
                                            Mark Completed
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
