import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import './VoyageForm.css';

function AdminVoyageForm() {
  const navigate = useNavigate();
  const { id } = useParams();
const isEdit = !!id;

  const [formData, setFormData] = useState({
    destination: '',
    description: '',
    departure_date: '',
    return_date: '',
    price: '',
    max_participants: '',
    image: '',
    included: ['']
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIncludedChange = (index, value) => {
    const updated = [...formData.included];
    updated[index] = value;
    setFormData({ ...formData, included: updated });
  };

  const addIncluded = () => {
    setFormData({ ...formData, included: [...formData.included, ''] });
  };

  const removeIncluded = (index) => {
    const updated = formData.included.filter((_, i) => i !== index);
    setFormData({ ...formData, included: updated });
  };
  useEffect(() => {
  if (isEdit) {
    fetchVoyage();
  }
}, [id]);

const fetchVoyage = async () => {
  try {
    const res = await api.get(`/voyages-organises/${id}`);
    const v = res.data;

    setFormData({
      destination: v.destination || '',
      description: '',
      departure_date: v.date || '',
      return_date: '',
      price: v.prix?.replace('€', '') || '',
      max_participants: v.personnes?.replace(' personnes', '') || '',
      image: v.image || '',
      included: ['']
    });

  } catch (err) {
    console.error(err);
  }
};
 const handleSubmit = async (e) => {
  e.preventDefault();

  const dataToSend = {
    destination: formData.destination,
    title: formData.destination,
    duree: formData.departure_date + ' - ' + formData.return_date,
    date: formData.departure_date,
    personnes: formData.max_participants + ' personnes',
    prix: formData.price + '€',
    image: formData.image || null
  };

  console.log("DATA TO SEND:", dataToSend);

  try {
    if (isEdit) {
  await api.put(`/voyages-organises/${id}`, dataToSend, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
} else {
  await api.post('/voyages-organises', dataToSend, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
}

    alert('Voyage ajouté avec succès');
    navigate('/admin');
  } catch (err) {
    console.log("FULL ERROR:", err);
    console.log("RESPONSE:", err.response);
    console.log("DATA:", err.response?.data);
    alert(err.message);
  }
};

  return (
    <div className="voyage-form-container">
      <div className="voyage-form-card">
        <h2>Add New Trip</h2>

        <form onSubmit={handleSubmit} className="voyage-form">

          <input
            name="destination"
             value={formData.destination}
            placeholder="Destination"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
             value={formData.description}
            placeholder="Description"
            onChange={handleChange}
          />

          <div className="form-row">
            <input
              type="date"
               value={formData.departure_date}
              name="departure_date"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="return_date"
               value={formData.return_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="Price"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="max_participants"
               value={formData.max_participants}
              placeholder="Max participants"
              onChange={handleChange}
              required
            />
          </div>

          <input
            name="image"
            placeholder="Image URL"
             value={formData.image}
            onChange={handleChange}
          />

          <h4>What's Included</h4>

          {formData.included.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px' }}>
              <input
                value={item}
                onChange={(e) => handleIncludedChange(index, e.target.value)}
                placeholder="e.g. Flights, Hotel..."
              />
              <button type="button" onClick={() => removeIncluded(index)}>
                ❌
              </button>
            </div>
          ))}

          <button type="button" onClick={addIncluded}>
            + Add Item
          </button>

          <br /><br />

         <button type="submit" className="btn-primary">
  {isEdit ? 'Update Trip' : 'Create Trip'}
</button>
          <button type="button" onClick={() => navigate('/admin')}>
            Cancel
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminVoyageForm;