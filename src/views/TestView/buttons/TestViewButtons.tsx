import { PeachScrollView } from '../../../components'
import tw from '../../../styles/tailwind'
import { OptionButtons } from './OptionButtons'
import { PrimaryButtons } from './PrimaryButtons'

export const TestViewButtons = () => (
  <PeachScrollView style={tw`h-full bg-primary-mild-1`} contentContainerStyle={tw`flex items-center w-full px-6 py-10`}>
    <PrimaryButtons />
    <OptionButtons />
  </PeachScrollView>
)
