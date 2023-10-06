import { View } from 'react-native'
import { Text } from '../../../components'
import { CopyAble, ErrorBox, HorizontalLine, Progress } from '../../../components/ui'
import tw from '../../../styles/tailwind'
import { CurrencySelections } from './CurrencySelections'

export const UIComponents = () => (
  <View style={tw`flex flex-col items-center`}>
    <Text style={tw`mt-4 h4`}>UI Components</Text>
    <CurrencySelections />
    <ErrorBox style={tw`w-64`}>in here goes an error message that can appear inside the ui</ErrorBox>
    <View style={tw`flex-row mt-4`}>
      <CopyAble value="something to copy" style={tw`mx-4`} />
      <CopyAble value="something else to copy" style={tw`w-5 h-5 mx-4`} color={tw`text-black-2`} />
      <CopyAble value="something else to copy" style={tw`w-6 h-6 mx-4`} color={tw`text-black-4`} />
    </View>
    <HorizontalLine style={tw`mt-4`} />
    <Progress
      style={tw`h-3 rounded`}
      backgroundStyle={tw`border-2 bg-primary-mild-1 border-primary-background`}
      barStyle={tw`border-2 bg-primary-main border-primary-background`}
      percent={0.615}
    />
    <Progress
      style={tw`h-3 mt-4 rounded`}
      backgroundStyle={tw`border-2 border-success-background-main`}
      barStyle={tw`border-2 bg-success-main border-success-background-main`}
      percent={0.808}
    />
  </View>
)
