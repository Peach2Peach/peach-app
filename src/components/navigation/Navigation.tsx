import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import { Button } from '..'
import Icon from '../Icon'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import { Text } from '../text'
import ConfirmCancelOffer from '../../overlays/ConfirmCancelOffer'
import { OverlayContext } from '../../contexts/overlay'
import { Fade, Loading } from '../animation'

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'sell'|'buy'>

type NavigationProps = {
  screen: string,
  back: () => void,
  next: () => void,
  navigation: ProfileScreenNavigationProp,
  stepValid: boolean,
  offer: BuyOffer|SellOffer,
}

export const Navigation = ({ screen, back, next, navigation, stepValid, offer }: NavigationProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  const [keyboardOpen, setKeyboardOpen] = useState(false)
  let buttonText:string|JSX.Element = i18n('next')
  if (offer && offer.type === 'ask' && screen === 'escrow' && !stepValid) {
    buttonText = offer.funding.status === 'MEMPOOL'
      ? i18n('sell.escrow.waitingForConfirmation')
      : <Text style={tw`font-baloo text-sm uppercase text-white-1`}>
        {i18n('sell.escrow.fundToContinue')}
        <View style={tw`w-8 h-0 bg-red absolute -mt-10`}>
          <Loading size="small" style={tw`-mt-2`} color={tw`text-white-1`.color as string} />
        </View>
      </Text>
  }
  if (/returnAddress|releaseAddress/u.test(screen)) buttonText = i18n('lookForAMatch')
  const navigate = () => navigation.replace('offer', { offer })

  const cancelOffer = () => updateOverlay({
    content: <ConfirmCancelOffer offer={offer} navigate={navigate} />,
    showCloseButton: false
  })

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardDidShow', () => setKeyboardOpen(true))
    Keyboard.addListener('keyboardWillHide', () => setKeyboardOpen(false))
    Keyboard.addListener('keyboardDidHide', () => setKeyboardOpen(false))
  }, [])

  return <Fade show={!keyboardOpen} style={tw`w-full flex items-center`} displayNone={false}>
    {!/main|escrow|search/u.test(screen)
      ? <Pressable style={tw`absolute left-0 z-10`} onPress={back}>
        <Icon id="arrowLeft" style={tw`w-10 h-10`} color={tw`text-peach-1`.color as string} />
      </Pressable>
      : null
    }
    <Button
      disabled={!stepValid}
      wide={false}
      onPress={stepValid ? next : () => {}}
      title={buttonText}
      style={screen === 'escrow' && !stepValid && offer && offer.type === 'ask'
        ? offer.funding.status === 'MEMPOOL' ? tw`w-72` : tw`w-48`
        : {}}
    />
    {screen === 'escrow'
      ? <Pressable style={tw`mt-4`} onPress={cancelOffer}>
        <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>
          {i18n('cancelOffer')}
        </Text>
      </Pressable>
      : null
    }
  </Fade>
}

export default Navigation