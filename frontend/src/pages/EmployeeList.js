import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee, searchEmployees, updateEmployee } from '../services/api';

const ScoreBadge = ({ score }) => {
  let bg = '#fef2f2', color = '#dc2626';
  if (score >= 80) { bg = '#f0fdf4'; color = '#16a34a'; }
  else if (score >= 60) { bg = '#fffbeb'; color = '#d97706'; }
  return <span style={{ background: bg, color, borderRadius: 5, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{score}</span>;
};

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchDept, setSearchDept] = useState('');
  const [searchName, setSearchName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const fetchAll = () => {
    setLoading(true);
    getEmployees()
      .then(res => setEmployees(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSearch = (e) => {
    e.preventDefault(); setLoading(true);
    searchEmployees({ department: searchDept, name: searchName })
      .then(res => setEmployees(res.data))
      .catch(err => setError(err.response?.data?.message || 'Search failed'))
      .finally(() => setLoading(false));
  };

  const handleReset = () => { setSearchDept(''); setSearchName(''); fetchAll(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try { await deleteEmployee(id); setEmployees(employees.filter(e => e._id !== id)); }
    catch (err) { alert(err.response?.data?.message || 'Delete failed'); }
  };

  const startEdit = (emp) => {
    setEditId(emp._id);
    setEditForm({ name: emp.name, department: emp.department, skills: emp.skills.join(', '), performanceScore: emp.performanceScore, experience: emp.experience });
  };

  const handleEditSave = async (id) => {
    try {
      const updated = await updateEmployee(id, {
        ...editForm,
        skills: editForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        performanceScore: Number(editForm.performanceScore),
        experience: Number(editForm.experience),
      });
      setEmployees(employees.map(e => e._id === id ? updated.data : e));
      setEditId(null);
    } catch (err) { alert(err.response?.data?.message || 'Update failed'); }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Employees</h1>
          <p style={s.pageSub}>{employees.length} team member{employees.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/add-employee"><button style={s.btnPrimary}>+ Add Employee</button></Link>
      </div>

      <form onSubmit={handleSearch} style={s.searchBar}>
        <input style={s.searchInput} placeholder="Filter by name…" value={searchName} onChange={e => setSearchName(e.target.value)} />
        <input style={s.searchInput} placeholder="Filter by department…" value={searchDept} onChange={e => setSearchDept(e.target.value)} />
        <button type="submit" style={s.btnSearch}>Search</button>
        <button type="button" onClick={handleReset} style={s.btnReset}>Reset</button>
      </form>

      {error && <div style={s.errorBox}>{error}</div>}

      {loading ? (
        <div style={s.emptyState}>Loading…</div>
      ) : employees.length === 0 ? (
        <div style={s.emptyState}>No employees found.</div>
      ) : (
        <div style={s.tableCard}>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr style={s.thead}>
                  <th style={s.th}>Name</th>
                  <th style={s.th}>Email</th>
                  <th style={s.th}>Department</th>
                  <th style={s.th}>Skills</th>
                  <th style={s.th}>Score</th>
                  <th style={s.th}>Experience</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => editId === emp._id ? (
                  <tr key={emp._id} style={{ ...s.tr, background: '#fffbeb' }}>
                    <td style={s.td}><input style={s.inlineInput} value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></td>
                    <td style={{ ...s.td, color: '#9e9b96', fontSize: 13 }}>{emp.email}</td>
                    <td style={s.td}><input style={s.inlineInput} value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} /></td>
                    <td style={s.td}><input style={s.inlineInput} value={editForm.skills} onChange={e => setEditForm({ ...editForm, skills: e.target.value })} /></td>
                    <td style={s.td}><input style={{ ...s.inlineInput, width: 64 }} type="number" min="0" max="100" value={editForm.performanceScore} onChange={e => setEditForm({ ...editForm, performanceScore: e.target.value })} /></td>
                    <td style={s.td}><input style={{ ...s.inlineInput, width: 56 }} type="number" min="0" value={editForm.experience} onChange={e => setEditForm({ ...editForm, experience: e.target.value })} /></td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <button onClick={() => handleEditSave(emp._id)} style={s.btnSave}>Save</button>
                      <button onClick={() => setEditId(null)} style={s.btnCancel}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={emp._id} style={s.tr}>
                    <td style={{ ...s.td, fontWeight: 500 }}>{emp.name}</td>
                    <td style={{ ...s.td, color: '#6b6860', fontSize: 13 }}>{emp.email}</td>
                    <td style={s.td}><span style={s.deptBadge}>{emp.department}</span></td>
                    <td style={s.td}>
                      <div style={s.skillsWrap}>
                        {emp.skills.slice(0, 2).map(sk => <span key={sk} style={s.skill}>{sk}</span>)}
                        {emp.skills.length > 2 && <span style={{ ...s.skill, color: '#9e9b96' }}>+{emp.skills.length - 2}</span>}
                      </div>
                    </td>
                    <td style={s.td}><ScoreBadge score={emp.performanceScore} /></td>
                    <td style={{ ...s.td, color: '#6b6860' }}>{emp.experience} yr{emp.experience !== 1 ? 's' : ''}</td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <button onClick={() => startEdit(emp)} style={s.actionBtn}>Edit</button>
                      <button onClick={() => handleDelete(emp._id)} style={{ ...s.actionBtn, color: '#dc2626' }}>Delete</button>
                      <Link to={`/ai-recommend?employeeId=${emp._id}`}><button style={{ ...s.actionBtn, color: '#2563eb' }}>AI</button></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 28px' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 },
  pageTitle: { fontSize: 22, fontWeight: 600, color: '#1a1916', marginBottom: 3 },
  pageSub: { fontSize: 14, color: '#6b6860' },
  btnPrimary: { background: '#1a1916', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  searchBar: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  searchInput: { border: '1px solid #e4e2de', borderRadius: 7, padding: '8px 12px', fontSize: 13, background: '#fff', color: '#1a1916', outline: 'none', minWidth: 180 },
  btnSearch: { background: '#1a1916', color: '#fff', border: 'none', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnReset: { background: '#fff', color: '#6b6860', border: '1px solid #e4e2de', borderRadius: 7, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '12px 16px', fontSize: 14, marginBottom: 16 },
  emptyState: { textAlign: 'center', color: '#9e9b96', fontSize: 14, padding: '48px 0' },
  tableCard: { background: '#fff', border: '1px solid #e4e2de', borderRadius: 12, overflow: 'hidden' },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f7f7f5' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9e9b96', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  tr: { borderTop: '1px solid #f0efec' },
  td: { padding: '11px 16px', fontSize: 14, color: '#1a1916', verticalAlign: 'middle' },
  inlineInput: { border: '1px solid #d97706', borderRadius: 5, padding: '4px 8px', fontSize: 13, background: '#fff', width: '100%', outline: 'none' },
  deptBadge: { background: '#f0efec', color: '#6b6860', borderRadius: 5, padding: '2px 8px', fontSize: 12, fontWeight: 500 },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  skill: { background: '#f7f7f5', border: '1px solid #e4e2de', color: '#6b6860', borderRadius: 4, padding: '1px 7px', fontSize: 11, fontWeight: 500 },
  actionBtn: { background: 'none', border: 'none', color: '#6b6860', fontSize: 13, fontWeight: 500, cursor: 'pointer', marginLeft: 8, padding: '3px 0' },
  btnSave: { background: '#16a34a', color: '#fff', border: 'none', borderRadius: 5, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginRight: 6 },
  btnCancel: { background: 'none', border: '1px solid #e4e2de', color: '#6b6860', borderRadius: 5, padding: '4px 10px', fontSize: 12, fontWeight: 500, cursor: 'pointer' },
};

export default EmployeeList;
