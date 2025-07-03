import { Outlet } from 'react-router'
import { SidebarProvider } from '../components/ui/sidebar'
import { AppSidebar } from '@renderer/components/nav'
import { TitleBar } from '@renderer/components/titlebar'

export default function BaseLayout(): React.JSX.Element {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />

      <div className="bg-sidebar relative h-screen w-full overflow-hidden pb-10">
        <TitleBar />
        <main className="bg-background relative mt-8 h-full overflow-y-scroll border shadow shadow-black/20 md:mr-2 md:rounded-lg">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
