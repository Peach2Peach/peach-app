/**
 * @description Method to trigger download on web
 * @param {string} filename name of file
 * @param {string} text file content
 */
export const download = (filename, text) => {
  const element = document.createElement('a')
  element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text))
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}