type Dimension = {
  width: number;
  height: number;
};

export const mockDimensions = ({ width, height }: Dimension) => {
  jest.resetModules();
  jest.doMock("react-native/Libraries/Utilities/Dimensions", () => ({
    get: jest.fn().mockReturnValue({ width, height }),
  }));
};
