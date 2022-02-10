import React, { useState, useEffect, useRef } from 'react';
import './board.scss';

const Dialog = ({ user, show }) => {
  const [loading, setLoading] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    // while image url changes set to loading
    if (user.imgUrl) {
      setLoading(true);
    }
  }, [user.imgUrl]);

  const onLoad = () => {
    setLoading(false);
  };

  const mayMobile = window.innerWidth < 1000;
  const verticalImg = !loading && imgRef.current && imgRef.current.clientWidth < imgRef.current.clientHeight;
  const modalStyle = (!loading && mayMobile && verticalImg) ? { margin: '10% 20% 50px' } : {};

  return (
    <div className={`dialog ${show && !loading ? "show-dialog" : ""}`}>
      <div className="modal-sm" style={modalStyle}>
        <div className="image-container">
          <img ref={imgRef} className="user-image" src={user.imgUrl} alt="images" onLoad={onLoad} />
        </div>
        <div className="message">
          <h2>From {user.name}:</h2>
          <p>{user.greetings}</p>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
