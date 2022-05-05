type pickReturn = {
  uri?: string
  content?: string,
  name?: string
}
interface pick {
  (): Promise<pickReturn>
}
const pick: pick = async () => new Promise(resolve => {
  const input = document.createElement('input')
  let content: string = ''

  input.type = 'file'
  input.onchange = (event?: Event) => {
    const $input = event?.target as HTMLInputElement
    const reader = new window.FileReader()
    const file = $input?.files?.item(0) as Blob

    reader.readAsText(file, 'UTF-8')

    reader.onload = readerEvent => {
      content = readerEvent?.target?.result as string

      resolve({
        content
      })
    }
  }
  input.click()
})

interface isCancel {
  (error: Error): boolean
}
const isCancel: isCancel = () => false

export default {
  pick,
  pickSingle: pick,
  isCancel
}