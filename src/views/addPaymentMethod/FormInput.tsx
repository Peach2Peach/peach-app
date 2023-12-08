import { useMemo } from 'react'
import { Control, useController } from 'react-hook-form'
import { PaymentMethodField } from '../../../peach-api/src/@types/payment'
import { Input } from '../../components/inputs'
import { InputProps } from '../../components/inputs/Input'
import i18n from '../../utils/i18n'
import { getMessages } from '../../utils/validation'
import { Formatter, formatters } from '../../utils/validation/formatters'
import { getValidators } from '../../utils/validation/validators'
import { FormType } from './PaymentMethodForm'

type Props = {
  control: Control<FormType>
  name: PaymentMethodField
  optional?: boolean
  defaultValue?: string
} & InputProps

export function FormInput ({ control, name, optional = false, defaultValue = '', ...inputProps }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    name,
    rules: {
      required: optional ? false : getMessages().required,
      validate: getValidators(name, optional),
    },
  })

  const inputFormatter = useMemo(() => {
    const result = Formatter.safeParse(name)
    return result.success ? formatters[result.data] : (val: string) => val
  }, [name])

  return (
    <Input
      label={i18n(`form.${name}`)}
      placeholder={i18n(`form.${name}.placeholder`)}
      value={field.value}
      errorMessage={error?.message ? [error.message] : undefined}
      onChangeText={field.onChange}
      keyboardType={name === 'phone' ? 'phone-pad' : name === 'email' ? 'email-address' : undefined}
      onEndEditing={(val) => field.onChange(inputFormatter(val))}
      onSubmit={(val) => field.onChange(inputFormatter(val))}
      required={!optional}
      autoCorrect={false}
      {...inputProps}
    />
  )
}