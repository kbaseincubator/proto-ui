import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { fetchProfileAPI } from '../utils/userInfo';
import { type } from 'os';
/*
 * action types
 */

export const FETCH_PROFILE_REQUEST = 'FETCH_PROFILE_REQUEST';
export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const FETCH_PROFILE_ERROR = 'FETCH_PROFILE_ERROR';

export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

/*
 * other constants
 */

export const VisibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE',
};

/*
 * action creators
 */

export function requestProfile() {
  return { type: 'FETCH_PROFILE_REQUEST', status: 'fetching' };
}
export function fetchErrorProfile(reponse: {}) {
  return { type: 'FETCH_PROFILE_ERROR', status: 'error', reponse: reponse };
}
export function loadProfile(reponse: {}) {
  return {
    type: 'FETCH_PROFILE_SUCCESS',
    status: 'fetching',
    reponse: reponse,
  };
}

/**
 * Asynchronous thunk action creators
 *
 */

/**
 *
 * @param username
 */
export function fetchProfile(username: string) {
  return async (dispatch: ThunkDispatch) => {
    dispatch(requestProfile());
    let res = await fetchProfileAPI(username);
    if (typeof res !== 'undefined') {
      dispatch(loadProfile(res));
    } else {
      dispatch(fetchErrorProfile(res));
    }
    console.log(res);
  };
}
