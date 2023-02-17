import { JsonObject } from 'type-fest'

export interface Game {
  system: {
    turn: number,
    player: number,
    finished: boolean,
  }
  background: JsonObject,
  playerList: Array<JsonObject>,
  unitMatrix: Array<Array<JsonObject>>,
}

export interface Action<
  State extends {} = {},
  ActionType extends string = string
> {
  type: ActionType
  reducer: (state: State, payload: {}) => State
}

export interface Task<
  State extends {} = {},
  ActionType extends string = string
> {
  type: ActionType
  payload: {}
}

export type Hook<
  State extends {} = {},
  ActionType extends string = string
> = (
  state: State,
  task: Task<State,  ActionType>
) => Array<Task<State, ActionType>> | Task<State, ActionType> | null | void
