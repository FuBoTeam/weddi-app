import React, { useCallback, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { logEvent } from 'firebase/analytics';
import './greeting.scss';

import { useAnalytics } from '../Provider/FirebaseApp';
import { GreetingForm } from './GreetingForm';
import Dialog from '../Board/Dialog';
import { getUpperUrl } from '../utils/urlHelpers';

export const Greeting: React.FC<RouteComponentProps> = (props) => {
  // TODO: remove this and find a proper filter way on GA
  const analytics = useAnalytics();
  useEffect(() => {
    logEvent(analytics, 'greeting_page_landed');
  }, [analytics]);

  const [modalDisplay, setModalDisplay] = useState(false);

  const [user, setUser] = useState({ name: '', greetings: '', imgUrl: '' });
  const onSubmit = useCallback((formData: WeddiApp.Post.UserInput) => {
    setUser(formData);
    setModalDisplay(true);
    setTimeout(() => { props.history.push(getUpperUrl(props.match.url)); }, 5000);
  }, [setUser, setModalDisplay, props.history, props.match.url]);

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
