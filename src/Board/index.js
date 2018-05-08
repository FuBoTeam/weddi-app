import React, { Component } from 'react';
import './board.css';
import loadingIcon from '../images/loading.gif';
import Dialog from './Dialog';
import Queue from './queue';
import { combination } from '../utils/random';

import Api from '../api';

const backgrounds = combination(114, 40);
const weddingImgUrl = (number) => `https://storage.googleapis.com/wedding_iota/${number}_small.jpg`;

export default class Board extends Component {
  state = {
    isLoading: true,
    modalDisplay: false,
    user: {},
  }

  componentDidMount() {
    const newFeeds = new Queue();
    const oldFeeds = new Queue();

    Api.getPost((user) => newFeeds.push(user));

    window.onload = () => {
      this.setState(({ isLoading }) => ({ isLoading: !isLoading }))

      setInterval(() => {
        this.pickUpFeed(newFeeds, oldFeeds);
      }, 5000);
    };
  }

  showDialog = (user) => {
    this.setState(() => ({ modalDisplay: true, user }));

    setTimeout(() => {
      this.setState(() => ({ modalDisplay: false }));
    }, 3000);
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
          backgrounds.map((background, index) => (
            <div key={index} className={this.state.isLoading ? 'pic-block hidden' : 'pic-block'}>
              <img src={weddingImgUrl(background)} alt="" />
            </div>
          ))
        }
        </section>
        <Dialog user={this.state.user} show={this.state.modalDisplay} />
      </div>
    );
  }
}
