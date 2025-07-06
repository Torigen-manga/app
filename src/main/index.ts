import { app, shell, BrowserWindow, ipcMain, net, protocol } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {
  createPreferencesHandlers,
  createExtensionsHandlers,
  createExtensionHandlers,
  createLibraryHandlers,
  ensureDirectoriesExist,
  createCategoryHandlers,
  directories,
  ensureExtensionService
} from './src/index'
import { join } from 'path'
import { createReadStream, existsSync } from 'fs'

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'cover',
    privileges: {
      secure: true,
      stream: true,
      standard: true,
      corsEnabled: true,
      supportFetchAPI: true
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

  await ensureDirectoriesExist()

  protocol.handle('cover', async (req) => {
    const url = new URL(req.url)
    const fileName = url.hostname + url.pathname

    const filePath = join(directories.coverCacheDir, decodeURIComponent(fileName))

    if (!existsSync(filePath)) {
      console.warn(`[cover protocol] File not found: ${filePath}`)
      return new Response(null, {
        status: 404,
        statusText: 'Not Found'
      })
    }

    const stream = createReadStream(filePath)

    return new Response(stream as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Access-Control-Allow-Origin': '*'
      }
    })
  })

  ensureExtensionService()

  createLibraryHandlers()
  createCategoryHandlers()
  createExtensionsHandlers()
  createPreferencesHandlers()
  createExtensionHandlers()

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
