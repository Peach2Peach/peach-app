import { createRenderer } from 'react-test-renderer/shallow'
import { SummaryItem } from './SummaryItem'

describe('SummaryItem', () => {
  const renderer = createRenderer()
  it('should render correctly for a lost dispute as a seller', () => {
    const props = {
      title: 'PC‑14F‑152',
      level: 'ERROR',
      date: new Date('2009-01-09'),
      action: {
        label: 'release escrow',
        icon: 'upload',
        callback: () => {},
      },
      icon: undefined,
      theme: undefined,
      amount: 40000,
      currency: 'EUR',
      price: 10.9,
    } as const
    renderer.render(<SummaryItem {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a won dispute as a seller', () => {
    const props = {
      title: 'PC‑149‑14A',
      level: 'SUCCESS',
      date: new Date('2023-04-26'),
      action: {
        label: 'refund escrow',
        icon: 'alertOctagon',
        callback: () => {},
      },
      icon: undefined,
      theme: undefined,
      amount: 50000,
      currency: 'EUR',
      price: 12.64,
    } as const
    renderer.render(<SummaryItem {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
  it('should render correctly for a started dispute', () => {
    const props = {
      title: 'PC‑147‑148',
      level: 'ERROR',
      date: new Date('2023-04-21'),
      action: {
        label: 'dispute started',
        icon: 'alertOctagon',
        callback: () => {},
      },
      icon: undefined,
      theme: undefined,
      amount: 50000,
      currency: 'EUR',
      price: 12.94,
    } as const
    renderer.render(<SummaryItem {...props} />)
    expect(renderer.getRenderOutput()).toMatchSnapshot()
  })
})
