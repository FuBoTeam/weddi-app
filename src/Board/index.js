import React, { Component } from 'react';
import range from 'lodash/range';
import './board.css';
import loadingIcon from '../images/loading.gif';
import Dialog from './Dialog';

import Queue from './queue';
import Config from '../config';
import { combinationList, permutationList } from '../utils/random';
import { getImageUrl } from '../images';


import * as Api from '../api';

export default class Board extends Component {
  allImgUrls = range(Config.img.totalImgs).map(k => getImageUrl(k));
  bgImgUrls = combinationList(this.allImgUrls, Config.img.bgImgsShouldBePicked);
  intervals = [];
  state = {
    isLoading: true,
    modalDisplay: false,
    user: {},
    permutation: permutationList(range(this.bgImgUrls.length)),
    isBgSwitching: false,
  };

  componentDidMount() {
    const newFeeds = new Queue();
    const oldFeeds = new Queue();

    Api.getPost((user) => newFeeds.push(user));

    window.onload = () => {
      this.setState(({ isLoading }) => ({ isLoading: !isLoading }))

      this.intervals.push(setInterval(() => {
        this.pickUpFeed(newFeeds, oldFeeds);
      }, 8000));
    };

    // Auto refresh background images
    this.intervals.push(
        setInterval(() => {
        this.setState({
          isBgSwitching: true,
        });
        setTimeout(() => {
          this.setState({
            permutation: permutationList(range(this.bgImgUrls.length)),
          });
          setTimeout(() => {
            this.setState({
              isBgSwitching: false,
            })
          }, 1000);
        }, 1000);
      }, 5 * 60 * 1000)
    );
  }

  componentWillUnmount() {
    this.intervals.forEach(clearInterval);
  }

  showDialog = (user) => {
    this.setState(() => ({ modalDisplay: true, user: Object.assign({}, user) }));

    setTimeout(() => {
      this.setState(() => ({ modalDisplay: false }));
    }, 5000);
  }

  pickUpFeed = (newFeeds, oldFeeds) => {
    const nextFeed = newFeeds.isEmpty() ? oldFeeds.pop() : newFeeds.pop();
    this.showDialog(nextFeed);
    oldFeeds.push(nextFeed);
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          {
            this.state.isLoading && <div className="loading">
              <img src={loadingIcon} alt="" />
              <span>Loading...</span>
            </div>
          }
          {
            this.bgImgUrls.map((bgImgUrl, idx) =>
              <img
                key={bgImgUrl}
                className={
                  this.state.isLoading || this.state.isBgSwitching ? 'hidden' : 'visible'
                }
                style={{order: this.state.permutation[idx]}}
                src={bgImgUrl}
                alt=""
              />
            )
          }
        </div>
        <Dialog user={this.state.user} show={this.state.modalDisplay} />
        <a className="message-link" href={`${this.props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
      </React.Fragment>
    );
  }
}
