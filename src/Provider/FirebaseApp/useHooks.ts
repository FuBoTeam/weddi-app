import { useContext } from 'react';
import { FirebaseContext, FirebaseContextType } from './context';

export const useDatabase = (): FirebaseContextType['database'] => {
  return useContext(FirebaseContext).database;
};

export const useStorage = (): FirebaseContextType['storage'] => {
  return useContext(FirebaseContext).storage;
};

export const useAnalytics = (): FirebaseContextType['analytics'] => {
  return useContext(FirebaseContext).analytics;
};
