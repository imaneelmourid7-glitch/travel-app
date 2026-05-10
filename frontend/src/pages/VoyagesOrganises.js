import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './VoyagesOrganises.css';

function VoyagesOrganises() {
  const navigate = useNavigate();

const [voyages, setVoyages] = useState([]);
useEffect(() => {
  fetchVoyages();
}, []);

const fetchVoyages = async () => {
  try {
    const res = await api.get('/voyages-organises');
    setVoyages(res.data);
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="voyages-page">
      <h1>Voyages organisés</h1>
      <p>Decouvrez nos voyages soigneusement organises. Tous est inclus il ne vous reste plus qu'a profitez.</p>

      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        ← Retour
      </button>

      <div className="voyages-list">
        {voyages.map(v => (
          <div key={v.id} className="voyage-card">
            
            {/* IMAGE */}
            <div className="voyage-img">
              <img src={v.image} alt={v.title} />
            </div>

            {/* INFO */}
            <div className="voyage-content">
              <p className="destination">📍 {v.destination}</p>
              <h2>{v.title}</h2>

              <div className="details">
                <span>⏱ {v.duree}</span>
                <span>📅 {v.date}</span>
                <span>👥 {v.personnes}</span>
              </div>

              <div className="bottom">
                <div className="price">{v.prix}</div>
                <button className="reserve-btn">
                  Réserver
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default VoyagesOrganises;