import { app, shell, BrowserWindow, ipcMain, protocol, net } from 'electron'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { preferencesService } from './services/preferences'
import { extensionsService } from './services/extension'
import path, { join } from 'path'

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
  // Create the browser window.
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
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

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
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

    return net.fetch('file://' + absolutePath)
  })

  ipcMain.handle('preferences:load', async () => {
    try {
      return await preferencesService.loadPreferences()
    } catch (error) {
      throw new Error('Failed to load preferences')
    }
  })

  ipcMain.handle('preferences:save', async (_, preferences) => {
    try {
      await preferencesService.savePreferences(preferences)
    } catch (error) {
      throw new Error('Failed to save preferences')
    }
  })

  ipcMain.handle('preferences:reset', async () => {
    try {
      await preferencesService.resetPreferences()
    } catch (error) {
      throw new Error('Failed to reset preferences')
    }
  })

  ipcMain.handle('extension:get-homepage', async (_, id: string) => {
    try {
      const extension = await extensionsService.loadExtension(id)

      return extension.getHomepage()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      throw new Error(`Failed to load extension with id ${id}: ${message}`)
    }
  })

  ipcMain.handle('extensions:load', async () => {
    try {
      return await extensionsService.loadExtensions()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      throw new Error(`Failed to load extensions: ${message}`)
    }
  })

  ipcMain.handle('extensions:load-registry', async () => {
    try {
      return await extensionsService.loadRegistry()
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      throw new Error(`Failed to load extension registry: ${message}`)
    }
  })

  ipcMain.handle('extensions:save-registry', async (_, registry) => {
    try {
      await extensionsService.saveRegistry(registry)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      throw new Error(`Failed to save extension registry: ${message}`)
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
