import { createContext } from 'react';
import firebase from 'firebase';

export interface FirebaseContextType {
  app: firebase.app.App;
  database: firebase.database.Database;
  storage: firebase.storage.Storage;
}

export const FirebaseContext = createContext<FirebaseContextType>({} as FirebaseContextType);
