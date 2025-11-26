import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const USE_MOCK_DATA = false;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


const mockEmployees = [
    { _id: '1', name: 'Sathwik Potu', email: 'sathwik@gmail.com', role: 'Developer', department: 'IT' },
    { _id: '2', name: 'Rahul Verma', email: 'rahul@example.com', role: 'Designer', department: 'Creative' },
];

const mockTasks = [
    { _id: '1', title: 'Fix Login', description: 'Login page is broken', assignee_id: '1', status: 'Pending', due_date: '2023-12-31' },
    { _id: '2', title: 'Design Logo', description: 'New logo for client', assignee_id: '2', status: 'In Progress', due_date: '2023-12-25' },
];

export const getEmployees = async () => {
    if (USE_MOCK_DATA) return { data: mockEmployees };
    return api.get('/employees');
};

export const createEmployee = async (employee) => {
    if (USE_MOCK_DATA) {
        const newEmployee = { ...employee, _id: Math.random().toString() };
        mockEmployees.push(newEmployee);
        return { data: newEmployee };
    }
    return api.post('/employees', employee);
};

export const updateEmployee = async (id, employee) => {
    if (USE_MOCK_DATA) return { data: employee };
    return api.put(`/employees/${id}`, employee);
};

export const deleteEmployee = async (id) => {
    if (USE_MOCK_DATA) return { data: {} };
    return api.delete(`/employees/${id}`);
};

export const getTasks = async () => {
    if (USE_MOCK_DATA) return { data: mockTasks };
    return api.get('/tasks');
};

export const createTask = async (task) => {
    if (USE_MOCK_DATA) {
        const newTask = { ...task, _id: Math.random().toString() };
        mockTasks.push(newTask);
        return { data: newTask };
    }
    return api.post('/tasks', task);
};

export const updateTask = async (id, task) => {
    if (USE_MOCK_DATA) return { data: task };
    return api.put(`/tasks/${id}`, task);
};

export const deleteTask = async (id) => {
    if (USE_MOCK_DATA) return { data: {} };
    return api.delete(`/tasks/${id}`);
};

export default api;
