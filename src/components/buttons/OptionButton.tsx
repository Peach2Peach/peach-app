import tw from '../../styles/tailwind'
import { Button, ButtonProps } from './Button'

type OptionButtonProps = Omit<ButtonProps, 'ghost' | 'textColor'>

export const OptionButton = (props: OptionButtonProps) => <Button {...props} ghost textColor={tw`text-black-2`} />
