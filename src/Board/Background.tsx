import React, { useState, useEffect } from 'react';
import { range } from '../utils/range';
import configService from '../services/configService';
import { combinationList, permutationList } from '../utils/random';
import { getImageUrl } from '../images';

import loadingIcon from '../images/loading.gif';
import './board.scss';

const TIME_FADE_OUT = 1000;
const TIME_FADE_IN = 1000;
const TIME_HIDDEN = 1500;
const TIME_UPDATE_BACKGROUND = 30 * 60 * 1000;

const BG_FADE_IN = 'BG_FADE_IN';
const BG_FADE_OUT = 'BG_FADE_OUT';
const BG_HIDDEN = 'BG_HIDDEN';
const BG_VISIBLE = 'BG_VISIBLE';

export const Background = () => {
  // get all image urls from api
  const allImgUrls = range(configService.config.img.totalImgs).map(k => getImageUrl(k));
  const bgImgUrls = combinationList(allImgUrls, configService.config.img.bgImgsShouldBePicked);
  const [isLoading, setIsLoading] = useState(true);
  const [bgState, setBgState] = useState(BG_HIDDEN);
  const [permutation, setPermutation] = useState(permutationList(bgImgUrls));

  useEffect(() => {
    // set loaded after background images are ready
    window.onload = () => {
      setIsLoading(false);
    };
  });

  useEffect(() => {
    if (bgState === BG_FADE_OUT) {
      setTimeout(() => {
        setBgState(BG_HIDDEN);
        setPermutation((permutation) => permutationList(permutation));
      }, TIME_FADE_OUT);
    } else if (bgState === BG_HIDDEN) {
      setTimeout(() => {
        setBgState(BG_FADE_IN);
      }, TIME_HIDDEN);
    } else if (bgState === BG_FADE_IN) {
      setTimeout(() => {
        setBgState(BG_VISIBLE);
      }, TIME_FADE_IN);
    } else if (bgState === BG_VISIBLE) {
      setTimeout(() => {
        setBgState(BG_FADE_OUT);
      }, TIME_UPDATE_BACKGROUND);
    }
  }, [bgState]);

  return (
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
              isLoading || bgState === BG_HIDDEN ? 'hidden' :
                bgState === BG_VISIBLE ? 'visible' :
                  bgState === BG_FADE_IN ? 'fade-in' :
                    bgState === BG_FADE_OUT ? 'fade-out' :
                      ''
            }
            src={bgImgUrl}
            alt=""
          />
        )
      }
    </div>
  );
};
