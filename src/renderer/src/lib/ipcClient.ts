import { invoke } from '@renderer/lib/ipcMethods'
import type { APIResponse } from '@common/index'

async function invokeIPC<T>(channel: string, ...args: any[]): Promise<T> {
  const res: APIResponse<T> = await invoke(channel, ...args)

  if (!res.success) throw new Error(res.error)

  return res.data
}

export { invokeIPC }
