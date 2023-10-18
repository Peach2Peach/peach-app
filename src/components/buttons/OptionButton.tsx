import tw from '../../styles/tailwind'
import { ButtonProps, OldButton } from './Button'

type OptionButtonProps = Omit<ButtonProps, 'borderColor' | 'textColor'>

export const OptionButton = (props: OptionButtonProps) => (
  <OldButton {...props} borderColor={tw`border-black-2`} textColor={tw`text-black-2`} />
)
