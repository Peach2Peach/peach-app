import { View } from 'react-native'

import { Text } from '../../../../components'
import tw from '../../../../styles/tailwind'
import { account } from '../../../../utils/account'
import i18n from '../../../../utils/i18n'
import { Word } from './Word'

export const TwelveWords = () => (
  <>
    <Text style={tw`self-center subtitle-1`}>{i18n('settings.backups.seedPhrase.yourSeedPhrase')}</Text>
    <View style={tw`flex-row mt-4 px-13`}>
      <View style={tw`w-1/2 pr-2`}>
        {account.mnemonic
          ?.split(' ')
          .slice(0, 6)
          .map((word, i) => (
            <Word word={word} index={i + 1} key={`seedPhraseWord${i}`} />
          ))}
      </View>
      <View style={tw`w-1/2 pl-2`}>
        {account.mnemonic
          ?.split(' ')
          .slice(6, 12)
          .map((word, i) => (
            <Word word={word} index={i + 7} key={`seedPhraseWord${i + 7}`} />
          ))}
      </View>
    </View>
  </>
)
