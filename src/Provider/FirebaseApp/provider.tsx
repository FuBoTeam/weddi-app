import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import React, { useMemo } from 'react';
import { FirebaseContext } from './context';
export interface Props {
  firebaseConfig?: Record<string, any>;
  appName?: string;
}

const DEFAULT_APP_NAME = '[DEFAULT]';

const shallowEqual = (a: Record<string, any>, b: Record<string, any>): boolean =>
  a === b || [...Object.keys(a), ...Object.keys(b)].every(key => a[key] === b[key]);

export const FirebaseAppProvider = (props: Props & { [key: string]: unknown }) => {
  const { firebaseConfig, appName } = props;
  const value = useMemo(() => {
    if (!firebaseConfig) {
      throw new Error('No config provided');
    }
    const existingApp = firebase.apps.find(app => app.name === (appName || DEFAULT_APP_NAME));
    if (existingApp && shallowEqual(existingApp.options, firebaseConfig)) {
      return {
        app: existingApp,
        storage: firebase.storage(existingApp),
        database: firebase.database(existingApp),
      };
    }

    const app = firebase.initializeApp(firebaseConfig, appName);
    const storage = firebase.storage();
    const database = firebase.database();
    return {
      app,
      storage,
      database
    };
  }, [firebaseConfig, appName]);
  return (
    <FirebaseContext.Provider value={value} {...props} />
  );
};
