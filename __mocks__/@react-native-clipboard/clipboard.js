let clipboard = null;

const Clipboard = {
  setString: jest.fn((string) => {
    clipboard = string;
  }),
  getString: jest.fn(() => clipboard),
};

export default Clipboard;
