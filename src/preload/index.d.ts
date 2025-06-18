import { ElectronAPI } from '@electron-toolkit/preload'
import { IPCResponse } from '@common/types/ipcResponse'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      proxyFetch: (url: string, options: RequestInit) => Promise<IPCResponse>
    }
  }
}
