import React, { ReactElement } from 'react'
import { Platform } from 'react-native'
import DocumentPicker from 'react-native-document-picker'
import { readFileInChunks } from '../../utils/file'
import { error } from '../../utils/log'
import Input, { InputProps } from './Input'

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

        const content = await readFileInChunks(uri)
        resolve({
          name: file.name || '',
          content,
        })
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

type FileInputProps = InputProps & {
  fileName?: string
}

export const FileInput = ({
  fileName,
  placeholder,
  style,
  theme = 'default',
  errorMessage = [],
  onChange,
}: FileInputProps): ReactElement => {
  const onPress = async () => (onChange ? onChange(await selectFile()) : null)

  return (
    <Input
      {...{
        style,
        theme,
        value: fileName,
        placeholder,
        disabled: true,
        onPressIn: onPress,
        icons: [['clipboard', onPress]],
        errorMessage,
      }}
    />
  )
}

export default FileInput
