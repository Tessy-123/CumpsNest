// src/components/landlord/LandlordDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function LandlordDashboard() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState({ active: 0, pendingViewings: 0, archived: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLandlordData();
  }, []);

  const fetchLandlordData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/landlord/accommodations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setListings(response.data.listings);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching landlord dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'unavailable' : 'available';
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/accommodations/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLandlordData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Landlord Dashboard</h1>
        <Link 
          to="/landlord/listings/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add New Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Active Listings</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Pending Viewing Requests</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingViewings}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
          <p className="text-sm text-gray-500 font-medium">Archived Listings</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.archived}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">My Properties</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="py-3 px-6">Title</th>
                <th className="py-3 px-6">Area / Location</th>
                <th className="py-3 px-6">Rent (MWK)</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {listings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-gray-500">No properties listed yet.</td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr key={item.accommodation_id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.title}</td>
                    <td className="py-4 px-6">{item.area}</td>
                    <td className="py-4 px-6">MK {Number(item.rent_mwk).toLocaleString()}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.availability_status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.availability_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link to={`/landlord/listings/edit/${item.accommodation_id}`} className="text-blue-600 hover:underline">Edit</Link>
                      <button 
                        onClick={() => handleStatusToggle(item.accommodation_id, item.availability_status)}
                        className="text-gray-600 hover:underline"
                      >
                        Toggle Status
                      </button>
                      <Link to={`/landlord/viewings?property=${item.accommodation_id}`} className="text-indigo-600 hover:underline">Viewings</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}