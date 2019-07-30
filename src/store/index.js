import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';

import { persister, rehydrate } from './persister';

import rootSaga from '../sagas';
import { Reducers } from '../reducers';

const sagaMiddleware = createSagaMiddleware();

/*eslint-disable */
const composeSetup = process.env.NODE_ENV !== 'production' && typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
/*eslint-enable */


const configureStore = (history) => {
  const middlewares = [persister, sagaMiddleware, thunk, routerMiddleware(history)];
  const initialState = rehydrate(); 
  const store = createStore(Reducers, initialState, composeSetup(applyMiddleware(...middlewares)));
  sagaMiddleware.run(rootSaga);
  return store;
};

export default configureStore;