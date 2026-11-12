import React, { useEffect } from 'react';
import './landing.scss';

const DEMO_URL = `${process.env.PUBLIC_URL}/test/?v=dashboard`;

const features = [
  {
    title: 'Greeting',
    path: '/<event>/greetings',
    body: 'Guests leave their name and a blessing, pick one of the provided photos or upload their own, and can opt in to the in-ceremony game.',
  },
  {
    title: 'Board',
    path: '/<event>/',
    body: 'A live photo wall that picks up new greetings as they arrive and moves through them automatically over a background of photos.',
  },
  {
    title: 'Lottery',
    path: '/<event>/lottery',
    body: 'A flip-card and shuffle game played among the guests who joined the game when they sent their greeting.',
  },
];

export const Landing: React.FC = () => {
  useEffect(() => {
    document.title = 'Weddi – live wedding greetings';
  }, []);

  return (
    <div className="landing">
      <header className="landing__header">
        <span className="landing__brand">Weddi</span>
      </header>

      <main className="landing__main">
        <section className="landing__hero" aria-labelledby="landing-title">
          <h1 id="landing-title" className="landing__title">
            Wedding greetings, live during the ceremony.
          </h1>
          <p className="landing__lead">
            Weddi is a wedding-greeting web app. Guests send messages to the bride and groom in real time,
            and every greeting shows up on a live photo wall.
          </p>
          <a className="landing__cta" href={DEMO_URL}>See a demo</a>
          <p className="landing__note">The demo opens a sample event. The in-app interface is mostly in Chinese.</p>
        </section>

        <section className="landing__features" aria-labelledby="landing-features">
          <h2 id="landing-features" className="landing__subtitle">How it works</h2>
          <ul className="landing__list">
            {features.map((f) => (
              <li key={f.title} className="landing__card">
                <h3 className="landing__card-title">{f.title}</h3>
                <code className="landing__path">{f.path}</code>
                <p className="landing__card-body">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="landing__footer">
        <p>Built by Ben with FuboTeam.</p>
        <p>
          <a className="landing__contact" href="https://benliu.dev">Get in touch at benliu.dev</a>
          <span className="landing__sep" aria-hidden="true"> · </span>
          <a className="landing__email" href="mailto:contact@weddi.app">contact@weddi.app</a>
        </p>
      </footer>
    </div>
  );
};
