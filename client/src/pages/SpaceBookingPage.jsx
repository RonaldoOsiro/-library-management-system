import { useMemo, useState } from 'react';

const SPACES = [
  { value: 'focus-booth', label: 'Focus Booth' },
  { value: 'study-room', label: 'Study Room' },
  { value: 'community-table', label: 'Community Table' },
  { value: 'presentation-room', label: 'Presentation Room' },
];

export default function SpaceBookingPage() {
  const [form, setForm] = useState({
    space: 'study-room',
    date: '',
    startTime: '',
    endTime: '',
  });
  const [status, setStatus] = useState('');

  const spaceLabel = useMemo(
    () => SPACES.find((space) => space.value === form.space)?.label ?? 'Selected space',
    [form.space],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.date || !form.startTime || !form.endTime) {
      setStatus('Please fill in the date, start time, and end time.');
      return;
    }

    if (form.startTime >= form.endTime) {
      setStatus('The end time must be later than the start time.');
      return;
    }

    setStatus(`Booking request saved for ${spaceLabel} on ${form.date} from ${form.startTime} to ${form.endTime}.`);
    setForm((current) => ({ ...current, date: '', startTime: '', endTime: '' }));
  };

  return (
    <main className="booking-page">
      <div className="booking-card">
        <p className="eyebrow"><span className="eyebrow-line" /> Reserve a room</p>
        <h1>Book a shared space</h1>

        <form className="booking-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Space</span>
            <select name="space" value={form.space} onChange={handleChange}>
              {SPACES.map((space) => (
                <option key={space.value} value={space.value}>
                  {space.label}
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

          {status && <p className="inline-notice" role="status">{status}</p>}

          <button type="submit" className="primary-button">Submit booking</button>
        </form>
      </div>
    </main>
  );
}
