import { createEvent, createStore, sample } from 'effector'
import { nanoid } from 'nanoid'

export namespace FataMorgana {
  export interface SurroundField {
    name: string
    valueInitial: string | number
    valueValidator?: (value: string | number) => boolean
  }

  // region chips

  export interface ChipField {
    name: string
    valueInitial: string | number
    valueValidator?: (value: string | number) => boolean
  }

  export interface ChipKind {
    kind: string
    fields?: Array<ChipField>
  }

  export interface Chip {
    kind: ChipKind['kind']
    fields?: Record<string, ChipField>
  }

  // endregion chips

  export interface State {}

  // region actions

  export interface ActionKind {
    kind: string
    payloadValidator?: (payload: any) => boolean
  }

  export interface Action {
    kind: ActionKind['kind']
    payload?: any
  }

  export type ActionHandler = (
    state: State,
    action: Action,
  ) => {
    state: State
    actions?: Array<Action>
  }

  // endregion actions

  // region plugins

  export interface PluginMeta {
    name: string
    version: string
  }

  export interface PluginRequirements {
    plugins?: Array<string>
    surroundFields?: Array<SurroundField['name']>
    chipFields?: Array<ChipField['name']>
    chipKinds?: Array<ChipKind['kind']>
    actionKinds?: Array<ActionKind['kind']>
  }

  export type PluginFactory = (pluginApi: PluginFactoryApi) => void

  export interface PluginFactoryApi {
    findSurroundField: (name: string) => SurroundField | undefined
    findChipField: (name: string) => ChipField | undefined
    findChipKind: (name: string) => ChipKind | undefined
    findActionKind: (name: string) => ActionKind | undefined
    createSurroundField: (surroundField: SurroundField) => SurroundField
    createChipField: (chipField: ChipField) => ChipField
    createChipKind: (chipKind: ChipKind) => ChipKind
    createActionKind: (actionKind: ActionKind) => ActionKind
    handleAction: (actionKind: ActionKind, handler: ActionHandler) => void,
  }

  // endregion plugins

  // region game instance

  export interface Game {
    system: {}
    surround: {}
    chips: Array<Chip>
  }

  export const createGame = (options: {
    chipKinds: Array<ChipKind>
    actionKinds: Array<ActionKind>
  }) => {
    const state = createStore<Game>({
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
      state => {
      },
    )

    return {
      state,
      queue,
      queuePush,
      queueDispatch,
    }
  }

  // endregion game instance
}
