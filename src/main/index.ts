import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { createExtensionHandlers } from './services/extension/ipc'
import { createPreferencesHandlers } from './services/preferences/ipc'
import path, { join } from 'path'
import { pathToFileURL } from 'url'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      stream: true,
      corsEnabled: true
    }
  }
])

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.handle('window:minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.handle('window:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.handle('window:close', () => {
    mainWindow.close()
  })
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('proxy-fetch', async (_, url, options) => {
    try {
      console.log(`[MAIN PROCESS] Proxying fetch for: ${url}`)

      const res = await net.fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'User-Agent': 'Torigen/0.1.0'
        }
      })

      return {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        body: await res.text()
      }
    } catch (err) {
      return {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        error: err instanceof Error ? err.message : String(err)
      }
    }
  })

  protocol.handle('app', async (req) => {
    const url = new URL(req.url)
    const { host, pathname } = url

    let basePath = ''

    if (host === 'extensions') {
      basePath = path.join(app.getPath('userData'), 'user', 'extensions')
    } else {
      return new Response(null, { status: 404, statusText: 'Not found' })
    }

    const absolutePath = path.normalize(path.join(basePath, pathname))

    if (!absolutePath.startsWith(basePath)) {
      return new Response(null, { status: 403, statusText: 'Forbidden' })
    }

    console.log('[protocol] URL:', req.url)
    console.log('[protocol] Base Path:', basePath)
    console.log('[protocol] Resolved Path:', absolutePath)

    const fileUrl = pathToFileURL(absolutePath).href
    console.log('[protocol] File URL:', fileUrl)

    return net.fetch(fileUrl)
  })

  // IPC Handlers
  createExtensionHandlers()
  createPreferencesHandlers()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
