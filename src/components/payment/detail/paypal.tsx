import Clipboard from '@react-native-clipboard/clipboard'
import React, { ReactElement, useState } from 'react'
import { Pressable, View } from 'react-native'
import { PaymentTemplateProps } from '..'
import { Text } from '../..'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'
import { Fade } from '../../animation'
import Icon from '../../Icon'
import { Headline } from '../../text'

export const DetailPaypal = ({ paymentData }: PaymentTemplateProps): ReactElement => {
  const [showCopiedUserName, setShowCopiedUserName] = useState(false)

  const copyUserName = () => {
    Clipboard.setString(paymentData.userName)
    setShowCopiedUserName(true)
    setTimeout(() => setShowCopiedUserName(false), 500)
  }

  return <View>
    <View style={tw`z-10`}><Pressable onPress={copyUserName} style={tw`absolute right-0 mt-2`}>
      <Fade show={showCopiedUserName} duration={300} delay={0}>
        <Text style={tw`font-baloo text-grey-1 text-sm uppercase absolute -top-6 w-20 left-1/2 -ml-10 text-center`}>
          {i18n('copied')}
        </Text>
      </Fade>
      <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-grey-3`.color as string}/>
    </Pressable></View>
    <Headline style={tw`text-grey-2 normal-case mt-4`}>
      {i18n('contract.payment.to')}
    </Headline>
    <Text style={tw`text-center text-grey-2`}>{paymentData.paypal}</Text>
  </View>
}
export default DetailPaypal