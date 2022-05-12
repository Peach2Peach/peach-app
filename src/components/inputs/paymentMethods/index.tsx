import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Button, Text } from '../..'
import i18n from '../../../utils/i18n'
import { Checkboxes } from '..'

import { account, updatePaymentData } from '../../../utils/account'
import { OverlayContext } from '../../../contexts/overlay'
import NoPaymentMethods from './NoPaymentMethods'
import AddPaymentMethod from './AddPaymentMethod'
import { PaymentMethodForms } from './paymentForms'
import { Headline } from '../../text'
import { getCheckboxItems } from './paymentMethodUtils'
import { paymentMethodAllowedForCurrencies, paymentMethodNotYetSelected } from '../../../utils/validation'

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
    data.selected = paymentMethodNotYetSelected(data, account.paymentData)
    account.paymentData.push(data)
    updatePaymentData(account.paymentData)
    setShowAddNew(false)

    // we use .map() here to make react understand there's a dependency update
    if (onChange) onChange(account.paymentData.map(d => d))
  }

  const checkboxItems = getCheckboxItems(paymentData, currencies)
  const selectedMoPs = paymentData.filter(data => data.selected).map(data => data.id)
  const onMoPSelect = (values: (string | number)[]) => {
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
  }
  const openAddPaymentMethodDialog = () => updateOverlay({
    content: <AddPaymentMethod onSubmit={addPaymentMethod} />,
    showCloseButton: false
  })
  return <View>
    {paymentData.length
      ? <View style={tw`w-full flex-row mt-2`}>
        <View style={tw`w-full flex-shrink`}>
          <Checkboxes items={checkboxItems} selectedValues={selectedMoPs} onChange={onMoPSelect}/>
        </View>
        <View style={tw`ml-2 flex-shrink-0 mt-1`}>
          {paymentData
            .filter(data => paymentMethodAllowedForCurrencies(data.type, currencies))
            .map((data, i) => <Button
              key={data.id}
              style={i > 0 ? tw`w-16 h-10 mt-4` : tw`w-16 h-10`}
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