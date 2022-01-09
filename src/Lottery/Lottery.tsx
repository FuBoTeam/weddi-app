import React, { useCallback, useEffect, useState } from 'react';
import { listPosts } from '../api';
import { useDatabase } from '../Provider/FirebaseApp';
import { permutationList } from '../utils/random';
import './lottery.scss';

export const Lottery: React.FC = () => {
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

  const onFlipBtnClick = useCallback(() => {
    setRevealedIds(ids => {
      if (ids['*']) { return { '*': false }; }
      return { '*': true };
    });
  }, []);

  const onExpandBtnClick = useCallback(() => {
    setIsExpanding(expanding => !expanding);
    setRevealedIds({ '*': false });
  }, []);
  const shuffle = useCallback((counter: number): void => {
    if (counter > 0) {
      setIsShuffling(true);
      const timeout = setTimeout(() => {
        setPosts(posts => permutationList(posts));
        setIsShuffling(false);
        shuffle(counter - 1);
        clearTimeout(timeout);
      }, 1000);
    }
  }, []);
  const onShufflingBtnClick = useCallback(() => {
    shuffle(3);
  }, [shuffle]);
  const onResetBtnClick = useCallback(() => {
    setIsExpanding(true);
    setIsShuffling(false);
    setRevealedIds({ '*': true });
  }, []);

  // const Cards = posts.map((post, index) => (
  //   <li
  //     key={post.id}
  //     className={isShuffling ? 'flip-card card-deck' : 'flip-card card-grid'}
  //     onClick={() => setRevealedIds(ids => ({...ids, [index]: true}))}
  //   >
  //     <div className='flip-card-inner card'>
  //       <div className='flip-card-front'>
  //         {post.name}
  //       </div>
  //       <div className='flip-card-back'>
  //         {index + 1}
  //       </div>
  //     </div>
  //   </li>
  // ));
  const allCards = posts.map((post, index) => (
    <li key={post.id} className={`card card-k`}>
      <div className={`inner ${revealedIds['*'] || revealedIds[index] ? '' : 'flip-transition'}`}>
        <div className='front'>{post.name}</div>
        <div className='back'>{index + 1}</div>
      </div>
    </li>)
  );

  const stacks = [];
  while (allCards.length > 0) {
    const cards = allCards.splice(0, 4);
    stacks.push((
      <li key={`stack-${stacks.length}`} className={`stack stack-k`}>
        <ul className='cards-down'>
          {cards}
        </ul>
      </li>
    ));
  }

  return (
    <div className='container'>
      {/* <ul className={isShuffling ? 'card-stacks cards-deck' : 'card-stacks cards-grid'}>{Cards}</ul> */}
      <div>
        <button onClick={onExpandBtnClick}>Expand</button>
        <button onClick={onFlipBtnClick}>Flip</button>
        <button onClick={onShufflingBtnClick}>Shuffle</button>
        <button onClick={onResetBtnClick}>reset</button>
      </div>
      <ul className={`card-stacks ${isExpanding ? 'expand-transition' : ''} ${isShuffling ? 'shuffle-transition' : ''}`}>{stacks}</ul>
    </div>
  );
};
