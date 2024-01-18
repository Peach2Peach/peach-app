import { View } from 'react-native'

import { PeachText } from '../../../../components/text/PeachText'
import tw from '../../../../styles/tailwind'
import { useAccountStore } from '../../../../utils/account/account'
import i18n from '../../../../utils/i18n'
import { NUMBER_OF_WORDS } from './NUMBER_OF_WORDS'
import { Word } from './Word'

export const TwelveWords = () => {
  const mnemonic = useAccountStore((state) => state.account?.mnemonic)
  return (
    <>
      <PeachText style={tw`self-center subtitle-1`}>{i18n('settings.backups.seedPhrase.yourSeedPhrase')}</PeachText>
      <View style={tw`flex-row gap-4 mt-4`}>
        <View style={tw`flex-1`}>
          {mnemonic
            ?.split(' ')
            .slice(0, NUMBER_OF_WORDS / 2)
            .map((word, i) => (
              <Word word={word} index={i + 1} key={`seedPhraseWord${i}`} />
            ))}
        </View>
        <View style={tw`flex-1`}>
          {mnemonic
            ?.split(' ')
            .slice(NUMBER_OF_WORDS / 2, NUMBER_OF_WORDS)
            .map((word, i) => (
              <Word
                word={word}
                index={i + NUMBER_OF_WORDS / 2 + 1}
                key={`seedPhraseWord${i + NUMBER_OF_WORDS / 2 + 1}`}
              />
            ))}
        </View>
      </View>
    </>
  )
}
