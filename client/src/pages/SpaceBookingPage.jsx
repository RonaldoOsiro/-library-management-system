import { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api.js';

function getToken() {
  return localStorage.getItem('token') || localStorage.getItem('library_jwt');
}

export default function SpaceBookingPage() {
  const [spaces, setSpaces] = useState([]);
  const [form, setForm] = useState({ spaceId: '', date: '', startTime: '', endTime: '' });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetchApi('/spaces?activeOnly=true', { signal: controller.signal })
      .then((result) => {
        const availableSpaces = Array.isArray(result) ? result : [];
        setSpaces(availableSpaces);
        if (availableSpaces.length) {
          setForm((current) => ({ ...current, spaceId: String(availableSpaces[0].id) }));
        }
      })
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Spaces could not be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('');

    const startAt = new Date(`${form.date}T${form.startTime}`);
    const endAt = new Date(`${form.date}T${form.endTime}`);
    if (startAt >= endAt) {
      setError('The end time must be later than the start time.');
      return;
    }

    setSubmitting(true);
    try {
      await fetchApi('/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          spaceId: Number(form.spaceId),
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
        }),
      });
      setStatus('Your booking request was submitted.');
      setForm((current) => ({ ...current, date: '', startTime: '', endTime: '' }));
    } catch (requestError) {
      setError(requestError.message || 'The booking could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="booking-page">
      <div className="booking-card">
        <p className="eyebrow"><span className="eyebrow-line" /> Reserve a room</p>
        <h1>Book a shared space</h1>
        {error && <p className="inline-notice" role="alert">{error}</p>}
        {status && <p className="inline-notice" role="status">{status}</p>}
        {loading ? (
          <p role="status">Loading available spaces…</p>
        ) : spaces.length === 0 ? (
          <p role="status">No spaces are available for booking right now.</p>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <label className="field-group">
              <span>Space</span>
              <select name="spaceId" value={form.spaceId} onChange={handleChange} required>
                {spaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.name} · capacity {space.capacity}
                  </option>
                ))}
              </select>
            </label>

            <label className="field-group">
              <span>Date</span>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>

            <div className="time-grid">
              <label className="field-group">
                <span>Start time</span>
                <input type="time" name="startTime" value={form.startTime} onChange={handleChange} required />
              </label>
              <label className="field-group">
                <span>End time</span>
                <input type="time" name="endTime" value={form.endTime} onChange={handleChange} required />
              </label>
            </div>

            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Submitting booking...' : 'Submit booking'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
