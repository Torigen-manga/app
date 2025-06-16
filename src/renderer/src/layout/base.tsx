import { Outlet } from 'react-router'
import { SidebarProvider } from '../components/ui/sidebar'
import { AppSidebar } from '@renderer/components/nav'
import { TitleBar } from '@renderer/components/titlebar'

export default function BaseLayout() {
  return (
    <SidebarProvider draggable className="flex">
      <AppSidebar />

      <div className="bg-sidebar relative min-h-screen w-full overflow-hidden pb-10">
        <TitleBar />
        <main className="bg-background mt-8 h-full overflow-hidden">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
