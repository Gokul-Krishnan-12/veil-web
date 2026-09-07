'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function AdminPortalPage() {
  const [token, setToken] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Active Tab: 'overview' | 'payments' | 'keys' | 'generate'
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard state
  const [stats, setStats] = useState({
    totalKeys: 0,
    activeKeys: 0,
    revokedKeys: 0,
    proKeys: 0,
    enterpriseKeys: 0,
    totalSeatsAllocated: 0,
    totalSeatsUsed: 0,
    totalRevenue: 0,
    proRevenue: 0,
    enterpriseRevenue: 0,
    avgOrderValue: 0
  });
  const [keys, setKeys] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dbStatus, setDbStatus] = useState('Checking...');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [copiedKey, setCopiedKey] = useState(null);

  // Key generator state
  const [genTier, setGenTier] = useState('pro');
  const [genEmail, setGenEmail] = useState('');
  const [genName, setGenName] = useState('');
  const [genSuccessKey, setGenSuccessKey] = useState(null);
  const [genErrorMsg, setGenErrorMsg] = useState('');

  // Check existing session
  useEffect(() => {
    const savedToken = localStorage.getItem('veil_admin_token');
    const savedUser = localStorage.getItem('veil_admin_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setAdminUser(JSON.parse(savedUser));
      } catch (e) {}
    }
    fetchHealth();
  }, []);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setDbStatus(data.database || 'Online');
    } catch (e) {
      setDbStatus('Local Mode');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid admin email or password');
      }

      setToken(data.token);
      setAdminUser(data.admin);
      localStorage.setItem('veil_admin_token', data.token);
      localStorage.setItem('veil_admin_user', JSON.stringify(data.admin));
    } catch (err) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('veil_admin_token');
    localStorage.removeItem('veil_admin_user');
  };

  const loadDashboardData = async () => {
    try {
      const [statsRes, keysRes, paymentsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/keys'),
        fetch('/api/admin/payments')
      ]);

      const statsData = await statsRes.json();
      const keysData = await keysRes.json();
      const paymentsData = await paymentsRes.json();

      if (statsData.success) setStats(statsData.stats);
      if (keysData.success) setKeys(keysData.keys);
      if (paymentsData.success) setPayments(paymentsData.payments);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    setGenSuccessKey(null);
    setGenErrorMsg('');

    if (!genEmail) {
      setGenErrorMsg('Customer email is required.');
      return;
    }

    try {
      const res = await fetch('/api/admin/generate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: genTier,
          customerEmail: genEmail,
          customerName: genName
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate key');
      }

      setGenSuccessKey(data);
      setGenEmail('');
      setGenName('');
      loadDashboardData();
    } catch (err) {
      setGenErrorMsg(err.message);
    }
  };

  const handleRevoke = async (oldKey, customerEmail) => {
    if (!confirm(`Revoke key ${oldKey}? A replacement key will be automatically reissued for ${customerEmail}.`)) return;

    try {
      const res = await fetch('/api/license/revoke-and-reissue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldKey, customerEmail })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || data.error || 'Failed to revoke key');
      } else {
        alert(`Success! Old key revoked. New replacement key: ${data.newKey}`);
        loadDashboardData();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtered keys
  const filteredKeys = useMemo(() => {
    return keys.filter((k) => {
      const matchQuery = !searchQuery || 
        k.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
        k.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTier = tierFilter === 'all' || k.tier === tierFilter;
      return matchQuery && matchTier;
    });
  }, [keys, searchQuery, tierFilter]);

  // Filtered payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      return !searchQuery ||
        p.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.txId.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [payments, searchQuery]);

  return (
    <div style={{ maxWidth: '1360px', margin: '30px auto 100px', padding: '0 24px' }}>
      {/* 1. Login View */}
      {!token ? (
        <section className="form-panel" style={{ maxWidth: '440px', margin: '70px auto', padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img src="/assets/icon48.png" alt="Veil" style={{ width: '48px', height: '48px', marginBottom: '14px' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff' }}>Veil Admin Portal</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
              Sign in with your master credentials to access licenses, payments, and seat analytics.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label className="input-label" htmlFor="admin-email">Admin Email</label>
              <input
                type="email"
                id="admin-email"
                className="input-field"
                placeholder="Enter admin email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label className="input-label" htmlFor="admin-password">Admin Password</label>
              <input
                type="password"
                id="admin-password"
                className="input-field"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '13px' }}>
              <span>🔐</span> {loading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>

            {loginError && (
              <div style={{ color: 'var(--accent-rose)', fontSize: '13px', textAlign: 'center', marginTop: '16px', padding: '10px', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                ⚠️ {loginError}
              </div>
            )}
          </form>
        </section>
      ) : (
        /* 2. Authenticated Dashboard */
        <section>
          {/* Top Dashboard App Bar */}
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '20px 28px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img src="/assets/icon48.png" alt="Veil" style={{ width: '38px', height: '38px', borderRadius: '10px' }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Veil Management Console</h1>
                  <span className="pill-badge emerald" style={{ fontSize: '11px' }}>
                    {dbStatus}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '2px' }}>
                  Supabase PostgreSQL Cloud Registry • Automated Browser Seat Enforcement
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={loadDashboardData} className="btn btn-secondary btn-sm" title="Refresh data from database">
                ↻ Sync
              </button>
              <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '6px 14px', borderRadius: '8px', fontSize: '12.5px', color: '#cbd5e1' }}>
                👤 {adminUser?.email}
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" style={{ color: '#fb7185' }}>
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--card-border)',
            paddingBottom: '12px',
            marginBottom: '28px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('overview')}
              className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
            >
              📊 Overview & KPIs
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`btn btn-sm ${activeTab === 'payments' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
            >
              💳 Payments & Revenue (${stats.totalRevenue.toLocaleString()})
            </button>
            <button
              onClick={() => setActiveTab('keys')}
              className={`btn btn-sm ${activeTab === 'keys' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
            >
              🔑 License Keys ({keys.length})
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`btn btn-sm ${activeTab === 'generate' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '8px' }}
            >
              ✨ Issue New License
            </button>
          </div>

          {/* TAB 1: OVERVIEW & KPIS */}
          {activeTab === 'overview' && (
            <div>
              {/* Stats KPI Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                {/* Gross Revenue */}
                <div className="stat-box" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(255, 255, 255, 0.02))' }}>
                  <div className="stat-label">Total Gross Revenue</div>
                  <div className="stat-number" style={{ color: '#34d399' }}>
                    ${stats.totalRevenue.toLocaleString()}
                  </div>
                  <div className="stat-meta" style={{ color: 'var(--text-muted)' }}>
                    ${stats.proRevenue} Pro • ${stats.enterpriseRevenue} Enterprise
                  </div>
                </div>

                {/* Active Licenses */}
                <div className="stat-box">
                  <div className="stat-label">Active Licenses</div>
                  <div className="stat-number">{stats.activeKeys}</div>
                  <div className="stat-meta" style={{ color: 'var(--accent-cyan)' }}>
                    {stats.proKeys} Solo ($29) • {stats.enterpriseKeys} Team ($199)
                  </div>
                </div>

                {/* Seat Consumption */}
                <div className="stat-box">
                  <div className="stat-label">Browser Seats Claimed</div>
                  <div className="stat-number">{stats.totalSeatsUsed} <span style={{ fontSize: '18px', color: 'var(--text-dim)', fontWeight: 500 }}>/ {stats.totalSeatsAllocated}</span></div>
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${stats.totalSeatsAllocated ? Math.min(100, Math.round((stats.totalSeatsUsed / stats.totalSeatsAllocated) * 100)) : 0}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #38bdf8)'
                      }} />
                    </div>
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="stat-box">
                  <div className="stat-label">Average Order Value</div>
                  <div className="stat-number">${stats.avgOrderValue}</div>
                  <div className="stat-meta" style={{ color: 'var(--accent-emerald)' }}>
                    100% Lifetime One-Time
                  </div>
                </div>
              </div>

              {/* Recent Transactions Strip */}
              <div className="data-table-card" style={{ marginBottom: '32px' }}>
                <div className="table-header-box">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Recent Payments & Mints</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '2px' }}>
                      Latest revenue events dispatched from checkout
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('payments')} className="btn btn-secondary btn-sm">
                    View All Payments &rarr;
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Tx Reference</th>
                        <th>Customer</th>
                        <th>Tier</th>
                        <th>Amount</th>
                        <th>License Key</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.slice(0, 5).map((p) => (
                        <tr key={p.txId}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#94a3b8' }}>{p.txId}</td>
                          <td>
                            <strong style={{ color: '#fff' }}>{p.customerEmail}</strong>
                          </td>
                          <td>
                            <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: p.tier === 'enterprise' ? '#38bdf8' : '#cbd5e1' }}>
                              {p.tier}
                            </span>
                          </td>
                          <td style={{ fontWeight: 800, color: p.isReplacement ? 'var(--text-dim)' : '#34d399', fontSize: '14px' }}>
                            {p.isReplacement ? (
                              <span>$0.00 <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.2)', padding: '2px 5px', borderRadius: '4px', color: '#a5b4fc' }}>FREE REISSUE</span></span>
                            ) : (
                              `$${p.amount}.00`
                            )}
                          </td>
                          <td>
                            <span className="key-code" style={{ fontSize: '12px' }}>{p.key}</span>
                          </td>
                          <td style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                            {new Date(p.createdAt).toLocaleDateString()}
                          </td>
                          <td>
                            <span className="status-badge active" style={{ fontSize: '10.5px', background: p.isReplacement ? 'rgba(99, 102, 241, 0.15)' : undefined, color: p.isReplacement ? '#a5b4fc' : undefined }}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENTS & REVENUE */}
          {activeTab === 'payments' && (
            <div>
              {/* Financial KPI Banner */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.08))',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '24px 32px',
                marginBottom: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Gross Processed Volume
                  </div>
                  <div style={{ fontSize: '38px', fontWeight: 800, color: '#ffffff', margin: '4px 0' }}>
                    ${stats.totalRevenue.toLocaleString()}.00 USD
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    Total collected across {payments.length} customer purchases in Supabase
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block' }}>Solo Pro ($29/ea)</span>
                    <strong style={{ fontSize: '20px', color: '#fff' }}>${stats.proRevenue}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{stats.proKeys} Orders</span>
                  </div>
                  <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '24px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-dim)', display: 'block' }}>Enterprise ($199/ea)</span>
                    <strong style={{ fontSize: '20px', color: '#38bdf8' }}>${stats.enterpriseRevenue}</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{stats.enterpriseKeys} Orders</span>
                  </div>
                </div>
              </div>

              {/* Payments Ledger Card */}
              <div className="data-table-card">
                <div className="table-header-box">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Payment Transactions Ledger</h3>
                    <p style={{ color: 'var(--text-dim)', fontSize: '12px', marginTop: '2px' }}>
                      Detailed receipt log for all license purchases
                    </p>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Search email, key, or Tx ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '8px',
                        padding: '7px 14px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        width: '260px'
                      }}
                    />
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Transaction ID</th>
                        <th>Customer Email</th>
                        <th>License Tier</th>
                        <th>Seats Paid</th>
                        <th>Amount Paid</th>
                        <th>Payment Method</th>
                        <th>Issued License Key</th>
                        <th>Date & Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayments.length === 0 ? (
                        <tr>
                          <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                            No transactions match your search.
                          </td>
                        </tr>
                      ) : (
                        filteredPayments.map((p) => (
                          <tr key={p.txId}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#818cf8', fontWeight: 600 }}>
                              {p.txId}
                            </td>
                            <td>
                              <strong style={{ color: '#fff' }}>{p.customerEmail}</strong>
                            </td>
                            <td>
                              <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: p.tier === 'enterprise' ? '#38bdf8' : '#cbd5e1' }}>
                                {p.tier}
                              </span>
                            </td>
                            <td style={{ fontSize: '13px' }}>
                              {p.maxSeats} Browser{p.maxSeats > 1 ? 's' : ''}
                            </td>
                            <td style={{ fontWeight: 800, color: p.isReplacement ? 'var(--text-dim)' : '#34d399', fontSize: '15px' }}>
                              {p.isReplacement ? (
                                <span>
                                  $0.00 <span style={{ fontSize: '10px', background: 'rgba(99, 102, 241, 0.2)', padding: '2px 5px', borderRadius: '4px', color: '#a5b4fc' }}>FREE REISSUE</span>
                                </span>
                              ) : (
                                `$${p.amount}.00`
                              )}
                            </td>
                            <td style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                              {p.isReplacement ? '🔄 Free Key Replacement ($0.00)' : `💳 ${p.paymentMethod}`}
                            </td>
                            <td>
                              <span className="key-code" style={{ fontSize: '12px', cursor: 'pointer' }} onClick={() => copyKey(p.key)} title="Click to copy key">
                                {p.key}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                              {new Date(p.createdAt).toLocaleString()}
                            </td>
                            <td>
                              <span className="status-badge active" style={{ fontSize: '11px', background: p.isReplacement ? 'rgba(99, 102, 241, 0.15)' : undefined, color: p.isReplacement ? '#a5b4fc' : undefined }}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LICENSE KEYS */}
          {activeTab === 'keys' && (
            <div>
              {/* Filter & Search Toolbar */}
              <div style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setTierFilter('all')}
                    className={`btn btn-sm ${tierFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    All Keys ({keys.length})
                  </button>
                  <button
                    onClick={() => setTierFilter('pro')}
                    className={`btn btn-sm ${tierFilter === 'pro' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Solo Pro ($29)
                  </button>
                  <button
                    onClick={() => setTierFilter('enterprise')}
                    className={`btn btn-sm ${tierFilter === 'enterprise' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Enterprise
                  </button>
                  <button
                    onClick={() => setTierFilter('trial')}
                    className={`btn btn-sm ${tierFilter === 'trial' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Free Trial
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Search by key or customer email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--card-border)',
                      borderRadius: '8px',
                      padding: '7px 16px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none',
                      width: '280px'
                    }}
                  />
                </div>
              </div>

              {/* Keys Registry Table */}
              <div className="data-table-card">
                <div className="table-header-box">
                  <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Active & Revoked License Keys</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
                    Showing {filteredKeys.length} of {keys.length} keys
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>License Key</th>
                        <th>Plan Tier</th>
                        <th>Customer Email</th>
                        <th>Active Browsers / Seats</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKeys.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                            No licenses found.
                          </td>
                        </tr>
                      ) : (
                        filteredKeys.map((k) => (
                          <tr key={k.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="key-code">{k.key}</span>
                                <button
                                  onClick={() => copyKey(k.key)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '2px 6px', fontSize: '11px' }}
                                  title="Copy key to clipboard"
                                >
                                  {copiedKey === k.key ? '✓ Copied' : '📋'}
                                </button>
                              </div>
                            </td>
                            <td>
                              <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700, color: k.tier === 'enterprise' ? 'var(--accent-cyan)' : (k.tier === 'trial' || k.tier === 'free_trial' ? '#38bdf8' : 'var(--text-main)') }}>
                                {k.tier === 'trial' || k.tier === 'free_trial' ? 'Free Trial ($0)' : `${k.tier} (${k.tier === 'enterprise' ? '$199' : '$29'})`}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-muted)' }}>{k.customer_email}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong>{k.seats_used || 0}</strong> / {k.max_seats || 1}
                                <div style={{ width: '60px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{
                                    width: `${Math.min(100, Math.round(((k.seats_used || 0) / (k.max_seats || 1)) * 100))}%`,
                                    height: '100%',
                                    background: (k.seats_used || 0) >= (k.max_seats || 1) ? '#f43f5e' : '#10b981'
                                  }} />
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge ${k.status}`}>
                                {k.status}
                              </span>
                            </td>
                            <td style={{ color: 'var(--text-dim)', fontSize: '12px' }}>
                              {new Date(k.created_at).toLocaleDateString()}
                            </td>
                            <td>
                              {k.status === 'active' ? (
                                <button
                                  onClick={() => handleRevoke(k.key, k.customer_email)}
                                  className="btn btn-secondary btn-sm"
                                  style={{ fontSize: '11px', padding: '4px 10px' }}
                                >
                                  Revoke & Reissue
                                </button>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                                  Replaced: {k.replaced_by_key || 'N/A'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ISSUE LICENSE */}
          {activeTab === 'generate' && (
            <div className="form-panel" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Mint New Commercial License Key</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Generate a signed cryptographic key and register it in the Supabase cloud database on behalf of a customer.
                </p>
              </div>

              <form onSubmit={handleGenerateKey}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label className="input-label">Select License Tier</label>
                    <select
                      className="select-field"
                      value={genTier}
                      onChange={(e) => setGenTier(e.target.value)}
                      style={{ colorScheme: 'dark', backgroundColor: '#0f172a', color: '#f8fafc' }}
                    >
                      <option value="pro" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>Personal Lifetime (3 Browsers — $29.00)</option>
                      <option value="enterprise" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>Enterprise (30 Seats — $199.00)</option>
                      <option value="trial" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>Free Trial (1 Browser — $0.00 Free)</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Customer Email Address</label>
                    <input
                      type="email"
                      className="input-field"
                      placeholder="client@company.com"
                      value={genEmail}
                      onChange={(e) => setGenEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="input-label">Company / Purchaser Name (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Acme Financial Corp"
                    value={genName}
                    onChange={(e) => setGenName(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                  <span>✨</span> Generate & Save Key in Supabase
                </button>
              </form>

              {genSuccessKey && (
                <div style={{
                  marginTop: '28px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ✓ License Successfully Minted in Supabase!
                  </div>
                  <div style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#ffffff', margin: '12px 0' }}>
                    {genSuccessKey.key}
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>
                    Bound to <strong>{genSuccessKey.customerEmail}</strong> with {genSuccessKey.maxSeats} browser seat{genSuccessKey.maxSeats > 1 ? 's' : ''}.
                  </p>
                  <button onClick={() => copyKey(genSuccessKey.key)} className="btn btn-secondary btn-sm">
                    {copiedKey === genSuccessKey.key ? '✓ Copied to Clipboard!' : '📋 Copy License Key'}
                  </button>
                </div>
              )}

              {genErrorMsg && (
                <div style={{ marginTop: '16px', color: 'var(--accent-rose)', fontSize: '13px' }}>
                  ⚠️ {genErrorMsg}
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
