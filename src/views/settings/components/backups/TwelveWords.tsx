import React, { ReactElement } from 'react'
import { View } from 'react-native'
import tw from '../../../../styles/tailwind'
import { Card, Text } from '../../../../components'
import { account } from '../../../../utils/account'

export const TwelveWords = (): ReactElement => (
  <View style={tw`h-full flex-shrink flex-row`}>
    <View style={tw`w-1/2 pr-2`}>
      {account.mnemonic
        ?.split(' ')
        .slice(0, 6)
        .map((word, i) => (
          <Card key={i} style={tw`flex-row items-center p-2 mb-2`}>
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
          <Card key={i} style={tw`flex-row items-center  p-2 mb-2`}>
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
)
