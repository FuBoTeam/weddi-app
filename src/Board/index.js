import React, { Component } from 'react';
import './board.css';
import loadingIcon from '../images/loading.gif';
import Dialog from './Dialog';

import Queue from './queue';
import Configs from '../configs';
import { combination } from '../utils/random';
import { getImageUrl } from '../images';


import Api from '../api';

export default class Board extends Component {
  interval = null;
  state = {
    isLoading: true,
    modalDisplay: false,
    user: {},
  };
  totalImgs = Configs.getImgConfig().totalImgs;
  bgImgsShouldBePicked = Configs.getImgConfig().bgImgsShouldBePicked;
  backgrounds = combination(this.totalImgs, this.bgImgsShouldBePicked);


  componentDidMount() {
    const newFeeds = new Queue();
    const oldFeeds = new Queue();

    Api.getPost((user) => newFeeds.push(user));

    window.onload = () => {
      this.setState(({ isLoading }) => ({ isLoading: !isLoading }))

      this.interval = setInterval(() => {
        this.pickUpFeed(newFeeds, oldFeeds);
      }, 8000);
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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
          this.backgrounds.map((background, index) => (
            <div key={index} className={this.state.isLoading ? 'pic-block hidden' : 'pic-block'}>
              <img src={getImageUrl(background)} alt="" />
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
