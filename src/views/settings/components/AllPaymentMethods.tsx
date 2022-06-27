import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import tw from '../../../styles/tailwind'
import { Button, Headline, PeachScrollView, Shadow } from '../../../components'
import i18n from '../../../utils/i18n'

import { account, addPaymentData } from '../../../utils/account'
import { OverlayContext } from '../../../contexts/overlay'
import NoPaymentMethods from '../../../components/inputs/paymentMethods/NoPaymentMethods'
import { PaymentMethodView } from '../../../components/inputs/paymentMethods/PaymentMethodView'
import { PaymentDataKeyFacts } from '../../../components/payment/PaymentDataKeyFacts'
import { mildShadow } from '../../../utils/layout'
import AddPaymentMethods from '../../../components/payment/AddPaymentMethods'
import { PAYMENTCATEGORIES } from '../../../constants'

const sortingMap = (Object.keys(PAYMENTCATEGORIES) as PaymentCategory[]).reduce((arr, cat) =>
  arr.concat(PAYMENTCATEGORIES[cat]), [] as PaymentMethod[]
)

const sortByType = (a: PaymentData, b: PaymentData) => {
  if (sortingMap.indexOf(a.type) === -1) return 1
  if (sortingMap.indexOf(b.type) === -1) return -1
  return sortingMap.indexOf(a.type) - sortingMap.indexOf(b.type)
}

type AllPaymentMethodsProps = {
  onChange?: (PaymentData: PaymentData[]) => void,
}

/**
 * @description Component to display payment methods
 * @param props Component properties
 * @param [props.onChange] on change handler
 * @example
 */
export const AllPaymentMethods = ({ onChange }: AllPaymentMethodsProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  const onPaymentDataUpdate = (data: PaymentData) => {
    addPaymentData(data)
    if (onChange) onChange({ ...account.paymentData })
    updateOverlay({ content: null, showCloseButton: true })
  }

  let currentType = ''

  return <View>
    <PeachScrollView>
      {account.paymentData.length
        ? account.paymentData
          .sort(sortByType)
          .map((data, index) => {
            let showHeadline = false
            if (currentType !== data.type) {
              showHeadline = true
              currentType = data.type
            }
            return <View key={data.id}>
              {showHeadline
                ? <Headline style={tw`mt-8 text-grey-1`}>
                  {i18n(`paymentMethod.${currentType}`)}
                </Headline>
                : null
              }
              <View style={[
                tw`flex-row items-center`,
                index > 0 ? tw`mt-4` : {}
              ]}>
                <Shadow shadow={mildShadow} style={tw`w-full flex-shrink`}>
                  <PaymentDataKeyFacts paymentData={data} style={tw`p-3 bg-white-1`} />
                </Shadow>
                <Button
                  key={data.id}
                  style={tw`flex-shrink-0 ml-2 w-16 h-10`}
                  onPress={() => updateOverlay({
                    content: <PaymentMethodView data={data} onSubmit={onPaymentDataUpdate} />,
                    showCloseButton: false
                  })}
                  title={i18n('edit')}
                />
              </View>
            </View>
          })
        : <NoPaymentMethods />
      }
      <AddPaymentMethods style={tw`mt-10`} onUpdate={() => {}} view="buyer" />
    </PeachScrollView>
  </View>
}

export default AllPaymentMethods