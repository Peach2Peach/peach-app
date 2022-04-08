import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Button, Text } from '../..'
import i18n from '../../../utils/i18n'
import { Checkboxes } from '..'

import { account, updatePaymentData } from '../../../utils/account'
import { OverlayContext } from '../../../utils/overlay'
import NoPaymentMethods from './NoPaymentMethods'
import AddPaymentMethod from './AddPaymentMethod'
import { PaymentMethodForms } from './paymentForms'
import { Headline } from '../../text'
import { paymentMethodAllowedForCurrencies } from '../../../utils/validation'

type PaymentMethodViewProps = {
  data: PaymentData
}

const PaymentMethodView = ({ data }: PaymentMethodViewProps) => {
  const PaymentForm = PaymentMethodForms[data.type]


  return <View style={tw`h-full w-full flex-shrink flex-col`}>
    <Headline style={tw`text-white-1 text-3xl leading-5xl`}>
      {i18n('paymentMethod.view')}
    </Headline>
    {PaymentForm
      ? <PaymentForm data={data} />
      : null
    }
  </View>
}
interface PaymentMethodsProps {
  paymentData: PaymentData[],
  currencies: Currency[],
  onChange?: (PaymentData: PaymentData[]) => void
}

/**
 * @description Component to display payment methods
 * @param props Component properties
 * @param props.paymentData array of saved payment methods
 * @param props.currencies array of selected currencies
 * @param [props.onChange] on change handler
 * @example
 */
// eslint-disable-next-line max-lines-per-function
export const PaymentMethods = ({ paymentData, currencies, onChange }: PaymentMethodsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [showAddNew, setShowAddNew] = useState(false)

  useEffect(() => {
    account.paymentData = account.paymentData.map(data => ({
      ...data,
      selected: data.selected ? paymentMethodAllowedForCurrencies(data.type, currencies) : false,
    }))
    updatePaymentData(account.paymentData)
    if (onChange) onChange(account.paymentData)
  }, [currencies])

  const addPaymentMethod = (data: PaymentData) => {
    data.selected = true
    account.paymentData.push(data)
    updatePaymentData(account.paymentData)
    setShowAddNew(false)
    if (onChange) onChange(account.paymentData)
  }


  const openAddPaymentMethodDialog = () => updateOverlay({
    content: <AddPaymentMethod onSubmit={addPaymentMethod} />,
    showCloseButton: false
  })
  return <View>
    {paymentData.length
      ? <View style={tw`w-full flex-row mt-2`}>
        <View style={tw`w-full flex-shrink`}>
          <Checkboxes
            items={paymentData.map((data: PaymentData) => ({
              value: data.id,
              disabled: !paymentMethodAllowedForCurrencies(data.type, currencies),
              display: <View style={tw`flex-row pr-3`}>
                <View style={tw`w-3/4 flex-shrink`}>
                  <Text numberOfLines={1} ellipsizeMode="tail">
                    {(data.iban || data.email || data.phone || data.paypal)}
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
          {paymentData.map((data: PaymentData, i) => <Button
            key={data.id}
            style={i > 0 ? tw`h-10 mt-4` : tw`h-10`}
            onPress={() => updateOverlay({
              content: <PaymentMethodView data={data} />,
              showCloseButton: true
            })}
            title={i18n('view')}
          />
          )}
        </View>
      </View>
      : <NoPaymentMethods />
    }
    <View style={tw`flex items-center mt-2`}>
      {showAddNew
        ? null
        : <Button
          secondary={true}
          wide={false}
          onPress={openAddPaymentMethodDialog}
          title={i18n('addNew')}
        />
      }
    </View>
  </View>
}

export default PaymentMethods