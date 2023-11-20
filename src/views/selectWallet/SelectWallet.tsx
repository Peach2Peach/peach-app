import { TouchableOpacity, View } from 'react-native'

import { useMemo } from 'react'
import { shallow } from 'zustand/shallow'
import { Icon, RadioButtons, Screen, Text } from '../../components'
import { Button } from '../../components/buttons/Button'
import { useNavigation, useRoute } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import tw from '../../styles/tailwind'
import { getMessageToSignForAddress } from '../../utils/account'
import { useAccountStore } from '../../utils/account/account'
import i18n from '../../utils/i18n'
import { isValidBitcoinSignature } from '../../utils/validation'

export const SelectWallet = () => {
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

  const wallets = useMemo(() => {
    const wllts = [{ value: 'peachWallet', display: i18n('peachWallet') }]
    if (payoutAddress) wllts.push({ value: 'externalWallet', display: payoutAddressLabel || i18n('externalWallet') })
    return wllts
  }, [payoutAddress, payoutAddressLabel])

  const setSelectedWallet = (selected: string) => {
    setPeachWalletActive(selected === 'peachWallet')
  }
  const route = useRoute<'selectWallet'>()
  const navigation = useNavigation()
  const publicKey = useAccountStore((state) => state.account.publicKey)

  const { type } = route.params

  const goToSetRefundWallet = () => navigation.navigate('payoutAddress', { type })

  const selectAndContinue = (): void | undefined => {
    if (type === 'refund' || peachWalletActive) return navigation.goBack()

    if (!payoutAddress) return undefined
    const message = getMessageToSignForAddress(publicKey, payoutAddress)
    if (!payoutAddressSignature || !isValidBitcoinSignature(message, payoutAddress, payoutAddressSignature)) {
      return navigation.navigate('signMessage')
    }
    return navigation.goBack()
  }

  return (
    <Screen header={i18n(`${type}.wallet.select.title`)}>
      <View style={tw`justify-center grow`}>
        <Text>{i18n(`${type}.wallet.select.description`)}</Text>
        <RadioButtons
          style={tw`mt-8`}
          items={wallets}
          selectedValue={peachWalletActive ? 'peachWallet' : 'externalWallet'}
          onButtonPress={setSelectedWallet}
        />
        {!payoutAddress && (
          <TouchableOpacity
            onPress={goToSetRefundWallet}
            style={[
              tw`flex-row items-center justify-between px-4 py-2 mt-2`,
              tw`border-2 border-transparent bg-primary-background-dark rounded-xl`,
            ]}
          >
            <Text style={tw`subtitle-1`}>{i18n(`${type}.wallet.select.setWallet`)}</Text>
            <Icon id="arrowRightCircle" style={tw`w-5 h-5`} color={tw`text-black-2`.color} />
          </TouchableOpacity>
        )}
      </View>
      <Button onPress={selectAndContinue} style={tw`self-center`}>
        {i18n('confirm')}
      </Button>
    </Screen>
  )
}
