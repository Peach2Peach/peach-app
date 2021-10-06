type pickReturn = {
  uri?: string
  content?: string
}
interface pick {
  (): Promise<pickReturn>
}
const pick: pick = async () => new Promise(resolve => {
  const input = document.createElement('input')
  let account: string = ''

  input.type = 'file'
  input.onchange = (event?: Event) => {
    const $input = event?.target as HTMLInputElement
    const reader = new window.FileReader()
    const file = $input?.files?.item(0) as Blob

    reader.readAsText(file, 'UTF-8')

    reader.onload = readerEvent => {
      account = readerEvent?.target?.result as string

      resolve({
        content: account
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
  isCancel
}