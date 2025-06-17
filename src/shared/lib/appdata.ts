import path from 'path'
import { app } from 'electron'

const EXTENSIONS_DIR = path.join(app.getPath('userData'), 'user', 'extensions')
const REGISTRY_FILE_DIR = path.join(EXTENSIONS_DIR, 'registry.json')

const PREFERENCES_FILE_DIR = path.join(app.getPath('userData'), 'preferences.json')

export { EXTENSIONS_DIR, REGISTRY_FILE_DIR, PREFERENCES_FILE_DIR }
