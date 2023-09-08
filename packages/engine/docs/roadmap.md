# Roadmap

## Explicit units and fields declaration

```typescript
const systemField = FataMorgana.createSystemField(key, defaultValue)
const surroundField = FataMorgana.createSurroundField(key, defaultValue)
const playerField = FataMorgana.createPlayerField(key, defaultValue)
const chip = FataMorgana.createChip('kind', { field: validationFn })
const action = FataMorgana.createAction('kind', { field: validationFn })
const plugin = FataMorgana.createPlugin({
  systemFields: [systemField],
  surroundFields: [surroundField],
  playerFields: [playerField],
  chips: [chip],
  actions: [action],
})
```

## Type-safe declarations
