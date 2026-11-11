import { useCallback, useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api.js';

const STATUSES = ['REQUESTED', 'APPROVED', 'REJECTED', 'BORROWED', 'RETURNED'];

function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('library_jwt');
}

export default function AdminBorrowRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const loadRequests = useCallback(() => fetchApi('/borrow-requests', {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(setRequests), []);

  useEffect(() => {
    loadRequests().catch((requestError) => setError(requestError.message || 'Borrow requests could not be loaded.'));
  }, [loadRequests]);

  const updateStatus = async (request, nextStatus) => {
    setError('');
    setStatus('');
    try {
      await fetchApi(`/borrow-requests/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      setStatus(`Request #${request.id} updated.`);
      await loadRequests();
    } catch (requestError) {
      setError(requestError.message || 'The borrow request could not be updated.');
    }
  };

  return (
    <main className="admin-page">
      <p className="eyebrow"><span className="eyebrow-line" /> Librarian tools</p>
      <h1 className="page-title">Borrow requests</h1>
      {error && <p className="inline-notice" role="alert">{error}</p>}
      {status && <p className="inline-notice" role="status">{status}</p>}
      {requests.length === 0 ? <p>No borrow requests found.</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Book</th><th>Patron</th><th>Requested</th><th>Due</th><th>Fine</th><th>Status</th></tr></thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.book.title}</td>
                  <td>{request.user.name}<br /><small>{request.user.email}</small></td>
                  <td>{new Date(request.requestedAt).toLocaleDateString()}</td>
                  <td>{new Date(request.dueDate).toLocaleDateString()}</td>
                  <td>${Number(request.fineAmount).toFixed(2)}</td>
                  <td>
                    <select
                      aria-label={`Status for ${request.book.title}`}
                      value={request.status}
                      disabled={request.status === 'RETURNED'}
                      onChange={(event) => updateStatus(request, event.target.value)}
                    >
                      {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
