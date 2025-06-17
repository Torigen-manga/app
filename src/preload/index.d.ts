import { ElectronAPI } from '@electron-toolkit/preload'
import { IPCResponse } from '@shared/types/ipcResponse'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      proxyFetch: (url: string, options: RequestInit) => Promise<IPCResponse>
    }
  }
}
