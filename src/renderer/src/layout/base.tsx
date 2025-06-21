import { Outlet } from 'react-router'
import { SidebarProvider } from '../components/ui/sidebar'
import { AppSidebar } from '@renderer/components/nav'
import { TitleBar } from '@renderer/components/titlebar'

export default function BaseLayout() {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />

      <div className="bg-sidebar relative h-screen w-full overflow-hidden pb-10">
        <TitleBar />
        <main className="bg-background relative mt-8 mr-2 ml-2 h-full overflow-y-scroll rounded-xl border shadow shadow-black/20 md:ml-0">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
