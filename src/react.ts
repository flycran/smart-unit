import { PickUnit, SmartUnit } from './SmartUnit'

export const useSmartUnit = <U extends string | number>(
  su: SmartUnit<any, U>,
  t: (str: PickUnit<U>) => string,
) => {
  return new Proxy(su, {
    get(target, p, receiver) {
      if (p === 'convert') {
        return t
      }
      return target[p]
    },
  })
}
