import { Props } from '../components/Right'

export type FiatAmount = {
  type: 'fiatAmount'
  amount: number
} & Required<Props>
export const isFiatAmount = (props: Props): props is Omit<FiatAmount, 'type'> =>
  typeof props.amount === 'number' && props.price !== undefined && props.currency !== undefined
