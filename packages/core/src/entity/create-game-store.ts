import { sample } from 'effector'

import { createReducerStore } from 'src/shared/create-reducer-store'
import { createTaskQueueStore } from 'src/shared/create-task-queue-store'

import { Action, Game, Hook, Task } from './model'

export const createGameStore = <
  ActionType extends string = string,
>(
  options: {
    fieldWidth: number
    fieldHeight: number
    players: number
  },
  actions: Array<Action<Game, ActionType>>,
  hooks: Array<Hook<Game, ActionType>>,
) => {
  const initialState: Game = {
    system: {
      turn: 0,
      player: 0,
      finished: false,
    },
    background: {},
    playerList:
      new Array(options.players).fill(null).map(() => (
        {}
      )),
    unitMatrix:
      new Array(options.fieldWidth).fill(null).map(row =>
        new Array(options.fieldHeight).fill(null).map(() => (
          {}
        ))
      ),
  }

  const reducer = createReducerStore<Game>(initialState)
  const taskQueue = createTaskQueueStore<Task<Game, ActionType>>()

  sample({
    source: reducer.store,
    clock: taskQueue.executed,
    fn: (store, payload) => (
      hooks
        .map(hook => hook(store, payload))
        .flat()
        .filter(task => !!task) as Array<Task<Game, ActionType>>
    ),
    target: taskQueue.push,
  })

  // throw new Error('FM0001: exceeded task queue limit, risk of infinite loop')
  // throw new Error('FM0002: exceeded executed tasks limit, risk of infinite loop')

  return {
    store: reducer.store,
    taskPush: taskQueue.push,
    taskExecuteSingle: taskQueue.executeSingle,
    taskExecuteBatch: taskQueue.executeBatch,
  }
}
