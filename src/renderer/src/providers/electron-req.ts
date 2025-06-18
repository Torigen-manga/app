// renderer/requestManager.ts
import type { IPCResponse } from '@shared/types/ipcResponse'
import type { RequestManager, AppRequest } from '@torigen/mounter'

/**
 * RequestManager implementation for Electron Renderer Process.
 * It uses the exposed `window.api.proxyFetch` to send network requests
 * to the main process, leveraging the existing `ipcMain.handle('proxy-fetch')`.
 */
export class ElectronRequestManager implements RequestManager {
  async fetch(req: AppRequest): Promise<Response> {
    if (!window.api || !window.api.proxyFetch) {
      throw new Error(
        "Electron API 'api.proxyFetch' not available. Ensure preload script is loaded correctly and exposing 'api'."
      )
    }

    console.log('Renderer: Sending request to main process via IPC', req)

    let requestUrl = req.url
    let requestOptions: RequestInit = {
      method: req.method,
      headers: req.headers
    }

    if (req.params && req.method === 'GET') {
      const urlParams = new URLSearchParams()
      Object.entries(req.params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => urlParams.append(key, String(item)))
        } else if (value !== undefined && value !== null) {
          urlParams.append(key, String(value))
        }
      })
      const queryString = urlParams.toString()
      if (queryString) {
        requestUrl = `${requestUrl}${requestUrl.includes('?') ? '&' : '?'}${queryString}`
      }
    }

    if (req.data && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
      if (typeof req.data === 'object') {
        requestOptions.body = JSON.stringify(req.data)
        requestOptions.headers = {
          'Content-Type': 'application/json',
          ...requestOptions.headers
        }
      } else {
        requestOptions.body = req.data
      }
    } else if (
      req.params &&
      (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')
    ) {
      if (!requestOptions.body) {
        requestOptions.body = JSON.stringify(req.params)
        requestOptions.headers = {
          'Content-Type': 'application/json',
          ...requestOptions.headers
        }
      }
    }

    const ipcResponse: IPCResponse = await window.api.proxyFetch(requestUrl, requestOptions)
    console.log('Renderer: Received response from main process', ipcResponse)

    if (ipcResponse.error) {
      throw new Error(`Network Error: ${ipcResponse.error} (Status: ${ipcResponse.status})`)
    }

    const response = new Response(ipcResponse.body, {
      status: ipcResponse.status,
      statusText: ipcResponse.statusText,
      headers: ipcResponse.headers
    })

    Object.defineProperty(response, 'ok', { value: ipcResponse.ok })

    return response
  }
}
