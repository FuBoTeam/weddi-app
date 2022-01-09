import React, { useState } from 'react';
import './greeting.scss';

import { GreetingForm } from './GreetingForm';
import Dialog from '../Board/Dialog';
import { getUpperUrl } from '../utils/urlHelpers';

const Greeting = (props) => {
  const [modalDisplay, setModalDisplay] = useState(false);

  const [user, setUser] = useState({ name: '', greetings: '', imgUrl: '' });
  const onSubmit = (formData) => {
    setUser(formData);
    setModalDisplay(true);
    setTimeout(() => { props.history.push(getUpperUrl()); }, 5000);
  };

  return (
    <div className="greeting">
      <header className="greeting-header">
        <h1 className="greeting-title orange-font">祝福留言版</h1>
      </header>
      {!modalDisplay && <GreetingForm onSubmit={onSubmit} />}
      {!modalDisplay && <a className="link orange-font" href={getUpperUrl(props.match.url)}>去照片牆瞧瞧</a>}
      <Dialog user={user} show={modalDisplay} />
    </div>
  );
};

export default Greeting;
