import { join } from 'path'
import { app } from 'electron'
import { mkdir } from 'fs/promises'

// Base Directories
const userDir = join(app.getPath('userData'), 'user')
const extensionsDir = join(userDir, 'extensions')
const localDir = join(userDir, 'local')
const coverCacheDir = join(localDir, 'cover-cache')
const downloadsDir = join(localDir, 'downloads')

// File Paths
const dataFilePath = join(localDir, 'manga.json')
const preferencesFilePath = join(userDir, 'preferences.json')
const registryFilePath = join(extensionsDir, 'registry.json')
const libraryFilePath = join(localDir, 'library.json')
const historyFilePath = join(localDir, 'history.json')
const recentReadFilePath = join(localDir, 'recent-read.json')

const directories = {
  userDir,
  extensionsDir,
  localDir,
  coverCacheDir,
  downloadsDir
}

const paths = {
  dataFilePath,
  preferencesFilePath,
  registryFilePath,
  libraryFilePath,
  historyFilePath,
  recentReadFilePath
}

async function ensureDirectoriesExist() {
  for (const dir of Object.values(directories)) {
    await mkdir(dir, { recursive: true })
  }
}

export { ensureDirectoriesExist, paths, directories }
