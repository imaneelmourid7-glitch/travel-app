import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../services/api';
import './Admin.css';
function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ users: 0, voyages: 0, depenses: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [voyagesOrganises, setVoyagesOrganises] = useState([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [usersRes, statsRes, voyagesRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/stats'),
        api.get('/voyages-organises'),
      ]);

      setUsers(usersRes.data);
      setStats(statsRes.data);
      setVoyagesOrganises(voyagesRes.data);

    } catch (err) {
      if (err.response?.status === 403) {
        alert('Accès refusé - Réservé aux administrateurs');
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteVoyage = async (id) => {
    if (!window.confirm('Supprimer ce voyage ?')) return;

    try {
      await api.delete(`/voyages-organises/${id}`);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Supprimer cet utilisateur et tous ses données ?')) return;
    await api.delete(`/admin/users/${userId}`);
    fetchAdminData();
  };

  if (loading) return <div className="admin-loading">Chargement...</div>;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">⚙️ Admin Panel</div>
        <nav className="admin-nav">
          <button className={activeTab === 'dashboard' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('dashboard')}>
            📊 Tableau de bord
          </button>
          <button className={activeTab === 'users' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('users')}>
            👥 Utilisateurs
          </button>
          <button
  className={activeTab === 'voyages' ? 'nav-item active' : 'nav-item'}
  onClick={() => setActiveTab('voyages')}
>
  ✈️ Voyages organisés
</button>
        </nav>
        <button className="nav-item back-nav" onClick={() => navigate('/dashboard')}>
          ← Retour App
        </button>
        
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
         <h1>
  {activeTab === 'dashboard'
    ? '📊 Vue d\'ensemble'
    : activeTab === 'users'
    ? '👥 Gestion des Utilisateurs'
    : '✈️ Gestion des Voyages'}
</h1>
        </header>

        {/* Stats Tab */}
        {activeTab === 'dashboard' && (
          <div className="admin-content">
            <div className="admin-stats-grid">
              <div className="admin-stat-card blue">
                <div className="admin-stat-icon">👥</div>
                <div className="admin-stat-value">{stats.users}</div>
                <div className="admin-stat-label">Utilisateurs inscrits</div>
              </div>
              <div className="admin-stat-card green">
                <div className="admin-stat-icon">✈️</div>
                <div className="admin-stat-value">{stats.voyages}</div>
                <div className="admin-stat-label">Voyages créés</div>
              </div>
              <div className="admin-stat-card orange">
                <div className="admin-stat-icon">💰</div>
                <div className="admin-stat-value">{parseFloat(stats.total_depenses || 0).toLocaleString('fr-FR')} €</div>
                <div className="admin-stat-label">Dépenses enregistrées</div>
              </div>
            </div>

            <div className="admin-recent">
              <h2>Derniers utilisateurs inscrits</h2>
              <table className="admin-table">
                <thead>
                  <tr><th>Nom</th><th>Email</th><th>Inscrit le</th><th>Voyages</th></tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                      <td><span className="badge">{u.voyages_count}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-content">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Inscrit le</th>
                  <th>Voyages</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
  {voyagesOrganises.map(v => (
    <tr key={v.id}>
      <td>{v.id}</td>
      <td>{v.destination}</td>
      <td>{v.title}</td>
      <td>{v.prix}</td>
      <td>
        <button>✏️ Modifier</button>
        <button className="btn-danger" onClick={() => deleteVoyage(v.id)}>
          🗑️ Supprimer
        </button>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>
        )}
        {activeTab === 'voyages' && (
  <div className="admin-content">
    <button className="btn-primary" onClick={() => navigate('/admin/voyages/nouveau')}>
  + Ajouter Voyage
</button>

    <table className="admin-table">
      <thead>
        <tr>
          <th>Destination</th>
      <th>Dates</th>
      <th>Durée</th>
      <th>Prix</th>
      <th>Capacity</th>
      <th>Status</th>
      <th>Actions</th>

        </tr>
      </thead>
      <tbody>
        {voyagesOrganises.map(v => (
          <tr key={v.id}>
             <td>{v.destination}</td>
        <td>{v.date}</td>
        <td>{v.duree}</td>
        <td>{v.prix}</td>
        <td>{v.personnes}</td>
        <td>
  <span
    className={
      new Date(v.date) > new Date()
        ? "status upcoming"
        : "status past"
    }
  >
    {new Date(v.date) > new Date() ? "Upcoming" : "Past"}
  </span>
</td>
            <td className="action-buttons">
          <button
  className="edit-btn"
  onClick={() => navigate(`/admin/voyages/modifier/${v.id}`)}
>
  ✏️
</button>
          <button
            className="delete-btn"
            onClick={() => deleteVoyage(v.id)}
          >
            🗑️
          </button>
        </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </main>
    </div>
  );
}

export default Admin;
