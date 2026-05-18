import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../services/api';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    skills: '',
    performanceScore: '',
    experience: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const skillsArray = form.skills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');

    try {
      await addEmployee({
        name: form.name,
        email: form.email,
        department: form.department,
        skills: skillsArray,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience),
      });
      setSuccess('Employee added successfully!');
      setForm({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '8px', boxSizing: 'border-box', marginTop: '4px' };
  const fieldStyle = { marginBottom: '14px' };

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Add Employee</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={fieldStyle}>
          <label>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label>Department *</label>
          <input name="department" value={form.department} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label>Skills (comma separated)</label>
          <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label>Performance Score (0-100) *</label>
          <input name="performanceScore" type="number" min="0" max="100" value={form.performanceScore} onChange={handleChange} required style={inputStyle} />
        </div>
        <div style={fieldStyle}>
          <label>Years of Experience *</label>
          <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} required style={inputStyle} />
        </div>
        <button type="submit" disabled={loading} style={{ padding: '8px 20px', marginRight: '10px' }}>
          {loading ? 'Saving...' : 'Add Employee'}
        </button>
        <button type="button" onClick={() => navigate('/employees')} style={{ padding: '8px 20px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
