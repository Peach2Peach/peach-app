import { View, ViewStyle } from 'react-native'
import { Text } from '..'
import tw from '../../styles/tailwind'

export function NotificationBubble ({ style, notifications = 0 }: { style?: ViewStyle; notifications?: number }) {
  return notifications === 0 ? null : (
    <View style={[tw`items-center justify-center w-5 h-5 rounded-full bg-primary-background`, style]}>
      <View style={tw`items-center justify-center w-4 h-4 rounded-full bg-primary-main`}>
        <View style={tw`-my-3`}>
          <Text style={tw`text-primary-background notification`}>{String(Math.min(99, notifications))}</Text>
        </View>
      </View>
    </View>
  )
}
