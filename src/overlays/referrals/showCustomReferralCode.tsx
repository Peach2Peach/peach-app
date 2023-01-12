import React, { ReactElement, useState } from 'react'
import { View, Text } from 'react-native'
import { Input } from '../../components'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'

export const showCustomReferralCode = (updateOverlay: Function) => {
  const [customReferral, setCustomReferral] = useState('')
  const CustomReferralCodeForm = (): ReactElement => (
    <View>
      <Text style={tw`mb-2 body-m text-black-1`}>{i18n('referrals.reward.customReferralCode.description')}</Text>
      <Input
        style={tw`bg-primary-background-heavy`}
        onChange={setCustomReferral}
        value={customReferral}
        placeholder={i18n('referrals.reward.customReferralCode.placeholder')}
        autoCorrect={false}
      />
    </View>
  )

  updateOverlay({
    title: i18n('referrals.reward.customReferralCode'),
    content: <CustomReferralCodeForm />,
    visible: true,
    action1: {
      callback: () => {
        // TODO : Callback to server
      },
      label: i18n('referrals.reward.customReferralCode.setReferral'),
      icon: 'checkSquare',
    },
    action2: {
      disabled: customReferral !== '',
      callback: () => {
        updateOverlay({ visible: false })
      },
      label: i18n('close'),
      icon: 'xSquare',
    },
    level: 'APP',
  })
}
