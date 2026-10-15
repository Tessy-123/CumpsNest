// src/components/landlord/EditListingForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditListingForm() {
  const { id } = useParams(); // Gets the accommodation ID from the URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    university_nearby: '',
    rent_mwk: '',
    deposit_mwk: '',
    room_type: 'Single Room',
    facilities: [],
    availability_status: 'available'
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const facilityOptions = ['WiFi', 'Water Included', 'Electricity (Prepaid/ESCOM)', 'Security Guard', 'Furnished', 'Kitchen'];

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/accommodations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching listing details:', err);
      setError('Failed to load listing data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (facility) => {
    setFormData(prev => {
      const exists = prev.facilities.includes(facility);
      if (exists) {
        return { ...prev, facilities: prev.facilities.filter(f => f !== facility) };
      } else {
        return { ...prev, facilities: [...prev.facilities, facility] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/accommodations/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/landlord/dashboard');
    } catch (err) {
      console.error('Error updating listing:', err);
      setError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading listing data...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Accommodation Listing</h1>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
            <input 
              type="text" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area / Location</label>
              <input 
                type="text" 
                name="area" 
                required
                value={formData.area} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nearby University / College</label>
              <input 
                type="text" 
                name="university_nearby" 
                required
                value={formData.university_nearby} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (MWK)</label>
              <input 
                type="number" 
                name="rent_mwk" 
                required
                min="0"
                value={formData.rent_mwk} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (MWK)</label>
              <input 
                type="number" 
                name="deposit_mwk" 
                required
                min="0"
                value={formData.deposit_mwk} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select 
                name="room_type" 
                value={formData.room_type} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Single Room">Single Room</option>
                <option value="Self-Contained">Self-Contained</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Cottage">Cottage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
              <select 
                name="availability_status" 
                value={formData.availability_status} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable / Occupied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities & Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map(facility => (
                <label key={facility} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={Array.isArray(formData.facilities) && formData.facilities.includes(facility)}
                    onChange={() => handleCheckboxChange(facility)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              rows="4" 
              required
              value={formData.description} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={() => navigate('/landlord/dashboard')}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}// src/components/landlord/EditListingForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function EditListingForm() {
  const { id } = useParams(); // Gets the accommodation ID from the URL
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    university_nearby: '',
    rent_mwk: '',
    deposit_mwk: '',
    room_type: 'Single Room',
    facilities: [],
    availability_status: 'available'
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const facilityOptions = ['WiFi', 'Water Included', 'Electricity (Prepaid/ESCOM)', 'Security Guard', 'Furnished', 'Kitchen'];

  useEffect(() => {
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/accommodations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData(response.data);
    } catch (err) {
      console.error('Error fetching listing details:', err);
      setError('Failed to load listing data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (facility) => {
    setFormData(prev => {
      const exists = prev.facilities.includes(facility);
      if (exists) {
        return { ...prev, facilities: prev.facilities.filter(f => f !== facility) };
      } else {
        return { ...prev, facilities: [...prev.facilities, facility] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/accommodations/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      navigate('/landlord/dashboard');
    } catch (err) {
      console.error('Error updating listing:', err);
      setError(err.response?.data?.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading listing data...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Accommodation Listing</h1>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
            <input 
              type="text" 
              name="title" 
              required
              value={formData.title} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area / Location</label>
              <input 
                type="text" 
                name="area" 
                required
                value={formData.area} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nearby University / College</label>
              <input 
                type="text" 
                name="university_nearby" 
                required
                value={formData.university_nearby} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Rent (MWK)</label>
              <input 
                type="number" 
                name="rent_mwk" 
                required
                min="0"
                value={formData.rent_mwk} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (MWK)</label>
              <input 
                type="number" 
                name="deposit_mwk" 
                required
                min="0"
                value={formData.deposit_mwk} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
              <select 
                name="room_type" 
                value={formData.room_type} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Single Room">Single Room</option>
                <option value="Self-Contained">Self-Contained</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Cottage">Cottage</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability Status</label>
              <select 
                name="availability_status" 
                value={formData.availability_status} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable / Occupied</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities & Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {facilityOptions.map(facility => (
                <label key={facility} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={Array.isArray(formData.facilities) && formData.facilities.includes(facility)}
                    onChange={() => handleCheckboxChange(facility)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{facility}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              rows="4" 
              required
              value={formData.description} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button 
              type="button" 
              onClick={() => navigate('/landlord/dashboard')}
              className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Saving Changes...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}