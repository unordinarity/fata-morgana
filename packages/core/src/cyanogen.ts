// utilities

type JsonFlatObject = Record<string, string | number | boolean | null>
type MaybeArray<T> = T | Array<T>

// definitions

export namespace FataMorgana {
  export type GameBase = {
    turn: number,
    player: number,
    finished: boolean,
  }

  export type SurroundBase = {}

  export type PlayerBase = {
    state: 'playing' | 'won' | 'lost'
  }

  export type ChipBase = {
    kind: string
  }

  export type ActionBase = {
    kind: string
  }

  export type State<
    Game extends JsonFlatObject = JsonFlatObject,
    Surround extends JsonFlatObject = JsonFlatObject,
    Player extends JsonFlatObject = JsonFlatObject,
    Chip extends JsonFlatObject = JsonFlatObject,
  > = {
    system: GameBase & Game,
    surround: SurroundBase & Surround,
    playerList: PlayerBase & Array<Player>,
    chipList: ChipBase & Array<Chip>,
  }

  export type Hook<
    Game extends JsonFlatObject = JsonFlatObject,
    Surround extends JsonFlatObject = JsonFlatObject,
    Player extends JsonFlatObject = JsonFlatObject,
    Chip extends JsonFlatObject = ChipBase,
    Action extends JsonFlatObject = ActionBase,
  > = (args: {
    state: State<Game, Surround, Player, Chip>
    action: Action
  }) => {
    state: State<Game, Surround, Player, Chip>,
    actions: MaybeArray<Action>,
  } | null | undefined | Error

  export type Plugin<
    Game extends JsonFlatObject = JsonFlatObject,
    Surround extends JsonFlatObject = JsonFlatObject,
    Player extends JsonFlatObject = JsonFlatObject,
    Chip extends (ChipBase & JsonFlatObject) | null = null,
    Action extends (ActionBase & JsonFlatObject) | null = null,
  > = {
    actionKindList: Action extends ActionBase ? Array<Action['kind']> : undefined,
    chipKindList: Chip extends ChipBase ? Array<Chip['kind']> : undefined,
    hookList: Array<Hook<
      Game,
      Surround,
      Player,
      Chip extends ChipBase ? Chip : ChipBase,
      Action extends ActionBase ? Action : ActionBase
    >>,
  }
}

// example

const corePlugin: FataMorgana.Plugin<
  {},
  {},
  {},
  null,
  { kind: 'next-move' } | { kind: 'player-won'} | { kind: 'player-lost' }
> = {
  actionKindList: ['next-move', 'player-lost', 'player-won']
}
