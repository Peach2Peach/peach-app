import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createPersistStorage } from '../../store/createPersistStorage'
import { createStorage } from '../storage'

export type NodeType = 'esplora' | 'electrum' | 'blockchainRpc'
export type NodeConfig = {
  enabled: boolean
  address?: string
  ssl: boolean
  type?: NodeType
}

export type NodeConfigStore = NodeConfig & {
  reset: () => void
  setCustomNode: (node: NodeConfig) => void
  toggleEnabled: () => void
  toggleSSL: () => void
}

export const defaultNodeConfig: NodeConfig = { enabled: false, ssl: false }

export const nodeConfigStore = createStorage('nodeConfig')
const storage = createPersistStorage(nodeConfigStore)

export const useNodeConfigState = create<NodeConfigStore>()(
  persist(
    (set, get) => ({
      ...defaultNodeConfig,
      reset: () => set(() => defaultNodeConfig),
      setCustomNode: (node) => set(node),
      toggleEnabled: () => set({ enabled: !get().enabled }),
      toggleSSL: () => set({ ssl: !get().ssl }),
    }),
    {
      name: 'nodeConfig',
      version: 0,
      storage,
    },
  ),
)
