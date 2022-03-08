import React, { ReactElement, useContext, useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  View
} from 'react-native'
const { LinearGradient } = require('react-native-gradients')

import tw from '../../styles/tailwind'
import { account, updateSettings } from '../../utils/account'
import { StackNavigationProp } from '@react-navigation/stack'
import i18n from '../../utils/i18n'
import { whiteGradient } from '../../utils/layout'
import LanguageContext from '../../components/inputs/LanguageSelect'
import { MessageContext } from '../../utils/messageUtils'
import AutoScan from './AutoScan'
import Manual from './Manual'
import Restored from './Restored'
import Decrypt from './Decrypt'


type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'restoreBackup'>
type Props = {
  navigation: ProfileScreenNavigationProp;
}

// TODO
// 1. scan phone, gdrive, icloud for backup file
// (2. if no file found, ask for manual selection)
// 3. ask for password
// 4. backup restored > continue button
export default ({ navigation }: Props): ReactElement => {
  const [file, setFile] = useState({
    name: '',
    content: ''
  })
  const [autoScanComplete, setAutoScanComplete] = useState(true)
  const [gotFile, setGotFile] = useState(false)

  useContext(LanguageContext)
  const [, updateMessage] = useContext(MessageContext)

  useEffect(() => {
    setTimeout(() => {
      // TODO auto scan function
      setAutoScanComplete(true)
    }, 4000)
  }, [])


  const onSuccess = () => {
    updateSettings({
      skipTutorial: true
    })
  }


  const onError = () => {
    updateMessage({
      msg: i18n('form.password.invalid'),
      level: 'ERROR',
    })
  }

  return <View style={tw`h-full flex`}>
    <View style={tw`h-full flex-shrink`}>
      <View style={tw`w-full h-8 mt-32 -mb-8 z-10`}>
        <LinearGradient colorList={whiteGradient} angle={-90} />
      </View>
      <ScrollView>
        <View style={tw`pb-8`}>
          <View style={tw`flex items-center`}>
            <Image source={require('../../../assets/favico/peach-icon-192.png')} />
          </View>
          {!autoScanComplete
            ? <AutoScan />
            : !gotFile
              ? <Manual
                file={file}
                setFile={setFile}
                submit={() => setGotFile(true)}
              />
              : !account.publicKey
                ? <Decrypt
                  encryptedAccount={file.content}
                  onSuccess={onSuccess}
                  onError={onError}
                />
                : <Restored navigation={navigation}/>
          }
        </View>
      </ScrollView>
      <View style={tw`w-full h-8 -mt-8`}>
        <LinearGradient colorList={whiteGradient} angle={90} />
      </View>
    </View>
  </View>
}