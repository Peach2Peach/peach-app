import React, { ReactElement } from 'react'
import {
  Pressable,
  View,
} from 'react-native'
import { error } from '../../utils/log'
import RNFS from '../../utils/fileSystem/RNFS'
import DocumentPicker from '../../utils/fileSystem/DocumentPicker'
import tw from '../../styles/tailwind'
import i18n from '../../utils/i18n'
import Icon from '../Icon'
import { Shadow, Text } from '..'
import { innerShadow } from '../../utils/layout'

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
    const result = await DocumentPicker.pickSingle()
    try {
      if (!result.uri) {
        throw Error('File could not be read')
      }

      RNFS.readFile(decodeURIComponent(result.uri), 'utf8').then(content => {
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
      error('File could not be read', e)
      resolve({
        name: '',
        content: ''
      })
    }
  } catch (err: any) {
    if (!DocumentPicker.isCancel(err)) {
      // User cancelled the picker, exit any dialogs or menus and move on
      throw err
    }
  }
})

type FileInputProps = ComponentProps & {
  fileName?: string,
  autoCorrect?: boolean
  isValid?: boolean,
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
      tw`flex h-8 border border-grey-4 rounded overflow-hidden`,
      tw.md`h-10`,
      isValid && fileName ? tw`border-green` : {},
      errorMessage.length > 0 ? tw`border-red` : {},
      style || {}
    ]}
    onPress={async () => onChange ? onChange(await selectFile()) : null}
  >
    <Shadow shadow={innerShadow}
      style={[
        tw`w-full flex flex-row items-center justify-between h-8 pl-4 pr-3 py-2 rounded`,
        tw.md`h-10`,
      ]}
    >
      <Text
        style={[
          tw`flex-grow-0 flex-shrink font-baloo text-xs uppercase`,
          fileName ? tw`text-peach-1` : tw`text-grey-1`
        ]}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {fileName || i18n('form.file')}
      </Text>
      <Icon id="file"
        style={tw`flex-shrink-0 w-5 h-5`}
        color={(tw`text-peach-1`).color as string}
      />
    </Shadow>
  </Pressable>

  {errorMessage.length > 0
    ? <Text style={tw`font-baloo text-xs text-red text-center mt-2`}>{errorMessage[0]}</Text>
    : null
  }
</View>

export default FileInput