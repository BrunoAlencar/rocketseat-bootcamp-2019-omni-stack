import { takeLatest, call, put, all } from 'redux-saga/effects';

import api from '~/services/api';
import { signInSuccess } from './actions';
import history from '~/services/history';

export function* signIn({ payload }) {
  const { email, password } = payload;
  console.tron.log('oi 1');
  const response = yield call(api.post, 'sessions', {
    email,
    password,
  });
  console.tron.log('oi 2');
  const { token, user } = response.data;

  if (!user.provider) {
    console.tron.error('Usuário não é prestador');
    return null;
  }

  yield put(signInSuccess(token, user));
  return history.push('/dashboard');
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
