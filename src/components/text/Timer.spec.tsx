import { createRenderer } from 'react-test-renderer/shallow'
import { MSINADAY } from '../../constants'
import { SimpleTimer, Timer } from './Timer'

const now = new Date('2022-03-08T11:41:07.245Z')
jest.useFakeTimers({ now })

describe('SimpleTimer', () => {
  const renderer = createRenderer()

  afterEach(() => {
    renderer.unmount()
  })
  it('should render correctly', () => {
    renderer.render(<SimpleTimer end={now.getTime() + MSINADAY} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})

describe('Timer', () => {
  const renderer = createRenderer()

  afterEach(() => {
    renderer.unmount()
  })
  it('should render correctly', () => {
    renderer.render(<Timer text="text" end={now.getTime() + MSINADAY} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly when timer expired', () => {
    renderer.render(<Timer text="text" end={now.getTime()} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
