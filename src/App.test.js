/* eslint-env jest */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route } from 'react-router-dom';
import App from './App';

jest.mock('./Board', () => { function MockBoard() { return <div>Live wall</div>; } return MockBoard; });
jest.mock('./Dashboard/Dashboard', () => { function Dashboard() { return <div>Host dashboard</div>; } return { Dashboard }; });
jest.mock('./Greeting/Greeting', () => { function Greeting() { return <div>Greeting form</div>; } return { Greeting }; });
jest.mock('./Lottery/Lottery', () => { function Lottery() { return <div>Lottery game</div>; } return { Lottery }; });
jest.mock('./Provider/FirebaseApp', () => ({ FirebaseAppProvider: ({ children }) => children }));
jest.mock('./services/configService', () => ({
  __esModule: true,
  default: { init: jest.fn(), config: { doc: { title: 'Sample event' }, firebase: {} } },
}));

it.each([
  ['/test/?v=dashboard', 'Host dashboard'],
  ['/chyy/?v=dashboard', 'Host dashboard'],
  ['/test/', 'Live wall'],
  ['/test/?v=other', 'Live wall'],
  ['/test/greetings', 'Greeting form'],
  ['/test/lottery', 'Lottery game'],
])('renders the event view for %s', (url, view) => {
  const html = renderToStaticMarkup(
    <MemoryRouter initialEntries={[url]}>
      <Route path="/:gnbId/" component={App} />
    </MemoryRouter>,
  );
  expect(html).toContain(view);
});
