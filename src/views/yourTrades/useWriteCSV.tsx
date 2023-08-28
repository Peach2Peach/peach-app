import { useCallback } from 'react'
import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { useShowErrorBanner } from '../../hooks/useShowErrorBanner'
import { writeFile } from '../../utils/file'

export const useWriteCSV = () => {
  const handleError = useShowErrorBanner()

  const openShareMenu = useCallback(
    async (csvValue: string, destinationFileName: string) => {
      await writeFile(`/${destinationFileName}`, csvValue)
      Share.open({
        title: destinationFileName,
        url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
      }).catch(handleError)
    },
    [handleError],
  )

  return openShareMenu
}
