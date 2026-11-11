import { useCallback, useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api.js';

function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('library_jwt');
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const loadBookings = useCallback(() => fetchApi('/bookings', {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(setBookings), []);

  useEffect(() => {
    loadBookings().catch((requestError) => setError(requestError.message || 'Bookings could not be loaded.'));
  }, [loadBookings]);

  return (
    <main className="admin-page">
      <p className="eyebrow"><span className="eyebrow-line" /> Librarian tools</p>
      <h1 className="page-title">Space bookings</h1>
      {error && <p className="inline-notice" role="alert">{error}</p>}
      {bookings.length === 0 ? <p>No bookings found.</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Space</th><th>Patron</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.space.name}</td>
                  <td>{booking.user.name}<br /><small>{booking.user.email}</small></td>
                  <td>{new Date(booking.startAt).toLocaleString()}</td>
                  <td>{new Date(booking.endAt).toLocaleString()}</td>
                  <td>{booking.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
