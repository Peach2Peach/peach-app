import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { APPLINKS } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { openAppLink } from '../../../utils/web'

import { Headline, Text, TextLink } from '../../text'
import { CopyAble, HorizontalLine } from '../../ui'

export const GeneralPaymentDetails = ({
  paymentData,
}: PaymentTemplateProps): ReactElement => {
  const openApp = () => fallbackUrl ? openAppLink(fallbackUrl, appLink) : {}
  const openUserLink = async () => openAppLink(`${APPLINKS.paypal!.userLink}${paymentData.userName.replace('@', '')}`)

  return <View>
    <Headline style={tw`text-grey-2 normal-case mt-4`}>
      {i18n('contract.payment.at')}
    </Headline>
    <Text style={tw`text-center text-grey-2`}>
      location agreed in chat
    </Text>
  </View>
}

export default GeneralPaymentDetails