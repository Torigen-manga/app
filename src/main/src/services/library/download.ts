import { createWriteStream } from 'fs'
import { access, stat, unlink } from 'fs/promises'
import { extname, join } from 'path'
import { directories } from '../../paths'
import { net } from 'electron'

async function downloadCover(id: string, url: string): Promise<string> {
  const extension = extname(new URL(url).pathname) || '.jpg'
  const fileName = `${id}${extension}`
  const filePath = join(directories.coverCacheDir, fileName)

  try {
    await access(filePath)
    const stats = await stat(filePath)
    if (stats.size === 0) {
      await unlink(filePath)
    } else {
      return fileName
    }
  } catch {}

  return new Promise((resolve, reject) => {
    const request = net.request({ url })

    request.on('response', (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download cover: ${response.statusMessage}`))
      }

      const fileStream = createWriteStream(filePath)

      fileStream.on('error', (err) => {
        fileStream.destroy()
        reject(err)
      })

      fileStream.on('finish', () => {
        resolve(fileName)
      })

      response.on('error', (err) => {
        fileStream.destroy()
        reject(err)
      })

      response.on('data', (chunk) => {
        fileStream.write(chunk)
      })

      response.on('end', () => {
        fileStream.end()
      })
    })

    request.on('error', (err) => {
      reject(err)
    })

    request.end()
  })
}

export { downloadCover }
