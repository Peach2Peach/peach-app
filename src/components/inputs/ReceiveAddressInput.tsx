import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const ReceiveAddressInput = (props: InputProps) => (
  <Input
    label={i18n('form.receiveAddress')}
    placeholder={i18n('form.receiveAddress.placeholder')}
    autoCorrect={false}
    {...props}
  />
)
