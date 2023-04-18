import i18n from '../../utils/i18n'
import { Input } from './index'
import { InputProps } from './Input'

export const LabelInput = (props: InputProps) => (
  <Input
    label={i18n('form.paymentMethodName')}
    placeholder={i18n('form.paymentMethodName.placeholder')}
    autoCorrect={false}
    {...props}
  />
)
