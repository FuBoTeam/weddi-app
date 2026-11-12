import React, { useEffect } from 'react';
import './landing.scss';
import boardShot from './screenshots/board.webp';
import greetingShot from './screenshots/greeting.webp';
import lotteryShot from './screenshots/lottery.webp';

const DEMO_URL = `${process.env.PUBLIC_URL}/test/?v=dashboard`;

// Keep this copy in sync with the static landing and FAQ JSON-LD in public/index.html.
const steps = [
  {
    title: 'Share your event QR code (or link)',
    body: 'Guests scan the event QR code, which is basically a link, and open it in their phone browser. There is no app to install and no account to create.',
  },
  {
    title: 'Guests write a greeting',
    body: 'Guests enter a name or nickname, a message, and a photo (pick one of the couple\'s or upload their own).',
  },
  {
    title: 'It appears on the big screen',
    body: 'The wall shows new greetings first, each for as long as it takes to read.',
  },
];

const faq = [
  {
    question: 'What is Weddi?',
    answer: 'Weddi is a wedding-greeting web app. Guests send a message and a photo to the couple from their phone, each greeting appears live on a photo wall on the venue screen, and the couple can draw lottery winners from everyone who sent a greeting.',
  },
  {
    question: 'Do guests need to download an app or create an account?',
    answer: 'No. Guests scan the event QR code (which is basically a link) or open the event link in their phone\'s web browser, type a name and a message, choose a photo, and send it.',
  },
  {
    question: 'What appears on the big screen?',
    answer: 'A live wall that shows each greeting with its photo over a collage of the couple\'s pictures. New greetings are shown first, and in quieter moments the wall cycles back through earlier ones.',
  },
  {
    question: 'How long does each greeting stay on screen?',
    answer: 'Long enough to read it. Weddi estimates the reading time from the message\'s length and language, with a minimum of about five seconds, so short notes and long messages both get their moment.',
  },
  {
    question: 'Can guests add photos?',
    answer: 'Yes. Every greeting comes with a picture: guests pick one of the couple\'s photos or upload their own, and uploads are resized on the phone before sending.',
  },
  {
    question: 'How does the wedding lottery work?',
    answer: 'Everyone who sends a greeting gets a card in the draw. On the big screen you shuffle the deck, then flip cards to reveal the winners.',
  },
  {
    question: 'Is the app in English or Chinese?',
    answer: 'This page is in English. The greeting form, wall, and lottery screens are mostly in Traditional Chinese, and guests can write greetings in any language.',
  },
  {
    question: 'How do we get Weddi for our wedding?',
    answer: 'Each event is set up with its own page, title, and photos. Contact us first at contact@weddi.app; the price is not decided yet.',
  },
];

const features = [
  {
    title: 'A live greeting wall on the venue screen',
    body: 'Every greeting appears on the venue screen with its photo, over a collage of your pictures. New greetings go up first; in quieter moments the wall cycles back through earlier ones.',
  },
  {
    title: 'Greetings from any phone, no app to install',
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
    title: 'A wedding lottery drawn from the greetings',
    body: 'Everyone who sends a greeting gets a card in the draw. Shuffle the deck on the big screen, then flip cards to reveal the winners.',
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
    document.title = 'Weddi – Live Wedding Greeting Wall & Guest Lottery App';
  }, []);

  return (
    <div className="landing">
      <header className="landing__header">
        <span className="landing__brand">Weddi</span>
      </header>

      <main className="landing__main">
        <section className="landing__hero" aria-labelledby="landing-title">
          <h1 id="landing-title" className="landing__title">
            A live wedding greeting wall your guests post to from their phones
          </h1>
          <p className="landing__lead">
            Weddi is a wedding-greeting web app. Guests send messages and a photo to the bride and groom from their phone browser, and every greeting shows up live on a photo wall on the venue screen. When it&apos;s time, draw lottery winners from everyone who sent a greeting.
          </p>
          <a className="landing__cta" href={DEMO_URL}>See a demo</a>
          <p className="landing__note">The demo opens a sample event. The in-app interface is mostly in Chinese.</p>
        </section>

        <section className="landing__steps" aria-labelledby="landing-steps">
          <h2 id="landing-steps" className="landing__subtitle">How it works</h2>
          <ol className="landing__step-list">
            {steps.map((step) => (
              <li key={step.title}>
                <h3 className="landing__card-title">{step.title}</h3>
                <p className="landing__card-body">{step.body}</p>
              </li>
            ))}
          </ol>
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
        <section className="landing__faq" aria-labelledby="landing-faq">
          <h2 id="landing-faq" className="landing__subtitle">Frequently asked questions</h2>
          {faq.map((item) => (
            <div key={item.question} className="landing__faq-item">
              <h3 className="landing__card-title">{item.question}</h3>
              <p className="landing__card-body">{item.answer}</p>
            </div>
          ))}
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
