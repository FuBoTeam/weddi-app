import { createContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { FirebaseStorage } from 'firebase/storage';
import { Database } from 'firebase/database';

export interface FirebaseContextType {
  app: FirebaseApp;
  database: Database;
  storage: FirebaseStorage;
}

export const FirebaseContext = createContext<FirebaseContextType>({} as FirebaseContextType);
