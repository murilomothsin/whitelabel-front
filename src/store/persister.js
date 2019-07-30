import {
  LOGIN_SUCCESS,
  LOGOUT,
} from '../modules/auth';

const storageKey = 'store-whitelabel';

export const persister = ({ getState }) => next => (action) => {
  const result = next(action);

  if ([LOGIN_SUCCESS, LOGOUT].includes(action.type)) {
    const { auth } = getState();
    localStorage.setItem(storageKey, JSON.stringify({ auth }));
  }

  return result;
};

export const rehydrate = () => {
  const persisted = localStorage.getItem(storageKey);
  return (persisted && JSON.parse(persisted)) || {};
};
