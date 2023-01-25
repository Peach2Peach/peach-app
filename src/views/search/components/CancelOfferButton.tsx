import React, { useContext } from 'react'
import { Pressable } from 'react-native'
import { Text } from '../../../components'
import { OverlayContext } from '../../../contexts/overlay'
import { useNavigation, useOfferDetails } from '../../../hooks'
import ConfirmCancelOffer from '../../../overlays/ConfirmCancelOffer'
import tw from '../../../styles/tailwind'
import i18n from '../../../utils/i18n'

export const CancelOfferButton = ({ offerId }: { offerId: string }) => {
  const navigation = useNavigation()
  const { offer } = useOfferDetails(offerId)
  const [, updateOverlay] = useContext(OverlayContext)

  const navigate = () => navigation.replace('yourTrades', {})
  if (!offer) return <></>
  const cancelOffer = () =>
    updateOverlay({
      content: <ConfirmCancelOffer {...{ offer, navigate, navigation }} />,
      showCloseButton: false,
    })
  return (
    <Pressable style={tw`mt-3`} onPress={cancelOffer}>
      <Text style={tw`text-sm text-center underline uppercase font-baloo text-peach-1`}>{i18n('cancelOffer')}</Text>
    </Pressable>
  )
}
