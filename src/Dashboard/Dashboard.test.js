/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { Dashboard } from './Dashboard';
import { approvePost, setApprovalEnabled, subscribeEvent } from '../api';

jest.mock('../api', () => ({
  approvePost: jest.fn(() => Promise.resolve()),
  setApprovalEnabled: jest.fn(() => Promise.resolve()),
  subscribeEvent: jest.fn(),
}));
jest.mock('../Provider/FirebaseApp', () => ({ useDatabase: () => 'mock-db' }));

const post = { id: 'pending', name: 'Sample Guest', greetings: 'Best wishes!', imgUrl: '/sample.jpg', status: 'pending' };
let container;
let receive;
let fail;
const unsubscribe = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  container = document.createElement('div');
  document.body.appendChild(container);
  subscribeEvent.mockImplementation((database, callback, onError) => {
    receive = callback;
    fail = onError;
    return unsubscribe;
  });
  act(() => { ReactDOM.render(<Dashboard match={{ url: '/test/' }} />, container); });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
});

it('defaults off, toggles approval, and approves the pending greeting', async () => {
  expect(container.querySelector('input').disabled).toBe(true);
  act(() => receive({ posts: { pending: post } }));
  expect(container.querySelector('input').checked).toBe(false);
  expect(container.textContent).toContain('Anyone with this dashboard URL can moderate');
  expect(container.querySelector('a').getAttribute('href')).toBe('/test/');
  await act(async () => Simulate.change(container.querySelector('input'), { target: { checked: true } }));
  expect(setApprovalEnabled).toHaveBeenCalledWith('mock-db', true);
  act(() => receive({ settings: { approvalEnabled: true }, posts: { pending: post } }));
  expect(container.querySelector('input').checked).toBe(true);
  await act(async () => Simulate.click(container.querySelector('button')));
  expect(approvePost).toHaveBeenCalledWith('mock-db', 'pending');
  act(() => receive({ settings: { approvalEnabled: true }, posts: { pending: { ...post, status: 'approved' } } }));
  expect(container.querySelector('article')).toBeNull();
  expect(container.textContent).toContain('No greetings waiting');
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

it('keeps a failed approval in the queue and shows an error', async () => {
  approvePost.mockRejectedValueOnce(new Error('denied'));
  act(() => receive({ settings: { approvalEnabled: true }, posts: { pending: post } }));
  await act(async () => Simulate.click(container.querySelector('button')));
  expect(container.querySelector('[role=alert]').textContent).toContain('Could not save');
  expect(container.querySelector('button').disabled).toBe(false);
  expect(container.querySelector('article').textContent).toContain('Sample Guest');
});

it('disables moderation on a subscription error', () => {
  act(() => fail(new Error('denied')));
  expect(container.querySelector('input').disabled).toBe(true);
  expect(container.querySelector('[role=alert]').textContent).toContain('Could not load');
});
