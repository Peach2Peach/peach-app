import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import tw from '../../styles/tailwind'

import shallow from 'zustand/shallow'
import { Fade, Headline, PeachScrollView, TextLink, Title } from '../../components'
import { BitcoinAddressInput } from '../../components/inputs'
import { OverlayContext } from '../../contexts/overlay'
import { useKeyboard, useValidatedState } from '../../hooks'
import { useSettingsStore } from '../../store/settingsStore'
import { account } from '../../utils/account'
import i18n from '../../utils/i18n'
import { peachWallet } from '../../utils/wallet/setWallet'
import { BuyViewProps } from './BuyPreferences'
import IDontHaveAWallet from './components/IDontHaveAWallet'

const addressRules = { required: true, bitcoinAddress: true }

export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [peachWalletActive] = useSettingsStore((state) => [state.peachWalletActive], shallow)

  const [address, setAddress, addressIsValid, addressErrors] = useValidatedState(
    offer.releaseAddress || '',
    addressRules,
  )
  const keyboardOpen = useKeyboard()
  const [displayErrors, setDisplayErrors] = useState(false)

  const showIDontHaveAWallet = () =>
    updateOverlay({
      content: <IDontHaveAWallet />,
      visible: true,
    })

  useEffect(() => {
    if (!address && !offer.releaseAddress) {
      setStepValid(false)
      return
    }

    if (!addressIsValid) {
      setStepValid(false)
      setDisplayErrors(true)
      return
    }

    Keyboard.dismiss()
    setStepValid(true)

    updateOffer(
      {
        ...offer,
        releaseAddress: address,
      },
      false,
    )
  }, [address, addressIsValid, setStepValid, updateOffer])

  useEffect(() => {
    ;(async () => {
      if (!peachWalletActive) {
        setAddress(account.settings.payoutAddress || '')
      } else {
        setAddress((await peachWallet.getReceivingAddress()) || '')
      }
    })()
  }, [peachWalletActive, setAddress])

  return (
    <PeachScrollView style={tw`flex-shrink h-full`} contentContainerStyle={tw`h-full px-6`}>
      <View style={tw`flex-col justify-between flex-shrink h-full`}>
        <Title title={i18n('buy.title')} />
        <View>
          <Headline style={tw`text-grey-1`}>{i18n('buy.releaseAddress')}</Headline>
          <BitcoinAddressInput
            style={tw`mt-3`}
            {...{
              value: address,
              onChange: setAddress,
              errorMessage: displayErrors ? addressErrors : undefined,
            }}
          />
          <Fade show={!keyboardOpen} displayNone={false}>
            <View style={tw`pb-10`}>
              <TextLink style={tw`mt-4 text-center`} onPress={showIDontHaveAWallet}>
                {i18n('iDontHaveAWallet')}
              </TextLink>
            </View>
          </Fade>
        </View>
        <View>{/* layout dummy */}</View>
      </View>
    </PeachScrollView>
  )
}
