import tw from '../../styles/tailwind'
import { ButtonProps, OldButton } from './Button'

export type PrimaryButtonProps = {
  white?: true
  border?: true
} & Partial<ButtonProps>

/** @deprecated Use NewButton instead */
export const PrimaryButton = (props: PrimaryButtonProps) => {
  const { white, border, disabled, textColor: propTextColor } = props

  const color = disabled
    ? tw`bg-primary-mild-1`
    : white && !border
      ? tw`bg-primary-background-light`
      : !border
        ? tw`bg-primary-main`
        : undefined
  const textColor
    = propTextColor !== undefined
      ? propTextColor
      : (!border && white) || (border && !white)
        ? tw`text-primary-main`
        : tw`text-primary-background-light`
  const borderColor = border ? (white ? tw`border-primary-background-light` : tw`border-primary-main`) : undefined

  return <OldButton {...{ ...props, color, textColor, borderColor }} />
}
