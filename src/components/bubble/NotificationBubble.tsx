import { View, ViewStyle } from 'react-native'
import tw from '../../styles/tailwind'
import { PeachText } from '../text/PeachText'

const MAX_NOTIFICATIONS = 99

export function NotificationBubble ({ style, notifications = 0 }: { style?: ViewStyle; notifications?: number }) {
  return notifications === 0 ? null : (
    <View style={[tw`items-center justify-center w-5 h-5 rounded-full bg-primary-background-main`, style]}>
      <View style={tw`items-center justify-center w-4 h-4 rounded-full bg-primary-main`}>
        <View style={tw`-my-3`}>
          <PeachText style={tw`text-primary-background-main notification`}>
            {String(Math.min(MAX_NOTIFICATIONS, notifications))}
          </PeachText>
        </View>
      </View>
    </View>
  )
}
