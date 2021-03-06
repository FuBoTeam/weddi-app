import React, { useState, useEffect, useMemo } from 'react';
import './board.scss';
import Dialog from './Dialog';
import { Background } from './Background';

import Queue from './queue';

import * as Api from '../api';

const Board = (props) => {
  const [modalDisplay, setModalDisplay] = useState(false);
  const newFeeds = useMemo(() => new Queue(), []);
  const oldFeeds = useMemo(() => new Queue(), []);
  const [user, setUser] = useState({});

  useEffect(() => {
    // subscribe the feeds
    Api.onNewPost((feed) => newFeeds.push(feed));
  });

  useEffect(() => {
    // show feeds
    const interval = setInterval(() => {
      const pickUpFeed = () => {
        const nextFeed = newFeeds.isEmpty() ? oldFeeds.pop() : newFeeds.pop();
        const showDialog = (user) => {
          setUser(user);
          const displayAndHide = () => {
            setModalDisplay(true);

            setTimeout(() => {
              setModalDisplay(false);
            }, 5000);
          };
          displayAndHide();
        };
        if (nextFeed) {
          showDialog(nextFeed);
          oldFeeds.push(nextFeed);
        }
      };

      pickUpFeed();
    }, 8000);

    // Auto refresh background images
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <React.Fragment>
      <Background />
      <Dialog user={user} show={modalDisplay} />
      <a className="message-link" href={`${props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
    </React.Fragment>
  );
};

export default Board;
