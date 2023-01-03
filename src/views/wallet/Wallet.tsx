import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon, Loading, Text } from '../../components'
import { BitcoinAddressInput, SlideToUnlock } from '../../components/inputs'
import { BigSatsFormat } from '../../components/text'
import { OverlayContext } from '../../contexts/overlay'
import { useValidatedState } from '../../hooks'
import { WithdrawalConfirmation } from '../../overlays/WithdrawalConfirmation'
import tw from '../../styles/tailwind'
import { account } from '../../utils/account'
import { openInWallet } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { getFeeEstimate } from '../../utils/peachAPI'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useWalletSetup } from './hooks/useWalletSetup'

const bitcoinAddressRules = { required: false, bitcoinAddress: true }
const openWalletApp = () => openInWallet('bitcoin:')

export default () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const closeOverlay = useMemo(() => () => updateOverlay({ visible: false }), [updateOverlay])

  const { walletStore } = useWalletSetup()
  const [address, setAddress, isValid, addressErrors] = useValidatedState<string>('', bitcoinAddressRules)

  const onChange = useCallback(
    (value: string) => {
      setAddress(value)
    },
    [setAddress],
  )

  const confirmWithdrawal = async () => {
    closeOverlay()
    let feeRate = account.settings.customFeeRate
    if (
      typeof feeRate !== 'number'
      && account.settings.selectedFeeRate
      && account.settings.selectedFeeRate !== 'custom'
    ) {
      const [estimatedFees] = await getFeeEstimate({})
      if (estimatedFees) feeRate = estimatedFees[account.settings.selectedFeeRate]
    }
    console.log('withdrawing', feeRate)
    console.log(await peachWallet.withdrawAll(address, feeRate))
  }

  const openWithdrawalConfirmation = () =>
    updateOverlay({
      title: i18n('wallet.confirmWithdraw.title'),
      content: <WithdrawalConfirmation />,
      visible: true,
      action2: {
        callback: closeOverlay,
        label: i18n('cancel'),
        icon: 'xCircle',
      },
      action1: {
        callback: confirmWithdrawal,
        label: i18n('wallet.confirmWithdraw.confirm'),
        icon: 'arrowRightCircle',
      },
      level: 'APP',
    })

  useFocusEffect(
    useCallback(() => {
      peachWallet.syncWallet()
    }, []),
  )

  return (
    <View style={tw`h-full flex flex-col justify-between px-8`}>
      <View style={tw`h-full flex-shrink flex flex-col justify-center items-center`}>
        <Text style={tw`button-medium mb-4`}>{i18n('wallet.totalBalance')}:</Text>
        <BigSatsFormat style={!peachWallet.synced ? tw`opacity-60` : {}} sats={walletStore.balance} />
        {!peachWallet.synced && <Loading style={tw`absolute`} />}
        <Text style={tw`button-medium mt-16`}>{i18n('wallet.withdrawTo')}:</Text>
        <BitcoinAddressInput
          style={tw`mt-4`}
          {...{
            onChange,
            isValid,
            value: address,
            errorMessage: addressErrors,
          }}
        />
        <TouchableOpacity style={tw`flex-row justify-center items-center`} onPress={openWalletApp}>
          <Text style={tw`body-s underline text-black-2 uppercase`}>{i18n('wallet.openWalletApp')}</Text>
          <Icon id="externalLink" style={tw`w-4 h-4 ml-1 -mt-1`} color={tw`text-primary-main`.color} />
        </TouchableOpacity>
      </View>
      <SlideToUnlock
        style={tw`mb-6`}
        disabled={!walletStore.balance || !peachWallet.synced || !address || !isValid}
        label1={i18n('wallet.withdrawAll')}
        onUnlock={openWithdrawalConfirmation}
      />
    </View>
  )
}
