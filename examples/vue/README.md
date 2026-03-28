# SmartUnit Vue i18n Example

Vue 3 + TypeScript example with **vue-i18n** integration.

## Run in CodeSandbox

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/vue)

## Quick Start

```bash
cd examples/vue
bun install
bun dev
```

## Key Integration

```ts
// src/utils/units.ts
import { useI18n } from 'vue-i18n'
import SmartUnit from 'smart-unit'

const baseUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

export const useWeightUnit = () => {
  const { t } = useI18n()
  return baseUnit.withConvert((unit) => t(`weight.${unit}`))
}
```

## Documentation

See [Internationalization Guide](https://flycran.github.io/smart-unit/examples/i18n.html) for smart-unit integration details.

## Tech Stack

- Vue 3
- TypeScript
- vue-i18n
- Vite
