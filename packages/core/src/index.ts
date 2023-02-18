import { createStore } from 'effector'

export namespace FMCore {
  export interface Plugin<
    Background extends {} = {},
    Player extends {} = {},
    Chip extends {} = {},
  > {

  }

  export interface Model<
    Background extends {} = {},
    Player extends {} = {},
    Chip extends {} = {},
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

  export const createController = <
    PluginType extends Plugin<any, any, any>,
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

    return store
  }
}
