import React, { ReactElement } from 'react'
import { Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import RNFS from 'react-native-fs'
import { Input } from '..'
import { error } from '../../utils/log'

export type FileData = {
  name: string
  content: string | object | null
}

/**
 * @description Prompts file select dialogue and reads content from file
 * TODO add visible error handling
 * - file cannot be read / timed out
 * - user cancels file selection
 */
const selectFile = (): Promise<FileData> =>
  new Promise(async (resolve) => {
    let timeout: NodeJS.Timer

    try {
      const file = await DocumentPicker.pickSingle()
      try {
        if (!file.uri) {
          throw Error('File could not be read')
        }

        const uri = Platform.select({
          android: file.uri,
          ios: decodeURIComponent(file.uri)?.replace?.('file://', ''),
        }) as string

        RNFS.readFile(uri, 'utf8').then((content) => {
          clearTimeout(timeout)
          resolve({
            name: file.name || '',
            content,
          })
        })

        // RNFS.readFile might not be able to read data if no network is available, stop after 10 seconds
        timeout = setTimeout(() => {
          resolve({
            name: '',
            content: '',
          })
        }, 10000)
      } catch (e) {
        error('File could not be read', e)
        resolve({
          name: '',
          content: '',
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
  fileName?: string
  errorMessage?: string[]
  onChange?: Function
  secureTextEntry?: boolean
  invertColors?: boolean
}

/**
 * @description Component to display the language select
 * @param props Component properties
 * @param [props.fileName] file name
 * @param [props.style] css style object
 * @param [props.invertColors] if true invert color
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
  style,
  invertColors,
  errorMessage = [],
  onChange,
}: FileInputProps): ReactElement => {
  const onPress = async () => (onChange ? onChange(await selectFile()) : null)

  return (
    <Input
      {...{
        style,
        invertColors,
        value: fileName,
        disabled: true,
        onPressIn: onPress,
        icons: [['clipboard', onPress]],
        errorMessage,
      }}
    />
  )
}

export default FileInput
