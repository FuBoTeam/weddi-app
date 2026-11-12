import React, { useEffect } from 'react';
import './landing.scss';
import boardShot from './screenshots/board.webp';
import greetingShot from './screenshots/greeting.webp';
import lotteryShot from './screenshots/lottery.webp';

const DEMO_URL = `${process.env.PUBLIC_URL}/test/?v=dashboard`;

const features = [
  {
    title: 'A live greeting wall',
    body: 'Visible greetings appear on the venue screen with their photos, over a collage of your pictures. New greetings go up first; in quieter moments the wall cycles back through earlier ones.',
  },
  {
    title: 'Screen greetings before they go live',
    body: 'Turn on message approval so you can review new greetings together and approve them before they appear on the live wall.',
  },
  {
    title: 'Greetings from any phone',
    body: 'Guests open your event link in their phone browser, type their name and a message, and send it. There is no app to install.',
  },
  {
    title: 'Pick a photo or upload one',
    body: 'Each greeting comes with a picture: guests choose one of your photos or upload their own, which is resized on the phone before it is sent.',
  },
  {
    title: 'Paced for reading',
    body: 'Each greeting stays on screen for as long as it takes to read, based on its length and language, so short notes and long messages both get their moment.',
  },
  {
    title: 'An in-ceremony lottery game',
    body: 'Guests who send a greeting get a card in the draw; with message approval on, only approved greetings enter. Shuffle the deck on the big screen, then flip cards to reveal the winners.',
  },
  {
    title: 'Made for your day',
    body: 'Your event gets its own page with your names in the title and your photos throughout the form and the wall.',
  },
];

const shots = {
  board: {
    src: boardShot,
    width: 1280,
    height: 720,
    alt: 'The live greeting wall: a sample greeting from "Sample Guest" with its photo, shown over a collage of the couple\'s photos.',
    caption: 'The live wall on the venue screen.',
  },
  greeting: {
    src: greetingShot,
    width: 780,
    height: 1520,
    alt: 'The greeting form on a phone: a photo picker, a name field and a message field filled in with a sample greeting.',
    caption: 'The greeting form on a guest\'s phone.',
  },
  lottery: {
    src: lotteryShot,
    width: 960,
    height: 810,
    alt: 'The lottery game: a four-by-four deck of cards, each showing a sample guest name, with a shuffle button.',
    caption: 'The lottery deck, ready to shuffle.',
  },
};

type Shot = typeof shots.board;

const Screenshot: React.FC<{ shot: Shot; className?: string }> = ({ shot, className }) => (
  <figure className={`landing__shot ${className ?? ''}`}>
    <img
      className="landing__shot-img"
      src={shot.src}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading="lazy"
      decoding="async"
    />
    <figcaption className="landing__shot-caption">{shot.caption}</figcaption>
  </figure>
);

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
            and greetings show up on a live photo wall.
          </p>
          <a className="landing__cta" href={DEMO_URL}>See a demo</a>
          <p className="landing__note">The demo opens a sample event. The in-app interface is mostly in Chinese.</p>
        </section>

        <section className="landing__features" aria-labelledby="landing-features">
          <h2 id="landing-features" className="landing__subtitle">Features</h2>
          <ul className="landing__list">
            {features.map((f) => (
              <li key={f.title} className="landing__card">
                <h3 className="landing__card-title">{f.title}</h3>
                <p className="landing__card-body">{f.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="landing__shots" aria-labelledby="landing-shots">
          <h2 id="landing-shots" className="landing__subtitle">See it in action</h2>
          <p className="landing__shots-note">Screenshots of the app with sample greetings.</p>
          <Screenshot shot={shots.board} className="landing__shot--wide" />
          <div className="landing__shot-row">
            <Screenshot shot={shots.greeting} className="landing__shot--phone" />
            <Screenshot shot={shots.lottery} />
          </div>
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
