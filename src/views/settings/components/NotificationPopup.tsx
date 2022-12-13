import React from 'react'
import { Text } from '../../../components'
import tw from '../../../styles/tailwind'

export const NotificationPopup = () => (
  <Text style={tw`tooltip`}>
    Without notifications, you'll not be informed when there's a match. {'\n\n'} Taking a long time to match someone back
    will negatively impact your reputation score.
  </Text>
)
