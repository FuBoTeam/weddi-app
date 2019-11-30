import React, { Component } from 'react';
import './board.scss';

export default class Dialog extends Component {
  constructor() {
    super();
    this.img =  new Image();
    const t = this;
    this.img.onload = function() {
      t.setState(() => ({
        imgWidth: this.width || 0,
        imgHeight: this.height || 0,
      }));
    };
    this.state = {
      imgWidth: 0,
      imgHeight: 0,
    };
  }

  componentDidUpdate() {
    this.img.src = this.props.show ? this.props.user.imgUrl : '';
  }

  render() {
    const { user, show } = this.props;

    const mayMobile = window.innerWidth < 1000;
    const verticalImg = this.state.imgWidth < this.state.imgHeight;
    const modalStyle = (show && mayMobile && verticalImg) ? { margin: '10% 20% 50px' } : {};

    return (
      <div className={show ? 'dialog show-dialog' : 'dialog'}>
        <div className="modal-sm" style={modalStyle}>
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
