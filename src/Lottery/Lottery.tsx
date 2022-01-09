import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { listPosts } from '../api';
import { useDatabase } from '../Provider/FirebaseApp';
import { permutationList } from '../utils/random';
import './lottery.scss';

enum Stage {
  Loaded,
  Start,
  Flipped,
  Stacked,
  Shuffling,
  Shuffled,
  Ready,
}

const getUpperUrl = (matchUrl: string): string => {
  const paths = matchUrl.split('/');
  paths.pop();
  return paths.join('/');
};

export const Lottery: React.FC<RouteComponentProps> = (props) => {
  const database = useDatabase();
  const [posts, setPosts] = useState<WeddiApp.Post.Data[]>([]);

  useEffect(() => {
    listPosts(database)(true).then(postsDictionary => {
      if (postsDictionary === null) {
        // TODO: enable retry
        return;
      }
      const posts = Object.keys(postsDictionary).map(key => postsDictionary[key]);
      const shuffledPosts = permutationList(posts);
      setPosts(shuffledPosts);
    });
  }, [database]);

  const [isExpanding, setIsExpanding] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({ '*': true });

  const onToggleFlipAll = useCallback(() => {
    setRevealedIds(ids => {
      if (ids['*']) { return { '*': false }; }
      return { '*': true };
    });
  }, []);
  const onFlipOne = useCallback((index: number) => {
    setRevealedIds(ids => {
      return {
        ...ids,
        [index]: true,
      };
    });
  }, []);

  const onToggleExpand = useCallback(() => {
    setIsExpanding(expanding => !expanding);
  }, []);
  const onToggleShuffle = useCallback((callback = null) => {
    setIsShuffling(true);
    const timeout = setTimeout(() => {
      setPosts(posts => permutationList(posts));
      setIsShuffling(false);
      clearTimeout(timeout);
      if (callback) {
        callback();
      }
    }, 1200 * 3);
  }, []);

  const [stage, setStage] = useState<Stage>(Stage.Loaded);
  useEffect(() => {
    switch(stage) {
      case Stage.Start: {
        onToggleFlipAll();
        setStage(Stage.Flipped);
        return;
      }
      case Stage.Flipped: {
        onToggleExpand();
        setStage(Stage.Stacked);
        return;
      }
      case Stage.Stacked: {
        onToggleShuffle(() => setStage(Stage.Shuffled));
        setStage(Stage.Shuffling);
        return;
      }
      case Stage.Shuffled: {
        onToggleExpand();
        setStage(Stage.Ready);
        return;
      }
    }
  }, [stage, onToggleFlipAll, onToggleExpand, onToggleShuffle]);

  const onGoBtnClick = useCallback(() => {
    if (stage === Stage.Loaded) {
      setStage(Stage.Start);
    }
  }, [stage]);

  const onResetBtnClick = useCallback(() => {
    setIsExpanding(true);
    setIsShuffling(false);
    setRevealedIds({ '*': true });
    setStage(Stage.Loaded);
  }, [setIsExpanding, setIsShuffling, setRevealedIds, setStage]);

  const allCards = posts.map((post, index) => (
    <li key={post.id} className="card" onClick={() => onFlipOne(index)}>
      <div className={`inner ${revealedIds['*'] || revealedIds[index] ? '' : 'flip-transition'}`}>
        <div className="front">{post.name}</div>
        <div className="back">{isExpanding ? index + 1 : ''}</div>
      </div>
    </li>)
  );

  const size = Math.min(10, Math.floor(Math.sqrt(allCards.length)));

  const stacks = [];
  while (allCards.length > 0) {
    const cards = allCards.splice(0, size);
    stacks.push((
      <li key={`stack-${stacks.length}`} className="stack">
        <ul className="cards-down">
          {cards}
        </ul>
      </li>
    ));
  }

  return (
    <div className="container">
      <div className="lottery-btns">
        <button onClick={onGoBtnClick}>洗牌</button>
        <button onClick={onResetBtnClick}>重置</button>
      </div>
      <ul className={`card-stacks ${isExpanding ? 'expand-transition' : ''} ${isShuffling ? 'shuffle-transition' : ''}`}>{stacks}</ul>
      <a className="home-link" href={getUpperUrl(props.match.url)}>回首頁</a>
    </div>
  );
};
