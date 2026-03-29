import 'vue-i18n'
import type { messages } from './index'

type MessageSchema = (typeof messages)['zh']

declare module 'vue-i18n' {
  interface DefineLocaleMessage extends MessageSchema {}
}
