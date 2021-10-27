import React, { ReactElement } from 'react'
import {
  Pressable,
  View,
  ViewStyle
} from 'react-native'
import { error } from '../../utils/logUtils'
import RNFS from '../../utils/fileSystem/RNFS'
import DocumentPicker from '../../utils/fileSystem/DocumentPicker'
import tw from '../../styles/tailwind'
import { Shadow } from 'react-native-shadow-2'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Text } from '..'

const shadowProps = {
  distance: 8,
  paintInside: true,
  startColor: '#00000000',
  finalColor: '#0000000D',
  offset: [0, 6] as [x: string | number, y: string | number],
  radius: 0
}

export type FileData = {
  name: string,
  content: string|object|null
}

/**
 * @description Prompts file select dialogue and reads content from file
 * TODO add visible error handling
 * - file cannot be read / timed out
 * - user cancels file selection
 */
const selectFile = (): Promise<FileData> => new Promise(async resolve => {
  let timeout: NodeJS.Timer

  try {
    const result = await DocumentPicker.pick()
    try {
      if (!result.uri) {
        throw Error('File could not be read')
      }

      RNFS.readFile(result.uri, 'utf8').then(content => {
        clearTimeout(timeout)
        resolve({
          name: result.name || '',
          content
        })
      })

      // RNFS.readFile might not be able to read data if no network is available, stop after 10 seconds
      timeout = setTimeout(() => {
        resolve({
          name: '',
          content: ''
        })
      }, 10000)
    } catch (e) {
      error('File could not be read', e.message)
      resolve({
        name: '',
        content: ''
      })
    }
  } catch (err) {
    if (!DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      throw err
    }
  }
})

interface FileInputProps {
  fileName?: string,
  autoCorrect?: boolean
  isValid?: boolean,
  style?: ViewStyle|ViewStyle[],
  errorMessage?: string[]
  onChange?: Function,
  secureTextEntry?: boolean
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param [props.fileName] file name
 * @param [props.isValid] if true show valid state
 * @param [props.style] css style object
 * @param [props.errorMessage] error message for invalid field
 * @param [props.onChange] onchange handler from outside
 * @example
 * <FileInput
 *   onChange={setAddress}
 *   fileName={fileName}
 *   isValid={!isFieldInError('address')}
 *   errorMessage={getErrorsInField('address')}
 * />
 */
export const FileInput = ({
  fileName,
  isValid,
  style,
  errorMessage = [],
  onChange
}: FileInputProps): ReactElement => <View>
  <Pressable
    style={[
      tw`flex h-10 border border-peach-1 rounded overflow-hidden`,
      isValid && fileName ? tw`border-green` : {},
      errorMessage.length > 0 ? tw`border-red` : {},
      style || {}
    ]}
    onPress={async () => onChange ? onChange(await selectFile()) : null}
  >
    <Shadow viewStyle={tw`w-full flex flex-row items-center justify-between h-10 pl-4 pr-3 py-2 rounded`}
      {...shadowProps}>
      <Text
        style={[tw`flex-grow-0 flex-shrink font-baloo text-grey-2 text-lg uppercase`]}
        numberOfLines={1}
        ellipsizeMode={'middle'}
      >
        {fileName || i18n('form.file')}
      </Text>
      <Icon id="file" style={tw`flex-shrink-0 w-5 h-5`} />
    </Shadow>
  </Pressable>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-2`}>{errorMessage[0]}</Text>
    : null
  }
</View>

export default FileInput