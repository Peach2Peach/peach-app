import { useState } from 'react'
import { View } from 'react-native'
import { HorizontalLine, Input, NewHeader, PeachScrollView, Screen, Text } from '../../components'
import { BitcoinAddressInput, ConfirmSlider } from '../../components/inputs'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { NetworkFees } from '../settings/NetworkFees'

export const SendBitcoin = () => {
  const [address, setAddress] = useState('')
  return (
    <Screen>
      <NewHeader title={i18n('wallet.sendBitcoin.title')} />
      <PeachScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Section title={i18n('wallet.sendBitcoin.to')}>
          <BitcoinAddressInput value={address} onChange={setAddress} />
        </Section>

        <HorizontalLine />

        <Section title={i18n('wallet.sendBitcoin.amount')}>
          <Input />
        </Section>

        <HorizontalLine />

        <Section title={i18n('wallet.sendBitcoin.fee')}>
          <NetworkFees />
        </Section>

        <HorizontalLine />

        <Section title={i18n('wallet.sendBitcoin.sendingFrom')}>
          <Text>Send All</Text>
        </Section>

        <ConfirmSlider label1="send transaction" onConfirm={() => {}} />
      </PeachScrollView>
    </Screen>
  )
}

function Section ({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <View style={tw`flex-grow`}>
      <View style={tw`flex-row items-center justify-between`}>
        <Text style={tw`h6`}>{title}</Text>
        {action}
      </View>
      <View style={tw`mt-4`}>{children}</View>
    </View>
  )
}
