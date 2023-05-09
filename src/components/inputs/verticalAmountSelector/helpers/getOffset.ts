import { interpolate } from '../../../../utils/math'

type Props = { amount: number; min: number; max: number; trackHeight: number }
export const getOffset = ({ amount, min, max, trackHeight }: Props) =>
  Math.round(interpolate(amount, [min, max], [trackHeight, 0]))
