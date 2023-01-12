import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import tw from '../../styles/tailwind'

import Clipboard from '@react-native-clipboard/clipboard'
import { BarCodeReadEvent } from 'react-native-camera'
import { Fade, Headline, IconButton, Input, ScanQR, TextLink, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import { OverlayContext } from '../../contexts/overlay'
import { parseBitcoinRequest } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { cutOffAddress } from '../../utils/string'
import { BuyViewProps } from './BuyPreferences'
import IDontHaveAWallet from './components/IDontHaveAWallet'
import { useValidatedState, useKeyboard } from '../../hooks'
import { account } from '../../utils/account'
import { peachWallet } from '../../utils/wallet/setWallet'
import { useSettingsStore } from '../../store/settingsStore'
import shallow from 'zustand/shallow'

const addressRules = { required: true, bitcoinAddress: true }
export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [peachWalletActive] = useSettingsStore((state) => [state.peachWalletActive], shallow)
  useContext(LanguageContext)

  const [address, setAddress, addressIsValid, addressErrors] = useValidatedState(
    offer.releaseAddress || account.settings.payoutAddress || '',
    addressRules,
  )
  const [shortAddress, setShortAddress] = useState(offer.releaseAddress ? cutOffAddress(offer.releaseAddress) : '')
  const [focused, setFocused] = useState(false)
  const keyboardOpen = useKeyboard()
  const [scanQR, setScanQR] = useState(false)
  const [displayErrors, setDisplayErrors] = useState(false)

  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    setAddress(request.address || clipboard)
    Keyboard.dismiss()
  }

  const focus = () => setFocused(() => true)
  const unFocus = () => setFocused(() => false)
  const showQRScanner = () => setScanQR(true)
  const closeQRScanner = () => setScanQR(false)
  const onQRScanSuccess = (e: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(e.data)

    setAddress(request.address || e.data)
    setScanQR(false)
  }
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

    setShortAddress(cutOffAddress(address || offer.releaseAddress || ''))

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
  }, [address, addressIsValid])

  useEffect(() => {
    ;(async () => {
      if (!peachWalletActive || address) return
      setAddress((await peachWallet.getReceivingAddress()) || '')
    })()
  }, [address, peachWalletActive, setAddress])

  return (
    <View style={tw`flex-col justify-between h-full px-6`}>
      <Title title={i18n('buy.title')} />
      <View>
        <Headline style={tw`text-grey-1`}>{i18n('buy.releaseAddress')}</Headline>
        <View style={tw`flex flex-row mt-3`}>
          <View style={tw`flex-shrink w-full mr-2`}>
            <Input
              value={focused ? address : shortAddress}
              style={tw`pl-4 pr-8`}
              onChange={(value: string) => (focused ? setAddress(() => value) : null)}
              disableOnEndEditing={true}
              onSubmit={unFocus}
              onFocus={focus}
              onBlur={unFocus}
              placeholder={i18n('form.address.btc')}
              isValid={addressIsValid}
              errorMessage={displayErrors ? addressErrors : undefined}
            />
          </View>
          <IconButton icon="camera" title={i18n('scanQR')} style={tw`mr-2`} onPress={showQRScanner} />
          <IconButton icon="copy" title={i18n('paste')} onPress={pasteAddress} />
        </View>
      </View>
      {scanQR ? (
        <View style={tw`mt-20`}>
          <ScanQR onSuccess={onQRScanSuccess} onCancel={closeQRScanner} />
        </View>
      ) : null}

      <Fade show={!keyboardOpen} displayNone={false}>
        <View style={tw`pb-10`}>
          <TextLink style={tw`mt-4 text-center`} onPress={showIDontHaveAWallet}>
            {i18n('iDontHaveAWallet')}
          </TextLink>
        </View>
      </Fade>
    </View>
  )
}
