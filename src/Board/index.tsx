import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { logEvent } from 'firebase/analytics';
import './board.scss';

import { useAnalytics, useDatabase } from '../Provider/FirebaseApp';
import Dialog from './Dialog';
import { Background } from './Background';
import { subscribePost } from './subscribePost';
import { estimateReadingTime } from '../utils/estimateReadingTime';
import { sleep } from '../utils/sleep';

const Board: React.FC<RouteComponentProps> = (props) => {
  // TODO: remove this and find a proper filter way on GA
  const analytics = useAnalytics();
  useEffect(() => {
    logEvent(analytics, 'board_page_landed');
  }, [analytics]);

  const [modalDisplay, setModalDisplay] = useState(false);
  const [post, setPost] = useState({});
  const database = useDatabase();
  const { next, unsubscribe } = useMemo(() => subscribePost(database), [database]);
  const getNextPost = useCallback(async () => {
    let newPost: WeddiApp.Post.Data | null = null;
    while (newPost === null)
    {
      try {
        newPost = next();
      } catch (err) {
        await sleep(1000);
      }
    }
    setPost(newPost);
    const estimatedSecond = await estimateReadingTime(newPost.greetings);
    const timeout = Math.max(estimatedSecond * 1000, 5000);
    // show the modal and auto hide
    setModalDisplay(true);
    await sleep(timeout);
    setModalDisplay(false);
    // after modal hide wait a bit to get next post
    await sleep(3000);
    getNextPost();
  }, [next]);

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
