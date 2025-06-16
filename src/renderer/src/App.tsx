import { Button } from '@renderer/components/ui/button'
import { useEffect } from 'react'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const loadPref = async () => {
    const pref = await window.electron.ipcRenderer.invoke('preferences:load')
    console.log('Preferences:', pref)
  }

  useEffect(() => {
    loadPref()
  }, [])

  return (
    <>
      <Button onClick={ipcHandle}>Send IPC</Button>
    </>
  )
}

export default App
