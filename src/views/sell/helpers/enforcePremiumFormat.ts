import { enforceDecimalsFormat } from '../../../utils/format'
import { parsePremiumToString } from './parsePremiumToString'

export const enforcePremiumFormat = (value: string | number) => parsePremiumToString(enforceDecimalsFormat(value, 2))
