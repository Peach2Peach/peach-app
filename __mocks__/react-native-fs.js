export let files = {};
export const resetFiles = () => (files = {});

export default {
  mkdir: jest.fn(),
  moveFile: jest.fn(),
  copyFile: jest.fn(),
  pathForBundle: jest.fn(),
  pathForGroup: jest.fn(),
  getFSInfo: jest.fn(),
  getAllExternalFilesDirs: jest.fn(),
  unlink: jest.fn(async (path) => {
    delete files[path];
  }),
  exists: jest.fn(async (path) => !!files[path]),
  stopDownload: jest.fn(),
  resumeDownload: jest.fn(),
  isResumable: jest.fn(),
  stopUpload: jest.fn(),
  completeHandlerIOS: jest.fn(),
  readDir: jest.fn(),
  readDirAssets: jest.fn(),
  existsAssets: jest.fn(),
  readdir: jest.fn(),
  setReadable: jest.fn(),
  stat: jest.fn(),
  readFile: jest.fn(async (path) => files[path]),
  read: jest.fn((uri, chunksize, index, encoding) =>
    files[uri].slice(index, index + chunksize),
  ),
  readFileAssets: jest.fn(),
  hash: jest.fn(),
  copyFileAssets: jest.fn(),
  copyFileAssetsIOS: jest.fn(),
  copyAssetsVideoIOS: jest.fn(),
  writeFile: jest.fn(async (path, data, encoding) => {
    files[path] = data;
  }),
  appendFile: jest.fn(async (path, data, encoding) => {
    files[path] = files[path] || "" + data;
  }),
  write: jest.fn(),
  downloadFile: jest.fn(),
  uploadFiles: jest.fn(),
  touch: jest.fn(),
  MainBundlePath: "",
  CachesDirectoryPath: "",
  DocumentDirectoryPath: "DDirPath/",
  ExternalDirectoryPath: "",
  ExternalStorageDirectoryPath: "",
  TemporaryDirectoryPath: "",
  LibraryDirectoryPath: "",
  PicturesDirectoryPath: "",
};
