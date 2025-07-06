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
const preferencesFilePath = join(userDir, 'preferences.json')
const registryFilePath = join(extensionsDir, 'registry.json')

const databasePath = join(userDir, 'main.db')
const devDatabasePath = join(process.cwd(), 'dev.db')

const directories = {
  userDir,
  extensionsDir,
  localDir,
  coverCacheDir,
  downloadsDir
}

const paths = {
  preferencesFilePath,
  registryFilePath,
  databasePath,
  devDatabasePath
}

async function ensureDirectoriesExist() {
  for (const dir of Object.values(directories)) {
    await mkdir(dir, { recursive: true })
  }
}

export { ensureDirectoriesExist, paths, directories }
