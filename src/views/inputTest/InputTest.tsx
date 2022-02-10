import React, { ReactElement, useState, useContext } from 'react'
import {
  View
} from 'react-native'
import tw from '../../styles/tailwind'
import { StackNavigationProp } from '@react-navigation/stack'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, Input } from '../../components'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'inputTest'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

export default ({ navigation }: Props): ReactElement => {
  useContext(LanguageContext)
  const [randomValue, setRandomValue] = useState('')

  return <View style={tw`flex-col justify-center h-full px-4`}>
    <View style={tw`w-6/12 mt-4`}>
      <Input
        label={'smol input'}
      />
    </View>
    <View style={tw`mt-4`}>
      <Input
        label={'Input w/ Icon'}
        icon={'send'}
        onChange={setRandomValue}
        value={randomValue}
        // eslint-disable-next-line no-alert
        onSubmit={(val: string) => alert(val)}
      />
    </View>
    <View style={tw`mt-4`}>
      <Button
        secondary={true}
        onPress={() => navigation.goBack()}
        title="Back"
      />
    </View>
  </View>
}