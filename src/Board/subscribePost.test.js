/* eslint-env jest */
import { subscribePosts } from '../api';
import { visiblePosts } from '../api/postVisibility';
import { subscribePost } from './subscribePost';

jest.mock('../api', () => ({ subscribePosts: jest.fn() }));

const old = { id: 'old', name: 'Earlier guest' };
const pending = { id: 'pending', name: 'Waiting guest', status: 'pending' };
let receive;
const stop = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  subscribePosts.mockImplementation((database, callback) => {
    receive = event => callback(visiblePosts(event));
    return stop;
  });
});

it('cycles historical greetings, queues newly approved greetings first, and unsubscribes', () => {
  const queue = subscribePost({});
  expect(() => queue.next()).toThrow('queue is empty');
  receive({ settings: { approvalEnabled: true }, posts: { old, pending } });
  expect(queue.next()).toEqual(old);
  expect(queue.next()).toEqual(old);
  receive({ settings: { approvalEnabled: true }, posts: { old, pending: { ...pending, status: 'approved' } } });
  expect(queue.next().id).toBe('pending');
  queue.unsubscribe();
  expect(stop).toHaveBeenCalledTimes(1);
});

it('removes pending greetings from the pool and queued feeds when approval turns on', () => {
  const hidden = jest.fn();
  const queue = subscribePost({}, hidden);
  receive({ posts: { old } });
  receive({ posts: { old, pending } });
  receive({ settings: { approvalEnabled: true }, posts: { old, pending } });
  expect(hidden).toHaveBeenCalledWith('pending');
  expect(queue.next()).toEqual(old);
  expect(queue.next()).toEqual(old);
  receive({ settings: { approvalEnabled: true }, posts: { pending } });
  expect(() => queue.next()).toThrow('queue is empty');
  receive({ settings: { approvalEnabled: false }, posts: { pending } });
  expect(queue.next()).toEqual(pending);
});
