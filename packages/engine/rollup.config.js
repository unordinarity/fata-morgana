import { defineConfig } from 'rollup'
import typescriptPlugin from '@rollup/plugin-typescript'
import typescriptDtsPlugin from 'rollup-plugin-dts'
import { readPackageUpSync } from 'read-pkg-up'

const packageJson = readPackageUpSync({ normalize: true }).packageJson

export default defineConfig([{
  input: 'src/index.ts',
  plugins: [
    typescriptPlugin(),
  ],
  output: [{
    file: packageJson.module,
    format: 'esm',
  }],
  external: [
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
  ],
}, {
  input: 'src/index.ts',
  plugins: [
    typescriptPlugin(),
    typescriptDtsPlugin(),
  ],
  output: {
    file: packageJson.types,
    format: 'es',
  },
  external: [
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.peerDependencies ?? {}),
  ],
}])
