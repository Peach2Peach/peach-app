const onLinkMock = jest.fn()
const getInitialLinkMock = jest.fn().mockResolvedValue(null)

export default () => ({
  onLink: onLinkMock,
  getInitialLink: getInitialLinkMock,
})
