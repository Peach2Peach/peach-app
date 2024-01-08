import { useMemo } from 'react'
import { View } from 'react-native'
import { shallow } from 'zustand/shallow'
import { NewBubble } from '../../components/bubble/Bubble'
import { useNavigation } from '../../hooks/useNavigation'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import { useAccountStore } from '../../utils/account/account'
import { getMessageToSignForAddress } from '../../utils/account/getMessageToSignForAddress'
import i18n from '../../utils/i18n'
import { isValidBitcoinSignature } from '../../utils/validation/isValidBitcoinSignature'
import { Section } from './components/Section'

export function WalletSelector ({ isPayout = false, offerId }: { isPayout?: boolean; offerId?: string }) {
  const [peachWalletActive, setPeachWalletActive, payoutAddress, payoutAddressLabel, payoutAddressSignature]
    = useSettingsStore(
      (state) => [
        state.peachWalletActive,
        state.setPeachWalletActive,
        state.payoutAddress,
        state.payoutAddressLabel,
        state.payoutAddressSignature,
      ],
      shallow,
    )
  const publicKey = useAccountStore((state) => state.account.publicKey)
  const navigation = useNavigation()

  const requiresMessageSigning = useMemo(
    () =>
      isPayout
      && (!payoutAddress
        || !payoutAddressSignature
        || !isValidBitcoinSignature(
          getMessageToSignForAddress(publicKey, payoutAddress),
          payoutAddress,
          payoutAddressSignature,
        )),
    [isPayout, payoutAddress, payoutAddressSignature, publicKey],
  )

  const onExternalWalletPress = () => {
    if (payoutAddress) {
      if (requiresMessageSigning) {
        navigation.navigate('signMessage', offerId ? { offerId } : undefined)
        return
      }
      setPeachWalletActive(false)
    } else if (!offerId) {
      navigation.navigate('payoutAddress', { type: isPayout ? 'payout' : 'refund' })
    } else {
      navigation.navigate('patchPayoutAddress', { offerId })
    }
  }

  const backgroundColor = isPayout ? tw.color('success-mild-1') : tw.color('primary-background-dark')
  const bubbleColor = isPayout ? 'green' : 'orange'

  if (!peachWalletActive && requiresMessageSigning) {
    setPeachWalletActive(true)
  }

  return (
    <Section.Container style={{ backgroundColor }}>
      <Section.Title>{i18n(isPayout ? 'offerPreferences.payoutTo' : 'offerPreferences.refundTo')}</Section.Title>
      <View style={tw`flex-row items-center gap-10px`}>
        <NewBubble color={bubbleColor} ghost={!peachWalletActive} onPress={() => setPeachWalletActive(true)}>
          {i18n('peachWallet')}
        </NewBubble>
        <NewBubble
          color={bubbleColor}
          ghost={peachWalletActive}
          iconId={!payoutAddress ? 'plusCircle' : undefined}
          onPress={onExternalWalletPress}
        >
          {payoutAddressLabel || i18n('externalWallet')}
        </NewBubble>
      </View>
    </Section.Container>
  )
}
