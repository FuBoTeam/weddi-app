import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { approvePost, setApprovalEnabled, subscribeEvent } from '../api';
import { EventData } from '../api/postVisibility';
import { useDatabase } from '../Provider/FirebaseApp';
import './dashboard.scss';

export const Dashboard: React.FC<RouteComponentProps> = ({ match }) => {
  const database = useDatabase();
  const [event, setEvent] = useState<EventData | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => subscribeEvent(database, setEvent, () => {
    setEvent(null);
    setError('Could not load greetings. Reload to try again.');
  }), [database]);

  const save = async (operation: () => Promise<void>) => {
    setBusy(true);
    setError('');
    try {
      await operation();
    } catch (err) {
      setError('Could not save your change. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  const enabled = event?.settings?.approvalEnabled === true;
  const pending = Object.entries(event?.posts || {}).filter(([, post]) => post.status === 'pending');
  const eventUrl = match.url.replace(/\/$/, '');

  return (
    <main className="dashboard">
      <header>
        <span className="dashboard__brand">Weddi · Host view</span>
        <h1>Your greetings, ready for the big screen.</h1>
        <p>Review each new message before sharing it with everyone.</p>
        <nav aria-label="Event views">
          <a href={`${eventUrl}/`}>Open live wall</a>
          <a href={`${eventUrl}/greetings`}>Guest greeting form</a>
          <a href={`${eventUrl}/lottery`}>Lottery</a>
        </nav>
      </header>
      <section className="dashboard__settings" aria-labelledby="approval-title">
        <h2 id="approval-title">Message approval</h2>
        <label className="dashboard__toggle">
          <input type="checkbox" checked={enabled} disabled={!event || busy}
            onChange={e => { const checked = e.target.checked; save(() => setApprovalEnabled(database, checked)); }} />
          Review greetings before they go live
        </label>
        <p>{enabled ? 'On: new greetings wait here for your approval. Only approved greetings enter the lottery.'
          : 'Off: all greetings appear on the live wall and can enter the lottery, including any waiting below.'}</p>
        <p>Earlier greetings without a status stay visible.</p>
      </section>
      <p className="dashboard__access">Anyone with this dashboard URL can moderate this event. Share it with care.</p>
      {error && <p role="alert">{error}</p>}
      {!event ? <p role="status">{error ? 'Dashboard unavailable.' : 'Loading greetings…'}</p> : (
        <section aria-labelledby="pending-title">
          <h2 id="pending-title">Waiting for approval <span>({pending.length})</span></h2>
          {pending.length === 0 && <p>No greetings waiting. You’re all caught up.</p>}
          <div className="dashboard__queue">
            {pending.map(([id, post]) => (
              <article className="dashboard__post" key={id}>
                <img src={post.imgUrl} alt={`Chosen by ${post.name}`} />
                <div>
                  <span className="dashboard__badge">Pending</span>
                  <h3>{post.name}</h3>
                  <p>{post.greetings}</p>
                  <button disabled={busy} onClick={() => save(() => approvePost(database, id))}>Approve greeting</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};
