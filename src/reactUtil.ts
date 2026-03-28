import { type PickUnit, SmartUnit } from './SmartUnit'

export const useSmartUnit = <D extends boolean = false, U extends string | number = string>(
  su: SmartUnit<D, U>,
  t: (str: PickUnit<U>) => string,
) => {
  const smartUnit: SmartUnit<D, U> = Object.create(su)
  smartUnit.convert = t
  return smartUnit
}
