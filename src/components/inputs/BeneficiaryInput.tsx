import i18n from '../../utils/i18n'
import { Input, InputProps } from './Input'

export const BeneficiaryInput = (props: InputProps) => (
  <Input
    required={true}
    label={i18n('form.beneficiary')}
    placeholder={i18n('form.beneficiary.placeholder')}
    autoCorrect={false}
    {...props}
  />
)
