import { call, spawn, all, ForkEffectDescriptor } from 'redux-saga/effects';
import { CombinatorEffect, SimpleEffect } from '@redux-saga/types';

function* keepAlive(
  saga: (...args: any[]) => any,
  onError: (err: Error) => any = defaultOnError,
  options: any[],
) {
  while (true) {
    try {
      // @ts-ignore
      yield call(saga, ...options);
      break;
    } catch (err) {
      if (typeof onError === 'function') {
        yield call(onError, err);
      }
    }
  }
}

function defaultOnError(err: Error) {
  console.error(err);
}

export default function sagaCreator(
  sagas: {
    [key: string]: (...args: any[]) => any;
  },
  onError?: (err: Error) => any,
): (
  ...options: any[]
) => Generator<
  CombinatorEffect<'ALL', SimpleEffect<'FORK', ForkEffectDescriptor<void>>>,
  void,
  unknown
> {
  return function* rootSaga(...options: any[]) {
    yield all(
      Object.values(sagas).map((saga) =>
        spawn(keepAlive, saga, onError, options),
      ),
    );
  };
}
