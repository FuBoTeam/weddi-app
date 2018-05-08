import React, { Component } from 'react';
import './board.css';

export default class Dialog extends Component {

  render() {
    const { user, show } = this.props;

    return (
      <div className={show ? 'dialog show-dialog' : 'dialog'}>
        <div className="modal-sm">
          <div className="image-container">
            <img className="user-image" src={user.imgUrl} alt="images" />
          </div>
          <div className="message">
            <h2>@ {user.name}</h2>
            <p>{user.greetings}</p>
          </div>
        </div>
      </div>
    );
  }
}
