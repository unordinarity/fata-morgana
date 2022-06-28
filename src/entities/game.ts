import { combine, createApi, createEvent, createStore, sample, split } from 'effector'

export namespace Game {
  export type Mod<
    C extends {} = {},
    P extends {} = {},
    S extends {} = {},
  > = {
    cell: C
  }

  export interface Action {
    kind: string
    parameters: object
  }

  export interface ActionCreate extends Action {

  }

  export type Cell<M extends Mod> = {
    id: string,
    x: number,
    y: number,
    kind: string
  }

  export type Player<M extends Mod> = {
    kind: string
  }

  export type Surround<M extends Mod> = {}

  export const createController = <M extends Mod> (
    options: {
      sizeX: number,
      sizeY: number,
    },
    mods: Array<M> = [],
  ) => {
    const $cellsList = createStore<Array<Cell<M>>>([])

    const cellsApi = createApi($cellsList, {
      create: (store, payload: Cell<M>) => {
        if (
          store.find(elem => elem.id === payload.id)
        ) {
          console.error('trying to create cell with already existing id', payload)
          return store
        } else if (
          store.find(elem => elem.x === payload.x && elem.y === payload.y)
        ) {
          console.error('trying to create cell with already existing coordinates', payload)
          return store
        } else if (
          payload.x < 0 ||
          payload.x >= options.sizeX ||
          payload.y <= 0 ||
          payload.y >= options.sizeY
        ) {
          console.error('trying to create cell with wrong coordinates', payload)
          return store
        } else {
          return [...store, payload]
        }
      },
      move: (store, payload: { id: Cell<M>['id'], x: Cell<M>['x'], y: Cell<M>['y'] }) => {
        const cellFoundId = store.findIndex(cell => cell.id === payload.id)
        if (cellFoundId === -1) {
          console.error('trying to move cell with non-existent id', payload)
          return store
        } else if (
          payload.x < 0 ||
          payload.x >= options.sizeX ||
          payload.y <= 0 ||
          payload.y >= options.sizeY
        ) {
          console.error('trying to move cell to wrong coordinates', payload)
          return store
        } else {
          const cellNew: Cell<M> = {
            ...store[cellFoundId],
            x: payload.x,
            y: payload.y,
          }
          return [...store.splice(cellFoundId, 1, cellNew)]
        }
      },
      transform: (store, payload: { id: Cell<M>['id'], variant: Cell<M>['kind'] }) => {
        const cellFoundId = store.findIndex(cell => cell.id === payload.id)
        if (cellFoundId === -1) {
          console.error('trying to transform cell with non-existent id', payload)
          return store
        } else {
          const cellNew: Cell<M> = {
            ...store[cellFoundId],
            kind: payload.variant,
          }
          return [...store.splice(cellFoundId, 1, cellNew)]
        }
      },
      destroy: (store, payload: { id: Cell<M>['id'] }) => {
        const cellFoundId = store.findIndex(cell => cell.id === payload.id)
        if (cellFoundId === -1) {
          console.error('trying to delete cell with non-existent id', payload)
          return store
        } else {
          return [...store.splice(cellFoundId, 1)]
        }
      },
    })

    const $cellsGrid = combine($cellsList, list => {
      const grid: Array<Array<Cell<M> | null>> =
        new Array(options.sizeX).fill(0).map(() => (
          new Array(options.sizeY).fill(null)
        ))

      list.forEach(cell => {
        grid[cell.x][cell.y] = cell
      })

      return grid
    })

    const $players = createStore<Array<Player<M>>>([])
    const playersApi = createApi($players, {
      change: (store, e) => {},
    })

    const $surround = createStore<Surround<M>>({})
    const surroundApi = createApi($surround, {
      change: (store, e) => {},
    })

    const $actions = createStore<Array<Action>>([])

    const actionsPush = createEvent<Action>()
    $actions.on(actionsPush, (stack, action: Action) => [...stack, action])

    const actionPerform = createEvent<Action>()

    return {
      $cellsList,
      $cellsGrid,
      $players,
      $surround,
      actionsPush,
      actionPerform,
    }
  }
}
