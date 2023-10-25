import * as FataMorgana from '@fata-morgana/engine'

export const pluginMeta: FataMorgana.PluginMeta = {
  name: 'logger',
  version: '0.0.0',
}

export const pluginRequirements: FataMorgana.PluginRequirements = {
  plugins: [],
}

export const pluginFactory: FataMorgana.PluginFactory = (pluginApi) => {
  const actionKind = pluginApi.findActionKind('')
  if (!actionKind) throw new Error('action not found')

  pluginApi.handleAction(
    actionKind,
    (state, action) => {
      console.log(action, state)
      return { state }
    }
  )
}
