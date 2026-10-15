// src/components/landlord/ViewingRequests.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ViewingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchViewingRequests();
  }, []);

  const fetchViewingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/landlord/viewings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
    } catch (err) {
      console.error('Error fetching viewing requests:', err);
      setError('Failed to load viewing requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (viewingId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/viewings/${viewingId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh list after successful update
      fetchViewingRequests();
    } catch (err) {
      console.error('Error updating viewing request status:', err);
      alert('Failed to update viewing status.');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading viewing requests...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Student Viewing Requests</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                <th className="py-3 px-6">Property</th>
                <th className="py-3 px-6">Student Name</th>
                <th className="py-3 px-6">Requested Date & Time</th>
                <th className="py-3 px-6">Message</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-500">No viewing requests found.</td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr key={item.viewing_id} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{item.property_title || 'Property'}</td>
                    <td className="py-4 px-6">{item.student_name}</td>
                    <td className="py-4 px-6">{new Date(item.requested_datetime).toLocaleString()}</td>
                    <td className="py-4 px-6 text-gray-500 italic max-w-xs truncate">{item.message || 'No message provided'}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        item.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {item.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(item.viewing_id, 'accepted')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(item.viewing_id, 'rejected')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {item.status !== 'pending' && (
                        <span className="text-gray-400 text-xs">Completed</span>
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
  );
}