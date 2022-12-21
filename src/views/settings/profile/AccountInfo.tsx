import { View } from 'react-native'
import React from 'react'
import { Icon, Text } from '../../../components'

export const AccountInfo = () => (
  <View>
    <View>
      <Text>account pubkey:</Text>
      <View>
        <Text>030b50919dd547db1cb93a96b5adde04129b621607bbc10598a095f6849061a4db</Text>
        <Icon id="clipboard" />
      </View>
    </View>

    <View>
      <Text>account created:</Text>
      <Text>06/07/2022 (92 days ago)</Text>
    </View>

    <View>
      <Text>disputes:</Text>
      <Text>0 opened 0 won 0 lost</Text>
    </View>

    <View>
      <Text>number of trades:</Text>
      <Text>30</Text>
    </View>
  </View>
)
