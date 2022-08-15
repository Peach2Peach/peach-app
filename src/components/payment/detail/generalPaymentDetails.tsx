import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { APPLINKS } from '../../../constants'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { openAppLink } from '../../../utils/web'

import { Headline, Text, TextLink } from '../../text'
import { CopyAble, HorizontalLine } from '../../ui'

const possibleFields = [
  'beneficiary',
  'userName',
  'email',
  'phone',
]

export const GeneralPaymentDetails = ({
  paymentData,
  appLink,
  fallbackUrl,
}: PaymentTemplateProps): ReactElement => {
  const openApp = () => fallbackUrl ? openAppLink(fallbackUrl, appLink) : {}
  const openUserLink = async () => openAppLink(`${APPLINKS.paypal!.userLink}${paymentData.userName.replace('@', '')}`)

  return <View>
    {possibleFields
      .filter(field => paymentData[field])
      .map((field, i) => <View key={field}>
        {i > 0 ? <HorizontalLine style={tw`mt-4`} /> : null}
        <View style={tw`z-10`}><CopyAble style={tw`absolute right-0 mt-2 ml-2`} value={paymentData[field]} /></View>
        <Headline style={tw`text-grey-2 normal-case mt-4`}>
          {i18n(i > 0 ? 'or' : 'contract.payment.to')}
        </Headline>
        {field === 'userName'
          ? <TextLink style={tw`text-center text-grey-2`} onPress={openUserLink}>{paymentData[field]}</TextLink>
          : appLink || fallbackUrl
            ? <TextLink style={tw`text-center text-grey-2`} onPress={openApp}>{paymentData[field]}</TextLink>
            : <Text style={tw`text-center text-grey-2`}>{paymentData[field]}</Text>
        }
      </View>)}
  </View>
}

export default GeneralPaymentDetails