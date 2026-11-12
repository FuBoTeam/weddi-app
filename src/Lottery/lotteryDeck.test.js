/* eslint-env jest */
import { applyEligiblePosts, isLotteryRoundActive, Stage } from './lotteryDeck';

const old = { id: 'old', name: 'Historical Guest', joinedGame: true };
const pending = { id: 'pending', name: 'Pending Guest', joinedGame: true, status: 'pending' };
const approved = { id: 'approved', name: 'Approved Guest', joinedGame: true, status: 'approved' };

it('treats init, loaded and error as inactive rounds', () => {
  expect(isLotteryRoundActive(Stage.Loaded)).toBe(false);
  expect(isLotteryRoundActive(Stage.Ready)).toBe(true);
});

it('rebuilds the deck before a round starts', () => {
  const next = applyEligiblePosts([old], [old, approved], Stage.Loaded, { '*': true });
  expect(next.posts.map(post => post.id)).toEqual(['old', 'approved']);
  expect(next.stage).toBe(Stage.Loaded);
  expect(next.resetPresentation).toBe(true);
});

it('keeps an active draw order and revealed cards, deferring newcomers', () => {
  const next = applyEligiblePosts([old, approved], [approved, pending, old], Stage.Ready, { '*': false, 1: true });
  expect(next.posts.map(post => post.id)).toEqual(['old', 'approved']);
  expect(next.stage).toBe(Stage.Ready);
  expect(next.revealedIds).toEqual({ '*': false, 1: true });
  expect(next.resetPresentation).toBe(false);
});

it('removes ineligible cards mid-draw and remaps revealed indexes', () => {
  const next = applyEligiblePosts([old, pending, approved], [old, approved], Stage.Ready, { '*': false, 0: true, 2: true });
  expect(next.posts.map(post => post.id)).toEqual(['old', 'approved']);
  expect(next.revealedIds).toEqual({ '*': false, 0: true, 1: true });
  expect(next.stage).toBe(Stage.Ready);
});

it('ends the round when every card becomes ineligible', () => {
  const next = applyEligiblePosts([pending], [], Stage.Shuffled, { '*': false });
  expect(next.posts).toEqual([]);
  expect(next.stage).toBe(Stage.Error);
  expect(next.resetPresentation).toBe(true);
});
