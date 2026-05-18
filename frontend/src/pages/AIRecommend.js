import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAIRecommendation, getEmployees } from '../services/api';

const AIRecommend = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState('single'); // 'single' or 'all'
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    getEmployees().then((res) => {
      setEmployees(res.data);
    });

    // Pre-select employee if coming from list page
    const params = new URLSearchParams(location.search);
    const empId = params.get('employeeId');
    if (empId) {
      setSelectedId(empId);
      setMode('single');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');
    setLoading(true);

    try {
      const payload = mode === 'single' ? { employeeId: selectedId } : {};
      const res = await getAIRecommendation(payload);
      setResult(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h2>AI Recommendations</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '12px' }}>
          <label>
            <input
              type="radio"
              value="single"
              checked={mode === 'single'}
              onChange={() => setMode('single')}
            />{' '}
            Single Employee
          </label>
          &nbsp;&nbsp;
          <label>
            <input
              type="radio"
              value="all"
              checked={mode === 'all'}
              onChange={() => setMode('all')}
            />{' '}
            All Employees (Ranking)
          </label>
        </div>

        {mode === 'single' && (
          <div style={{ marginBottom: '12px' }}>
            <label>Select Employee</label><br />
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              required
              style={{ padding: '7px', width: '300px' }}
            >
              <option value="">-- Select --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} — {emp.department} (Score: {emp.performanceScore})
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" disabled={loading || (mode === 'single' && !selectedId)} style={{ padding: '8px 20px' }}>
          {loading ? 'Generating...' : 'Get AI Recommendation'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ border: '1px solid #ccc', padding: '16px', background: '#fafafa' }}>
          <h3>AI Analysis Result</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: '1.6' }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AIRecommend;
