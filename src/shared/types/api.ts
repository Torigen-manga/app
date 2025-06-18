type APIResponse<T> = { success: true; data: T } | { success: false; error: string }

async function apiWrapper<T>(fn: () => Promise<T>): Promise<APIResponse<T>> {
  try {
    const data = await fn()
    return { success: true, data }
  } catch (err) {
    return { success: false, error: (err as Error).message }
  }
}

export { type APIResponse, apiWrapper }
