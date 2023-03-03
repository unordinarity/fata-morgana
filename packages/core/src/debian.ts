// utilities

type JsonFlatObject = Record<string, string | number | boolean | null>
type MaybeArray<T> = T | Array<T>

// definitions

export namespace FataMorgana {
  export interface SystemBase {
    player: number
    finished: boolean
  }

  export interface SurroundBase {}

  export interface PlayerBase {
    state: 'playing' | 'won' | 'lost'
  }

  export interface ChipBase {
    kind: string
  }

  export interface ActionBase {
    kind: string
  }

  export interface Model<
    System extends SystemBase = SystemBase,
    Surround extends SurroundBase = SurroundBase,
    Player extends PlayerBase = PlayerBase,
    Chip extends ChipBase = ChipBase,
  > {
    system: System,
    surround: Surround,
    playerList: Array<Player>,
    chipMatrix: Array<Array<Chip>>,
  }

  export type HookBase = <
    Action extends ActionBase,
    State extends Model,
  >(payload: {
    action: Action,
    state: State,
  }) => ({
    action: MaybeArray<Action>,
    state: State,
  })

  export interface Plugin<
    System extends SystemBase = SystemBase,
    Surround extends SurroundBase = SurroundBase,
    Player extends PlayerBase = PlayerBase,
    Chip extends ChipBase = ChipBase,
    Action extends ActionBase = ActionBase,
  > {
    plugins: Array<Plugin>,

  }

  export const createPlugin = <
    System extends JsonFlatObject = JsonFlatObject,
    Surround extends JsonFlatObject = JsonFlatObject,
    Player extends JsonFlatObject = JsonFlatObject,
    Chip extends JsonFlatObject = JsonFlatObject,
    Action extends JsonFlatObject = JsonFlatObject,
  >(options: {
    plugins?: Array<Plugin>,
    actions?: Array<Action>,
    hooks?: Array<(action: Action) => void>,
  }) => {
    const plugins = options?.plugins ?? []
    const actions = options?.actions ?? []
    const hooks = options?.hooks ?? []

    return {
      requirePlugin: <
        P extends Plugin
      >(
        plugin: P
      ) => (
        createPlugin<System, Surround, Player, Chip, Action>({
          plugins: [...plugins, plugin],
          actions,
          hooks,
        })
      ),
      addChip: () => {},
      addAction: <A extends JsonFlatObject>(action: A) => (
        createPlugin<System, Surround, Player, Chip, Action | A>({
          plugins,
          actions: [...actions, action],
          hooks,
        })
      ),
      addHook: (hook: () => void) => (
        createPlugin<System, Surround, Player, Chip, Action>({
          plugins,
          actions,
          hooks,
        })
      ),
      build: () => {},
    }
  }
}

const corePlugin = FataMorgana
  .createPlugin({})
  .addAction({ kind: 'asd' })
  .addHook(() => {})
  .build()
