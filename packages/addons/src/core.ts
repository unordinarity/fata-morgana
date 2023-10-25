import { random } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { produce } from 'immer'

import * as FataMorgana from '@fata-morgana/engine'

export const pluginMeta: FataMorgana.PluginMeta = {
  name: 'core',
  version: '0.0.0',
}

export const pluginRequirements: FataMorgana.PluginRequirements = {
  plugins: [],
}

export const pluginFactory: FataMorgana.PluginFactory = (pluginApi) => {
  const chipCreateAction = pluginApi.createActionKind({ kind: 'chip-create' })

  pluginApi.handleAction(
    chipCreateAction,
    (state, action) => {
      if (!action.kind || !action.x || !action.y) {
        throw Error(
          'FM: core-addon: actions: chip-create: ' +
          'cannot create chip without required fields "x", "y" and "kind"'
        )
      }
      if (state.chips.find(c => c.x === action.x && c.y === action.y)) {
        throw Error(
          'FM: core-addon: actions: chip-create: ' +
          'chip with same values of fields "x" and "y" already exists'
        )
      }
      return {
        state: produce(state, state => {
          state.chips.push({
            kind: action.kind,
            id: (action.id as string) ?? uuid(),
            x: action.x as number,
            y: action.y as number,
          })
        })
      }
    }
  )

  const chipMoveAction = pluginApi.createActionKind({ kind: 'chip-move' })

  pluginApi.handleAction(
    chipMoveAction,
    (state, action) => {
      if ((
        !action.fromX || !action.fromY || !action.toX || !action.toY
      ) || (
        !action.id || !action.toX || !action.toY
      )) {
        throw Error(
          'FM: core-addon: actions: chip-move: ' +
          'cannot move chip without required fields "fromX", "fromY", "toX", "toY" or "id", "toX", "toY"'
        )
      }
      if (action.x && action.y) {
        const chipFoundIndex = state.chipList.findIndex(c => c.x === action.x && c.y === action.y)
        if (chipFoundIndex !== -1) {
          throw Error(
            'FM: core-addon: actions: chip-move: ' +
            'chip with same values of fields "x" and "y" already exists'
          )
        }
        return {
          state: produce(state, state => {
            state.chipList[chipFoundIndex].x = action.fromX as number
            state.chipList[chipFoundIndex].y = action.fromY as number
          }),
        }
      }
      if (action.id) {
        const chipFoundIndex = state.chipList.findIndex(c => c.id === action.id)
        if (chipFoundIndex !== -1) {
          throw Error(
            'FM: core-addon: actions: chip-move: ' +
            'chip with same value of field "id" already exists'
          )
        }
        return {
          state: produce(state, state => {
            state.chipList[chipFoundIndex].x = action.fromX as number
            state.chipList[chipFoundIndex].y = action.fromY as number
          }),
        }
      }
      return null
    }
  )

  const chipDeleteAction = pluginApi.createActionKind({ kind: 'chip-delete' })

  pluginApi.handleAction(
    chipDeleteAction,
    (state, action) => {
      if (action.x && action.y) return null
      if (action.id) return null
      throw Error()
    }
  )

  const gameStartAction = pluginApi.createActionKind({ 'game-start' })

  pluginApi.handleAction(
    gameStartAction,
    (state, action) => {
      const obstacles = new Array(random(20)).fill(null).map(elem => ({
        x: random(10),
        y: random(10),
      }))
      const actions = []

      return {
        actions: [{
          kind: 'chip-create',
        }],
        state: state
      }
    }
  )
}
