import { createApi, createEvent, createStore, sample } from 'effector'

export const createTaskQueueStore = <Task>() => {
  // queue

  const store = createStore<Array<Task>>([])
  const storeApi = createApi(store, {
    push: (store, payload: Task | Array<Task>) => (
      Array.isArray(payload) ? [...store, ...payload] : [...store, payload]
    ),
    clear: () => [],
    pop: (store) => store.slice(0, -1),
  })

  // single task execution

  const executed = createEvent<Task>()
  const executeSingle = createEvent()

  sample({
    source: store,
    clock: executeSingle,
    filter: store => store.length > 0,
    fn: (store) => store[store.length - 1],
    target: [executed, storeApi.pop],
  })

  // batch execution

  const executeBatch = createEvent<void>()

  sample({
    clock: executeBatch,
    source: store,
    filter: (source) => source.length > 0,
    target: [executeBatch, executeSingle],
  })

  // api

  return {
    store,
    push: storeApi.push,
    clear: storeApi.clear,
    executed,
    executeSingle,
    executeBatch,
  }
}
