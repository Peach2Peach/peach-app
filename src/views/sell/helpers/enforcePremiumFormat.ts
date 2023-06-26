import { enforceDecimalsFormat } from '../../../utils/format'
import { parsePremiumToString } from './parsePremiumToString'

export const enforcePremiumFormat = (value: string | number) =>
  parsePremiumToString(enforceDecimalsFormat(String(value), 2))
