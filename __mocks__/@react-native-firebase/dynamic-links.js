const onLinkMock = jest.fn()
const getInitialLinkMock = jest.fn()

export default () => ({
  onLink: onLinkMock,
  getInitialLink: getInitialLinkMock,
})
