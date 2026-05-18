import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEmployees } from '../services/api';

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{ ...s.stat, ...(accent ? { borderColor: '#2563eb', background: '#eff4ff' } : {}) }}>
    <p style={s.statLabel}>{label}</p>
    <p style={{ ...s.statValue, ...(accent ? { color: '#2563eb' } : {}) }}>{value}</p>
    {sub && <p style={s.statSub}>{sub}</p>}
  </div>
);

const ScoreBadge = ({ score }) => {
  let bg = '#fef2f2', color = '#dc2626';
  if (score >= 80) { bg = '#f0fdf4'; color = '#16a34a'; }
  else if (score >= 60) { bg = '#fffbeb'; color = '#d97706'; }
  return <span style={{ background: bg, color, borderRadius: 5, padding: '2px 8px', fontSize: 12, fontWeight: 600 }}>{score}</span>;
};

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getEmployees()
      .then(res => setEmployees(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const avgScore = employees.length > 0
    ? (employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length).toFixed(1) : 0;
  const topPerformers = employees.filter(e => e.performanceScore >= 80).length;
  const needsImprovement = employees.filter(e => e.performanceScore < 60).length;
  const sorted = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);

  if (loading) return <div style={s.page}><div style={s.loader}>Loading…</div></div>;
  if (error) return <div style={s.page}><div style={s.errorBox}>{error}</div></div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.pageTitle}>Dashboard</h1>
          <p style={s.pageSub}>Performance overview for your team</p>
        </div>
        <div style={s.headerActions}>
          <Link to="/add-employee"><button style={s.btnPrimary}>+ Add Employee</button></Link>
          <Link to="/ai-recommend"><button style={s.btnOutline}>AI Recommendations</button></Link>
        </div>
      </div>

      <div style={s.statsRow}>
        <StatCard label="Total Employees" value={employees.length} sub="across all departments" />
        <StatCard label="Avg Performance" value={avgScore} sub="team average score" accent />
        <StatCard label="Top Performers" value={topPerformers} sub="score ≥ 80" />
        <StatCard label="Needs Improvement" value={needsImprovement} sub="score < 60" />
      </div>

      <div style={s.tableCard}>
        <div style={s.tableHeader}>
          <h2 style={s.tableTitle}>Employee Rankings</h2>
          <Link to="/employees" style={s.viewAll}>View all →</Link>
        </div>
        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr style={s.thead}>
                <th style={{ ...s.th, width: 48 }}>#</th>
                <th style={s.th}>Name</th>
                <th style={s.th}>Department</th>
                <th style={s.th}>Score</th>
                <th style={s.th}>Experience</th>
                <th style={s.th}>Skills</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((emp, i) => (
                <tr key={emp._id} style={s.tr}>
                  <td style={{ ...s.td, color: '#9e9b96', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{i + 1}</td>
                  <td style={{ ...s.td, fontWeight: 500 }}>{emp.name}</td>
                  <td style={s.td}><span style={s.deptBadge}>{emp.department}</span></td>
                  <td style={s.td}><ScoreBadge score={emp.performanceScore} /></td>
                  <td style={{ ...s.td, color: '#6b6860' }}>{emp.experience} yr{emp.experience !== 1 ? 's' : ''}</td>
                  <td style={s.td}>
                    <div style={s.skillsWrap}>
                      {emp.skills.slice(0, 3).map(sk => <span key={sk} style={s.skill}>{sk}</span>)}
                      {emp.skills.length > 3 && <span style={{ ...s.skill, color: '#9e9b96' }}>+{emp.skills.length - 3}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 28px' },
  loader: { color: '#6b6860', fontSize: 14 },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '12px 16px', fontSize: 14 },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 },
  pageTitle: { fontSize: 22, fontWeight: 600, color: '#1a1916', marginBottom: 3 },
  pageSub: { fontSize: 14, color: '#6b6860' },
  headerActions: { display: 'flex', gap: 10 },
  btnPrimary: { background: '#1a1916', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnOutline: { background: '#fff', color: '#1a1916', border: '1px solid #e4e2de', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 },
  stat: { background: '#fff', border: '1px solid #e4e2de', borderRadius: 10, padding: '18px 20px' },
  statLabel: { fontSize: 12, color: '#9e9b96', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: 600, color: '#1a1916', lineHeight: 1.1, marginBottom: 4 },
  statSub: { fontSize: 12, color: '#9e9b96' },
  tableCard: { background: '#fff', border: '1px solid #e4e2de', borderRadius: 12, overflow: 'hidden' },
  tableHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #e4e2de' },
  tableTitle: { fontSize: 15, fontWeight: 600, color: '#1a1916' },
  viewAll: { fontSize: 13, color: '#2563eb', fontWeight: 500 },
  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#f7f7f5' },
  th: { padding: '10px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#9e9b96', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' },
  tr: { borderTop: '1px solid #f0efec' },
  td: { padding: '12px 16px', fontSize: 14, color: '#1a1916', verticalAlign: 'middle' },
  deptBadge: { background: '#f0efec', color: '#6b6860', borderRadius: 5, padding: '2px 8px', fontSize: 12, fontWeight: 500 },
  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: 4 },
  skill: { background: '#f7f7f5', border: '1px solid #e4e2de', color: '#6b6860', borderRadius: 4, padding: '1px 7px', fontSize: 11, fontWeight: 500 },
};

export default Dashboard;
