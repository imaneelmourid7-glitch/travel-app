import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './TripDetails.css';

const CATEGORIES = ['transport', 'hébergement', 'nourriture', 'activités', 'autre'];
const CAT_ICONS = { transport: '✈️', hébergement: '🏨', nourriture: '🍽️', activités: '🎭', autre: '💼' };
const CAT_COLORS = { transport: '#4A90E2', hébergement: '#9B59B6', nourriture: '#E67E22', activités: '#27AE60', autre: '#95A5A6' };
const RESA_ICONS = { vol: '✈️', train: '🚂', bus: '🚌', hébergement: '🏨', autre: '📋' };

const RECOMMENDATIONS = {
  'paris': ['Musée du Louvre', 'Tour Eiffel', 'Balade sur la Seine', 'Montmartre'],
  'tanger': ['Grottes d\'Hercule', 'Cap Spartel', 'Médina de Tanger', 'Café Hafa'],
  'marrakech': ['Jardin Majorelle', 'Place Jemaa el-Fna', 'Palais de la Bahia'],
  'default': ['Visiter le centre-ville', 'Goûter la cuisine locale', 'Faire un tour guidé']
};

function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voyage, setVoyage] = useState(null);
  const [activities, setActivities] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('itineraire');

  // Modals
  const [showActModal, setShowActModal] = useState(false);
  const [showDepModal, setShowDepModal] = useState(false);
  const [showResaModal, setShowResaModal] = useState(false);

  const [newActivity, setNewActivity] = useState({ titre: '', description: '', date: '', heure: '', lieu: '' });
  const [newDepense, setNewDepense] = useState({ titre: '', montant: '', categorie: 'transport', date: '', note: '' });
  const [newResa, setNewResa] = useState({ type: 'vol', titre: '', date: '', prix: '', reference: '', adresse: '', note: '' });

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      const [vRes, aRes, dRes, rRes] = await Promise.all([
        api.get(`/voyages/${id}`),
        api.get(`/voyages/${id}/activities`),
        api.get(`/voyages/${id}/depenses`),
        api.get(`/voyages/${id}/reservations`),
      ]);
      setVoyage(vRes.data);
      setActivities(aRes.data);
      setDepenses(dRes.data);
      setReservations(rRes.data);
    } catch (err) {
      navigate('/dashboard');
    } finally { setLoading(false); }
  };

  const handlePrint = () => {
    window.print();
  };

  const submitActivity = async (e) => {
    e.preventDefault();
    await api.post(`/voyages/${id}/activities`, newActivity);
    setShowActModal(false);
    setNewActivity({ titre: '', description: '', date: '', heure: '', lieu: '' });
    fetchAll();
  };

  const submitDepense = async (e) => {
    e.preventDefault();
    await api.post(`/voyages/${id}/depenses`, newDepense);
    setShowDepModal(false);
    setNewDepense({ titre: '', montant: '', categorie: 'transport', date: '', note: '' });
    fetchAll();
  };

  const submitResa = async (e) => {
    e.preventDefault();
    await api.post(`/voyages/${id}/reservations`, newResa);
    setShowResaModal(false);
    setNewResa({ type: 'vol', titre: '', date: '', prix: '', reference: '', adresse: '', note: '' });
    fetchAll();
  };

  const deleteItem = async (endpoint, itemId) => {
    if (!window.confirm('Supprimer cet élément ?')) return;
    await api.delete(`/${endpoint}/${itemId}`);
    fetchAll();
  };

  // Budget computations
  const totalDepenses = depenses.reduce((s, d) => s + parseFloat(d.montant), 0);
  const budgetRestant = voyage ? parseFloat(voyage.budget_total) - totalDepenses : 0;
  const byCategorie = CATEGORIES.map(cat => ({
    cat,
    total: depenses.filter(d => d.categorie === cat).reduce((s, d) => s + parseFloat(d.montant), 0),
  }));

  if (loading) return <div className="loading-state">Chargement...</div>;
  if (!voyage) return null;

  return (
    <div className="trip-details-page">
      <header className="trip-header no-print">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Mes Voyages</button>
            <h1>📍 {voyage.destination}</h1>
            <p className="trip-dates">Du {voyage.date_depart} au {voyage.date_retour}</p>
            <p className="trip-meta">{voyage.nb_voyageurs} voyageur(s) | Budget: {parseFloat(voyage.budget_total).toLocaleString('fr-FR')} €</p>
          </div>
          <button className="btn-secondary" onClick={handlePrint} style={{background: 'rgba(255,255,255,0.2)', color: 'white'}}>
            🖨️ Exporter PDF
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === 'itineraire' ? 'tab active' : 'tab'} onClick={() => setActiveTab('itineraire')}>🗓️ Itinéraire</button>
        <button className={activeTab === 'budget' ? 'tab active' : 'tab'} onClick={() => setActiveTab('budget')}>💰 Budget</button>
        <button className={activeTab === 'reservations' ? 'tab active' : 'tab'} onClick={() => setActiveTab('reservations')}>📋 Réservations</button>
        <button className={activeTab === 'infos' ? 'tab active' : 'tab'} onClick={() => setActiveTab('infos')}>🌤️ Infos & Météo</button>
      </div>

      {/* BUDGET WARNING NOTIFICATION */}
      {budgetRestant < 0 && (
        <div className="notification warning pulse" style={{marginBottom: '20px'}}>
          ⚠️ <strong>Alerte Budget :</strong> Vous avez dépassé votre budget prévisionnel de {Math.abs(budgetRestant).toLocaleString('fr-FR')} € !
        </div>
      )}

      {/* INFOS & METEO TAB */}
      {activeTab === 'infos' && (
        <div className="tab-content">
          <div className="infos-grid">
            <div className="weather-card">
              <h3>🌤️ Météo à {voyage.destination}</h3>
              <div className="weather-main">
                <span className="weather-temp">24°C</span>
                <span className="weather-desc">Ensoleillé</span>
              </div>
              <p>Prévisions pour votre séjour : Excellentes conditions pour les visites extérieures.</p>
            </div>
            
            <div className="recommendations-box">
              <h3>💡 Recommandations</h3>
              <ul className="reco-list">
                {(RECOMMENDATIONS[voyage.destination.toLowerCase()] || RECOMMENDATIONS['default']).map((item, idx) => (
                  <li key={idx}>✨ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ITINERARY TAB */}
      {activeTab === 'itineraire' && (
        <div className="tab-content">
          <div className="itinerary-header">
            <h2>Votre Itinéraire</h2>
            <button className="add-activity-btn" onClick={() => setShowActModal(true)}>+ Ajouter une étape</button>
          </div>
          {activities.length === 0 ? (
            <div className="empty-itinerary"><p>Aucune activité planifiée. Commencez à organiser votre séjour !</p></div>
          ) : (
            <div className="timeline">
              {activities.map(act => (
                <div key={act.id} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="act-time">
                      <span className="act-date">{act.date}</span>
                      {act.heure && <span className="act-hour">à {act.heure}</span>}
                    </div>
                    <h3 className="act-title">{act.titre}</h3>
                    {act.lieu && <p className="act-location">📌 {act.lieu}</p>}
                    {act.description && <p className="act-desc">{act.description}</p>}
                    <button className="delete-act" onClick={() => deleteItem('activities', act.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BUDGET TAB */}
      {activeTab === 'budget' && (
        <div className="tab-content">
          <div className="itinerary-header">
            <h2>Gestion du Budget</h2>
            <button className="add-activity-btn" onClick={() => setShowDepModal(true)}>+ Ajouter dépense</button>
          </div>

          <div className="budget-summary-cards">
            <div className="budget-card total">
              <div className="bc-label">Budget Total</div>
              <div className="bc-value">{parseFloat(voyage.budget_total).toLocaleString('fr-FR')} €</div>
            </div>
            <div className="budget-card spent">
              <div className="bc-label">Dépensé</div>
              <div className="bc-value">{totalDepenses.toLocaleString('fr-FR')} €</div>
            </div>
            <div className={`budget-card ${budgetRestant < 0 ? 'over' : 'remaining'}`}>
              <div className="bc-label">{budgetRestant < 0 ? '⚠️ Dépassement' : 'Restant'}</div>
              <div className="bc-value">{Math.abs(budgetRestant).toLocaleString('fr-FR')} €</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="budget-progress-wrap">
            <div className="budget-progress-bar">
              <div
                className="budget-progress-fill"
                style={{ width: `${Math.min((totalDepenses / parseFloat(voyage.budget_total)) * 100, 100)}%`, background: budgetRestant < 0 ? '#e74c3c' : '#27ae60' }}
              ></div>
            </div>
            <span>{voyage.budget_total > 0 ? Math.round((totalDepenses / parseFloat(voyage.budget_total)) * 100) : 0}% utilisé</span>
          </div>

          {/* Category breakdown */}
          <div className="cat-breakdown">
            {byCategorie.filter(c => c.total > 0).map(c => (
              <div key={c.cat} className="cat-bar-row">
                <span className="cat-label">{CAT_ICONS[c.cat]} {c.cat}</span>
                <div className="cat-bar-bg">
                  <div className="cat-bar-fill" style={{ width: totalDepenses > 0 ? `${(c.total / totalDepenses) * 100}%` : '0%', background: CAT_COLORS[c.cat] }}></div>
                </div>
                <span className="cat-amount">{c.total.toLocaleString('fr-FR')} €</span>
              </div>
            ))}
          </div>

          {/* Expenses list */}
          <div className="depenses-list">
            {depenses.length === 0 ? <p style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>Aucune dépense enregistrée.</p> : depenses.map(d => (
              <div key={d.id} className="depense-item">
                <span className="dep-icon">{CAT_ICONS[d.categorie]}</span>
                <div className="dep-info">
                  <strong>{d.titre}</strong>
                  <span>{d.date} · {d.categorie}</span>
                </div>
                <span className="dep-amount">{parseFloat(d.montant).toLocaleString('fr-FR')} €</span>
                <button className="delete-act" onClick={() => deleteItem('depenses', d.id)}>✕</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESERVATIONS TAB */}
      {activeTab === 'reservations' && (
        <div className="tab-content">
          <div className="itinerary-header">
            <h2>Mes Réservations</h2>
            <button className="add-activity-btn" onClick={() => setShowResaModal(true)}>+ Ajouter réservation</button>
          </div>
          {reservations.length === 0 ? (
            <div className="empty-itinerary"><p>Aucune réservation pour ce voyage. Ajoutez vols, hôtels, trains...</p></div>
          ) : (
            <div className="resa-list">
              {reservations.map(r => (
                <div key={r.id} className="resa-card">
                  <div className="resa-icon">{RESA_ICONS[r.type]}</div>
                  <div className="resa-info">
                    <h3>{r.titre}</h3>
                    <span>📅 {r.date}</span>
                    {r.reference && <span>🔖 Réf: {r.reference}</span>}
                    {r.adresse && <span>📍 {r.adresse}</span>}
                    {r.note && <p>{r.note}</p>}
                  </div>
                  <div className="resa-price">{parseFloat(r.prix).toLocaleString('fr-FR')} €</div>
                  <button className="delete-act" onClick={() => deleteItem('reservations', r.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ACTIVITY MODAL */}
      {showActModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>➕ Nouvelle étape</h3>
            <form onSubmit={submitActivity}>
              <input type="text" placeholder="Titre*" value={newActivity.titre} onChange={e => setNewActivity({...newActivity, titre: e.target.value})} required />
              <div className="row">
                <input type="date" value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} required />
                <input type="time" value={newActivity.heure} onChange={e => setNewActivity({...newActivity, heure: e.target.value})} />
              </div>
              <input type="text" placeholder="Lieu" value={newActivity.lieu} onChange={e => setNewActivity({...newActivity, lieu: e.target.value})} />
              <textarea placeholder="Description..." value={newActivity.description} onChange={e => setNewActivity({...newActivity, description: e.target.value})} />
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowActModal(false)}>Annuler</button>
                <button type="submit" className="save-btn">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPENSE MODAL */}
      {showDepModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>💰 Nouvelle dépense</h3>
            <form onSubmit={submitDepense}>
              <input type="text" placeholder="Titre*" value={newDepense.titre} onChange={e => setNewDepense({...newDepense, titre: e.target.value})} required />
              <div className="row">
                <input type="number" placeholder="Montant (€)*" value={newDepense.montant} onChange={e => setNewDepense({...newDepense, montant: e.target.value})} required min="0" step="0.01" />
                <input type="date" value={newDepense.date} onChange={e => setNewDepense({...newDepense, date: e.target.value})} required />
              </div>
              <select value={newDepense.categorie} onChange={e => setNewDepense({...newDepense, categorie: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>)}
              </select>
              <textarea placeholder="Note optionnelle..." value={newDepense.note} onChange={e => setNewDepense({...newDepense, note: e.target.value})} />
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowDepModal(false)}>Annuler</button>
                <button type="submit" className="save-btn">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESERVATION MODAL */}
      {showResaModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>📋 Nouvelle réservation</h3>
            <form onSubmit={submitResa}>
              <div className="row">
                <select value={newResa.type} onChange={e => setNewResa({...newResa, type: e.target.value})}>
                  {['vol','train','bus','hébergement','autre'].map(t => <option key={t} value={t}>{RESA_ICONS[t]} {t}</option>)}
                </select>
                <input type="date" value={newResa.date} onChange={e => setNewResa({...newResa, date: e.target.value})} required />
              </div>
              <input type="text" placeholder="Titre*" value={newResa.titre} onChange={e => setNewResa({...newResa, titre: e.target.value})} required />
              <div className="row">
                <input type="number" placeholder="Prix (€)" value={newResa.prix} onChange={e => setNewResa({...newResa, prix: e.target.value})} min="0" step="0.01" />
                <input type="text" placeholder="Référence (ex: AB1234)" value={newResa.reference} onChange={e => setNewResa({...newResa, reference: e.target.value})} />
              </div>
              <input type="text" placeholder="Adresse / Aéroport" value={newResa.adresse} onChange={e => setNewResa({...newResa, adresse: e.target.value})} />
              <textarea placeholder="Notes..." value={newResa.note} onChange={e => setNewResa({...newResa, note: e.target.value})} />
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowResaModal(false)}>Annuler</button>
                <button type="submit" className="save-btn">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetails;
