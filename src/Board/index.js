import React, { Component } from 'react';
import range from 'lodash/range';
import './board.css';
import loadingIcon from '../images/loading.gif';
import Dialog from './Dialog';

import Queue from './queue';
import Configs from '../configs';
import { combinationList, permutationList } from '../utils/random';
import { getImageUrl } from '../images';


import Api from '../api';

export default class Board extends Component {
  allImgUrls = range(Configs.getImgConfig().totalImgs).map(k => getImageUrl(k));
  bgImgUrls = combinationList(this.allImgUrls, Configs.getImgConfig().bgImgsShouldBePicked);
  bgImgUrls = permutationList([...this.bgImgUrls, ...this.bgImgUrls]);
  intervals = [];
  state = {
    isLoading: true,
    modalDisplay: false,
    user: {},
    bgImgUrls: this.bgImgUrls,
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

    setInterval(() => {
      this.setState({
        isBgSwitching: true,
      });
      setTimeout(() => {
        this.setState({
          bgImgUrls: permutationList(this.state.bgImgUrls),
        });
        setTimeout(() => {
          this.setState({
            isBgSwitching: false,
          })
        }, 1000);
      }, 1000);
    }, 5 * 60 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervals);
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
      <div className="container">
        {
          this.state.isLoading && <div className="loading">
            <img src={loadingIcon} alt="" />
            <span>Loading...</span>
          </div>
        }
        <section className="pic-container">
        {
          this.bgImgUrls.map((bgImgUrl, idx) => (
            <div key={`${bgImgUrl}_${idx}`} className={this.state.isLoading || this.state.isBgSwitching ? 'pic-block hidden' : 'pic-block visible'}>
              <img src={bgImgUrl} alt="" />
            </div>
          ))
        }
        </section>
        <Dialog user={this.state.user} show={this.state.modalDisplay} />
        <a className="message-link" href={`${this.props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
      </div>
    );
  }
}
