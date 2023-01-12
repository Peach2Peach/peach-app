import React, { useContext } from 'react'
import { Pressable } from 'react-native'
import { Text } from '../../../components'
import { useMatchStore } from '../../../components/matches/store'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation } from '../../../hooks'
import ConfirmCancelOffer from '../../../overlays/ConfirmCancelOffer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const CancelOfferButton = () => {
  const navigation = useNavigation()
  const offer = useMatchStore((state) => state.offer)
  const [, updateOverlay] = useContext(OverlayContext)

  const navigate = () => navigation.replace('yourTrades')
  const cancelOffer = () =>
    updateOverlay({
      content: <ConfirmCancelOffer {...{ offer, navigate, navigation }} />,
      visible: true,
    })
  return (
    <Pressable style={tw`mt-3`} onPress={cancelOffer}>
      <Text style={tw`text-sm text-center underline uppercase font-baloo text-peach-1`}>{i18n('cancelOffer')}</Text>
    </Pressable>
  )
}
