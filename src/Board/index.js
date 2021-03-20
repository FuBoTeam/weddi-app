import React, { useState, useEffect } from 'react';
import './board.scss';
import Dialog from './Dialog';
import { Background } from './Background';

import Queue from './queue';

import { onNewPost } from '../api';
import { useDatabase } from '../Provider/FirebaseApp';

const subscribePost = (database) => (listener) => {
  const newFeeds = new Queue();
  const oldFeeds = new Queue();

  onNewPost(database)((feed) => newFeeds.push(feed));

  const interval = setInterval(() => {
    const nextFeed = newFeeds.isEmpty() ? oldFeeds.pop() : newFeeds.pop();
    if (nextFeed) {
      oldFeeds.push(nextFeed);
    }
    listener(nextFeed);
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
