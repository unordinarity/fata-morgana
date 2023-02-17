import { createEvent, createStore } from 'effector'

export const createReducerStore = <T>(defaultState: T) => {
  const store = createStore<T>(defaultState)
  const reduce = createEvent<(state: T) => T>()
  store.on(reduce, (state, payload) => payload(state))

  return {
    store,
    reduce,
  }
}
