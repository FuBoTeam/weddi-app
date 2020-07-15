import React, { useState, useEffect } from 'react';
import range from 'lodash/range';
import './board.scss';
import loadingIcon from '../images/loading.gif';
import Dialog from './Dialog';

import Queue from './queue';
import Config from '../config';
import { combinationList, permutationList } from '../utils/random';
import { preloadImage, getImageUrl } from '../images';


import * as Api from '../api';
import { RouteComponentProps } from 'react-router';

const Board = (props: RouteComponentProps) => {
  const allImgUrls = range(Config.img.totalImgs).map(k => getImageUrl(k));
  const bgImgUrls = combinationList(allImgUrls, Config.img.bgImgsShouldBePicked);
  const intervals: NodeJS.Timeout[] = [];
  const [isLoading, setIsLoading] = useState(true);
  const [modalDisplay, setModalDisplay] = useState(false);
  const [user, setUser] = useState({});
  const [permutation, setPermutation] = useState(permutationList(range(bgImgUrls.length)));
  const [isBgSwitching, setIsBgSwitching] = useState(false);

  const newFeeds = new Queue<{ imgUrl: string; name: string; greetings: string }>();
  const oldFeeds = new Queue<{ imgUrl: string; name: string; greetings: string }>();

  const showDialog = (user: { imgUrl: string; name: string; greetings: string }) => {
    setUser(user);
    const displayAndHide = () => {
      setModalDisplay(true);

      setTimeout(() => {
        setModalDisplay(false);
      }, 5000);
    };
    // preload dialog img and display in dialog
    preloadImage(user.imgUrl, displayAndHide);
  };

  const pickUpFeed = (newFeeds: Queue<{ imgUrl: string; name: string; greetings: string }>, oldFeeds: Queue<{ imgUrl: string; name: string; greetings: string }>) => {
    const nextFeed = newFeeds.isEmpty() ? oldFeeds.deQueue() : newFeeds.deQueue();
    showDialog(nextFeed);
    oldFeeds.enQueue(nextFeed);
  };

  useEffect(() => {
    Api.onNewPost((feed: { imgUrl: string; name: string; greetings: string }) => newFeeds.enQueue(feed));

    window.onload = () => {
      setIsLoading(isLoading => !isLoading);

      intervals.push(setInterval(() => {
        pickUpFeed(newFeeds, oldFeeds);
      }, 8000));
    };

    // Auto refresh background images
    intervals.push(
      setInterval(() => {
        setIsBgSwitching(true);
        setTimeout(() => {
          setPermutation(permutationList(range(bgImgUrls.length)));
          setTimeout(() => {
            setIsBgSwitching(false);
          }, 1000);
        }, 1000);
      }, 5 * 60 * 1000)
    );
    return () => {
      intervals.forEach(clearInterval);
    };
  });

  return (
    <React.Fragment>
      <div className="container">
        {
          isLoading && <div className="loading">
            <img src={loadingIcon} alt="" />
            <span>Loading...</span>
          </div>
        }
        {
          bgImgUrls.map((bgImgUrl, idx) =>
            <img
              key={bgImgUrl}
              className={
                isLoading || isBgSwitching ? 'hidden' : 'visible'
              }
              style={{order: permutation[idx]}}
              src={bgImgUrl}
              alt=""
            />
          )
        }
      </div>
      <Dialog user={user as { imgUrl: string; name: string; greetings: string }} show={modalDisplay} />
      <a className="message-link" href={`${props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
    </React.Fragment>
  );
};

export default Board;
