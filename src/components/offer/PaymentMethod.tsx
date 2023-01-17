import React, { ReactElement } from 'react'
import { Pressable, View } from 'react-native'
import { APPLINKS } from '../../constants'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { openAppLink } from '../../utils/web'
import Icon from '../Icon'
import { Selector } from '../inputs'
import { Headline, Text } from '../text'

type PaymentMethodProps = ComponentProps & {
  paymentMethod: PaymentMethod
  showLink: boolean
}

export const PaymentMethod = ({ paymentMethod, showLink, style }: PaymentMethodProps): ReactElement => {
  const url = APPLINKS[paymentMethod]?.url
  const appLink = APPLINKS[paymentMethod]?.appLink
  const openLink = () => (url ? openAppLink(url, appLink) : null)

  return (
    <View style={style}>
      <Headline style={tw`normal-case text-grey-2`}>
        {i18n(paymentMethod === 'cash' ? 'contract.summary.in' : 'contract.summary.on')}
      </Headline>
      <Selector
        items={[
          {
            value: paymentMethod,
            display: i18n(`paymentMethod.${paymentMethod}`),
          },
        ]}
        style={tw`mt-2`}
      />
      {url && showLink ? (
        <Pressable style={tw`flex-row items-center justify-center`} onPress={openLink}>
          <Text style={tw`underline text-peach-1`}>{i18n(/giftCard/u.test(paymentMethod) ? 'buy' : 'open')}</Text>
          <Icon id="link" style={tw`w-3 h-3 ml-1`} color={tw`text-peach-1`.color} />
        </Pressable>
      ) : null}
    </View>
  )
}
