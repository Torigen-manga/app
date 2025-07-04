import { AppRequest, RequestManager } from '@torigen/mounter'

export class ProxyFetch implements RequestManager {
  async fetch(req: AppRequest): Promise<Response> {
    try {
      let url = req.url
      let options: RequestInit = {
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
          url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
        }
      }

      if (req.data && (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')) {
        if (typeof req.data === 'object') {
          options.body = JSON.stringify(req.data)
          options.headers = {
            'Content-Type': 'application/json',
            ...options.headers
          }
        } else {
          options.body = req.data
        }
      } else if (
        req.params &&
        (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH')
      ) {
        if (!options.body) {
          options.body = JSON.stringify(req.params)
          options.headers = {
            'Content-Type': 'application/json',
            ...options.headers
          }
        }
      }

      const res = await fetch(url, options)

      return res
    } catch (error) {
      console.error('[ERROR] Error occurred while fetching:', error)
      throw error
    }
  }
}
