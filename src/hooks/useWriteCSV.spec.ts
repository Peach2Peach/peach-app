import RNFS from 'react-native-fs'
import Share from 'react-native-share'
import { renderHook, waitFor } from 'test-utils'
import { useWriteCSV } from './useWriteCSV'

describe('useWriteCSV', () => {
  const csvValue = 'header 1, header 2\nvalue 1, value 2\n'
  const destinationFileName = 'test.csv'
  it('should create a CSV file', async () => {
    const { result } = renderHook(useWriteCSV)
    result.current(csvValue, destinationFileName)

    expect(RNFS.writeFile).toHaveBeenCalledWith(`DDirPath//${destinationFileName}`, csvValue, 'utf8')

    await waitFor(() => {
      expect(Share.open).toHaveBeenCalledWith({
        title: destinationFileName,
        url: `file://${RNFS.DocumentDirectoryPath}/${destinationFileName}`,
      })
    })
  })
})
