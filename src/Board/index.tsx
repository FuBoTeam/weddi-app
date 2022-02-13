import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { logEvent } from 'firebase/analytics';
import './board.scss';

import { useAnalytics, useDatabase } from '../Provider/FirebaseApp';
import Dialog from './Dialog';
import { Background } from './Background';
import { subscribePost } from './subscribePost';
import { estimateReadingTime } from '../utils/estimateReadingTime';

const Board: React.FC<RouteComponentProps> = (props) => {
  // TODO: remove this and find a proper filter way on GA
  const analytics = useAnalytics();
  useEffect(() => {
    logEvent(analytics, 'board_page_landed');
  }, [analytics]);

  const [modalDisplay, setModalDisplay] = useState(false);
  const openModalAndClose = useCallback<(timeout?: number) => void>((timeout = 5000) => {
    setModalDisplay(true);
    setTimeout(() => {
      setModalDisplay(false);
    }, timeout);
  }, [setModalDisplay]);

  const [post, setPost] = useState({});
  const database = useDatabase();

  useEffect(() => {
    // subscribe post while component did mount
    const unsubscribe = subscribePost(database)((newPost) => {
      if (newPost) {
        setPost(newPost);
        estimateReadingTime(newPost.greetings, (estimatedSecond) => {
          const timeout = Math.max(estimatedSecond * 1000, 5000);
          openModalAndClose(timeout);
        });
      }
    });
    return () => {
      // unsubscribe post while component will unmount
      unsubscribe();
    };
  }, [database, openModalAndClose]);

  return (
    <React.Fragment>
      <Background />
      <Dialog user={post} show={modalDisplay} />
      <a className="message-link" href={`${props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
      <a className="game-link" href={`${props.match.url}/lottery`}>去遊戲頁</a>
    </React.Fragment>
  );
};

export default Board;
