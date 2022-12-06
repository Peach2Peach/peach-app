import React from 'react'
import { View } from 'react-native'
import { PeachScrollView, Text } from '../components'

import { GoBackButton, InfoButton, OptionButton, PrimaryButton } from '../components/buttons'
import tw from '../styles/tailwind'

export default () => (
  <PeachScrollView contentContainerStyle={tw`bg-primary-mild`}>
    <View style={tw`flex flex-col items-center`}>
      <Text style={tw`h2`}>Buttons</Text>
      <Text style={tw`h3`}>Primary</Text>
      <PrimaryButton style={tw`mt-2`} wide>
        Wide
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} narrow>
        Narrow
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`}>Relative</PrimaryButton>
      <PrimaryButton style={tw`mt-2`} white>
        White
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} border>
        Border
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} white border>
        White Border
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} disabled>
        Disabled
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} border iconId="helpCircle">
        With Icon
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} border iconId="helpCircle" loading>
        Loading
      </PrimaryButton>
      <PrimaryButton style={tw`mt-2`} iconId="helpCircle" />

      <Text style={tw`h3 mt-4`}>Info</Text>
      <InfoButton style={tw`mt-2`} wide>
        Wide
      </InfoButton>
      <InfoButton style={tw`mt-2`} narrow>
        Narrow
      </InfoButton>
      <InfoButton style={tw`mt-2`}>Relative</InfoButton>
      <InfoButton style={tw`mt-2`} white>
        White
      </InfoButton>
      <InfoButton style={tw`mt-2`} border>
        Border
      </InfoButton>
      <InfoButton style={tw`mt-2`} white border>
        White Border
      </InfoButton>
      <InfoButton style={tw`mt-2`} disabled>
        Disabled
      </InfoButton>
      <InfoButton style={tw`mt-2`} border iconId="helpCircle">
        With Icon
      </InfoButton>
      <InfoButton style={tw`mt-2`} border iconId="helpCircle" loading>
        Loading
      </InfoButton>
      <InfoButton style={tw`mt-2`} iconId="helpCircle" />

      <Text style={tw`h3 mt-4`}>Go back</Text>
      <GoBackButton style={tw`mt-2`} wide />
      <GoBackButton style={tw`mt-2`} narrow />
      <GoBackButton style={tw`mt-2`} />
      <GoBackButton style={tw`mt-2`} white />
      <GoBackButton style={tw`mt-2`} border />
      <GoBackButton style={tw`mt-2`} white border />
      <GoBackButton style={tw`mt-2`} disabled />
      <GoBackButton style={tw`mt-2`} border iconId="helpCircle" />
      <GoBackButton style={tw`mt-2`} border iconId="helpCircle" loading />
      <GoBackButton style={tw`mt-2`} iconId="helpCircle" />

      <Text style={tw`h3 mt-4`}>Option</Text>
      <OptionButton style={tw`mt-2`} wide>
        Wide
      </OptionButton>
      <OptionButton style={tw`mt-2`} narrow>
        Narrow
      </OptionButton>
      <OptionButton style={tw`mt-2`}>Relative</OptionButton>
      <OptionButton style={tw`mt-2`} disabled>
        Disabled
      </OptionButton>
      <OptionButton style={tw`mt-2`} iconId="helpCircle">
        With Icon
      </OptionButton>
      <OptionButton style={tw`mt-2`} iconId="helpCircle" loading>
        Loading
      </OptionButton>
      <OptionButton style={tw`mt-2`} iconId="helpCircle" />
    </View>
  </PeachScrollView>
)
