import 'i18next'
import type { resources } from './index'

type Resources = typeof resources

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: Resources['zh']
  }
}
