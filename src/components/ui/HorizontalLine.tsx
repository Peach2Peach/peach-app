import { View } from 'react-native'
import tw from '../../styles/tailwind'

export const HorizontalLine = ({ style }: ComponentProps) => <View style={[tw`w-full h-px shrink bg-black-10`, style]} />
