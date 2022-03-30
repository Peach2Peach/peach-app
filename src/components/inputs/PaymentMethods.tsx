import React, { ReactElement, useState } from 'react'
import { View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { Shadow } from 'react-native-shadow-2'
import { mildShadow } from '../../utils/layout'
import { Button, MenuItem, Text } from '..'
import i18n from '../../utils/i18n'
import { Checkboxes, Input } from '.'
import { PAYMENTMETHODS } from '../../constants'

import { getMessages, rules } from '../../utils/validation'
import { account, updatePaymentData } from '../../utils/account'
const { useValidation } = require('react-native-form-validator')

interface PaymentFormProps {
  style?: ViewStyle|ViewStyle[],
  onSubmit: (data: PaymentData) => void
}

const NoPaymentMethods = (): ReactElement => <View style={tw`p-5 py-2 bg-white-1 border border-grey-4 rounded`}>
  <Shadow {...mildShadow} viewStyle={tw`w-full`}>
    <Text style={tw`text-center text-grey-2`}>
      {i18n('sell.paymentMethods.empty')}
    </Text>
  </Shadow>
</View>

const SEPA = ({ style, onSubmit }: PaymentFormProps): ReactElement => {
  const [iban, setIBAN] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { iban, beneficiary },
    rules,
    messages: getMessages()
  })

  const save = () => {
    validate({
      iban: {
        required: true,
        iban: true
      },
      beneficiary: {
        required: true,
      }
    })
    if (!isFormValid()) return
    onSubmit({
      id: `sepa-${iban.replace(/\s/gu, '')}`,
      type: 'sepa',
      iban,
      beneficiary,
    })
  }

  return <View style={style}>
    <View>
      <Input
        onChange={setIBAN}
        value={iban}
        label={i18n('form.iban')}
        isValid={!isFieldInError('iban')}
        autoCorrect={false}
        errorMessage={getErrorsInField('iban')}
      />
    </View>
    <View style={tw`mt-4`}>
      <Input
        onChange={setBeneficiary}
        value={beneficiary}
        label={i18n('form.beneficiary')}
        isValid={!isFieldInError('beneficiary')}
        autoCorrect={false}
        errorMessage={getErrorsInField('beneficiary')}
      />
    </View>
    <View style={tw`flex items-center mt-4`}>
      <Button
        wide={false}
        onPress={save}
        title={i18n('save')}
      />
    </View>
  </View>
}

const PaymentMethodForms = {
  sepa: SEPA
}


interface PaymentMethodsProps {
  paymentData: PaymentData[],
  onChange?: (PaymentData: PaymentData[]) => void
}

/**
 * @description Component to display payment methods
 * @param props Component properties
 * @param props.paymentData array of saved payment methods
 * @param [props.onChange] on change handler
 * @example
 */
// eslint-disable-next-line max-lines-per-function
export const PaymentMethods = ({ paymentData, onChange }: PaymentMethodsProps): ReactElement => {
  const [showAddNew, setShowAddNew] = useState(false)
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentMethod|null>(null)
  const PaymentMethodForm = newPaymentMethod ? PaymentMethodForms[newPaymentMethod] : null

  const addPaymentMethod = (data: PaymentData) => {
    account.paymentData.push(data)
    data.selected = true
    updatePaymentData(account.paymentData)
    setShowAddNew(false)
  }
  return <View>
    {paymentData.length
      ? <View style={tw`w-full flex-row mt-2`}>
        <View style={tw`w-full flex-shrink`}>
          <Checkboxes
            items={paymentData.map((data: PaymentData) => ({
              value: data.id,
              display: <View style={tw`flex-row pr-3`}>
                <View style={tw`w-3/4 flex-shrink`}>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {(data.iban || data.email || data.phone)}
                  </Text>
                </View>
                <View style={tw`w-1/4 flex-shrink-0`}>
                  <Text style={tw`text-right text-grey-1`}>{i18n(`paymentMethod.${data.type}`)}</Text>
                </View>
              </View>
            }))}
            selectedValues={paymentData.filter(data => data.selected).map(data => data.id)}
            onChange={values => {
              paymentData.forEach(data => data.selected = false)
              values.forEach(id => {
                const data = paymentData.find((d: PaymentData) => d.id === id)
                if (data) data.selected = true
              })
              if (onChange) {
                const updatedPaymentMethods = values
                  .map(id => paymentData.find((d: PaymentData) => d.id === id) as PaymentData)

                onChange(updatedPaymentMethods)
              }
            }}/>
        </View>
        <View style={tw`ml-2 flex-shrink-0 mt-1`}>
          {paymentData.map(data =>
            <Button
              key={data.id}
              style={tw`mb-4`}
              // eslint-disable-next-line no-alert
              onPress={() => alert(JSON.stringify(data))}
              // TODO implement real view
              title={i18n('view')}
            />
          )}
        </View>
      </View>
      : <NoPaymentMethods />
    }
    <View style={tw`flex items-center mt-2`}>
      {showAddNew
        ? <View style={tw`w-full`}>
          {!newPaymentMethod && PAYMENTMETHODS.map(PAYMENTMETHOD =>
            <MenuItem
              key={PAYMENTMETHOD}
              text={i18n(`paymentMethod.${PAYMENTMETHOD}`)}
              onPress={() => setNewPaymentMethod(PAYMENTMETHOD)}
            />
          )}
          {PaymentMethodForm
            ? <PaymentMethodForm style={tw`mt-4`} onSubmit={addPaymentMethod} />
            : null
          }
          <View style={tw`flex items-center mt-2`}>
            <Button
              secondary={true}
              wide={false}
              onPress={() => {
                setNewPaymentMethod(null)
                setShowAddNew(false)
              }}
              title={i18n('cancel')}
            />
          </View>
        </View>
        : <Button
          secondary={true}
          wide={false}
          onPress={() => setShowAddNew(true)}
          title={i18n('addNew')}
        />
      }
    </View>
  </View>
}

export default PaymentMethods