import { createEvent, createStore, sample } from 'effector'
import { cloneDeep } from 'lodash-es'

// game state

type Surround = Record<string, NonNullable<string | number | boolean>>

type Player = Record<string, NonNullable<string | number | boolean>>

type Cell = Record<string, NonNullable<string | number | boolean>> & {
  kind: string
}

interface GameState {
  general: {
    turn: number
    player: number
    finished: boolean
  }
  surround: Surround
  playerList: Array<Player>
  cellMatrix: Array<Array<Cell>>
}

//

interface Action {
  name: string
  reducer: (gameState: GameState, payload: {}) => GameState
}

interface Task {
  name: Action['name']
  payload: {}
}

interface Hook {
  action: Action['name']
  trigger: () => Array<Task> | Task | void
}

interface Addon {
  actions: Array<Action>
  hooks: Array<Hook>
}

const createController = (
  addons: Array<Addon> = [],
) => {
  const actionsList = addons.map(addon => addon.actions).flat()
  const hookList = addons.map(addons => addons.hooks).flat()

  const gameState = createStore<GameState>({
    general: {
      turn: 0,
      finished: false,
      player: 0,
    },
    surround: {},
    playerList: [],
    cellMatrix: [],
  })

  const taskQueue = createStore<Array<Task>>([])

  const taskQueuePush = createEvent<Task>()
  taskQueue.on(taskQueuePush, (state, payload) => [...state, payload])

  const taskQueueExecute = createEvent()
  sample({
    clock: taskQueueExecute,
    source: { gameState: gameState, taskQueue },
    fn: ({ gameState, taskQueue }) => {
      let gameStateTemp = cloneDeep(gameState)
      let taskQueueTemp = cloneDeep(taskQueue)

      while (taskQueueTemp.length > 0) {
        const task = taskQueueTemp.shift()
        if (!task) throw new Error('Trying to shift task from empty queue')

        const actionFound = actionsList.find(a => a.name === task.name)
        if (!actionFound) throw new Error('Trying to execute task with unknown action name')

        gameStateTemp = actionFound.reducer(gameStateTemp, task.payload)
      }

      return gameStateTemp
    },
    target: gameState
  })

  taskQueue.on(taskQueueExecute, () => [])

  return {
    gameState,
    taskQueuePush,
    taskQueueExecute,
  }
}

//

const addonStarter: Addon = {
  actions: [],
  hooks: [],
}

const addonNavigation: Addon = {
  actions: [],
  hooks: [],
}

const addonMyths: Addon = {
  actions: [],
  hooks: [],
}

const controller = createController([
  addonStarter,
  addonMyths,
  addonNavigation,
])

export {}
