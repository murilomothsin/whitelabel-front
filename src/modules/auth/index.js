import Api, { ApiError } from '../api';

import { takeLatest, call, put, select, apply } from 'redux-saga/effects';

export const LOGIN_SUBMIT = 'LOGIN_SUBMIT';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const SET_SESSION = 'SET_SESSION';
export const LOGOUT = 'LOGOUT';

export const getToken = state => state.auth.id && state.auth.token;
export const getCompany = state => state.auth.id && state.auth.company;
export const getId = state => state.auth.id;

const initialSate = {
  id: null,
  username: null,
  token: null,
  company: null,
  expiration: null,
  redirectToReferrer: false,
  errors: {},
}

export const authReducer = (state = initialSate, action) => {
  if (!action) return state;

  switch (action.type) {
    case SET_SESSION:
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        redirectToReferrer: true,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        errors: action.payload,
      }
    case LOGOUT:
      return initialSate;
    default:
      return state;
  }
}

// Triggered whenever the user clicks the login submit button
export function loginSubmit(data) {
  return {
    type: LOGIN_SUBMIT,
    payload: data
  };
}

// triggered when the login has succeded
export function loginSuccess(data) {
  return {
    type: LOGIN_SUCCESS,
    payload: data
  };
}

export function setSession(data) {
  return {
    type: SET_SESSION,
    payload: data
  };
}

// triggered when the login failed
export function loginError(errors) {
  return {
    type: LOGIN_ERROR,
    error: true,
    payload: errors
  };
}

// triggered to logout the user
export function logout() {
  return {
    type: LOGOUT
  };
}

function* api(method, ...args) {
  try {
    const apiInstance = Api(yield select());
    return yield apply(apiInstance, method, args);
  } catch (err) {
    const body = yield err.json();
    throw new ApiError(err.status, body);
  }
}

/** saga worker that is responsible for the side effects */
function* handleLogin(action) {
  try {
    let data = yield call(api, 'login', action.payload);
    yield put(loginSuccess(data))
  } catch (e) {
    yield put(loginError(e.body))
  }
}

// TODO: Find a better way to secure all sagas
const safe = (saga, ...args) => function* (action) {
  try {
    yield call(saga, ...args, action);
  } catch (err) {
    console.error(err);
  }
};

/**
 * saga watcher that is triggered when dispatching action of type
 * 'LOGIN_WATCHER'
 */
export function* authSaga() {
  yield takeLatest(LOGIN_SUBMIT, safe(handleLogin));
}