import 'regenerator-runtime/runtime';

import { getToken } from '../auth';

export class ApiError extends Error {
  constructor(status, body) {
    super(`ApiError: ${status}. ${JSON.stringify(body)}`);
    this.status = status;
    this.body = body;
  }
}

export default function Api(state) {
  return {
    login,
  };

  function login(body) {
    return request('/sign_in', { body, method: 'post' });
  }

  function request(path, {
    method,
    headers,
    body,
    ...config
  }) {
    const BASE_URL = 'http://localhost:3000';
    if (method === 'GET' && body) {
      path = [path, toQuery(body)].join('?');
      body = undefined;
    } else {
      body = JSON.stringify(body);
    }
    return fetch(`${BASE_URL}${path}`, {
      method,
      body,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken(state)}`,
        ...headers,
      },
      ...config,
    }).then((response) => {
      if (!response.ok) { throw response; }
      return response.json();
    });
  }

  // TODO: use query-string
  function toQuery(obj) {
    if (!obj) { return ''; }
    return Object.entries(obj).map(([key, val]) => `${key}=${val}`).join('&');
  }

}