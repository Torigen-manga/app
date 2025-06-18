const ipc = window.electron.ipcRenderer

export const send = ipc.send.bind(ipc)
export const invoke = ipc.invoke.bind(ipc)
export const on = ipc.on.bind(ipc)
export const once = ipc.once.bind(ipc)
export const removeListener = ipc.removeListener.bind(ipc)

