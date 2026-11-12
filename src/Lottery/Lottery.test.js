/* eslint-env jest */
import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { Lottery } from './Lottery';
import { subscribePosts } from '../api';
import { visiblePosts } from '../api/postVisibility';

jest.mock('../api', () => ({ subscribePosts: jest.fn() }));
jest.mock('firebase/analytics', () => ({ logEvent: jest.fn() }));
jest.mock('../Provider/FirebaseApp', () => ({ useDatabase: () => 'mock-db', useAnalytics: () => null }));
jest.mock('../utils/random', () => ({ permutationList: posts => posts }));

it('keeps pending greetings out of the live lottery and updates on approval/toggle', () => {
  let receive;
  const stop = jest.fn();
  subscribePosts.mockImplementation((database, callback, options) => {
    receive = event => callback(visiblePosts(event, options));
    return stop;
  });
  const container = document.createElement('div');
  const posts = {
    old: { id: 'old', name: 'Historical Guest', joinedGame: true },
    pending: { id: 'pending', name: 'Pending Guest', joinedGame: true, status: 'pending' },
    approved: { id: 'approved', name: 'Approved Guest', joinedGame: true, status: 'approved' },
    spectator: { id: 'spectator', name: 'Spectator', joinedGame: false },
  };
  act(() => { ReactDOM.render(<Lottery match={{ url: '/test/lottery' }} />, container); });
  act(() => receive({ posts }));
  expect(container.querySelectorAll('.card')).toHaveLength(3);
  act(() => receive({ settings: { approvalEnabled: true }, posts }));
  expect(container.textContent).toContain('Historical Guest');
  expect(container.textContent).toContain('Approved Guest');
  expect(container.textContent).not.toContain('Pending Guest');
  expect(container.textContent).not.toContain('Spectator');
  act(() => receive({ settings: { approvalEnabled: true }, posts: { ...posts, pending: { ...posts.pending, status: 'approved' } } }));
  expect(container.textContent).toContain('Pending Guest');
  act(() => receive({ settings: { approvalEnabled: true }, posts: { pending: posts.pending } }));
  expect(container.querySelectorAll('.card')).toHaveLength(0);
  expect(container.textContent).toContain('現在還沒有玩家喔');
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  expect(stop).toHaveBeenCalledTimes(1);
});

it('does not reshuffle or reveal an active draw when a new greeting arrives', () => {
  let receive;
  subscribePosts.mockImplementation((database, callback, options) => {
    receive = event => callback(visiblePosts(event, options));
    return jest.fn();
  });
  const container = document.createElement('div');
  const posts = {
    old: { id: 'old', name: 'Historical Guest', joinedGame: true },
    approved: { id: 'approved', name: 'Approved Guest', joinedGame: true, status: 'approved' },
  };
  act(() => { ReactDOM.render(<Lottery match={{ url: '/test/lottery' }} />, container); });
  act(() => receive({ posts }));
  const namesBefore = [...container.querySelectorAll('.front')].map(node => node.textContent);
  expect(namesBefore).toEqual(['Historical Guest', 'Approved Guest']);
  act(() => Simulate.click(container.querySelector('.lottery-btns button.show')));
  expect(container.querySelector('.inner.flip-transition')).not.toBeNull();
  act(() => receive({
    posts: {
      ...posts,
      late: { id: 'late', name: 'Late Guest', joinedGame: true },
    },
  }));
  const namesAfter = [...container.querySelectorAll('.front')].map(node => node.textContent);
  expect(namesAfter).toEqual(['Historical Guest', 'Approved Guest']);
  expect(container.textContent).not.toContain('Late Guest');
  expect(container.querySelector('.inner.flip-transition')).not.toBeNull();
  act(() => { ReactDOM.unmountComponentAtNode(container); });
});
