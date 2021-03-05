import React, { useState, useEffect, useMemo } from 'react';
import { range } from '../utils/range';
import './board.scss';
import loadingIcon from '../images/loading.gif';
import Dialog from './Dialog';

import Queue from './queue';
import configService from '../services/configService';
import { combinationList, permutationList } from '../utils/random';
import { getImageUrl } from '../images';
import { preloadImage } from '../images/preloadImage';


import * as Api from '../api';

const Board = (props) => {
  // get all image urls from api
  const allImgUrls = range(configService.config.img.totalImgs).map(k => getImageUrl(k));
  const bgImgUrls = combinationList(allImgUrls, configService.config.img.bgImgsShouldBePicked);
  const [isLoading, setIsLoading] = useState(true);
  const [isBgSwitching, setIsBgSwitching] = useState(false);
  const [permutation, setPermutation] = useState(permutationList(bgImgUrls));

  useEffect(() => {
    // set loaded after background images are ready
    window.onload = () => {
      setIsLoading(false);
    };
  });

  useEffect(() => {
    // auto permutate background images
    const interval = setInterval(() => {
      setIsBgSwitching(true);
      setTimeout(() => {
        setPermutation((permutation) => permutationList(permutation));
        setTimeout(() => {
          setIsBgSwitching(false);
        }, 1000);
      }, 1000);
    }, 5 * 60 * 1000);
    return () => {
      clearInterval(interval);
    };
  });

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
          // preload dialog img and display in dialog
          preloadImage(user.imgUrl, displayAndHide);
        };
        showDialog(nextFeed);
        oldFeeds.push(nextFeed);
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
      <div className="container">
        {
          isLoading && <div className="loading">
            <img src={loadingIcon} alt="" />
            <span>Loading...</span>
          </div>
        }
        {
          permutation.map((bgImgUrl) =>
            <img
              key={bgImgUrl}
              className={
                isLoading || isBgSwitching ? 'hidden' : 'visible'
              }
              src={bgImgUrl}
              alt=""
            />
          )
        }
      </div>
      <Dialog user={user} show={modalDisplay} />
      <a className="message-link" href={`${props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
    </React.Fragment>
  );
};

export default Board;
