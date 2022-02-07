
import React, { ReactElement, ReactNode, useContext } from 'react'
import { View } from 'react-native'
import { Button } from '.'

import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../utils/overlayUtils'

interface OverlayProps {
  content: ReactNode,
}

/**
 * @description Component to display the Overlay
 * @param props Component properties
 * @param props.content the overlay content
 * @example
 * <Overlay content={<Text>Overlay content</Text>} />
 */
export const Overlay = ({ content }: OverlayProps): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)

  return <View style={tw`absolute z-20 w-full h-full flex items-center justify-center p-3 bg-peach-translucent-2`}>
    {content}
    <Button
      title={i18n('close')}
      style={tw`mt-6`}
      secondary={true}
      onPress={() => updateOverlay({ overlayContent: null })}
      wide={false}
    />
  </View>
}

export default Overlay