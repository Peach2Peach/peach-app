import tw from '../../styles/tailwind'
import { Bubble, BubbleProps } from './Bubble'

export type Props = {
  border?: true
} & Partial<BubbleProps>

export const MildBubble = (props: Props) => {
  const { border } = props

  const color = border ? tw`bg-primary-background-light` : tw`bg-primary-background-dark`
  const textColor = tw`text-black-1`
  const iconColor = border ? tw`text-black-1` : tw`text-primary-main`
  const borderColor = border ? tw`border-black-1` : tw`border-primary-mild-1`

  return <Bubble {...{ ...props, color, textColor, iconColor, borderColor }} />
}
