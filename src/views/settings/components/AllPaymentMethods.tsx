import React, { ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Button } from '../../../components'
import i18n from '../../../utils/i18n'

import { account } from '../../../utils/account'
import { OverlayContext } from '../../../contexts/overlay'
import NoPaymentMethods from '../../../components/inputs/paymentMethods/NoPaymentMethods'
import AddPaymentMethod from '../../../components/inputs/paymentMethods/AddPaymentMethod'
import { PaymentMethodView } from '../../../components/inputs/paymentMethods/PaymentMethodView'
import { Text } from '../../../components/text'

type PaymentMethodsProps = {
  onChange?: (PaymentData: PaymentData[]) => void,
}

/**
 * @description Component to display payment methods
 * @param props Component properties
 * @param [props.onChange] on change handler
 * @example
 */
export const PaymentMethods = ({ onChange }: PaymentMethodsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const [showAddNew, setShowAddNew] = useState(false)

  const onPaymentDataUpdate = () => {
    setShowAddNew(false)

    if (onChange) onChange({ ...account.paymentData })
    updateOverlay({ content: null, showCloseButton: true })
  }

  const openAddPaymentMethodDialog = () => updateOverlay({
    content: <AddPaymentMethod onSubmit={onPaymentDataUpdate} />,
    showCloseButton: false
  })
  return <View>
    {account.paymentData.length
      ? <View style={tw`w-full flex-row mt-2`}>
        {<View style={tw`w-full flex-shrink`}>
          {account.paymentData.map((data, index) => <View
            key={data.id}
            style={[
              tw`bg-white-1 flex-row items-center p-3 px-4 h-12 border border-grey-4 rounded`,
              index > 0 ? tw`mt-2` : {}
            ]}>
            <Text>{data.id}</Text>
          </View>
          )}
        </View>
        }
        <View style={tw`ml-2 flex-shrink-0 mt-1`}>
          {account.paymentData
            .map((data, i) => <Button
              key={data.id}
              style={i > 0 ? tw`w-16 h-10 mt-4 flex` : tw`w-16 h-10`}
              onPress={() => updateOverlay({
                content: <PaymentMethodView data={data} onSubmit={onPaymentDataUpdate} />,
                showCloseButton: false
              })}
              title={i18n('edit')}
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