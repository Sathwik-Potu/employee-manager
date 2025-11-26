import React, { useEffect, useState } from 'react';
import { getEmployees, createEmployee, deleteEmployee } from '../services/api';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState({ name: '', email: '', role: '', department: '' });

    useEffect(() => {
        loadEmployees();
    }, []);

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
            await createEmployee(form);
            setForm({ name: '', email: '', role: '', department: '' });
            loadEmployees();
        } catch (error) {
            console.error("Error creating employee", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            try {
                await deleteEmployee(id);
                loadEmployees();
            } catch (error) {
                console.error("Error deleting employee", error);
            }
        }
    };

    return (
        <div>
            <h1>Employees</h1>

            <div className="card">
                <h3>Add New Employee</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Department</label>
                        <input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Add Employee</button>
                </form>
            </div>

            <div className="card">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id || emp._id}>
                                <td>{emp.name}</td>
                                <td>{emp.email}</td>
                                <td>{emp.role}</td>
                                <td>{emp.department}</td>
                                <td>
                                    <button onClick={() => handleDelete(emp.id || emp._id)} className="btn btn-danger">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EmployeeList;
