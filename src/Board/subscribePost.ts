import { Database } from 'firebase/database';
import { listPosts, onNewPost } from '../api';
import { newHeap } from '../utils/priorityQueue';

interface HeapNode {
  priority: number;
  timestampId: string;
}

/**
 * Create a queue for upcoming new feeds
 * There are two kinds of feeds in the queue, 1. feeds from pool 2. feeds from push event
 * We would like to pop the feeds in follows order untill the queue is empty:
 * [earliest pushed feed -> latest pushed feed -> earliest pool feed -> latest pool feed
 * once the pushed feed is popped from queue, it will be considered a pool feed
 *
 * When the queue is empty, it should refill the queue with feeds from pool.
 * The queue will be simplify down to a time-based queue if there is no pushed feed in the it.
 * The order of the popped feed will be [earliest pool feed -> latest pool feed]
 *
 * Implementation: priority queue (min heap)
 * The element in priority queue has members (priority: int, timestamp: string)
 * priority is 0 in pushed feed and 1 in pool feed
 * The element i is higher priority than j when
 *  1. i's priority < j's priority
 *  2. i's priority = j's priority and i's timestamp < j's timestamp
 */
const newHeapNode = (priority: number, timestampId: string): HeapNode => ({ priority, timestampId });
const heap = newHeap<HeapNode>((node1, node2) => {
  if (node1.priority < node2.priority) {
    return true;
  }
  if (node1.priority === node2.priority && node1.timestampId < node2.timestampId) {
    return true;
  }
  return false;
});

type PostListener = (post: WeddiApp.Post.Data) => any;
type UnsubscribeFn = () => void;

export const subscribePost = (database: Database) => (listener: PostListener): UnsubscribeFn => {
  const postsPool: {[timestampId: string]: WeddiApp.Post.Data} = {};
  let feeds: HeapNode[] = [];
  listPosts(database).then(posts => {
    if (posts === null) {
      return;
    }
    Object.keys(posts).forEach(id => {
      postsPool[id] = posts[id];
    });
  }).then(() => {
    onNewPost(database, (post: WeddiApp.Post.Data) => {
      if (!postsPool[post.id]) {
        postsPool[post.id] = post;
        heap.push(feeds, newHeapNode(0, post.id));
      }
    });
  });

  const interval = setInterval(() => {
    if (feeds.length === 0) {
      // refill feeds with pool feeds
      feeds = Object.keys(postsPool).map(postId => newHeapNode(1, postId));
      heap.init(feeds);
    }
    const nextFeed = heap.pop(feeds);
    if (nextFeed) {
      listener(postsPool[nextFeed.timestampId]);
    }
  }, 8000);

  const unsubscribe: UnsubscribeFn = () => {
    clearInterval(interval);
    // TODO: unsub API
  };
  return unsubscribe;
};
