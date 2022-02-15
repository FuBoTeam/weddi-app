import React, { useState, useEffect } from 'react';
import { preloadImageAsync } from '../../images/preloadImage';
import { sleep } from '../../utils/sleep';
import './dialog.scss';

interface Props {
  post: WeddiApp.Post.UserInput;
  show: boolean;
  onReady?: () => void;
}

const Dialog: React.FC<Props> = ({ post: user, show, onReady }) => {
  const [loaded, setLoaded] = useState(false);
  const [imageDimension, setImageDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // while image url changes set to loading
    if (user.imgUrl) {
      setLoaded(false);
      preloadImageAsync(user.imgUrl).then((img) => {
        setLoaded(true);
        setImageDimension({ width: img.width, height: img.height });
      });
    }
  }, [user.imgUrl]);

  // while image is loaded and message moved to the position then fire onReady
  useEffect(() => {
    if (loaded) {
      // wait 1s for message to move in
      sleep(1000).then(() => {
        if (typeof onReady === 'function') {
          onReady();
        }
      });
    }
  }, [loaded, onReady]);

  const portraitImage = loaded && imageDimension.width < imageDimension.height;

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
