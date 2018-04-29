# Redux Saga Creator

A simple utility to convert an object of sagas into a single saga.

## Usage

```js
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import sagaCreator from 'redux-saga-creator';

const sagas = {
    onLogin: function* {},
    onLogout: function* {},
    // etc ...
};

const rootSaga = sagaCreator(sagas);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
    () => {},
    null,
    applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);
```
