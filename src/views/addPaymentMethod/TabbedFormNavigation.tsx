import { useMemo, useState } from 'react'
import { Control, FieldError } from 'react-hook-form'
import { PaymentMethodField } from '../../../peach-api/src/@types/payment'
import { TabbedNavigation } from '../../components/navigation'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { FormInput } from './FormInput'
import { FormType } from './PaymentMethodForm'

type Props = {
  row: PaymentMethodField[][]
  control: Control<FormType>
  paymentData: Partial<PaymentData> & {
    type: PaymentMethod
    currencies: Currency[]
  }
  getFieldState: (name: keyof FormType) => {
    invalid: boolean
    isDirty: boolean
    isTouched: boolean
    error?: FieldError | undefined
  }
  getValues: (fieldName?: PaymentMethodField) => unknown
}

export function TabbedFormNavigation ({ row, control, paymentData, getFieldState, getValues }: Props) {
  const [selected, setSelected] = useState(0)
  const tabbedNavigationItems = row.map((column) => ({
    id: column[0],
    display: i18n(`form.${column[0]}`),
  }))

  const errorTabs = useMemo(() => {
    const fields: PaymentMethodField[] = []
    row.forEach((column, index) => {
      column.some((field) => {
        const fieldHasError = !!getValues(field) && getFieldState(field).error
        if (fieldHasError) {
          fields.push(tabbedNavigationItems[index].id)
          return true
        }
        return false
      })
    })
    return fields
  }, [getFieldState, getValues, row, tabbedNavigationItems])

  return (
    <>
      <TabbedNavigation
        items={tabbedNavigationItems}
        selected={tabbedNavigationItems[selected]}
        select={(item) => {
          setSelected(tabbedNavigationItems.indexOf(item))
        }}
        tabHasError={errorTabs}
        style={tw`pb-2`}
      />
      {row[selected].map((field) => {
        const otherColumns = row.filter((_column, index) => index !== selected)
        const hasValidColumnWithValues = otherColumns.some((column) =>
          column.every((f) => !!getValues(f) && !getFieldState(f).invalid),
        )

        return (
          <FormInput
            key={`formInput-${field}`}
            name={field}
            control={control}
            defaultValue={paymentData[field]}
            optional={hasValidColumnWithValues}
          />
        )
      })}
    </>
  )
}
