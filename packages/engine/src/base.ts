import { JsonFlatObject, MaybeArray } from './utils'

export interface SurroundField {
  name: string
  valueInitial: string | number
  valueValidator?: (value: string | number) => boolean
}

// region players

export interface Player {
  id: string
  state: 'in-game' | 'won' | 'lost'
}

export interface PlayerField {

}

// endregion

// region chips

export interface ChipField<Value extends boolean | number | string = any> {
  name: string
  valueInitial: Value
  valueValidator?: (value: Value) => boolean
}

export interface ChipKind {
  kind: string
  fields?: Array<ChipField>
}

export interface Chip<FieldMap extends Record<string, ChipField> = {}> {
  id: string
  kind: ChipKind['kind']
  x: number
  y: number
  fields?: FieldMap
}

// endregion chips

export interface GameState {
  system: {}
  surround: {}
  chips: Array<Chip>
}

// region actions

export interface ActionKind {
  kind: string
  payloadValidator?: (payload: {}) => boolean
}

export interface Action {
  id: string
  kind: ActionKind['kind']
  payload?: {}
}

export type ActionHandler = (
  state: GameState,
  action: Action,
) => {
  state?: GameState
  actions?: MaybeArray<Action>
} | null

// endregion actions
