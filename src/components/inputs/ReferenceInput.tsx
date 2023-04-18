import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const ReferenceInput = (props: InputProps) => (
  <Input
    required={false}
    label={i18n('form.reference')}
    placeholder={i18n('form.reference.placeholder')}
    autoCorrect={false}
    {...props}
  />
)
