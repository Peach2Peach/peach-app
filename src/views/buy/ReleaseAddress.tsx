import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import tw from '../../styles/tailwind'

import Clipboard from '@react-native-clipboard/clipboard'
import { BarCodeReadEvent } from 'react-native-camera'
import { Fade, Headline, IconButton, Input, ScanQR, TextLink, Title } from '../../components'
import LanguageContext from '../../contexts/language'
import { OverlayContext } from '../../contexts/overlay'
import keyboard from '../../effects/keyboard'
import { parseBitcoinRequest } from '../../utils/bitcoin'
import i18n from '../../utils/i18n'
import { cutOffAddress } from '../../utils/string'
import { getMessages, rules } from '../../utils/validation'
import { BuyViewProps } from './BuyPreferences'
import IDontHaveAWallet from './components/IDontHaveAWallet'

const { useValidation } = require('react-native-form-validator')

// eslint-disable-next-line max-lines-per-function
export default ({ offer, updateOffer, setStepValid }: BuyViewProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  useContext(LanguageContext)

  const [address, setAddress] = useState(offer.releaseAddress)
  const [shortAddress, setShortAddress] = useState(offer.releaseAddress ? cutOffAddress(offer.releaseAddress) : '')
  const [focused, setFocused] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  const [scanQR, setScanQR] = useState(false)

  const { validate, isFieldInError, getErrorsInField, isFormValid } = useValidation({
    deviceLocale: 'default',
    state: { address },
    rules,
    messages: getMessages()
  })

  const pasteAddress = async () => {
    const clipboard = await Clipboard.getString()
    const request = parseBitcoinRequest(clipboard)
    setAddress(request.address || clipboard)
    Keyboard.dismiss()
  }

  useEffect(() => {
    if (!address && !offer.releaseAddress) {
      setStepValid(false)
      return
    }

    setShortAddress(cutOffAddress(address || offer.releaseAddress || ''))

    validate({
      address: {
        required: true,
        bitcoinAddress: true
      }
    })
    if (!isFormValid()) {
      setStepValid(false)
      return
    }

    Keyboard.dismiss()
    setStepValid(true)

    updateOffer({
      ...offer,
      releaseAddress: address,
    }, false)
  }, [address])

  useEffect(keyboard(setKeyboardOpen), [])

  const showQRScanner = () => setScanQR(true)
  const closeQRScanner = () => setScanQR(false)
  const onQRScanSuccess = (e: BarCodeReadEvent) => {
    const request = parseBitcoinRequest(e.data)

    setAddress(request.address || e.data)
    setScanQR(false)
  }
  const showIDontHaveAWallet = () => updateOverlay({
    content: <IDontHaveAWallet />, showCloseButton: true
  })
  return <View style={tw`h-full flex-col justify-between px-6`}>
    <Title title={i18n('buy.title')} />
    <View>
      <Headline style={tw`text-grey-1`}>
        {i18n('buy.releaseAddress')}
      </Headline>
      <View style={tw`flex flex-row mt-3`}>
        <View style={tw`w-full flex-shrink mr-2`}>
          <Input value={focused ? address : shortAddress}
            style={tw`pl-4 pr-8`}
            onChange={(value: string) => focused ? setAddress(() => value) : null}
            onSubmit={() => setFocused(() => false)}
            placeholder={i18n('form.address.btc')}
            isValid={!isFieldInError('address')}
            onFocus={() => setFocused(() => true)}
            onBlur={() => setFocused(() => false)}
            errorMessage={getErrorsInField('address')}
          />
        </View>
        <IconButton
          icon="camera"
          title={i18n('scanQR')}
          style={tw`mr-2`}
          onPress={showQRScanner}
        />
        <IconButton
          icon="copy"
          title={i18n('paste')}
          onPress={pasteAddress}
        />
      </View>
    </View>
    {scanQR
      ? <View style={tw`mt-20`}>
        <ScanQR onSuccess={onQRScanSuccess} onCancel={closeQRScanner}/>
      </View>
      : null}

    <Fade show={!keyboardOpen} displayNone={false}>
      <View style={tw`pb-10`}>
        <TextLink style={tw`mt-4 text-center`} onPress={showIDontHaveAWallet}>
          {i18n('iDontHaveAWallet')}
        </TextLink>
      </View>
    </Fade>
  </View>
}