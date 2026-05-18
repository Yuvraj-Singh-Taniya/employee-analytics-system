import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees, deleteEmployee, searchEmployees, updateEmployee } from '../services/api';

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
      .then((res) => setEmployees(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    searchEmployees({ department: searchDept, name: searchName })
      .then((res) => setEmployees(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Search failed'))
      .finally(() => setLoading(false));
  };

  const handleReset = () => {
    setSearchDept('');
    setSearchName('');
    fetchAll();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await deleteEmployee(id);
      setEmployees(employees.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (emp) => {
    setEditId(emp._id);
    setEditForm({
      name: emp.name,
      department: emp.department,
      skills: emp.skills.join(', '),
      performanceScore: emp.performanceScore,
      experience: emp.experience,
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (id) => {
    try {
      const updated = await updateEmployee(id, {
        ...editForm,
        skills: editForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
        performanceScore: Number(editForm.performanceScore),
        experience: Number(editForm.experience),
      });
      setEmployees(employees.map((e) => (e._id === id ? updated.data : e)));
      setEditId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employees</h2>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          placeholder="Filter by department"
          value={searchDept}
          onChange={(e) => setSearchDept(e.target.value)}
          style={{ padding: '6px', width: '200px' }}
        />
        <input
          placeholder="Filter by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={{ padding: '6px', width: '200px' }}
        />
        <button type="submit" style={{ padding: '6px 14px' }}>Search</button>
        <button type="button" onClick={handleReset} style={{ padding: '6px 14px' }}>Reset</button>
        <Link to="/add-employee"><button type="button" style={{ padding: '6px 14px' }}>+ Add Employee</button></Link>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && employees.length === 0 && <p>No employees found.</p>}

      {!loading && employees.length > 0 && (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#f0f0f0' }}>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Skills</th>
              <th>Score</th>
              <th>Exp (yrs)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) =>
              editId === emp._id ? (
                <tr key={emp._id} style={{ background: '#fffbe6' }}>
                  <td><input name="name" value={editForm.name} onChange={handleEditChange} style={{ width: '100%' }} /></td>
                  <td>{emp.email}</td>
                  <td><input name="department" value={editForm.department} onChange={handleEditChange} style={{ width: '100%' }} /></td>
                  <td><input name="skills" value={editForm.skills} onChange={handleEditChange} style={{ width: '100%' }} /></td>
                  <td><input name="performanceScore" type="number" value={editForm.performanceScore} onChange={handleEditChange} style={{ width: '60px' }} /></td>
                  <td><input name="experience" type="number" value={editForm.experience} onChange={handleEditChange} style={{ width: '50px' }} /></td>
                  <td>
                    <button onClick={() => handleEditSave(emp._id)} style={{ marginRight: '5px' }}>Save</button>
                    <button onClick={() => setEditId(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.skills.join(', ')}</td>
                  <td>{emp.performanceScore}</td>
                  <td>{emp.experience}</td>
                  <td>
                    <button onClick={() => startEdit(emp)} style={{ marginRight: '5px' }}>Edit</button>
                    <button onClick={() => handleDelete(emp._id)} style={{ marginRight: '5px' }}>Delete</button>
                    <Link to={`/ai-recommend?employeeId=${emp._id}`}>
                      <button>AI</button>
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeeList;
