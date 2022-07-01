import { createEvent, createStore, sample } from 'effector'

// game state

interface State {

}

interface Surround {

}

interface Player {

}

interface Cell {
  kind: string
  hooks: Record<TaskDefinition['name'], () => Array<TaskAttempt> | TaskAttempt | void>
}

interface Game {
  state: State
  surround: Surround
  players: Array<Player>
  cells: Array<Array<Cell>>
}

//

interface TaskDefinition {
  name: string
  reducer: (game: Game, payload: {}) => Game
}

interface TaskAttempt {
  name: TaskDefinition['name']
  payload: {}
}

interface Addon {
  actions: Array<TaskDefinition>
}

const createPlugin = (): Addon => {
  return {
    actions: []
  }
}

const createController = (
  addons: Array<Addon> = []
) => {
  const actionsList = addons.map(plugin => plugin.actions).flat()

  const gameState = createStore<Game>({
    state: {},
    surround: {},
    players: [],
    cells: [],
  })

  const gameStateSet = createEvent()
  gameState.on(gameStateSet, (_, payload) => payload)

  const taskQueue = createStore<Array<TaskAttempt>>([])

  const taskQueuePush = createEvent<TaskAttempt>()
  taskQueue.on(taskQueuePush, (state, payload) => [...state, payload])

  const taskQueueExecute = createEvent()
  sample({
    clock: taskQueueExecute,
    source: { gameState, taskQueue },
    fn: ({ gameState, taskQueue }) => {
      let gameStateTemp = { ...gameState }
      let taskQueueTemp = [...taskQueue]

      while (taskQueueTemp.length > 0) {
        const task = taskQueueTemp.shift()
        if (!task) throw new Error('Trying to shift task from empty queue')

        const actionFound = actionsList.find(a => a.name === task.name)
        if (!actionFound) throw new Error('Trying to execute task with unknown action name')

        const reduceResult = actionFound.reducer(gameStateTemp, task.payload)
      }

      return gameStateTemp
    },
    target: gameStateSet
  })

  taskQueue.on(taskQueueExecute, () => [])

  return {
    gameState,
    actionsQueuePush: taskQueuePush,
    actionsQueueExecute: taskQueueExecute,
  }
}

//

const pluginStarter = createPlugin()

const pluginNavigation = createPlugin()

const pluginMyths = createPlugin()

const controller = createController([
  pluginStarter,
  pluginMyths,
  pluginNavigation,
])

export {}
