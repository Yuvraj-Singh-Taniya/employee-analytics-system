import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees } from '../services/api';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEmployees()
      .then((res) => setEmployees(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const avgScore =
    employees.length > 0
      ? (employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length).toFixed(1)
      : 0;

  const topPerformers = employees.filter((e) => e.performanceScore >= 80).length;
  const needsImprovement = employees.filter((e) => e.performanceScore < 60).length;

  if (loading) return <p style={{ padding: '20px' }}>Loading...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Dashboard</h2>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '15px', minWidth: '150px' }}>
          <strong>Total Employees</strong>
          <p style={{ fontSize: '24px', margin: '5px 0' }}>{employees.length}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', minWidth: '150px' }}>
          <strong>Avg Performance</strong>
          <p style={{ fontSize: '24px', margin: '5px 0' }}>{avgScore}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', minWidth: '150px' }}>
          <strong>Top Performers (≥80)</strong>
          <p style={{ fontSize: '24px', margin: '5px 0' }}>{topPerformers}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '15px', minWidth: '150px' }}>
          <strong>Needs Improvement (&lt;60)</strong>
          <p style={{ fontSize: '24px', margin: '5px 0' }}>{needsImprovement}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <Link to="/add-employee"><button style={{ padding: '8px 15px' }}>Add Employee</button></Link>
        <Link to="/employees"><button style={{ padding: '8px 15px' }}>View All Employees</button></Link>
        <Link to="/ai-recommend"><button style={{ padding: '8px 15px' }}>AI Recommendations</button></Link>
      </div>

      <h3>Employee Rankings (by Performance Score)</h3>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f0f0f0' }}>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Department</th>
            <th>Score</th>
            <th>Experience (yrs)</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {[...employees]
            .sort((a, b) => b.performanceScore - a.performanceScore)
            .map((emp, index) => (
              <tr key={emp._id}>
                <td>{index + 1}</td>
                <td>{emp.name}</td>
                <td>{emp.department}</td>
                <td>{emp.performanceScore}</td>
                <td>{emp.experience}</td>
                <td>{emp.skills.join(', ')}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
