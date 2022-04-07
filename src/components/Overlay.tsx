
import React, { ReactElement, useContext } from 'react'
import { View } from 'react-native'
import { Button } from '.'

import tw from '../styles/tailwind'
import i18n from '../utils/i18n'
import { OverlayContext } from '../utils/overlay'

/**
 * @description Component to display the Overlay
 * @param props Component properties
 * @param props.content the overlay content
 * @param props.showCloseButton if true show close button
 * @example
 * <Overlay content={<Text>Overlay content</Text>} showCloseButton={true} />
 */
export const Overlay = ({ content, showCloseButton }: OverlayState): ReactElement => {
  const [, updateOverlay] = useContext(OverlayContext)
  return <View style={[
    tw`absolute z-20 w-full h-full flex items-center justify-between`,
    tw`p-3 pb-8 bg-peach-translucent-2`,
  ]}>
    <View>{/* dummy content for layout */}</View>
    {content}
    <View>{/* dummy content for layout */}</View>
    {showCloseButton
      ? <Button
        title={i18n('close')}
        secondary={true}
        onPress={() => updateOverlay({ content: null, showCloseButton: true })}
        wide={false}
      />
      : null
    }
  </View>
}

export default Overlay