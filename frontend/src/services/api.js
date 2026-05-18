import axios from 'axios';

const API_BASE = 'https://employee-analytics-system.onrender.com';

// Employee APIs
export const getEmployees = () => axios.get(`${API_BASE}/api/employees`);
export const getEmployee = (id) => axios.get(`${API_BASE}/api/employees/${id}`);
export const addEmployee = (data) => axios.post(`${API_BASE}/api/employees`, data);
export const updateEmployee = (id, data) => axios.put(`${API_BASE}/api/employees/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`${API_BASE}/api/employees/${id}`);
export const searchEmployees = (params) => axios.get(`${API_BASE}/api/employees/search`, { params });

// AI APIs
export const getAIRecommendation = (data) => axios.post(`${API_BASE}/api/ai/recommend`, data);