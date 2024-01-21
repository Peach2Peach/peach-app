import ShallowRenderer from 'react-test-renderer/shallow'
import { useSettingsStore } from '../../../../store/settingsStore/useSettingsStore'
import { LastSeedBackup } from './LastSeedBackup'

describe('LastSeedBackup', () => {
  const YEAR = 2022
  const MONTH = 8
  const DAY = 1
  const now = new Date(YEAR, MONTH, DAY, 0, 0).getTime()
  const goBackToStartMock = jest.fn()
  const renderer = ShallowRenderer.createRenderer()

  it('should render correctly', () => {
    renderer.render(<LastSeedBackup goBackToStart={goBackToStartMock} />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
  it('should render correctly with seedbackup date', () => {
    useSettingsStore.setState({ lastSeedBackupDate: now })
    renderer.render(<LastSeedBackup goBackToStart={goBackToStartMock} />)

    const renderOutput = renderer.getRenderOutput()
    expect(renderOutput).toMatchSnapshot()
  })
})
