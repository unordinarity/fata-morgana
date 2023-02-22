import { nanoid } from 'nanoid'

// definitions

export namespace FataMorgana {
  const secretId = Symbol('secretId')

  export type Action<A extends string> = {
    [secretId]: string
  }

  export const createAction = <A extends string>({
    name,
  }: {
    name: A
  }): Action<A> => ({
    [secretId]: nanoid(),
  })

  export type Unit <U extends string> = {
    [secretId]: string
  }

  export const createUnit = <U extends string>({
    name
  }: {
    name: U
  }): Unit<U> => ({
    [secretId]: nanoid(),
  })

  export type Plugin<A extends Action<string>> = {
    [secretId]: string,
  }

  export const createPlugin = <A extends Action<string>>({
    actions
  } : {
    actions: Array<A>
  }): Plugin<A> => ({
    [secretId]: nanoid(),
  })
}

// example

const ship = FataMorgana.createUnit({
  name: 'ship'
})

const moveAction = FataMorgana.createAction({
  name: 'move'
})

const winAction = FataMorgana.createAction({
  name: 'win'
})

const corePlugin = FataMorgana.createPlugin({
  actions: [moveAction, winAction]
})
