import { random } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { produce } from 'immer'

import { FataMorgana } from '@fata-morgana/engine'

export const hooks: Array<FataMorgana.Hook> = [
  {
    actions: 'chip-create',
    handler: ({ action, state }) => {
      if (!action.kind || !action.x || !action.y) {
        return Error(
          'FM: core-addon: actions: chip-create: ' +
          'cannot create chip without required fields "x", "y" and "kind"'
        )
      }
      if (state.chipList.find(c => c.x === action.x && c.y === action.y)) {
        return Error(
          'FM: core-addon: actions: chip-create: ' +
          'chip with same values of fields "x" and "y" already exists'
        )
      }
      return {
        state: produce(state, state => {
          state.chipList.push({
            kind: action.kind,
            id: (action.id as string) ?? uuid(),
            x: action.x as number,
            y: action.y as number,
          })
        })
      }
    }
  },
  {
    actions: 'chip-move',
    handler: ({ action, state }) => {
      if ((
        !action.fromX || !action.fromY || !action.toX || !action.toY
      ) || (
        !action.id || !action.toX || !action.toY
      )) {
        return Error(
          'FM: core-addon: actions: chip-move: ' +
          'cannot move chip without required fields "fromX", "fromY", "toX", "toY" or "id", "toX", "toY"'
        )
      }
      if (action.x && action.y) {
        const chipFoundIndex = state.chipList.findIndex(c => c.x === action.x && c.y === action.y)
        if (chipFoundIndex !== -1) {
          return Error(
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
          return Error(
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
  },
  {
    actions: 'chip-delete',
    handler: ({ action, state }) => {
      if (action.x && action.y) return null
      if (action.id) return null
      return Error()
    }
  },
  {
    actions: 'game-start',
    handler: ({ action, state }) => {
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
  },
]
