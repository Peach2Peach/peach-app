import React, { Dispatch, ReactElement, useContext, useState } from 'react'
import { View } from 'react-native'
import tw from '../../styles/tailwind'

import LanguageContext from '../../components/inputs/LanguageSelect'
import { Button, FileData, FileInput, Text } from '../../components'
import i18n from '../../utils/i18n'

type ManualProps = {
  file: FileData,
  setFile: Dispatch<FileData>,
  submit: () => void
}
export default ({ file, setFile, submit }: ManualProps): ReactElement => {
  useContext(LanguageContext)

  return <View>
    <Text style={[tw`font-baloo text-center text-3xl leading-3xl text-peach-1`, tw.md`text-5xl`]}>
      {i18n('restoreBackup')}
    </Text>
    <Text style={tw`mt-4 text-center`}>
      {i18n('restoreBackup.manual.description.1')}
    </Text>
    <Text style={tw`mt-3 text-center`}>
      {i18n('restoreBackup.manual.description.2')}
    </Text>
    <View style={tw`mt-4 flex flex-col items-center`}>
      <FileInput
        fileName={file.name}
        style={tw`w-48`}
        onChange={setFile}
        isValid={!!file}
      />
    </View>
    <View style={tw`mt-4 flex items-center`}>
      <Button
        onPress={submit}
        secondary={true}
        wide={false}
        title={i18n('restoreBackup')}
      />
    </View>
  </View>
}