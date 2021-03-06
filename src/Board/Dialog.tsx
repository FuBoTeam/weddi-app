import React, { useState } from 'react';
import { preloadImage } from '../images/preloadImage';
import { User } from '../types/User';
import './board.scss';

interface DialogProps {
  user: User;
  show: boolean;
}

const Dialog = ({ user, show }: DialogProps) => {
  const [state, setState] = useState({ imgWidth: 0, imgHeight: 0});

  preloadImage(user.imgUrl, (img) => {
    setState(() => ({
      imgWidth: img.width || 0,
      imgHeight: img.height || 0,
    }));
  });

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
