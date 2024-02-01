const NetInfo = {
  fetch: jest.fn().mockResolvedValue({
    isInternetReachable: true,
  }),
  addEventListener: jest.fn(),
};

export default NetInfo;
