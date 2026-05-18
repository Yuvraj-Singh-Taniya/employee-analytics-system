import axios from 'axios';

// Employee APIs
export const getEmployees = () => axios.get('/api/employees');
export const getEmployee = (id) => axios.get(`/api/employees/${id}`);
export const addEmployee = (data) => axios.post('/api/employees', data);
export const updateEmployee = (id, data) => axios.put(`/api/employees/${id}`, data);
export const deleteEmployee = (id) => axios.delete(`/api/employees/${id}`);
export const searchEmployees = (params) => axios.get('/api/employees/search', { params });

// AI APIs
export const getAIRecommendation = (data) => axios.post('/api/ai/recommend', data);
