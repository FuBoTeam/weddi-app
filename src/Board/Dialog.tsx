import React, { useState, useEffect } from 'react';
import './board.scss';
import { Feed } from './type';

const Dialog = (props: { user: Feed; show: boolean }) => {
  const [state, setState] = useState({ imgWidth: 0, imgHeight: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = function() {
      setState(() => ({
        imgWidth: img.width || 0,
        imgHeight: img.height || 0,
      }));
    };
    img.src = props.show ? props.user.imgUrl : '';
    return () => {
      img.src = '';
    };
  }, [props.show, props.user.imgUrl]);

  const { user, show } = props;

  const mayMobile = window.innerWidth < 1000;
  const verticalImg = state.imgWidth < state.imgHeight;
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
};

export default Dialog;
