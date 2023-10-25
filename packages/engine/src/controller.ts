import { createEvent, createStore, sample } from 'effector'

import { Action, ActionKind, ChipKind, GameState } from './base'

// region game instance

export const createController = (options: {
  chipKinds: Array<ChipKind>
  actionKinds: Array<ActionKind>
}) => {
  const state = createStore<GameState>({
    system: {},
    surround: {},
    chips: [],
  })

  const queue = createStore<Array<Action>>([])
  const queuePush = createEvent<Action>()
  const queueUnstash = createEvent<void>()

  const queueDispatch = createEvent<Action>()
  const queueDispatchSingle = createEvent<Action>()

  sample({
    clock: queueDispatch,
    source: queue,
    filter: (queue, dispatch) => queue.length > 0,
    fn: (queue, dispatch) => queue[0],
    target: queueDispatchSingle,
  })

  sample({
    clock: queueDispatchSingle,
    source: queue,
    filter: (queue, dispatch) => queue.length > 0,
    fn: (queue, dispatch) => queue[0],
    target: queueDispatchSingle,
  })

  sample({
    clock: queueDispatchSingle,
    target: queueUnstash,
  })

  state.on(
    queueDispatchSingle,
    state => {},
  )

  return {
    state,
    queue,
    queuePush,
    queueDispatch,
  }
}

// endregion game instance
