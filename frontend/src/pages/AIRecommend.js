import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAIRecommendation, getEmployees } from '../services/api';

const AIRecommend = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [mode, setMode] = useState('single');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    getEmployees().then(res => setEmployees(res.data));
    const params = new URLSearchParams(location.search);
    const empId = params.get('employeeId');
    if (empId) { setSelectedId(empId); setMode('single'); }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setResult(''); setLoading(true);
    try {
      const payload = mode === 'single' ? { employeeId: selectedId } : {};
      const res = await getAIRecommendation(payload);
      setResult(res.data.recommendation);
    } catch (err) {
      setError(err.response?.data?.message || 'AI request failed');
    } finally { setLoading(false); }
  };

  const selected = employees.find(e => e._id === selectedId);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.pageTitle}>AI Recommendations</h1>
        <p style={s.pageSub}>Get intelligent insights and suggestions powered by AI</p>
      </div>

      <div style={s.layout}>
        <div style={s.panel}>
          <h2 style={s.panelTitle}>Configure</h2>
          <form onSubmit={handleSubmit}>
            <div style={s.modeGroup}>
              {[{ v: 'single', label: 'Single Employee', desc: 'Detailed analysis for one person' }, { v: 'all', label: 'All Employees', desc: 'Team-wide ranking & insights' }].map(opt => (
                <label key={opt.v} style={{ ...s.modeOption, ...(mode === opt.v ? s.modeActive : {}) }}>
                  <input type="radio" value={opt.v} checked={mode === opt.v} onChange={() => setMode(opt.v)} style={{ display: 'none' }} />
                  <span style={s.modeRadio}>{mode === opt.v ? '●' : '○'}</span>
                  <span>
                    <span style={s.modeLabel}>{opt.label}</span>
                    <span style={s.modeDesc}>{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>

            {mode === 'single' && (
              <div style={s.field}>
                <label style={s.label}>Select Employee</label>
                <select style={s.select} value={selectedId} onChange={e => setSelectedId(e.target.value)} required>
                  <option value="">— Choose a team member —</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name} · {emp.department} (Score: {emp.performanceScore})
                    </option>
                  ))}
                </select>
                {selected && (
                  <div style={s.preview}>
                    <span style={s.previewName}>{selected.name}</span>
                    <span style={s.previewDept}>{selected.department}</span>
                    <span style={s.previewScore}>{selected.performanceScore} pts</span>
                  </div>
                )}
              </div>
            )}

            <button type="submit" disabled={loading || (mode === 'single' && !selectedId)} style={s.btn}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={s.spinner} />Generating analysis…
                </span>
              ) : '→ Get AI Recommendation'}
            </button>
          </form>
          {error && <div style={s.errorBox}>{error}</div>}
        </div>

        <div style={s.resultPanel}>
          {!result && !loading && (
            <div style={s.placeholder}>
              <p style={s.placeholderIcon}>✦</p>
              <p style={s.placeholderText}>AI analysis will appear here</p>
              <p style={s.placeholderSub}>Configure your query and click Get AI Recommendation</p>
            </div>
          )}
          {loading && (
            <div style={s.placeholder}>
              <p style={s.placeholderIcon}>⟳</p>
              <p style={s.placeholderText}>Generating insights…</p>
            </div>
          )}
          {result && (
            <>
              <div style={s.resultHeader}>
                <h2 style={s.resultTitle}>AI Analysis</h2>
                <span style={s.resultBadge}>✦ AI Generated</span>
              </div>
              <div style={s.resultBody}>
                <pre style={s.resultPre}>{result}</pre>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { maxWidth: 1200, margin: '0 auto', padding: '32px 28px' },
  header: { marginBottom: 28 },
  pageTitle: { fontSize: 22, fontWeight: 600, color: '#1a1916', marginBottom: 3 },
  pageSub: { fontSize: 14, color: '#6b6860' },
  layout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' },
  panel: { background: '#fff', border: '1px solid #e4e2de', borderRadius: 12, padding: 24 },
  panelTitle: { fontSize: 14, fontWeight: 600, color: '#1a1916', marginBottom: 18 },
  modeGroup: { display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 },
  modeOption: { display: 'flex', gap: 10, padding: '12px 14px', border: '1px solid #e4e2de', borderRadius: 8, cursor: 'pointer', alignItems: 'flex-start' },
  modeActive: { borderColor: '#2563eb', background: '#eff4ff' },
  modeRadio: { color: '#2563eb', fontFamily: 'monospace', fontSize: 14, flexShrink: 0, marginTop: 1 },
  modeLabel: { display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1916', marginBottom: 1 },
  modeDesc: { display: 'block', fontSize: 12, color: '#9e9b96' },
  field: { marginBottom: 20 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: '#1a1916', marginBottom: 6 },
  select: { width: '100%', border: '1px solid #e4e2de', borderRadius: 7, padding: '9px 12px', fontSize: 13, color: '#1a1916', background: '#fafaf9', outline: 'none', cursor: 'pointer' },
  preview: { marginTop: 10, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f7f7f5', borderRadius: 7 },
  previewName: { fontSize: 13, fontWeight: 600, color: '#1a1916' },
  previewDept: { fontSize: 12, background: '#f0efec', color: '#6b6860', borderRadius: 4, padding: '1px 7px' },
  previewScore: { fontSize: 12, color: '#9e9b96', marginLeft: 'auto' },
  btn: { width: '100%', background: '#1a1916', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginTop: 16 },
  resultPanel: { background: '#fff', border: '1px solid #e4e2de', borderRadius: 12, minHeight: 400, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  placeholder: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 },
  placeholderIcon: { fontSize: 28, marginBottom: 12, color: '#c9c7c2' },
  placeholderText: { fontSize: 15, fontWeight: 500, color: '#6b6860', marginBottom: 6 },
  placeholderSub: { fontSize: 13, color: '#9e9b96', textAlign: 'center', maxWidth: 280 },
  resultHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e4e2de' },
  resultTitle: { fontSize: 14, fontWeight: 600, color: '#1a1916' },
  resultBadge: { fontSize: 11, background: '#eff4ff', color: '#2563eb', borderRadius: 99, padding: '3px 10px', fontWeight: 600 },
  resultBody: { padding: '20px', flex: 1 },
  resultPre: { fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#1a1916', lineHeight: 1.75, whiteSpace: 'pre-wrap', margin: 0 },
};

export default AIRecommend;
