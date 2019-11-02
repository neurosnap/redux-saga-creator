import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, take } from 'redux-saga/effects';
import sagaCreator from './index';

function* login() {
  console.log('login');
}

function* logout() {
  console.log('logout');
  throw new Error('something bad');
}

function* onAuth(...params: any[]) {
  console.log(params);
  while (true) {
    yield take('LOGIN');
    yield call(login);
    yield take('LOGOUT');
    yield call(logout);
  }
}

const sagas = {
  onAuth,
  some: () => {
    console.log('should call');
  },
};

const onError = (err: Error) => {
  console.log('track saga errors');
  console.log(err);
};
const rootSaga = sagaCreator(sagas, onError);
// $ExpectType (...options: any[]) => Generator<AllEffect, void, unknown>
rootSaga;

const sagaMiddleware = createSagaMiddleware();
const store = createStore(() => {}, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga, 'more', 'data');

store.dispatch({ type: 'LOGIN' });
setTimeout(() => {
  store.dispatch({ type: 'LOGOUT' });
  setTimeout(() => {
    store.dispatch({ type: 'LOGIN' });
    store.dispatch({ type: 'LOGOUT' });
  }, 200);
}, 200);
