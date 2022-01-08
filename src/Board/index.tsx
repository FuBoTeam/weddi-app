import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { useDatabase } from '../Provider/FirebaseApp';
import './board.scss';
import Dialog from './Dialog';
import { Background } from './Background';
import { subscribePost } from './subscribePost';

const Board: React.FC<RouteComponentProps> = (props) => {
  const [modalDisplay, setModalDisplay] = useState(false);
  const [user, setUser] = useState({});
  const database = useDatabase();

  useEffect(() => {
    // subscribe post while component did mount
    const unsubscribe = subscribePost(database)((user) => {
      if (user) {
        setUser(user);
        const displayAndHide = () => {
          setModalDisplay(true);

          setTimeout(() => {
            setModalDisplay(false);
          }, 5000);
        };
        displayAndHide();
      }
    });
    return () => {
      // unsubscribe post while component will unmount
      unsubscribe();
    };
  }, [database]);

  return (
    <React.Fragment>
      <Background />
      <Dialog user={user} show={modalDisplay} />
      <a className="message-link" href={`${props.match.url}/greetings`}>&lt;&lt; 留下你的祝福</a>
    </React.Fragment>
  );
};

export default Board;
