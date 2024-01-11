import ShallowRenderer from 'react-test-renderer/shallow'
import { useSettingsStore } from '../../../../store/settingsStore/useSettingsStore'
import { LastSeedBackup } from './LastSeedBackup'

describe('LastSeedBackup', () => {
  const now = new Date(2022, 8, 1, 0, 0).getTime()
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
