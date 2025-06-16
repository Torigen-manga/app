import { Button } from '@renderer/components/ui/button'
import { send } from '@renderer/config/ipc'

function Home(): React.JSX.Element {
  const ipcHandle = (): void => send('ping')

  return (
    <>
      <Button onClick={ipcHandle}>Send IPC</Button>
    </>
  )
}

export default Home
