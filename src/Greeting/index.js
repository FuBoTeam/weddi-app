import React, { useState } from 'react';
import './greeting.scss';

import { GreetingForm } from './GreetingForm';
import Dialog from '../Board/Dialog';

const Greeting = (props) => {
  const [modalDisplay, setModalDisplay] = useState(false);
  const getUpperUrl = () => {
    const matchUrl = props.match.url;
    const paths = matchUrl.split('/');
    paths.pop();
    return paths.join('/');
  };

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
      {!modalDisplay && <a className="link orange-font" href={getUpperUrl()}>去照片牆瞧瞧</a>}
      <Dialog user={user} show={modalDisplay} />
    </div>
  );
};

export default Greeting;
