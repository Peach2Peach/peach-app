import tw from '../../styles/tailwind'
import { Bubble, BubbleProps } from './Bubble'

export type PrimaryBubbleProps = {
  border?: true
} & Partial<BubbleProps>

export const PrimaryBubble = (props: PrimaryBubbleProps) => {
  const { border } = props

  const color = border ? tw`bg-primary-background-light` : tw`bg-primary-main`
  const textColor = border ? tw`text-primary-main` : tw`text-primary-background-light`
  const borderColor = border && tw`border-primary-main`

  return <Bubble {...{ ...props, color, textColor, borderColor }} />
}
