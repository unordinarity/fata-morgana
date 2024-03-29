import * as FataMorgana from '@fata-morgana/engine'

export const pluginMeta: FataMorgana.PluginMeta = {
  name: 'navigation',
  version: '0.0.0',
}

export const pluginRequirements: FataMorgana.PluginRequirements = {
  plugins: ['core'],
}

export const pluginFactory: FataMorgana.PluginFactory = (pluginApi) => {
  const hpField = pluginApi.findChipField('hp')
  if (!hpField) throw new Error('hp field not found')

  const windDirections = ['east', 'north', 'west', 'south']
  const weatherKinds = ['calm', 'wind', 'hurricane', 'fog', 'thunderstorm']

  pluginApi.createSurroundField({
    name: 'wind-direction',
    valueInitial: 'east',
    valueValidator: value => windDirections.includes(value.toString()),
  })

  pluginApi.createSurroundField({
    name: 'weather',
    valueInitial: 'calm',
    valueValidator: value => {
      return weatherKinds.includes(value.toString())
    },
  })

  const compass = pluginApi.createChipKind({ kind: 'compass' })
  const windsock = pluginApi.createChipKind({ kind: 'windsock' })
  const shipswheel = pluginApi.createChipKind({ kind: 'shipswheel' })
  const stormglass = pluginApi.createChipKind({ kind: 'stormglass' })
  const beacon = pluginApi.createChipKind({ kind: 'beacon', fields: [hpField] })
  const buoy = pluginApi.createChipKind({ kind: 'buoy', fields: [hpField] })
  const anchor = pluginApi.createChipKind({ kind: 'anchor', fields: [hpField] })
  const rock = pluginApi.createChipKind({ kind: 'rock', fields: [hpField] })

  const changeWindDirection = pluginApi.createActionKind({
    kind: 'change-wind-direction',
    payloadValidator: payload => typeof payload === 'string' && windDirections.includes(payload)
  })

  pluginApi.handleAction(
    changeWindDirection,
    (state, action) => ({ state }),
  )
}
