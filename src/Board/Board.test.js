/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Board from './index';
import { subscribePosts } from '../api';
import { visiblePosts } from '../api/postVisibility';

jest.mock('../api', () => ({ subscribePosts: jest.fn() }));
jest.mock('firebase/analytics', () => ({ logEvent: jest.fn() }));
jest.mock('../Provider/FirebaseApp', () => ({ useDatabase: () => 'mock-db', useAnalytics: () => null }));
jest.mock('./Background/Background', () => () => null);
jest.mock('./Dialog/Dialog', () => {
  const React = require('react');
  // Keep the greeting open so a toggle must hide the currently displayed post.
  function MockDialog({ post, show }) { return <div data-visible={show}>{post.name}</div>; }
  return MockDialog;
});

it('hides an already displayed pending greeting when approval turns on', async () => {
  jest.useFakeTimers();
  let receive;
  const stop = jest.fn();
  subscribePosts.mockImplementation((database, callback) => {
    receive = event => callback(visiblePosts(event));
    return stop;
  });
  const container = document.createElement('div');
  const pending = { id: 'pending', name: 'Waiting Guest', status: 'pending' };
  act(() => { ReactDOM.render(<Board match={{ url: '/test' }} />, container); });
  act(() => receive({ posts: { pending } }));
  await act(async () => {
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
  });
  expect(container.textContent).toContain('Waiting Guest');
  act(() => receive({ settings: { approvalEnabled: true }, posts: { pending } }));
  expect(container.textContent).not.toContain('Waiting Guest');
  act(() => receive({ settings: { approvalEnabled: true }, posts: { pending: { ...pending, status: 'approved' } } }));
  await act(async () => {
    jest.advanceTimersByTime(1000);
    await Promise.resolve();
  });
  expect(container.textContent).toContain('Waiting Guest');
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  expect(stop).toHaveBeenCalledTimes(1);
  jest.clearAllTimers();
  jest.useRealTimers();
});
