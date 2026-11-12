import React, { useState, useEffect, useCallback } from 'react';
import { RouteComponentProps } from 'react-router';
import { logEvent } from 'firebase/analytics';
import './board.scss';

import { useAnalytics, useDatabase } from '../Provider/FirebaseApp';
import Dialog from './Dialog/Dialog';
import Background from './Background/Background';
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
  const [post, setPost] = useState<WeddiApp.Post.Data | null>(null);
  const [ready, setReady] = useState(false);
  const [queue, setQueue] = useState<ReturnType<typeof subscribePost> | null>(null);
  const database = useDatabase();
  const eventUrl = props.match.url.replace(/\/$/, '');

  useEffect(() => {
    const subscription = subscribePost(database, id => {
      setPost(current => current?.id === id ? null : current);
    });
    setQueue(subscription);
    return subscription.unsubscribe;
  }, [database]);

  useEffect(() => {
    if (!queue || post) return;
    let active = true;
    const showNext = async () => {
      while (active) {
        try {
          const nextPost = queue.next();
          setReady(false);
          setModalDisplay(true);
          setPost(nextPost);
          return;
        } catch (err) {
          await sleep(1000);
        }
      }
    };
    showNext();
    return () => { active = false; };
  }, [queue, post]);

  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (!post || !ready) return;
    let active = true;
    const advance = async () => {
      const estimatedSecond = await estimateReadingTime(post.greetings);
      await sleep(Math.max(estimatedSecond * 1000, 5000));
      if (!active) return;
      setModalDisplay(false);
      await sleep(3000);
      if (active) setPost(null);
    };
    advance();
    return () => { active = false; };
  }, [post, ready]);

  return (
    <React.Fragment>
      <Background />
      {post && <Dialog post={post} show={modalDisplay} onReady={onReady} />}
      <a className="message-link" href={`${eventUrl}/greetings`}>&lt;&lt; 留下你的祝福</a>
      <a className="game-link" href={`${eventUrl}/lottery`}>去遊戲頁</a>
    </React.Fragment>
  );
};

export default Board;
