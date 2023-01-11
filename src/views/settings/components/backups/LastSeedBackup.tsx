import React, { Dispatch, ReactElement, SetStateAction } from 'react'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { Text } from '../../../../components'
import { PrimaryButton } from '../../../../components/buttons'
import i18n from '../../../../utils/i18n'

type Props = {
  setCurrentScreenIndex: Dispatch<SetStateAction<number>>
}

const translationsPath = 'settings.backups.seedPhrase.'
export const LastSeedBackup = ({ setCurrentScreenIndex }: Props): ReactElement => (
  <View style={tw`items-center mt-44`}>
    <Text style={tw`h6`}>{i18n(translationsPath + 'lastBackup')}</Text>
    <Text style={tw`mt-2`}>20 / 10 / 2022 09:45</Text>
    <PrimaryButton wide onPress={() => setCurrentScreenIndex(0)} style={tw`mt-10`} iconId="rotateCounterClockwise">
      {i18n(translationsPath + 'checkWords')}
    </PrimaryButton>
  </View>
)
