import React, { useContext } from 'react'
import { Pressable } from 'react-native'
import { OverlayContext } from '../../../contexts/overlay'
import tw from '../../../styles/tailwind'
import Icon from '../../Icon'
import MatchOverlay from '../../../overlays/info/Match'
import DoubleMatch from '../../../overlays/info/DoubleMatch'
import { useRoute } from '../../../hooks'

export const MatchHelpButton = () => {
  const [, updateOverlay] = useContext(OverlayContext)
  const { offer } = useRoute<'search'>().params
  const openMatchHelp = () =>
    updateOverlay({
      content: offer.type === 'bid' ? <MatchOverlay /> : <DoubleMatch />,
      showCloseButton: true,
      help: true,
    })
  return (
    <Pressable onPress={openMatchHelp} style={tw`p-3`}>
      <Icon id="helpCircle" style={tw`w-5 h-5`} color={tw`text-blue-1`.color} />
    </Pressable>
  )
}
