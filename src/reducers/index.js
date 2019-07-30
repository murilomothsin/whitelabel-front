import { combineReducers } from 'redux';
import { authReducer } from "../modules/auth"

export const Reducers = combineReducers({
  auth: authReducer,
});
