import { Props } from '../components/Right'
import { FiatAmount, isFiatAmount } from './isFiatAmount'
import { Amount, isAmount } from './isAmount'
import { Range, isRange } from './isRange'

type Empty = {
  type: 'empty'
} & Partial<Props>

export const getPropsWithType = (props: Props): Empty | FiatAmount | Range | Amount => {
  if (isRange(props)) return { ...props, type: 'range' }
  if (isFiatAmount(props)) return { ...props, type: 'fiatAmount' }
  if (isAmount(props)) return { ...props, type: 'amount' }
  return { ...props, type: 'empty' }
}
