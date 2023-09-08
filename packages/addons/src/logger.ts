import { FataMorgana } from '@fata-morgana/engine'

export const hooks: Array<FataMorgana.Hook> = [
  {
    handler: ({ action, state }) => {
      console.log(action, state)
      return null
    },
  },
]
