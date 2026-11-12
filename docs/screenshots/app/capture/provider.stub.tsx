// Used only in the temp capture copy. No Firebase SDK is initialized.
import React from 'react';
import { FirebaseContext, FirebaseContextType } from './context';

const value = {} as FirebaseContextType;
export const FirebaseAppProvider: React.FC = ({ children }) => (
  <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
);
