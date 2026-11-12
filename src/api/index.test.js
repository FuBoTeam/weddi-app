/* eslint-env jest */
import { onValue, push, set } from 'firebase/database';
import { approvePost, listPosts, onNewPost, setApprovalEnabled, subscribePosts, writePost } from './index';

jest.mock('firebase/database', () => ({
  ref: jest.fn((database, path) => path),
  onValue: jest.fn(),
  push: jest.fn(() => ({ key: 'new-post' })),
  set: jest.fn(() => Promise.resolve()),
}));
jest.mock('firebase/storage', () => ({}));
jest.mock('../services/configService', () => ({
  __esModule: true,
  default: { config: { post: { namespace: 'sample-event' } } },
}));

const input = { name: 'Guest', greetings: 'Congratulations!', imgUrl: '/sample.jpg', joinedGame: true };
const posts = {
  old: { ...input, id: 'old' },
  pending: { ...input, id: 'pending', status: 'pending' },
  approved: { ...input, id: 'approved', status: 'approved' },
  spectator: { ...input, id: 'spectator', joinedGame: false, status: 'approved' },
};
const snapshot = value => ({ val: () => value });
const unsubscribe = jest.fn();
let event;

beforeEach(() => {
  jest.clearAllMocks();
  event = { posts };
  onValue.mockImplementation((path, callback) => {
    callback(snapshot(path.endsWith('/settings/approvalEnabled') ? event.settings?.approvalEnabled : event));
    return unsubscribe;
  });
});

it.each([undefined, false])('preserves legacy writes and readers when approval is %s', async enabled => {
  event.settings = { approvalEnabled: enabled };
  await writePost({}, input);
  expect(set).toHaveBeenCalledWith('sample-event/posts/new-post', expect.objectContaining(input));
  expect(set.mock.calls[0][1]).not.toHaveProperty('status');
  expect(Object.keys(await listPosts({}))).toEqual(Object.keys(posts));
});

it('writes pending greetings under this event when approval is on', async () => {
  event.settings = { approvalEnabled: true };
  await writePost({}, input);
  expect(set).toHaveBeenCalledWith('sample-event/posts/new-post', expect.objectContaining({
    ...input, id: 'new-post', status: 'pending', modifiedTime: expect.any(String), userAgent: expect.any(String),
  }));
  expect(onValue).toHaveBeenCalledWith('sample-event/settings/approvalEnabled', expect.any(Function), expect.any(Function), { onlyOnce: true });
});

it('fails closed if settings cannot be read', async () => {
  onValue.mockImplementationOnce((path, callback, onError) => {
    onError(new Error('permission denied'));
    return unsubscribe;
  });
  await expect(writePost({}, input)).rejects.toThrow('permission denied');
  expect(push).not.toHaveBeenCalled();
  expect(set).not.toHaveBeenCalled();
});

it('filters lists and lottery entrants, retaining historical greetings', async () => {
  event.settings = { approvalEnabled: true };
  expect(Object.keys(await listPosts({}))).toEqual(['old', 'approved', 'spectator']);
  expect(Object.keys(await listPosts({}, { joinedGame: true }))).toEqual(['old', 'approved']);
  event.posts = { pending: posts.pending };
  expect(await listPosts({}, { joinedGame: true })).toBeNull();
});

it('updates the live wall on approval and toggle, and detaches its listener', () => {
  event.settings = { approvalEnabled: true };
  const callback = jest.fn();
  const stop = subscribePosts({}, callback);
  expect(Object.keys(callback.mock.calls[0][0])).toEqual(['old', 'approved', 'spectator']);
  const receive = onValue.mock.calls[0][1];
  receive(snapshot({ ...event, posts: { ...posts, pending: { ...posts.pending, status: 'approved' } } }));
  expect(callback.mock.calls[1][0]).toHaveProperty('pending.status', 'approved');
  receive(snapshot({ ...event, settings: { approvalEnabled: false } }));
  expect(callback.mock.calls[2][0]).toHaveProperty('pending');
  receive(snapshot(event));
  expect(callback.mock.calls[3][0]).not.toHaveProperty('pending');
  stop();
  expect(unsubscribe).toHaveBeenCalledTimes(1);
});

it('emits newly approved posts through onNewPost without repeating unchanged posts', () => {
  event.settings = { approvalEnabled: true };
  const callback = jest.fn();
  const stop = onNewPost({}, callback);
  expect(callback.mock.calls.map(([post]) => post.id)).toEqual(['old', 'approved', 'spectator']);
  const receive = onValue.mock.calls[0][1];
  receive(snapshot({ ...event, posts: { ...posts, pending: { ...posts.pending, status: 'approved' } } }));
  expect(callback.mock.calls.map(([post]) => post.id)).toEqual(['old', 'approved', 'spectator', 'pending']);
  stop();
});

it('writes only the event setting or status when moderating', async () => {
  await setApprovalEnabled({}, true);
  await setApprovalEnabled({}, false);
  await approvePost({}, 'pending');
  expect(set.mock.calls).toEqual([
    ['sample-event/settings/approvalEnabled', true],
    ['sample-event/settings/approvalEnabled', false],
    ['sample-event/posts/pending/status', 'approved'],
  ]);
});
