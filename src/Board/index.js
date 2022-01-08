import React, { useState, useEffect } from 'react';
import { useDatabase } from '../Provider/FirebaseApp';
import { listPosts, onNewPost } from '../api';
import { newHeap } from '../utils/priorityQueue';
import './board.scss';
import Dialog from './Dialog';
import { Background } from './Background';

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
const newHeapNode = (priority, timestampId) => ({ priority, timestampId });
const heap = newHeap((node1, node2) => {
  if (node1.priority < node2.priority) {
    return true;
  }
  if (node1.priority === node2.priority && node1.timestampId < node2.timestampId) {
    return true;
  }
  return false;
});

const subscribePost = (database) => (listener) => {
  let postsPool = {};
  let feeds = [];
  listPosts(database)().then(posts => {
    Object.keys(posts).forEach(id => {
      postsPool[id] = posts[id];
    });
  }).then(() => {
    onNewPost(database)(post => {
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

  const unsubscribe = () => {
    clearInterval(interval);
    // TODO: unsub API
  };
  return unsubscribe;
};

const Board = (props) => {
  const [modalDisplay, setModalDisplay] = useState(false);
  const [user, setUser] = useState({});
  const database = useDatabase();

  useEffect(() => {
    // subscribe post while component did mount
    const unsubscribe = subscribePost(database)((user) => {
      if (user) {
        setUser(user);
        const displayAndHide = () => {
          setModalDisplay(true);

          setTimeout(() => {
            setModalDisplay(false);
          }, 5000);
        };
        displayAndHide();
      }
    });
    return () => {
      // unsubscribe post while component will unmount
      unsubscribe();
    };
  }, [database]);

  return (
    <React.Fragment>
      <Background />
      <Dialog user={user} show={modalDisplay} />
      <a className="message-link" href={`${props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
    </React.Fragment>
  );
};

export default Board;
