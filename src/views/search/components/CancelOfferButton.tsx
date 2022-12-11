import React, { useContext } from 'react'
import { Pressable } from 'react-native'
import { Text } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation, useRoute } from '../../../hooks'
import ConfirmCancelOffer from '../../../overlays/ConfirmCancelOffer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const CancelOfferButton = () => {
  const navigation = useNavigation()
  const { offer } = useRoute<'search'>().params
  const [, updateOverlay] = useContext(OverlayContext)

  const navigate = () => navigation.replace('yourTrades')
  const cancelOffer = () =>
    updateOverlay({
      content: <ConfirmCancelOffer {...{ offer, navigate, navigation }} />,
      showCloseButton: false,
    })
  return (
    <Pressable style={tw`mt-3`} onPress={cancelOffer}>
      <Text style={tw`font-baloo text-sm text-peach-1 underline text-center uppercase`}>{i18n('cancelOffer')}</Text>
    </Pressable>
  )
}
