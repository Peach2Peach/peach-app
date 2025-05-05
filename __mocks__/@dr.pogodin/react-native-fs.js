export let files = {};
export const resetFiles = () => (files = {});
export const mkdir = jest.fn();
export const moveFile = jest.fn();
export const copyFile = jest.fn();
export const pathForBundle = jest.fn();
export const pathForGroup = jest.fn();
export const getFSInfo = jest.fn();
export const getAllExternalFilesDirs = jest.fn();
export const unlink = jest.fn(async (path) => {
  delete files[path];
});
export const exists = jest.fn(async (path) => !!files[path]);
export const stopDownload = jest.fn();
export const resumeDownload = jest.fn();
export const isResumable = jest.fn();
export const stopUpload = jest.fn();
export const completeHandlerIOS = jest.fn();
export const readDir = jest.fn();
export const readDirAssets = jest.fn();
export const existsAssets = jest.fn();
export const readdir = jest.fn();
export const setReadable = jest.fn();
export const stat = jest.fn();
export const readFile = jest.fn(async (path) => files[path]);
export const read = jest.fn((uri, chunksize, index, encoding) =>
  files[uri].slice(index, index + chunksize),
);
export const readFileAssets = jest.fn();
export const hash = jest.fn();
export const copyFileAssets = jest.fn();
export const copyFileAssetsIOS = jest.fn();
export const copyAssetsVideoIOS = jest.fn();
export const writeFile = jest.fn(async (path, data, encoding) => {
  files[path] = data;
});
export const appendFile = jest.fn(async (path, data, encoding) => {
  files[path] = files[path] || "" + data;
});
export const write = jest.fn();
export const downloadFile = jest.fn();
export const uploadFiles = jest.fn();
export const touch = jest.fn();
export const MainBundlePath = "";
export const CachesDirectoryPath = "";
export const DocumentDirectoryPath = "DDirPath/";
export const ExternalDirectoryPath = "";
export const ExternalStorageDirectoryPath = "";
export const TemporaryDirectoryPath = "";
export const LibraryDirectoryPath = "";
export const PicturesDirectoryPath = "";
