import { createStore } from 'effector'

export namespace FMCore {
  export interface Plugin<Background, Player, Chip> {
    background: Background
    player: Player
    chip: Chip
  }

  export interface Model<Background, Player, Chip> {
    system: {
      turn: number
      player: number
      finished: boolean
    }
    background: Background,
    playerList: Array<Player>,
    chipMatrix: Array<Array<Chip>>
  }

  export const createController = <
    Plugins extends Array<Plugin<any, any, any>>,
  > (options: {
    plugins: Plugins,
  }) => {
    type ModelPlugged = Model<Plugins[number]['background'], Plugins[number]['player'], Plugins[number]['chip']>

    const store = createStore<ModelPlugged>({
      system: {
        turn: 0,
        player: 0,
        finished: false,
      },
      background: {},
      playerList: [],
      chipMatrix: [],
    })

    return store
  }
}
