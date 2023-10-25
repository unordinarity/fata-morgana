import { ActionHandler, ActionKind, ChipField, ChipKind, SurroundField } from './base'

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
  handleAction: (actionKind: ActionKind, handler: ActionHandler) => void
}
