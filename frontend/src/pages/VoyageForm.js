import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './VoyageForm.css';

function VoyageForm() {
  const [formData, setFormData] = useState({
    destination: '',
    description: '',
    date_depart: '',
    date_retour: '',
    nb_voyageurs: 1,
    budget_total: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/voyages', formData);
      navigate('/dashboard'); // Retour au dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du voyage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voyage-form-container">
      <div className="voyage-form-card">
        <div className="form-header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>
            ← Retour
          </button>
          <h2>✈️ Créer un nouveau voyage</h2>
          <p>Renseignez les détails pour commencer à planifier.</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="voyage-form">
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Ex: Kyoto, Japon"
              required
            />
          </div>

          <div className="form-group">
            <label>Description (Optionnel)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Un petit mot sur ce voyage..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Date de départ</label>
              <input
                type="date"
                name="date_depart"
                value={formData.date_depart}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half">
              <label>Date de retour</label>
              <input
                type="date"
                name="date_retour"
                value={formData.date_retour}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Nombre de voyageurs</label>
              <input
                type="number"
                name="nb_voyageurs"
                value={formData.nb_voyageurs}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <div className="form-group half">
              <label>Budget total prévisionnel (€)</label>
              <input
                type="number"
                name="budget_total"
                value={formData.budget_total}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary form-submit" disabled={loading}>
            {loading ? 'Création en cours...' : '🌍 Enregistrer mon voyage'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VoyageForm;
