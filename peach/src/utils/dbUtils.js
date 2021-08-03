import { info } from './logUtils'

const indexedDB = typeof window !== 'undefined'
  ? window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
  : null

let db = null
let debug = false

export const init = dbg => {
  let freshlyMinted = false
  debug = dbg

  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open('peach', 1000)
    dbRequest.onerror = event => {
      if (debug) info('Database error code: ', event)
      reject(event)
    }
    dbRequest.onsuccess = event => {
      db = event.target.result
      if (debug) info('Database connected', db)
      resolve(freshlyMinted)
    }
    dbRequest.onupgradeneeded = event => {
      db = event.target.result
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

export const destroy = () => new Promise(resolve => {
  const dbRequest = indexedDB.deleteDatabase('peach')
  dbRequest.onsuccess = () => {
    if (debug) info('Database destroyed')
    resolve()
  }
})

export const set = (key, value) => new Promise(resolve => {
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

export const remove = (key) => Promise(resolve => {
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

export const get = key => new Promise(resolve => {
  const state = db.transaction(['state'], 'readonly').objectStore('state')
  const request = state.get(key)
  request.onerror = () => {
    resolve(null)
  }
  request.onsuccess = event => {
    // Get the old value that we want to update
    resolve(event.target.result ? event.target.result.value : null)
  }
})