import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, RadioButtons, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type KYCProps = {
  kyc: boolean,
  setKYC: (kyc: boolean) => void,
  kycType: KYCType,
  setKYCType: (kycType: KYCType) => void,
}
export default ({ kyc, setKYC, kycType, setKYCType }: KYCProps): ReactElement => <View>
  <Headline style={tw`mt-16`}>
    {i18n('sell.kyc')}
  </Headline>
  <RadioButtons
    style={tw`px-7 mt-2`}
    items={[
      { value: true, display: <Text>{i18n('yes')}</Text> },
      { value: false, display: <Text>{i18n('no')}</Text> }
    ]}
    selectedValue={kyc}
    onChange={value => setKYC(value as boolean)}/>
  {kyc
    ? <RadioButtons
      style={tw`px-7 mt-6`}
      items={[
        { value: 'iban', display: <Text>{i18n('sell.kyc.iban')} ({i18n('default')})</Text> },
        { value: 'id', display: <Text>{i18n('sell.kyc.id')}</Text> }
      ]}
      selectedValue={kycType || 'iban'}
      onChange={value => setKYCType(value as KYCType)}/>
    : null
  }
</View>