import React, { ReactElement, useState } from 'react'
import { View } from 'react-native'

import tw from '../../styles/tailwind'

import { Card, GoBackButton, Headline, PrimaryButton, Text, Title } from '../../components'
import i18n from '../../utils/i18n'
import { account } from '../../utils/account'

export default (): ReactElement => {
  const [showWords, setShowWords] = useState(false)

  const iUnderstand = () => setShowWords(true)
  return (
    <View style={tw`h-full flex items-stretch pt-6 px-6 pb-10`}>
      <Title title={i18n('settings.title')} subtitle={i18n('settings.backups.subtitle')} />
      {showWords ? (
        <View style={tw`h-full flex-shrink flex-row mt-12`}>
          <View style={tw`w-1/2 pr-2`}>
            {account.mnemonic
              ?.split(' ')
              .slice(0, 6)
              .map((word, i) => (
                <Card key={i} style={tw`flex-row p-2 mb-2`}>
                  <View>
                    <Text style={tw`text-lg text-black-1 w-7`}>{i + 1}.</Text>
                  </View>
                  <View>
                    <Text style={tw`text-peach-1 ml-4`}>{word}</Text>
                  </View>
                </Card>
              ))}
          </View>
          <View style={tw`w-1/2 pl-2`}>
            {account.mnemonic
              ?.split(' ')
              .slice(6, 12)
              .map((word, i) => (
                <Card key={i} style={tw`flex-row p-2 mb-2`}>
                  <View>
                    <Text style={tw`text-lg text-black-1 w-7`}>{i + 7}.</Text>
                  </View>
                  <View>
                    <Text style={tw`text-peach-1 ml-4`}>{word}</Text>
                  </View>
                </Card>
              ))}
          </View>
        </View>
      ) : (
        <View style={tw`h-full flex-shrink flex justify-center items-center`}>
          <Headline style={tw`text-grey-1`}>{i18n('settings.seedWords.note')}</Headline>
          <Text style={tw`text-grey-1`}>{i18n('settings.seedWords.note.description')}</Text>
        </View>
      )}
      <View style={tw`flex items-center mt-16`}>
        {showWords ? (
          <GoBackButton />
        ) : (
          <PrimaryButton onPress={iUnderstand} narrow>
            {i18n('settings.seedWords.iUnderstand')}
          </PrimaryButton>
        )}
      </View>
    </View>
  )
}
