import React, { useState, useEffect } from 'react';
import loadingIcon from '../images/loading.gif';
import './board.scss';

import { useStorage } from '../Provider/FirebaseApp';
import configService from '../services/configService';
import { listRandomKImages } from '../api';
import { permutationList } from '../utils/random';
import { preloadImageAsync } from '../images/preloadImage';

const TIME_FADE_OUT = 1000;
const TIME_FADE_IN = 1000;
const TIME_HIDDEN = 1500;
const TIME_UPDATE_BACKGROUND = 30 * 60 * 1000;

enum BG_STATE {
  BG_FADE_IN = 'BG_FADE_IN',
  BG_FADE_OUT = 'BG_FADE_OUT',
  BG_HIDDEN = 'BG_HIDDEN',
  BG_VISIBLE = 'BG_VISIBLE',
}

export const Background = () => {
  const storage = useStorage();
  const [isLoading, setIsLoading] = useState(true);
  const [bgState, setBgState] = useState(BG_STATE.BG_HIDDEN);
  const [permutation, setPermutation] = useState<string[]>([]);

  useEffect(() => {
    if (isLoading) {
      listRandomKImages(storage, configService.config.img.bgImgsShouldBePicked).then(imgUrls => {
        Promise.all(imgUrls.map(preloadImageAsync)).then(() => setIsLoading(false));
        setPermutation(permutationList(imgUrls));
      });
    }
  }, [storage, isLoading]);

  useEffect(() => {
    switch(bgState) {
      case BG_STATE.BG_FADE_OUT: {
        setTimeout(() => {
          setBgState(BG_STATE.BG_HIDDEN);
          setPermutation((permutation) => permutationList(permutation));
        }, TIME_FADE_OUT);
        break;
      }
      case BG_STATE.BG_HIDDEN: {
        setTimeout(() => {
          setBgState(BG_STATE.BG_FADE_IN);
        }, TIME_HIDDEN);
        break;
      }
      case BG_STATE.BG_FADE_IN: {
        setTimeout(() => {
          setBgState(BG_STATE.BG_VISIBLE);
        }, TIME_FADE_IN);
        break;
      }
      case BG_STATE.BG_VISIBLE: {
        setTimeout(() => {
          setBgState(BG_STATE.BG_FADE_OUT);
        }, TIME_UPDATE_BACKGROUND);
        break;
      }
      default: {
        break;
      }
    }
  }, [bgState]);

  return (
    <div className="container">
      {
        isLoading && (
          <div className="loading">
            <img src={loadingIcon} alt="" />
            <span>Loading...</span>
          </div>
        )
      }
      {
        permutation.map((bgImgUrl) =>
          <img
            key={bgImgUrl}
            className={
              isLoading || bgState === BG_STATE.BG_HIDDEN ? 'hidden' :
                bgState === BG_STATE.BG_VISIBLE ? 'visible' :
                  bgState === BG_STATE.BG_FADE_IN ? 'fade-in' :
                    bgState === BG_STATE.BG_FADE_OUT ? 'fade-out' :
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
