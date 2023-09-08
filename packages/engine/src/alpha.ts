import { nanoid } from 'nanoid'

import { MaybeArray } from './utils'

export namespace FataMorgana {
  // region utility

  const idKey = Symbol('subscribed entities id key')
  type Subscribed<T> = T & { [idKey]: string }

  // endregion

  // region game state

  export interface SystemField {
    name: string
    initialValue: string | number
    validator?: (value: string | number) => boolean
  }

  export const createSystemField = (systemField: SystemField): Subscribed<SystemField> => ({ [idKey]: nanoid(), ...systemField })

  export const createSurroundField = () => {}

  export const createChipField = () => {}

  export interface ChipKind {
    name: string
  }

  export const createChipKind = (chipKind: ChipKind): Subscribed<ChipKind> => ({ [idKey]: nanoid(), ...chipKind })

  export interface State {
    system: {}
    surround: {}
    players: Array<{}>
    chips: Array<{}>
  }

  // endregion

  // region impact and intention

  export interface ImpactKind {
    name: string
    required: Array<Subscribed<SystemField> | Subscribed<ChipKind>>
  }

  export interface Impact {
    kind: string
    payload: object
  }

  export const createImpactKind = (impactKind: ImpactKind): Subscribed<ImpactKind> => ({ [idKey]: nanoid(), ...impactKind })

  export interface IntentionKind {
    name: string
    target: Array<'chip' | 'global'>
    handler: (
      state: State,
      intention: {
        name: string
        payload: {}
      },
    ) => [
      state: State,
      impacts: MaybeArray<Impact>
    ]
    required: Array<Subscribed<SystemField> | Subscribed<ChipKind>>
  }

  export interface Intention {
    kind: IntentionKind['name']
    from: Array<'player' | 'chip'>
    to: Array<'player' | 'chip'>

  }

  export const createIntentionKind = (intentionKind: IntentionKind): Subscribed<IntentionKind> => ({ [idKey]: nanoid(), ...intentionKind })

  // endregion

  // region plugins

  interface Plugin {
    systemFields?: Array<Subscribed<SystemField>>
    chipKinds?: Array<Subscribed<ChipKind>>
  }

  export const createPlugin = (plugin: Plugin): Subscribed<Plugin> => ({ [idKey]: nanoid(), ...plugin })

  export const createGame = (options: {
    plugins: Subscribed<Plugin>
  }) => {}

  // endregion
}
