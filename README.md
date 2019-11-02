# Redux Saga Creator

Create a fault-tolerant root saga from an object of sagas.

Inspiration from
[this](https://redux-saga.js.org/docs/advanced/RootSaga.html#keeping-everything-alive)post.

## Features

- Creates a root saga based on an object where its values are sagas to be
  initiated on store creation.
- Handles sagas from crashing all other sagas
- Automatically restarts sagas that crash

## Usage

```js
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, take } from 'redux-saga/effects';

import sagaCreator from 'redux-saga-creator';

function* login() {
  console.log('login');
}

// an effect that demonstrates what happens when there is an error in a saga
function* logout() {
  console.log('logout');
  throw new Error('something bad');
}

// testing to make sure sagas work properly
function* onAuth(...params: any[]) {
  console.log(params);
  while (true) {
    yield take('LOGIN');
    yield call(login);
    yield take('LOGOUT');
    yield call(logout);
  }
}

// object that contains sagas
const sagas = {
  onAuth,
  some: () => {
    console.log('should call');
  },
};

// optional: handle errors in sagas
const onError = (err: Error) => {
  console.log('track saga errors');
  console.log(err);
};
// create root saga from object
const rootSaga = sagaCreator(sagas, onError);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(() => {}, applyMiddleware(sagaMiddleware));
// pass extra data to all sagas inside object
sagaMiddleware.run(rootSaga, 'more', 'data');

function test() {
  store.dispatch({ type: 'LOGIN' });
  setTimeout(() => {
    store.dispatch({ type: 'LOGOUT' });
  }, 200);
}

test();
setTimeout(() => {
  test();
}, 200);

/*
[ 'more', 'data' ]
should call
login
logout
track saga errors
Error: something bad
    at index.ts:12:9
[ 'more', 'data' ]
login
logout
track saga errors
Error: something bad
    at index.ts:12:9
[ 'more', 'data' ]
*/
```
