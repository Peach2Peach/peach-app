import { Props } from '../components/Right'

export type Amount = {
  type: 'amount'
  amount: number
} & Partial<Props>
export const isAmount = (props: Props): props is Omit<Amount, 'type'> => typeof props.amount === 'number'
