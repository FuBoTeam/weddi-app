import React, { useState, useEffect } from 'react';
import { preloadImageAsync } from '../../images/preloadImage';
import './dialog.scss';

interface Props {
  user: WeddiApp.Post.UserInput;
  show: boolean;
}

const Dialog: React.FC<Props> = ({ user, show }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageDimension, setImageDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // while image url changes set to loading
    if (user.imgUrl) {
      preloadImageAsync(user.imgUrl).then((img) => {
        setLoaded(true);
        setImageDimension({ width: img.width, height: img.height });
      });
    }
  }, [user.imgUrl]);

  const portraitImage = loaded && imageDimension.width < imageDimension.height;
  console.log(imageDimension);

  return (
    <div className={`dialog ${(show && loaded) ? 'show-dialog' : ''}`}>
      <div className={`image-container ${portraitImage ? 'portrait' : 'landscape'}`}>
        <img src={user.imgUrl} alt="images" />
      </div>
      <div className="message">
        <h2>From {user.name}:</h2>
        <p>{user.greetings}</p>
      </div>
    </div>
  );
};

export default Dialog;
