import { createStore } from 'effector'
import { JsonObject } from 'type-fest'

export namespace FMCore {
  interface PlayerBase {
    isWinner: boolean
  }

  interface ChipBase {
    kind: string
  }

  export interface Plugin<
    Background extends JsonObject = {},
    Player extends PlayerBase = PlayerBase,
    Chip extends ChipBase = ChipBase,
    Actions extends Array<string> = [],
  > {
    actions: Actions
  }

  export interface Model<
    Background extends JsonObject = {},
    Player extends PlayerBase = PlayerBase,
    Chip extends ChipBase = ChipBase,
  > {
    system: {
      turn: number
      player: number
      finished: boolean
    }
    background: Background,
    playerList: Array<Player>,
    chipMatrix: Array<Array<Chip>>
  }

  type BackgroundWithPlugins<PluginType extends Plugin> =
    PluginType extends Plugin<infer Background, any, any> ? Background : never

  type PlayerWithPlugins<PluginType extends Plugin> =
    PluginType extends Plugin<any, infer Player, any> ? Player : never

  type ChipWithPlugins<PluginType extends Plugin> =
    PluginType extends Plugin<any, any, infer Chip> ? Chip : never

  type ModelWithPlugins<PluginType extends Plugin> = Model<
    BackgroundWithPlugins<PluginType>,
    PlayerWithPlugins<PluginType>,
    ChipWithPlugins<PluginType>
  >

  export const definePlugin = <P>(
    plugin: P extends Plugin<infer Background, infer Player, infer Chip, infer Actions>
      ? Plugin<Background, Player, Chip, Actions>
      : never
  )  => plugin

  export const createController = <
    PluginType extends Plugin,
  > (options: {
    plugins: Array<PluginType>,
  }) => {
    const store = createStore<ModelWithPlugins<PluginType>>({
      system: {
        turn: 0,
        player: 0,
        finished: false,
      },
      background: {} as BackgroundWithPlugins<PluginType>,
      playerList: [] as Array<PlayerWithPlugins<PluginType>>,
      chipMatrix: [] as Array<Array<ChipWithPlugins<PluginType>>>,
    })

    const actionQueue = createStore<Array<never>>([])

    return store
  }
}
