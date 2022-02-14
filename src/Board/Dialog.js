import React, { useState, useEffect, useRef } from 'react';
import './board.scss';

const Dialog = ({ user, show }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    // while image url changes set to loading
    if (user.imgUrl) {
      setLoaded(false);
    }
  }, [user.imgUrl]);

  const onLoad = () => {
    setLoaded(true);
  };

  const portraitImage = loaded && imgRef.current && imgRef.current.clientWidth < imgRef.current.clientHeight;

  return (
    <div className={`dialog ${(show && loaded) ? 'show-dialog' : ''}`}>
      <div className={`image-container ${portraitImage ? 'portrait' : ''}`}>
        <img ref={imgRef} className="user-image" src={user.imgUrl} alt="images" onLoad={onLoad} />
      </div>
      <div className="message">
        <h2>From {user.name}:</h2>
        <p>{user.greetings}</p>
      </div>
    </div>
  );
};

export default Dialog;
