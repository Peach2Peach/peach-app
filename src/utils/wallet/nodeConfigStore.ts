import { BlockChainNames } from 'bdk-rn/lib/lib/enums'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createPersistStorage } from '../../store/createPersistStorage'
import { createStorage } from '../storage'

export type NodeConfig = {
  enabled: boolean
  url?: string
  ssl: boolean
  type?: BlockChainNames
  gapLimit?: number
}

export type NodeConfigStore = NodeConfig & {
  reset: () => void
  setCustomNode: (nodeConfig: Partial<NodeConfig>) => void
  toggleEnabled: () => void
}

export const defaultNodeConfig: NodeConfig = { enabled: false, ssl: false, gapLimit: 25 }

export const nodeConfigStore = createStorage('nodeConfig')
const storage = createPersistStorage(nodeConfigStore)

export const useNodeConfigState = create<NodeConfigStore>()(
  persist(
    (set, get) => ({
      ...defaultNodeConfig,
      reset: () => set(() => defaultNodeConfig),
      setCustomNode: (node) => set(node),
      toggleEnabled: () => set({ enabled: !get().enabled }),
    }),
    {
      name: 'nodeConfig',
      version: 0,
      storage,
    },
  ),
)
