import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  const openModalAndClose = useCallback<(onClose: () => any, timeout?: number) => void>((onClose, timeout = 5000) => {
    setModalDisplay(true);
    setTimeout(() => {
      setModalDisplay(false);
      onClose();
    }, timeout);
  }, [setModalDisplay]);

  const [post, setPost] = useState({});
  const database = useDatabase();
  const { next, unsubscribe } = useMemo(() => subscribePost(database), [database]);
  const getNextPost = useCallback(() => {
    setTimeout(() => {
      const newPost = next();
      setPost(newPost);
      estimateReadingTime(newPost.greetings, (estimatedSecond) => {
        const timeout = Math.max(estimatedSecond * 1000, 5000);
        openModalAndClose(getNextPost, timeout);
      });
    }, 3000);
  }, [openModalAndClose, next]);

  useEffect(() => {
    getNextPost();
    return () => {
      // unsubscribe post while component will unmount
      unsubscribe();
    };
  }, [getNextPost, unsubscribe]);

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
