import { Props } from '../components/Right'

export type Range = {
  type: 'range'
  amount: [number, number]
} & Partial<Props>

export const isRange = (props: Props): props is Omit<Range, 'type'> => Array.isArray(props.amount)
