import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { Text } from '../../../../components'
import { account } from '../../../../utils/account'
import { Word } from './Word'
import i18n from '../../../../utils/i18n'

export const TwelveWords = (): ReactElement => (
  <>
    <Text style={tw`self-center mt-6 subtitle-1`}>{i18n('settings.backups.seedPhrase.yourSeedPhrase')}</Text>
    <View style={tw`flex-row flex-shrink h-full mt-4`}>
      <View style={tw`w-1/2 pr-2`}>
        {account.mnemonic
          ?.split(' ')
          .slice(0, 6)
          .map((word, i) => (
            <Word word={word} index={i + 1} key={i} />
          ))}
      </View>
      <View style={tw`w-1/2 pl-2`}>
        {account.mnemonic
          ?.split(' ')
          .slice(6, 12)
          .map((word, i) => (
            <Word word={word} index={i + 7} key={i} />
          ))}
      </View>
    </View>
  </>
)
