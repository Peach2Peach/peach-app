import React, { ReactElement } from 'react'
import { View } from 'react-native'
import { Headline, RadioButtons, Text } from '../../../components'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

type KYCProps = {
  kyc: boolean,
  setKYC: (kyc: boolean) => void,
}
export default ({ kyc, setKYC }: KYCProps): ReactElement => <View>
  <Headline style={tw`mt-16`}>
    {i18n('buy.kyc')}
  </Headline>
  <RadioButtons
    style={tw`px-7 mt-2`}
    items={[
      { value: true, display: <Text>{i18n('yes')}</Text> },
      { value: false, display: <Text>{i18n('no')}</Text> }
    ]}
    selectedValue={kyc}
    onChange={value => setKYC(value as boolean)}/>
</View>