import { info } from './log'

let db: any = null
let debug = false

interface init {
  (dbg: boolean): Promise<boolean>
}

export const init: init = (dbg = false) => {
  let freshlyMinted = false
  debug = dbg

  return new Promise((resolve, reject) => {
    const dbRequest = window.indexedDB.open('peach', 1000)
    dbRequest.onerror = event => {
      if (debug) info('Database error code: ', event)
      reject(event)
    }
    dbRequest.onsuccess = () => {
      db = dbRequest.result
      if (debug) info('Database connected', db)
      resolve(freshlyMinted)
    }
    dbRequest.onupgradeneeded = () => {
      db = dbRequest.result
      const objectStoreState = db.createObjectStore(
        'state', {
          'keyPath': 'id'
        }
      )
      objectStoreState.createIndex('id', 'id', {
        'unique': true
      })
      freshlyMinted = true
    }
  })
}

interface destroy {
  (): Promise<void>
}

export const destroy: destroy = () => new Promise(resolve => {
  const dbRequest = window.indexedDB.deleteDatabase('peach')
  dbRequest.onsuccess = () => {
    if (debug) info('Database destroyed')
    resolve()
  }
})

interface set {
  (key: string, value:any): Promise<void>
}

export const set: set = (key, value) => new Promise(resolve => {
  const state = db.transaction(['state'], 'readwrite').objectStore('state')
  const updateRequest = state.get(key)

  updateRequest.onerror = () => {
    if (debug) info('Create entry', key, value)
    state.add({
      id: key,
      value
    })
    resolve()
  }
  updateRequest.onsuccess = () => {
    if (debug) info('Updated entry', key, value)
    state.put({
      id: key,
      value
    })
    resolve()
  }
})

interface remove {
  (key: string): Promise<void>
}

export const remove: remove = (key) => new Promise(resolve => {
  const state = db.transaction(['state'], 'readwrite').objectStore('state')
  const deleteRequest = state.delete(key)

  deleteRequest.onerror = () => {
    if (debug) info('Remove entry', key)
    state.add({
      id: key
    })
    resolve()
  }
  deleteRequest.onsuccess = () => {
    if (debug) info('Removed entry', key)
    resolve()
  }
})

interface get {
  (key: string): Promise<string | object | null>
}
export const get: get = key => new Promise(resolve => {
  const state = db.transaction(['state'], 'readonly').objectStore('state')
  const request = state.get(key)
  request.onerror = () => {
    resolve(null)
  }
  request.onsuccess = () => {
    resolve(request.result ? request.result.value : null)
  }
})