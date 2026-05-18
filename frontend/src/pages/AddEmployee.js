import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEmployee } from '../services/api';

const Field = ({ label, hint, children }) => (
  <div style={s.field}>
    <label style={s.label}>{label}{hint && <span style={s.hint}> — {hint}</span>}</label>
    {children}
  </div>
);

const AddEmployee = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    try {
      await addEmployee({ ...form, skills: skillsArray, performanceScore: Number(form.performanceScore), experience: Number(form.experience) });
      setSuccess('Employee added successfully!');
      setForm({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add employee');
    } finally { setLoading(false); }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>Add Employee</h1>
          <p style={s.sub}>Fill in the details below to add a new team member</p>
        </div>

        {error && <div style={s.alertError}>{error}</div>}
        {success && <div style={s.alertSuccess}>✓ {success}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.row}>
            <Field label="Full Name">
              <input name="name" style={s.input} value={form.name} onChange={handleChange} required placeholder="Jane Smith" />
            </Field>
            <Field label="Email">
              <input name="email" type="email" style={s.input} value={form.email} onChange={handleChange} required placeholder="jane@company.com" />
            </Field>
          </div>
          <div style={s.row}>
            <Field label="Department">
              <input name="department" style={s.input} value={form.department} onChange={handleChange} required placeholder="Engineering" />
            </Field>
            <Field label="Skills" hint="comma separated">
              <input name="skills" style={s.input} value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
            </Field>
          </div>
          <div style={s.row}>
            <Field label="Performance Score" hint="0–100">
              <input name="performanceScore" type="number" min="0" max="100" style={s.input} value={form.performanceScore} onChange={handleChange} required placeholder="85" />
            </Field>
            <Field label="Years of Experience">
              <input name="experience" type="number" min="0" style={s.input} value={form.experience} onChange={handleChange} required placeholder="3" />
            </Field>
          </div>

          <div style={s.actions}>
            <button type="button" onClick={() => navigate('/employees')} style={s.btnCancel}>Cancel</button>
            <button type="submit" disabled={loading} style={s.btnSubmit}>{loading ? 'Adding…' : 'Add Employee'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 28px' },
  container: { background: '#fff', border: '1px solid #e4e2de', borderRadius: 14, padding: '32px', maxWidth: 700 },
  header: { marginBottom: 28 },
  title: { fontSize: 20, fontWeight: 600, color: '#1a1916', marginBottom: 4 },
  sub: { fontSize: 14, color: '#6b6860' },
  alertError: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 20 },
  alertSuccess: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 20 },
  form: {},
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 4 },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#1a1916', marginBottom: 5 },
  hint: { color: '#9e9b96', fontWeight: 400 },
  input: { width: '100%', border: '1px solid #e4e2de', borderRadius: 7, padding: '9px 12px', fontSize: 14, color: '#1a1916', background: '#fafaf9', outline: 'none' },
  actions: { display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #f0efec', marginTop: 8 },
  btnCancel: { background: '#fff', color: '#6b6860', border: '1px solid #e4e2de', borderRadius: 8, padding: '9px 20px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  btnSubmit: { background: '#1a1916', color: '#fff', border: 'none', borderRadius: 8, padding: '9px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
};

export default AddEmployee;
