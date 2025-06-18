import { ipcMain } from 'electron'
import { extensionsService } from '.'

import type { SourceInfo } from '@torigen/mounter'
import { type RegistryEntry, apiWrapper, channels } from '@common/index'

const createExtensionHandlers = () => {
  ipcMain.handle(channels.extensions.loadAll, async () =>
    apiWrapper<SourceInfo[]>(() => extensionsService.loadExtensions())
  )

  ipcMain.handle(channels.extensions.has, async (_, id: string) =>
    apiWrapper<boolean>(() => extensionsService.hasExtension(id))
  )

  ipcMain.handle(channels.extensions.getPath, async (_, id: string) =>
    apiWrapper<string | null>(() => extensionsService.getExtensionPath(id))
  )

  ipcMain.handle(channels.extensions.count, async () =>
    apiWrapper<number>(() => extensionsService.loadExtensions().then((exts) => exts.length))
  )

  ipcMain.handle(channels.extensions.getEntry, (_, id: string) =>
    apiWrapper<RegistryEntry | null>(() => extensionsService.getExtensionEntry(id))
  )
}

export { createExtensionHandlers }
