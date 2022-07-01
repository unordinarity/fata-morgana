import { createEvent, createStore } from 'effector'

type Chip<P extends Array<Plugin> = []> = {
  x: number
  y: number
  kind: string
} & P[number]['chip']

type Player<P extends Array<Plugin> = []> = {} & P[number]['player']

type Surround<P extends Array<Plugin> = []> = {} & P[number]['surround']

interface Game<P extends Array<Plugin> = []> {
  surround: Surround<P>
  players: Array<Player<P>>
  chips: Array<Array<Chip<P>>>
}

interface Action<P extends Plugin> {
  kind: string
  arguments: {}
  script: (game: Game<Array<P>>, actions: Array<Action<P>>) => Array<Action<P>> | Action<P> | void | false
}

interface Plugin {
  chip: {}
  player: {}
  surround: {}
  actions: string
}

export const createController = <P extends Plugin>({
  game,
  plugins,
  actions,
}: {
  game: Game<Array<P>>
  plugins: Array<P>,
  actions: Array<Action<P>>,
}) => {
  const $game = createStore(game)
  const performAction = createEvent<(typeof actions)[number]['kind']>()
  $game.on(performAction, (state, payload) => {
    actions.find(a => a.kind === payload)?.script(state, actions)
  })
}
