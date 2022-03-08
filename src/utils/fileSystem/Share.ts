import * as db from '../db'
import { download } from '../webUtils'

/**
 * @description Web method to emulate fs file sharing by using indexedDB & download
 * @param path document path
 */
interface open {
  (
    openArgs: {
      url: string,
      title?: string,
      subject?: string
    }
  ): Promise<void>
}
const open: open = async ({ url }) => {
  const account = await db.get(url) as string
  download(url, account)
}

export default {
  open
}