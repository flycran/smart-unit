# SmartUnit React i18n Example

React + TypeScript example with **react-i18next** integration.

## Run in CodeSandbox

[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/flycran/smart-unit/tree/master/examples/react)

## Quick Start

```bash
cd examples/react
bun install
bun dev
```

## Key Integration

```ts
// src/utils/units.ts
import { useTranslation } from 'react-i18next'
import SmartUnit from 'smart-unit'

const baseUnit = new SmartUnit(['g', 1000, 'kg', 1000, 't'])

export const useWeightUnit = () => {
  const { t } = useTranslation()
  return baseUnit.withConvert((unit) => t(`weight.${unit}`))
}
```

## Documentation

See [Internationalization Guide](https://flycran.github.io/smart-unit/examples/i18n.html) for smart-unit integration details.

## Tech Stack

- React 18
- TypeScript
- react-i18next
- Vite
