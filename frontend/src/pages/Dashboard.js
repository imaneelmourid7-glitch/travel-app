import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [voyages, setVoyages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessionAndData = async () => {
      try {
        const userResponse = await api.get('/user');
        setUser(userResponse.data);
        
        await fetchVoyages();
      } catch (err) {
        console.error('Session invalide ou expirée');
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchSessionAndData();
    }
  }, [navigate]);

  const fetchVoyages = async () => {
    try {
      const response = await api.get('/voyages');
      setVoyages(response.data);
    } catch (err) {
      console.error('Erreur chargement voyages', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-logo">
          ✈️ NomadPlan.
        </div>
        <div className="header-actions">
          {user?.is_admin ? (
            <button onClick={() => navigate('/admin')} className="btn-secondary" style={{marginRight: '10px'}}>
              ⚙️ Admin Panel
            </button>
          ) : null}
          <span className="user-greeting">Bonjour, {user?.name || 'Voyageur'}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Déconnexion
          </button>
        </div>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-greeting">
          <h1>Votre Espace Voyage</h1>
          <p>Planifiez, organisez et suivez toutes vos aventures au même endroit.</p>
        </div>

        {voyages.some(v => new Date(v.date_depart) > new Date()) && (
          <div className="notification" style={{background: '#e3f2fd', borderColor: '#4A90E2', color: '#1565c0', marginBottom: '30px'}}>
            ✨ <strong>Prochain Départ :</strong> Votre voyage à <strong>{voyages.find(v => new Date(v.date_depart) > new Date())?.destination}</strong> approche ! Préparez vos valises.
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Voyages Prévus</div>
            <div className="stat-value">{voyages.length}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-title">Budget Total Prévu</div>
            <div className="stat-value">{voyages.reduce((sum, v) => sum + parseFloat(v.budget_total || 0), 0).toLocaleString('fr-FR')} €</div>
          </div>
          <div className="stat-card orange">
            <div className="stat-title">Destinations</div>
            <div className="stat-value">{new Set(voyages.map(v => v.destination)).size}</div>
          </div>
        </div>
        
        <div className="main-grid">
          <section className="voyages-section">
            <div className="section-header">
              <h2 className="section-title">Mes Voyages</h2>
              <div style={{ display: 'flex', gap: '12px' }}>
  <button className="btn-secondary" onClick={() => navigate('/voyages-organises')}>
    Voir les voyages organisés
  </button>

  <button className="btn-primary" onClick={() => navigate('/voyages/nouveau')}>
    + Nouveau Voyage
  </button>
</div>
            </div>
            
            <div className="voyages-list">
              {loading ? (
                <div style={{ padding: '20px', color: '#7F8C8D' }}>Chargement de vos voyages...</div>
              ) : voyages.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🌍</div>
                  <h3>Aucun voyage prévu</h3>
                  <p>Il est temps de commencer à planifier votre prochaine aventure.</p>
                  <button className="btn-primary" onClick={() => navigate('/voyages/nouveau')}>
                    Créer mon premier voyage
                  </button>
                </div>
              ) : (
                voyages.map(voyage => (
                  <div key={voyage.id} className="voyage-card">
                    <div className="voyage-info">
                      <h3>{voyage.destination}</h3>
                      <div className="voyage-details">
                        <span className="voyage-detail-item">
                          🗓️ Du {voyage.date_depart} au {voyage.date_retour}
                        </span>
                        <span className="voyage-detail-item">
                          👥 {voyage.nb_voyageurs} voyageur(s)
                        </span>
                      </div>
                    </div>
                    <div className="voyage-actions">
                      <span className="voyage-budget">💰 {parseFloat(voyage.budget_total).toLocaleString('fr-FR')} €</span>
                      <button className="btn-secondary" onClick={() => navigate(`/voyages/${voyage.id}`)}>
                        🗺️ Voir l'itinéraire
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <aside className="sidebar-section">
            <div className="recent-activity-box">
              <h2 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Recommandations</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-title">💡 Astuce Budget</div>
                  <div className="activity-time">Réservez vos vols le mardi pour bénéficier des meilleurs tarifs.</div>
                </div>
                <div className="activity-item">
                  <div className="activity-title">🗺️ Inspiration</div>
                  <div className="activity-time">Découvrez les 10 destinations les plus tendance pour l'été 2026.</div>
                </div>
                <div className="activity-item">
                  <div className="activity-title">🛡️ Sécurité</div>
                  <div className="activity-time">N'oubliez pas de vérifier les vaccins nécessaires pour votre prochaine destination.</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;