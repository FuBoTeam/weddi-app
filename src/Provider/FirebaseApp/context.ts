import { createContext } from 'react';
import { FirebaseApp } from 'firebase/app';
import { FirebaseStorage } from 'firebase/storage';
import { Database } from 'firebase/database';
import { Analytics } from 'firebase/analytics';

export interface FirebaseContextType {
  app: FirebaseApp;
  database: Database;
  storage: FirebaseStorage;
  analytics: Analytics;
}

export const FirebaseContext = createContext<FirebaseContextType>({} as FirebaseContextType);
