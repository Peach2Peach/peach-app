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
import { HorizontalLine } from '../../ui'

export const DetailIBAN = ({ paymentData }: PaymentTemplateProps): ReactElement => {
  const [showCopiedIBAN, setShowCopiedIBAN] = useState(false)
  const [showCopiedBeneficiary, setShowCopiedBeneficiary] = useState(false)

  const copyIBAN = () => {
    Clipboard.setString(paymentData.iban)
    setShowCopiedIBAN(true)
    setTimeout(() => setShowCopiedIBAN(false), 500)
  }
  const copyBeneficiary = () => {
    Clipboard.setString(paymentData.beneficiary)
    setShowCopiedBeneficiary(true)
    setTimeout(() => setShowCopiedBeneficiary(false), 500)
  }

  return <View>
    <View style={tw`z-10`}><Pressable onPress={copyIBAN} style={tw`absolute right-0 mt-2`}>
      <Fade show={showCopiedIBAN} duration={300} delay={0}>
        <Text style={tw`font-baloo text-grey-1 text-sm uppercase absolute -top-6 w-20 left-1/2 -ml-10 text-center`}>
          {i18n('copied')}
        </Text>
      </Fade>
      <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-grey-3`.color as string}/>
    </Pressable></View>
    <Headline style={tw`text-grey-2 normal-case mt-4`}>
      {i18n('contract.payment.to')}
    </Headline>
    <Text style={tw`text-center text-grey-2`}>{paymentData.iban}</Text>
    <HorizontalLine style={tw`mt-4`}/>
    <View style={tw`z-10`}><Pressable onPress={copyBeneficiary} style={tw`absolute right-0 mt-2`}>
      <Fade show={showCopiedBeneficiary} duration={300} delay={0}>
        <Text style={tw`font-baloo text-grey-1 text-sm uppercase absolute -top-6 w-20 left-1/2 -ml-10 text-center`}>
          {i18n('copied')}
        </Text>
      </Fade>
      <Icon id="copy" style={tw`w-7 h-7 ml-2`} color={tw`text-grey-3`.color as string}/>
    </Pressable></View>
    <Headline style={tw`text-grey-2 normal-case mt-4`}>
      {i18n('form.beneficiary')}
    </Headline>
    <Text style={tw`text-center text-grey-2`}>{paymentData.beneficiary}</Text>
  </View>
}
export default DetailIBAN